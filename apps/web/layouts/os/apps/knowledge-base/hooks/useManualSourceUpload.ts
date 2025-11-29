import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import { createSource } from '@/layouts/os/apps/knowledge-base/utils/network';
import { fetcher } from '@/lib/fetcher';

import type {
  KBCollection,
  KnowledgeBase,
} from '@/layouts/os/apps/knowledge-base/components/types';
import type {
  KnowledgeBase as ApiKnowledgeBase,
  Source,
  SourceApi,
} from '@/layouts/os/apps/knowledge-base/types';

type StorageUploadResponse = {
  key: string;
  name: string;
  size?: number | null;
  type?: string | null;
  visibility?: 'public' | 'private' | null;
  public_url?: string | null;
};

type ManualUploadMode = 'url' | 'file';

type UseManualSourceUploadParams = {
  selectedKb: KnowledgeBase | null;
  selectedKbRecord: ApiKnowledgeBase | null;
  selectedCollection: KBCollection | null;
  selectedCollectionId: string | null;
  refetchSources: () => Promise<unknown>;
};

export function useManualSourceUpload({
  selectedKb,
  selectedKbRecord,
  selectedCollection,
  selectedCollectionId,
  refetchSources,
}: UseManualSourceUploadParams) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ManualUploadMode>('url');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const createSourceMutation = useMutation({
    mutationFn: createSource,
  });

  const updateCachedRunId = useCallback(
    (created: SourceApi | null | undefined) => {
      if (
        !created ||
        typeof created.id === 'undefined' ||
        created.id === null ||
        typeof created.mastra_run_id !== 'string'
      ) {
        return;
      }

      const runId = created.mastra_run_id.trim();
      if (!runId) {
        return;
      }

      if (!selectedKbRecord || !selectedCollectionId) {
        return;
      }

      const queryKey = [
        'knowledge-bases',
        Number(selectedKbRecord.id),
        'collections',
        Number(selectedCollectionId),
        'sources',
      ] as const;

      queryClient.setQueryData<Source[]>(queryKey, (previous) => {
        if (!previous) return previous;

        const targetId = String(created.id);
        let updated = false;
        const next = previous.map((item) => {
          if (item.id !== targetId) return item;
          updated = true;
          return {
            ...item,
            mastraRunId: runId,
          };
        });

        return updated ? next : previous;
      });
    },
    [queryClient, selectedCollectionId, selectedKbRecord],
  );

  const manualUploadPrefix = useMemo(() => {
    if (!selectedKbRecord) return null;
    const base = `knowledge-bases/${selectedKbRecord.id}/`;
    if (selectedCollectionId) {
      return `${base}collections/${selectedCollectionId}/sources/`;
    }
    return `${base}sources/`;
  }, [selectedCollectionId, selectedKbRecord]);

  const resetState = useCallback(() => {
    setTitle('');
    setSourceUrl('');
    setFile(null);
    setError(null);
    setMode('url');
    setSubmitting(false);
  }, []);

  const handleOpenDialog = useCallback(() => {
    if (!selectedKbRecord || !selectedCollectionId) {
      toast({
        title: 'Select a collection first',
        description: 'Choose a collection before adding a source manually.',
        variant: 'destructive',
      });
      return;
    }
    resetState();
    setOpen(true);
  }, [resetState, selectedCollectionId, selectedKbRecord]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        resetState();
      }
    },
    [resetState],
  );

  const handleModeChange = useCallback((nextMode: ManualUploadMode) => {
    setMode(nextMode);
    setError(null);
    if (nextMode === 'url') {
      setFile(null);
    } else {
      setSourceUrl('');
    }
  }, []);

  const handleFileChange = useCallback((nextFile: File | null) => {
    setFile(nextFile);
    if (nextFile) {
      const baseName = nextFile.name.replace(/\.[^.]+$/, '');
      setTitle((previous) => {
        if (previous && previous.trim().length > 0) {
          return previous;
        }
        return baseName || nextFile.name;
      });
    }
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!selectedKbRecord || !selectedCollectionId) {
        setError('Select a collection first.');
        return;
      }
      if (submitting || createSourceMutation.isPending) {
        return;
      }

      let nextTitle = title.trim();
      const normalizedCollectionId = Number(selectedCollectionId);
      const normalizedKbId = Number(selectedKbRecord.id);

      setError(null);
      setSubmitting(true);

      try {
        if (mode === 'file') {
          if (!file) {
            setError('Select a Markdown or PDF file to upload.');
            return;
          }
          if (!manualUploadPrefix) {
            setError('Unable to determine upload destination.');
            return;
          }

          if (!nextTitle) {
            const baseName = file.name.replace(/\.[^.]+$/, '');
            nextTitle = baseName || file.name;
          }

          const uploadForm = new FormData();
          uploadForm.append('file', file);
          uploadForm.append('prefix', manualUploadPrefix);
          uploadForm.append('visibility', 'private');

          const uploadResult = await fetcher<StorageUploadResponse>(
            '/api/storage/upload',
            {
              method: 'POST',
              body: uploadForm,
            },
          );

          const storageKey = `${manualUploadPrefix}${file.name}`.replace(
            /\/{2,}/g,
            '/',
          );
          const directory = manualUploadPrefix.replace(/\/$/, '') || null;

          const created = await createSourceMutation.mutateAsync({
            knowledge_base_id: normalizedKbId,
            collection_id: normalizedCollectionId,
            title: nextTitle,
            source_uri: `storage://${storageKey}`,
            visibility: 'private',
            mime: file.type || null,
            size: Number.isFinite(file.size) ? file.size : null,
            public_url:
              typeof uploadResult?.public_url === 'string'
                ? uploadResult.public_url
                : null,
            directory,
            storage_key: storageKey,
            meta: {
              manual_upload: true,
              upload_source: 'knowledge-base-app',
              input_kind: 'file',
              original_filename: file.name,
              uploaded_at: new Date().toISOString(),
            },
          });

          updateCachedRunId(created);
        } else {
          const trimmedUrl = sourceUrl.trim();
          if (!trimmedUrl) {
            setError('Source URL is required.');
            return;
          }
          if (!/^https?:\/\/\S+/i.test(trimmedUrl)) {
            setError('Enter a valid http(s) URL.');
            return;
          }

          if (!nextTitle) {
            nextTitle = trimmedUrl;
          }

          const lowerUrl = trimmedUrl.toLowerCase();
          const mime = lowerUrl.endsWith('.pdf')
            ? 'application/pdf'
            : lowerUrl.endsWith('.md') || lowerUrl.endsWith('.markdown')
              ? 'text/markdown'
              : null;

          const created = await createSourceMutation.mutateAsync({
            knowledge_base_id: normalizedKbId,
            collection_id: normalizedCollectionId,
            title: nextTitle,
            source_uri: trimmedUrl,
            visibility: 'private',
            public_url: trimmedUrl,
            mime,
            meta: {
              manual_upload: true,
              upload_source: 'knowledge-base-app',
              input_kind: 'url',
              uploaded_at: new Date().toISOString(),
            },
          });

          updateCachedRunId(created);
        }

        toast({ title: 'Source queued for ingestion.' });
        handleOpenChange(false);
        await refetchSources();
        await queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Failed to upload source.',
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      createSourceMutation,
      file,
      handleOpenChange,
      manualUploadPrefix,
      mode,
      queryClient,
      refetchSources,
      selectedCollectionId,
      selectedKbRecord,
      sourceUrl,
      submitting,
      title,
      updateCachedRunId,
    ],
  );

  const manualUploadDisabled = useMemo(() => {
    return (
      !selectedCollectionId ||
      !selectedKbRecord ||
      submitting ||
      createSourceMutation.isPending
    );
  }, [
    createSourceMutation.isPending,
    selectedCollectionId,
    selectedKbRecord,
    submitting,
  ]);

  return {
    manualUploadDisabled,
    openManualUploadDialog: handleOpenDialog,
    dialogProps: {
      open,
      onOpenChange: handleOpenChange,
      knowledgeBaseName: selectedKb?.name,
      collectionName: selectedCollection?.name,
      title,
      sourceUri: sourceUrl,
      mode,
      onModeChange: handleModeChange,
      file,
      onFileChange: handleFileChange,
      isSubmitting: submitting || createSourceMutation.isPending,
      error,
      onChangeTitle: setTitle,
      onChangeSourceUri: setSourceUrl,
      onSubmit: handleSubmit,
    },
  } as const;
}
