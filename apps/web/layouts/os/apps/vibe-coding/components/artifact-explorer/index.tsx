import { Loader2 } from 'lucide-react';
import { useArtifactExplorer } from './use-artifact-explorer';
import { ArtifactList } from './artifact-list';
import { FilePanel } from './file-panel';
import { FileViewer } from './file-viewer';
import { EmptyState } from './empty-state';

interface ArtifactExplorerProps {
  sessionId: string;
}

export function ArtifactExplorer({ sessionId }: ArtifactExplorerProps) {
  const {
    artifacts,
    selectedArtifact,
    selectedFile,
    expandedFolders,
    artifactDetails,
    fileData,
    isLoadingArtifacts,
    isLoadingDetails,
    isLoadingFile,
    setSelectedFile,
    toggleFolder,
    expandAll,
    collapseAll,
    handleSelectArtifact,
    handleDownload,
    refetchArtifacts,
  } = useArtifactExplorer(sessionId);

  if (isLoadingArtifacts) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (artifacts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex h-full">
      <ArtifactList
        artifacts={artifacts}
        selectedArtifact={selectedArtifact}
        isLoading={isLoadingArtifacts}
        onSelect={handleSelectArtifact}
        onRefresh={refetchArtifacts}
      />

      {selectedArtifact && (
        <FilePanel
          artifactDetails={artifactDetails?.artifact}
          expandedFolders={expandedFolders}
          selectedFile={selectedFile}
          isLoading={isLoadingDetails}
          onFileSelect={setSelectedFile}
          onFolderToggle={toggleFolder}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onDownload={() => handleDownload(selectedArtifact.id, selectedArtifact.title)}
        />
      )}

      <FileViewer
        selectedFile={selectedFile}
        fileContent={fileData?.content}
        isLoading={isLoadingFile}
        hasArtifact={!!selectedArtifact}
      />
    </div>
  );
}
