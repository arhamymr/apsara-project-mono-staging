'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button } from '@workspace/ui/components/button';
import { Kbd } from '@workspace/ui/components/kbd';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { ChunkEditorSheet } from '@/layouts/os/apps/knowledge-base/components/ChunkEditorSheet';
import { ChunksPanel } from '@/layouts/os/apps/knowledge-base/components/ChunksPanel';
import { CreateCollectionDialog } from '@/layouts/os/apps/knowledge-base/components/CreateCollectionDialog';
import { CreateKnowledgeBaseDialog } from '@/layouts/os/apps/knowledge-base/components/CreateKnowledgeBaseDialog';
import { CreateSourceDialog } from '@/layouts/os/apps/knowledge-base/components/CreateSourceDialog';
import { KnowledgeSidebar } from '@/layouts/os/apps/knowledge-base/components/KnowledgeSidebar';
import { SourceDetailsPanel } from '@/layouts/os/apps/knowledge-base/components/SourceDetailsPanel';
import { SourceTable } from '@/layouts/os/apps/knowledge-base/components/SourceTable';
import type { KBChunk } from '@/layouts/os/apps/knowledge-base/components/types';
import { useSourceLifecycle } from '@/layouts/os/apps/knowledge-base/hooks/source-lifecycle';
import { useChunkEditor } from '@/layouts/os/apps/knowledge-base/hooks/useChunkEditor';
import { useCollectionSources } from '@/layouts/os/apps/knowledge-base/hooks/useCollectionSources';
import { useKnowledgeBaseState } from '@/layouts/os/apps/knowledge-base/hooks/useKnowledgeBaseState';
import { useManualSourceUpload } from '@/layouts/os/apps/knowledge-base/hooks/useManualSourceUpload';
import { useSourceChunks } from '@/layouts/os/apps/knowledge-base/hooks/useSourceChunks';
import { useSourcesState } from '@/layouts/os/apps/knowledge-base/hooks/useSourcesState';
import { ArrowLeft } from 'lucide-react';

export default function KnowledgeBaseExplorer() {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const {
    query: knowledgeBaseQuery,
    lists,
    selection,
    search,
    createKbDialog,
    createCollectionDialog,
    actions,
  } = useKnowledgeBaseState();

  const {
    selectedKbId,
    selectedCollectionId,
    selectedSourceId,
    selectedKb,
    selectedKbRecord,
    selectedCollection,
    selectKb,
    selectCollection,
    setSelectedSourceId,
  } = selection;

  const { kbs, collections } = lists;

  const {
    rawSources,
    refetchSources,
    isLoadingSources,
    isFetchingSources,
    sourcesErrorMessage,
    sourcesQueryEnabled,
  } = useCollectionSources(selectedKbRecord, selectedCollectionId);

  const { sources, selectedSource } = useSourcesState({
    rawSources,
    selectedSourceId,
    sourcesQueryEnabled,
  });

  const {
    manualUploadDisabled,
    openManualUploadDialog,
    dialogProps: manualUploadDialogProps,
  } = useManualSourceUpload({
    selectedKb,
    selectedKbRecord,
    selectedCollection,
    selectedCollectionId,
    refetchSources,
  });

  const {
    chunks: fetchedChunks,
    isLoadingChunks,
    isFetchingChunks,
    chunksErrorMessage,
    refetchChunks,
  } = useSourceChunks(selectedSource);

  const handleSourceCleared = useCallback(() => {
    setSelectedSourceId(null);
    setViewMode('list');
  }, [setSelectedSourceId]);

  const handleOpenSource = useCallback(
    (sourceId: string) => {
      setSelectedSourceId(sourceId);
      setViewMode('detail');
    },
    [setSelectedSourceId],
  );

  const {
    chunkSheetOpen,
    setChunkSheetOpen,
    chunkEditing,
    activeChunks,
    handleEditChunk,
    handleChunkTextChange,
    handleUpsertChunk,
    handleCreateChunkFromSource,
    setChunksForSource,
  } = useChunkEditor(selectedSourceId);

  useEffect(() => {
    if (!selectedSourceId) return;
    setChunksForSource(selectedSourceId, fetchedChunks);
  }, [fetchedChunks, selectedSourceId, setChunksForSource]);

  const handleChunksUpserted = useCallback(
    (sourceId: string, chunks: KBChunk[]) => {
      setChunksForSource(sourceId, chunks);
    },
    [setChunksForSource],
  );

  const {
    mastraStatus,
    isFetchingMastraStatus,
    mastraStatusErrorMessage,
    refreshMastraStatus,
    handleDeleteSource,
    isDeleting,
    handleTriggerIngest,
    canIngest,
    isIngesting,
  } = useSourceLifecycle({
    viewMode,
    selectedSource,
    refetchSources,
    onSourceCleared: handleSourceCleared,
    onChunksUpserted: handleChunksUpserted,
  });

  const portalRef = useWindowPortalContainer();
  const portalContainer = portalRef?.current ?? undefined;

  return (
    <div className="text-foreground flex h-full flex-col">
      {/* Header */}
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-semibold">Knowledge Base</h2>
          {selectedCollection && (
            <span className="text-muted-foreground text-sm">
              {selectedCollection.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'outline' : 'ghost'}
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'detail' ? 'outline' : 'ghost'}
              onClick={() => setViewMode('detail')}
            >
              Detail
            </Button>
          </div>
          <Button size="sm" onClick={() => createKbDialog.onOpenChange(true)}>
            New KB <Kbd className="text-primary-900 bg-black/20">N</Kbd>
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <KnowledgeSidebar
              knowledgeBases={kbs}
              collections={collections}
              selectedKbId={selectedKbId}
              selectedCollectionId={selectedCollectionId}
              onSelectKb={selectKb}
              onSelectCollection={selectCollection}
              onCreateKb={() => createKbDialog.onOpenChange(true)}
              onCreateCollection={actions.requestCreateCollection}
              onCreateCollectionFor={actions.openCreateCollectionForKb}
              onDeleteKb={actions.deleteKnowledgeBase}
              search={search.value}
              onSearch={search.onChange}
              onClearSearch={search.clear}
              isLoading={knowledgeBaseQuery.isLoading}
              isFetching={knowledgeBaseQuery.isFetching}
              errorMessage={knowledgeBaseQuery.errorMessage}
              onRetry={knowledgeBaseQuery.retry}
              portalContainer={portalContainer}
            />
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3">
            {viewMode === 'detail' ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setViewMode('list')}
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to sources
                  </Button>
                </div>

                <SourceDetailsPanel
                  source={selectedSource}
                  ingestStatus={mastraStatus}
                  isStatusFetching={isFetchingMastraStatus}
                  statusErrorMessage={mastraStatusErrorMessage}
                  onRefreshStatus={() => {
                    void refreshMastraStatus();
                  }}
                  onDelete={handleDeleteSource}
                  isDeleting={isDeleting}
                  onIngest={handleTriggerIngest}
                  canIngest={canIngest}
                  isIngesting={isIngesting}
                />

                <ChunksPanel
                  selectedSourceId={selectedSourceId}
                  sources={sources}
                  chunks={activeChunks}
                  onEditChunk={handleEditChunk}
                  onCreateFromSource={handleCreateChunkFromSource}
                  disableCreate={!selectedSourceId}
                  isLoading={Boolean(selectedSourceId) && isLoadingChunks}
                  isFetching={isFetchingChunks}
                  errorMessage={chunksErrorMessage}
                  onRefresh={() => {
                    if (!selectedSourceId) return;
                    void refetchChunks();
                  }}
                />
              </div>
            ) : (
              <SourceTable
                sources={selectedCollectionId ? sources : []}
                isLoading={sourcesQueryEnabled && isLoadingSources}
                isFetching={sourcesQueryEnabled && isFetchingSources}
                errorMessage={sourcesErrorMessage}
                onRefresh={refetchSources}
                onManualUpload={openManualUploadDialog}
                manualUploadDisabled={manualUploadDisabled}
                onOpenSource={handleOpenSource}
                selectedSourceId={selectedSourceId}
                emptyMessage={
                  selectedCollectionId
                    ? 'No sources yet.'
                    : 'Select a collection to view sources'
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateCollectionDialog
        open={createCollectionDialog.open}
        onOpenChange={createCollectionDialog.onOpenChange}
        knowledgeBaseName={selectedKb?.name}
        name={createCollectionDialog.name}
        description={createCollectionDialog.description}
        onNameChange={createCollectionDialog.onNameChange}
        onDescriptionChange={createCollectionDialog.onDescriptionChange}
        error={createCollectionDialog.error}
        onSubmit={createCollectionDialog.onSubmit}
        isSubmitting={createCollectionDialog.isSubmitting}
        portalContainer={portalContainer}
      />

      <CreateKnowledgeBaseDialog
        open={createKbDialog.open}
        onOpenChange={createKbDialog.onOpenChange}
        title={createKbDialog.title}
        onTitleChange={createKbDialog.onTitleChange}
        error={createKbDialog.error}
        onSubmit={createKbDialog.onSubmit}
        isSubmitting={createKbDialog.isSubmitting}
        portalContainer={portalContainer}
      />

      <ChunkEditorSheet
        open={chunkSheetOpen}
        onOpenChange={setChunkSheetOpen}
        chunk={chunkEditing}
        onChangeText={handleChunkTextChange}
        onSave={handleUpsertChunk}
        portalContainer={portalContainer}
      />

      <CreateSourceDialog
        {...manualUploadDialogProps}
        portalContainer={portalContainer}
      />
    </div>
  );
}
