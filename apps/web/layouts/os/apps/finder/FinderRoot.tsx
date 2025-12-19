'use client';

import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Input } from '@workspace/ui/components/input';
import { ToggleGroup, ToggleGroupItem } from '@workspace/ui/components/toggle-group';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import {
  ChevronDown,
  FolderPlus,
  Grid3X3,
  List,
  Loader2,
  Search,
  Upload,
} from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Breadcrumbs } from './Breadcrumbs';
import { DetailsDialog } from './components/DetailsDialog';
import { FolderDialog } from './components/FolderDialog';
import { PreviewDialog } from './components/PreviewDialog';
import { FileGrid } from './FileGrid';
import { FileList } from './FileList';
import {
  useStorageActions,
  useStorageList,
  type StorageEntry,
} from './queries';
import { useFinder } from './useFinder';
import { useFinderKnowledgeBase } from './useFinderKnowledgeBase';

export default function FinderRoot() {
  const { state, setPrefix, setView, setQuery, breadcrumbs } = useFinder('');
  const list = useStorageList(state.prefix);
  const actions = useStorageActions(state.prefix);
  const portalRef = useWindowPortalContainer();
  const portalContainer = portalRef?.current ?? undefined;
  const isUploading = actions.uploadOne.isPending;
  const isCreatingFolder = actions.createFolder.isPending;
  const isFetchingList = list.isLoading || list.isFetching;
  const [preview, setPreview] = useState<null | {
    key: string;
    name: string;
    type?: string | null;
    size?: number;
  }>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [details, setDetails] = useState<StorageEntry | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadVisibilityRef = useRef<'public' | 'private'>('private');
  const [detailsUrl, setDetailsUrl] = useState<string | null>(null);
  const [detailsUrlStatus, setDetailsUrlStatus] = useState<
    'idle' | 'loading' | 'error'
  >('idle');
  const detailsRequestKeyRef = useRef<string | null>(null);
  const [isFolderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderError, setNewFolderError] = useState<string | null>(null);
  const newFolderInputRef = useRef<HTMLInputElement>(null);

  const folders = useMemo(() => list.data?.folders ?? [], [list.data?.folders]);
  const files = useMemo(() => list.data?.files ?? [], [list.data?.files]);
  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(state.q.toLowerCase()),
  );
  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(state.q.toLowerCase()),
  );
  const {
    knowledgeBases,
    knowledgeBasesStatus,
    collectionsByKnowledgeBase,
    collectionStatusByKnowledgeBase,
    selectedKnowledgeBaseId,
    setSelectedKnowledgeBaseId,
    selectedCollectionId,
    setSelectedCollectionId,
    collections: selectedCollections,
    collectionsStatus,
    handleAddToKnowledgeBase,
    queueAddToKnowledgeBase,
    addSourceDisabled,
    isAddingToKnowledgeBase,
  } = useFinderKnowledgeBase(details);

  const buildNameSet = useCallback(() => {
    const set = new Set<string>();
    folders.forEach((folder) => set.add(normalizeName(folder.name)));
    files.forEach((file) => set.add(normalizeName(file.name)));
    return set;
  }, [folders, files]);

  const openCreateFolderDialog = useCallback(() => {
    if (isCreatingFolder) return;
    const suggested = makeUniqueName('New Folder', buildNameSet(), {
      treatAsFile: false,
      add: false,
    });
    setNewFolderName(suggested);
    setNewFolderError(null);
    setFolderDialogOpen(true);
  }, [isCreatingFolder, buildNameSet]);

  useEffect(() => {
    if (isFolderDialogOpen) {
      const id = setTimeout(() => {
        newFolderInputRef.current?.focus();
        newFolderInputRef.current?.select();
      }, 15);
      return () => clearTimeout(id);
    }
  }, [isFolderDialogOpen]);

  const submitCreateFolder = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (isCreatingFolder) return;
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      setNewFolderError('Folder name is required.');
      return;
    }

    const uniqueName = makeUniqueName(trimmed, buildNameSet(), {
      treatAsFile: false,
      add: false,
    });
    setNewFolderName(uniqueName);

    const normalizedPrefix =
      state.prefix && !state.prefix.endsWith('/')
        ? `${state.prefix}/`
        : state.prefix;
    const nextPrefix = `${normalizedPrefix || ''}${uniqueName}/`;

    try {
      await actions.createFolder.mutateAsync(uniqueName);
      toast.success('Folder created', {
        description: `"${uniqueName}" is ready to use.`,
        action: {
          label: 'Open',
          onClick: () => setPrefix(nextPrefix),
        },
      });
      setFolderDialogOpen(false);
      setNewFolderError(null);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Unable to create folder.';
      setNewFolderError(message);
      toast.error('Failed to create folder', {
        description: message,
      });
    }
  };

  const triggerUploadDialog = (
    visibility: 'public' | 'private' = 'private',
  ) => {
    uploadVisibilityRef.current = visibility;
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleUploadSelection = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const visibility = uploadVisibilityRef.current;
    const existingNames = buildNameSet();
    const prepared = Array.from(files).map((file) => {
      const uniqueName = makeUniqueName(file.name, existingNames, {
        treatAsFile: true,
      });
      if (uniqueName !== file.name) {
        return new File([file], uniqueName, {
          type: file.type,
          lastModified: file.lastModified,
        });
      }
      return file;
    });
    await actions.uploadFiles(prepared, visibility);
    e.target.value = '';
  };

  const handleSetVisibility = async (
    entry: StorageEntry,
    visibility: 'public' | 'private',
  ) => {
    if (entry.visibility === visibility) return;
    try {
      await actions.setVisibility.mutateAsync({ key: entry.key, visibility });
      toast.success('Visibility updated', {
        description: `"${entry.name}" is now ${visibility}.`,
      });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : 'Unable to change visibility.';
      toast.error('Failed to update visibility', {
        description: message,
      });
    }
  };

  const closePreview = () => {
    setPreview(null);
    setPreviewUrl(null);
  };

  const openItem = async (prefixOrKey: string, isFolder: boolean) => {
    if (isFolder) {
      closePreview();
      setPrefix(prefixOrKey);
      return;
    }
    try {
      const url = await actions.downloadUrl(prefixOrKey);
      window.open(url, '_blank');
    } finally {
      // nothing
    }
  };

  const previewFile = async (entry: StorageEntry) => {
    const { key, name, type, size, is_folder } = entry;
    if (is_folder || key.endsWith('/')) {
      closePreview();
      setPrefix(key.endsWith('/') ? key : `${key}/`);
      return;
    }

    setPreview({ key, name, type, size });
    setPreviewLoading(true);
    try {
      const url = await actions.downloadUrl(key);
      setPreviewUrl(url);
    } finally {
      setPreviewLoading(false);
    }
  };

  const showDetails = (entry: StorageEntry) => {
    setDetails(entry);
    detailsRequestKeyRef.current = entry.key;
    setDetailsUrl(null);
    if (entry.is_folder) {
      setDetailsUrlStatus('idle');
      return;
    }
    setDetailsUrlStatus('loading');
    actions
      .downloadUrl(entry.key)
      .then((url) => {
        if (detailsRequestKeyRef.current === entry.key) {
          setDetailsUrl(url);
          setDetailsUrlStatus('idle');
        }
      })
      .catch(() => {
        if (detailsRequestKeyRef.current === entry.key) {
          setDetailsUrl(null);
          setDetailsUrlStatus('error');
        }
      });
  };

  const closeDetails = () => {
    detailsRequestKeyRef.current = null;
    setDetails(null);
    setDetailsUrl(null);
    setDetailsUrlStatus('idle');
    setSelectedKnowledgeBaseId(null);
    setSelectedCollectionId(null);
  };

  useEffect(() => {
    closePreview();
  }, [state.prefix]);

  const isImage = useMemo(() => {
    if (!preview) return false;
    const mime = preview.type || '';
    const ext = preview.name.split('.').pop()?.toLowerCase();
    return (
      mime.startsWith('image/') ||
      ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext || '')
    );
  }, [preview]);

  const totalItems = filteredFolders.length + filteredFiles.length;

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Files</h2>
          {isFetchingList && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openCreateFolderDialog}
            disabled={isCreatingFolder}
          >
            <FolderPlus className="mr-1.5 h-4 w-4" />
            New Folder
          </Button>

          <div className="inline-flex items-center gap-px">
            <Button
              size="sm"
              className="gap-2 rounded-r-none"
              onClick={() => triggerUploadDialog('private')}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="rounded-l-none px-2"
                  disabled={isUploading}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[99999] w-44 text-xs">
                <DropdownMenuLabel>Upload visibility</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => triggerUploadDialog('private')}
                  disabled={isUploading}
                >
                  Private (default)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => triggerUploadDialog('public')}
                  disabled={isUploading}
                >
                  Public
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{
          position: 'absolute',
          left: -9999,
          width: 1,
          height: 1,
          opacity: 0,
        }}
        onChange={handleUploadSelection}
      />

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sidebar */}
          <aside className="space-y-4">
            <p className="text-muted-foreground text-xs">
              Browse and manage your files. Upload new files or create folders to organize your content.
            </p>

            <div>
              <label className="text-xs">Search</label>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2" />
                <Input
                  placeholder="Search files..."
                  className="pl-9"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs">View</label>
              <ToggleGroup
                type="single"
                value={state.view}
                onValueChange={(value) => {
                  if (value === 'grid' || value === 'list') setView(value);
                }}
                className="mt-1 w-full justify-start"
              >
                <ToggleGroupItem value="grid" aria-label="Grid view" className="flex-1">
                  <Grid3X3 className="mr-1.5 h-4 w-4" />
                  Grid
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view" className="flex-1">
                  <List className="mr-1.5 h-4 w-4" />
                  List
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <label className="text-xs">Location</label>
              <div className="mt-1">
                <Breadcrumbs breadcrumbs={breadcrumbs} onClick={setPrefix} />
              </div>
            </div>

            <div className="border-t pt-3">
              <p className="text-muted-foreground text-xs">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
                {filteredFolders.length > 0 && ` • ${filteredFolders.length} folders`}
                {filteredFiles.length > 0 && ` • ${filteredFiles.length} files`}
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="relative md:col-span-3">
            {state.view === 'grid' ? (
              <FileGrid
                prefix={state.prefix}
                folders={filteredFolders}
                files={filteredFiles}
                onOpen={openItem}
                onPreview={previewFile}
                onShowDetails={showDetails}
                isLoading={isFetchingList}
                onCreateFolder={openCreateFolderDialog}
                onTriggerUpload={triggerUploadDialog}
                onSetVisibility={handleSetVisibility}
                isCreatingFolder={isCreatingFolder}
                knowledgeBases={knowledgeBases}
                knowledgeBasesLoading={knowledgeBasesStatus.isLoading}
                knowledgeBasesError={knowledgeBasesStatus.isError}
                collectionsByKnowledgeBase={collectionsByKnowledgeBase}
                collectionStatusByKnowledgeBase={collectionStatusByKnowledgeBase}
                onAddToKnowledgeBase={queueAddToKnowledgeBase}
                isAddingToKnowledgeBase={isAddingToKnowledgeBase}
              />
            ) : (
              <FileList
                prefix={state.prefix}
                folders={filteredFolders}
                files={filteredFiles}
                onOpen={openItem}
                onPreview={previewFile}
                onShowDetails={showDetails}
                isLoading={isFetchingList}
                onCreateFolder={openCreateFolderDialog}
                onTriggerUpload={triggerUploadDialog}
                onSetVisibility={handleSetVisibility}
                isCreatingFolder={isCreatingFolder}
                knowledgeBases={knowledgeBases}
                knowledgeBasesLoading={knowledgeBasesStatus.isLoading}
                knowledgeBasesError={knowledgeBasesStatus.isError}
                collectionsByKnowledgeBase={collectionsByKnowledgeBase}
                collectionStatusByKnowledgeBase={collectionStatusByKnowledgeBase}
                onAddToKnowledgeBase={queueAddToKnowledgeBase}
                isAddingToKnowledgeBase={isAddingToKnowledgeBase}
              />
            )}

            {isUploading && (
              <div className="bg-background/70 pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-md">
                <div className="bg-card flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium shadow">
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading files...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FolderDialog
        open={isFolderDialogOpen}
        portalContainer={portalContainer}
        isCreatingFolder={isCreatingFolder}
        name={newFolderName}
        error={newFolderError}
        onOpenChange={(open) => {
          if (!isCreatingFolder) {
            setFolderDialogOpen(open);
            if (!open) {
              setNewFolderError(null);
            }
          }
        }}
        onNameChange={(value) => {
          setNewFolderName(value);
          if (newFolderError) setNewFolderError(null);
        }}
        onSubmit={submitCreateFolder}
        onCancel={() => {
          if (!isCreatingFolder) {
            setFolderDialogOpen(false);
            setNewFolderError(null);
          }
        }}
        inputRef={newFolderInputRef}
      />

      <PreviewDialog
        open={!!preview}
        preview={preview}
        previewUrl={previewUrl}
        isLoading={previewLoading}
        isImage={isImage}
        portalContainer={portalContainer}
        onOpenChange={(open) => {
          if (!open) closePreview();
        }}
      />

      <DetailsDialog
        open={!!details}
        details={details}
        detailsUrl={detailsUrl}
        detailsUrlStatus={detailsUrlStatus}
        portalContainer={portalContainer}
        onOpenChange={(open) => {
          if (!open) closeDetails();
        }}
        onAddToKnowledgeBase={handleAddToKnowledgeBase}
        addSourceDisabled={addSourceDisabled}
        knowledgeBases={knowledgeBases}
        knowledgeBasesStatus={knowledgeBasesStatus}
        selectedKnowledgeBaseId={selectedKnowledgeBaseId}
        onSelectKnowledgeBase={(value) => setSelectedKnowledgeBaseId(value)}
        selectedCollectionId={selectedCollectionId}
        onSelectCollection={(value) => setSelectedCollectionId(value)}
        collections={selectedCollections}
        collectionsStatus={collectionsStatus}
        isAddingToKnowledgeBase={isAddingToKnowledgeBase}
      />
    </div>
  );
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase();
}

function splitFileName(name: string): { base: string; ext: string } {
  const trimmed = name.trim();
  const dot = trimmed.lastIndexOf('.');
  if (dot <= 0 || dot === trimmed.length - 1) {
    return { base: trimmed, ext: '' };
  }
  return {
    base: trimmed.slice(0, dot),
    ext: trimmed.slice(dot),
  };
}

function extractBase(base: string): { root: string; next: number } {
  const match = base.match(/^(.*?)(?:\s\((\d+)\))?$/);
  if (match) {
    const root = (match[1] ?? '').trim();
    const next = match[2] ? Number(match[2]) + 1 : 2;
    return { root: root || base, next };
  }
  return { root: base, next: 2 };
}

function makeUniqueName(
  desired: string,
  existing: Set<string>,
  options: { treatAsFile?: boolean; add?: boolean } = {},
): string {
  const { treatAsFile = false, add = true } = options;
  let trimmed = desired.trim();
  if (!trimmed) trimmed = 'Untitled';

  let base: string;
  let ext = '';
  if (treatAsFile) {
    const parts = splitFileName(trimmed);
    base = parts.base.trim() || 'Untitled';
    ext = parts.ext;
  } else {
    base = trimmed;
  }

  if (!base) base = 'Untitled';

  const { root, next } = extractBase(base);
  let counter = next;
  let candidateBase = base;
  let candidate = treatAsFile ? `${candidateBase}${ext}` : candidateBase;

  while (existing.has(normalizeName(candidate))) {
    candidateBase = `${root} (${counter})`;
    candidate = treatAsFile ? `${candidateBase}${ext}` : candidateBase;
    counter += 1;
  }

  if (add) {
    existing.add(normalizeName(candidate));
  }

  return candidate;
}
