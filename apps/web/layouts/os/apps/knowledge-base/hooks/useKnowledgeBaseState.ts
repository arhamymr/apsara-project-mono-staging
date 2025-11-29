import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import {
  createCollection,
  createKnowledgeBase,
  deleteKnowledgeBase,
  fetchKnowledgeBases,
} from '@/layouts/os/apps/knowledge-base/api';
import {
  mapCollections,
  mapKnowledgeBases,
} from '@/layouts/os/apps/knowledge-base/utils/transformers';

import type {
  KBCollection,
  KnowledgeBase,
} from '@/layouts/os/apps/knowledge-base/components/types';
import type { KnowledgeBase as ApiKnowledgeBase } from '@/layouts/os/apps/knowledge-base/types';

type CreateKbDialogState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
};

type CreateCollectionDialogState = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
};

type KnowledgeBaseQueryState = {
  apiKnowledgeBases: ApiKnowledgeBase[];
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  retry: () => Promise<void>;
};

type SelectionState = {
  selectedKbId: string | null;
  selectedCollectionId: string | null;
  selectedSourceId: string | null;
  selectedKb: KnowledgeBase | null;
  selectedKbRecord: ApiKnowledgeBase | null;
  selectedCollection: KBCollection | null;
  selectKb: (kbId: string) => void;
  selectCollection: (collectionId: string) => void;
  setSelectedSourceId: (sourceId: string | null) => void;
};

type SearchState = {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
};

type KnowledgeBaseActions = {
  openCreateCollectionForKb: (kbId: string | number) => void;
  requestCreateCollection: () => void;
  deleteKnowledgeBase: (kbId: number) => Promise<void>;
};

type UseKnowledgeBaseStateResult = {
  query: KnowledgeBaseQueryState;
  lists: {
    kbs: KnowledgeBase[];
    collections: KBCollection[];
  };
  selection: SelectionState;
  search: SearchState;
  createKbDialog: CreateKbDialogState;
  createCollectionDialog: CreateCollectionDialogState;
  actions: KnowledgeBaseActions;
};

export function useKnowledgeBaseState(): UseKnowledgeBaseStateResult {
  const queryClient = useQueryClient();

  const {
    data: apiKnowledgeBases = [],
    isLoading: isLoadingKnowledgeBases,
    isFetching: isFetchingKnowledgeBases,
    error: knowledgeBasesError,
  } = useQuery({
    queryKey: ['knowledge-bases'],
    queryFn: fetchKnowledgeBases,
    staleTime: 30_000,
  });

  const knowledgeBasesErrorMessage =
    knowledgeBasesError instanceof Error
      ? knowledgeBasesError.message
      : knowledgeBasesError
        ? 'Unable to load knowledge bases.'
        : null;

  const kbs = useMemo<KnowledgeBase[]>(
    () => mapKnowledgeBases(apiKnowledgeBases),
    [apiKnowledgeBases],
  );

  const collections = useMemo<KBCollection[]>(
    () => mapCollections(apiKnowledgeBases),
    [apiKnowledgeBases],
  );

  const [selectedKbId, setSelectedKbId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);

  const selectedKb = useMemo(
    () => kbs.find((kb) => kb.id === selectedKbId) ?? null,
    [kbs, selectedKbId],
  );

  const selectedKbRecord = useMemo(
    () =>
      apiKnowledgeBases.find((kb) => String(kb.id) === selectedKbId) ?? null,
    [apiKnowledgeBases, selectedKbId],
  );

  const selectedCollection = useMemo(() => {
    if (!selectedCollectionId) return null;
    return (
      collections.find(
        (collection) => collection.id === selectedCollectionId,
      ) ?? null
    );
  }, [collections, selectedCollectionId]);

  const [search, setSearch] = useState('');
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);
  const handleClearSearch = useCallback(() => {
    setSearch('');
  }, []);

  useEffect(() => {
    if (!kbs.length) {
      if (selectedKbId !== null) setSelectedKbId(null);
      return;
    }
    if (!selectedKbId || !kbs.some((kb) => kb.id === selectedKbId)) {
      setSelectedKbId(kbs[0].id);
    }
  }, [kbs, selectedKbId]);

  useEffect(() => {
    if (!selectedKbId) {
      if (selectedCollectionId !== null) setSelectedCollectionId(null);
      return;
    }
    const matches = collections.filter(
      (collection) => collection.kbId === selectedKbId,
    );
    if (!matches.length) {
      if (selectedCollectionId !== null) setSelectedCollectionId(null);
      return;
    }
    if (
      !selectedCollectionId ||
      !matches.some((collection) => collection.id === selectedCollectionId)
    ) {
      setSelectedCollectionId(matches[0].id);
    }
  }, [collections, selectedKbId, selectedCollectionId]);

  useEffect(() => {
    if (!selectedCollectionId && selectedSourceId !== null) {
      setSelectedSourceId(null);
    }
  }, [selectedCollectionId, selectedSourceId]);

  const createKnowledgeBaseMutation = useMutation({
    mutationFn: (title: string) => createKnowledgeBase(title),
  });

  const [createKbDialogOpen, setCreateKbDialogOpen] = useState(false);
  const [newKbTitle, setNewKbTitle] = useState('');
  const [createKbError, setCreateKbError] = useState<string | null>(null);

  const handleCreateKbDialogChange = useCallback((open: boolean) => {
    setCreateKbDialogOpen(open);
    if (!open) {
      setNewKbTitle('');
      setCreateKbError(null);
    }
  }, []);

  const handleCreateKbSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = newKbTitle.trim();
      if (!trimmed) {
        setCreateKbError('Title is required.');
        return;
      }
      setCreateKbError(null);
      try {
        const created = await createKnowledgeBaseMutation.mutateAsync(trimmed);
        queryClient.setQueryData<ApiKnowledgeBase[]>(
          ['knowledge-bases'],
          (previous) => {
            if (!previous) return [created];
            if (previous.some((kb) => kb.id === created.id)) {
              return previous;
            }
            return [created, ...previous];
          },
        );
        setSelectedKbId(String(created.id));
        handleCreateKbDialogChange(false);
        toast({ title: 'Knowledge base created successfully.' });
        await queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
      } catch (error) {
        setCreateKbError(
          error instanceof Error
            ? error.message
            : 'Failed to create knowledge base.',
        );
      }
    },
    [
      newKbTitle,
      createKnowledgeBaseMutation,
      queryClient,
      handleCreateKbDialogChange,
    ],
  );

  const createCollectionMutation = useMutation({
    mutationFn: createCollection,
  });

  const [createCollectionDialogOpen, setCreateCollectionDialogOpen] =
    useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [createCollectionError, setCreateCollectionError] = useState<
    string | null
  >(null);

  const handleCreateCollectionDialogChange = useCallback((open: boolean) => {
    setCreateCollectionDialogOpen(open);
    if (!open) {
      setNewCollectionName('');
      setNewCollectionDescription('');
      setCreateCollectionError(null);
    }
  }, []);

  const handleCreateCollectionSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedKbRecord) {
        setCreateCollectionError('Select a knowledge base first.');
        return;
      }
      const trimmedName = newCollectionName.trim();
      if (!trimmedName) {
        setCreateCollectionError('Name is required.');
        return;
      }
      const trimmedDescription = newCollectionDescription.trim();
      setCreateCollectionError(null);
      try {
        const created = await createCollectionMutation.mutateAsync({
          knowledgeBaseId: selectedKbRecord.id,
          name: trimmedName,
          description: trimmedDescription ? trimmedDescription : undefined,
        });
        queryClient.setQueryData<ApiKnowledgeBase[]>(
          ['knowledge-bases'],
          (previous) => {
            if (!previous) return previous;
            return previous.map((kb) => {
              if (kb.id !== selectedKbRecord.id) return kb;
              const existing = Array.isArray(kb.collections)
                ? kb.collections
                : [];
              if (
                existing.some(
                  (collection) => collection && collection.id === created.id,
                )
              ) {
                return kb;
              }
              return {
                ...kb,
                collections: [created, ...existing],
              };
            });
          },
        );
        setSelectedKbId(String(selectedKbRecord.id));
        setSelectedCollectionId(String(created.id));
        handleCreateCollectionDialogChange(false);
        toast({ title: 'Collection created successfully.' });
        await queryClient.invalidateQueries({
          queryKey: ['knowledge-bases'],
        });
      } catch (error) {
        setCreateCollectionError(
          error instanceof Error
            ? error.message
            : 'Failed to create collection.',
        );
      }
    },
    [
      selectedKbRecord,
      newCollectionName,
      newCollectionDescription,
      createCollectionMutation,
      queryClient,
      handleCreateCollectionDialogChange,
    ],
  );

  const handleSelectKB = useCallback((kbId: string) => {
    setSelectedKbId(kbId);
    setSelectedCollectionId(null);
    setSelectedSourceId(null);
  }, []);

  const handleSelectCollection = useCallback((collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setSelectedSourceId(null);
  }, []);

  const handleRetryKnowledgeBases = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
  }, [queryClient]);

  const openCreateCollectionForKb = useCallback(
    (kbId: string | number) => {
      setSelectedKbId(String(kbId));
      handleCreateCollectionDialogChange(true);
    },
    [handleCreateCollectionDialogChange],
  );

  const requestCreateCollection = useCallback(() => {
    if (!selectedKbId) {
      toast({
        title: 'Select a knowledge base first',
        description: 'Choose a knowledge base before adding a collection.',
        variant: 'destructive',
      });
      return;
    }
    handleCreateCollectionDialogChange(true);
  }, [selectedKbId, handleCreateCollectionDialogChange]);

  const deleteKnowledgeBaseMutation = useMutation({
    mutationFn: deleteKnowledgeBase,
  });

  const handleDeleteKnowledgeBase = useCallback(
    async (kbId: number) => {
      await deleteKnowledgeBaseMutation.mutateAsync(kbId);
      queryClient.setQueryData<ApiKnowledgeBase[]>(
        ['knowledge-bases'],
        (previous) =>
          previous ? previous.filter((kb) => kb.id !== kbId) : previous,
      );
      if (selectedKbId === String(kbId)) {
        setSelectedKbId(null);
        setSelectedCollectionId(null);
        setSelectedSourceId(null);
      }
      toast({ title: 'Knowledge base deleted.' });
      await queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    },
    [deleteKnowledgeBaseMutation, queryClient, selectedKbId],
  );

  return {
    query: {
      apiKnowledgeBases,
      isLoading: isLoadingKnowledgeBases,
      isFetching: isFetchingKnowledgeBases,
      errorMessage: knowledgeBasesErrorMessage,
      retry: handleRetryKnowledgeBases,
    },
    lists: {
      kbs,
      collections,
    },
    selection: {
      selectedKbId,
      selectedCollectionId,
      selectedSourceId,
      selectedKb,
      selectedKbRecord,
      selectedCollection,
      selectKb: handleSelectKB,
      selectCollection: handleSelectCollection,
      setSelectedSourceId,
    },
    search: {
      value: search,
      onChange: handleSearchChange,
      clear: handleClearSearch,
    },
    createKbDialog: {
      open: createKbDialogOpen,
      onOpenChange: handleCreateKbDialogChange,
      title: newKbTitle,
      onTitleChange: setNewKbTitle,
      error: createKbError,
      onSubmit: handleCreateKbSubmit,
      isSubmitting: createKnowledgeBaseMutation.isPending,
    },
    createCollectionDialog: {
      open: createCollectionDialogOpen,
      onOpenChange: handleCreateCollectionDialogChange,
      name: newCollectionName,
      onNameChange: setNewCollectionName,
      description: newCollectionDescription,
      onDescriptionChange: setNewCollectionDescription,
      error: createCollectionError,
      onSubmit: handleCreateCollectionSubmit,
      isSubmitting: createCollectionMutation.isPending,
    },
    actions: {
      openCreateCollectionForKb,
      requestCreateCollection,
      deleteKnowledgeBase: handleDeleteKnowledgeBase,
    },
  };
}
