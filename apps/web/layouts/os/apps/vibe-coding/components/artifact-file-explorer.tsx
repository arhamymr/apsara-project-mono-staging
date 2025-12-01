import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useTheme } from '@/layouts/dark-mode/useTheme';
import { fetcher } from '@/lib/fetcher';
import {
  buildFileTree,
  FileManifestItem,
  FileTreeNode,
  getLanguageFromPath,
} from '@/lib/file-utils';
import Editor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import {
  Download,
  Eye,
  File,
  FileCode,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FileNode, FileTree } from './file-tree';

interface Artifact {
  id: string;
  version: number;
  title: string;
  description?: string;
  file_count: number;
  total_size: number;
  trigger: 'manual' | 'auto' | 'milestone';
  metadata?: {
    framework?: string;
    language?: string;
  };
  created_at: string;
}

interface ArtifactDetails extends Artifact {
  file_manifest: FileManifestItem[];
}

interface ArtifactFileExplorerProps {
  sessionId: string;
}

export function ArtifactFileExplorer({ sessionId }: ArtifactFileExplorerProps) {
  const { theme } = useTheme();
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null,
  );
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  // Fetch artifacts list
  const {
    data: artifactsData,
    isLoading: isLoadingArtifacts,
    refetch: refetchArtifacts,
  } = useQuery<{ artifacts: Artifact[] }>({
    queryKey: ['artifacts', sessionId],
    queryFn: () => fetcher(`/api/sessions/${sessionId}/artifacts`),
    enabled: !!sessionId,
  });

  // Fetch selected artifact details
  const { data: artifactDetails, isLoading: isLoadingDetails } = useQuery<{
    artifact: ArtifactDetails;
  }>({
    queryKey: ['artifact', selectedArtifact?.id],
    queryFn: () => fetcher(`/api/artifacts/${selectedArtifact?.id}`),
    enabled: !!selectedArtifact?.id,
  });

  // Fetch selected file content
  const { data: fileData, isLoading: isLoadingFile } = useQuery<{
    path: string;
    content: string;
  }>({
    queryKey: ['artifact-file', selectedArtifact?.id, selectedFile],
    queryFn: () =>
      fetcher(
        `/api/artifacts/${selectedArtifact?.id}/files?path=${encodeURIComponent(selectedFile!)}`,
      ),
    enabled: !!selectedArtifact?.id && !!selectedFile,
  });

  const artifacts = artifactsData?.artifacts || [];

  // Build file tree from manifest
  const fileTree = buildFileTree(
    artifactDetails?.artifact.file_manifest,
    expandedFolders,
  );

  const toggleFolder = (pathArray: string[]) => {
    const path = pathArray.join('/');
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const handleDownload = async (artifactId: string, title: string) => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}/download`, {
        credentials: 'include', // Use cookie-based auth (Sanctum)
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Artifact downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download artifact');
    }
  };

  // Convert FileTreeNode to FileNode format for FileTree component
  const convertToFileNode = (nodes: FileTreeNode[]): FileNode[] => {
    return nodes.map((node) => ({
      name: node.name,
      type: node.type,
      expanded: node.expanded,
      children: node.children ? convertToFileNode(node.children) : undefined,
    }));
  };

  if (isLoadingArtifacts) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          <FileCode className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Artifacts Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Artifacts are saved versions of your generated code. Ask the agent to
          save your work to create your first artifact.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Artifacts List */}
      <div className="w-64 border-r">
        <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
          <h3 className="text-xs font-semibold uppercase">
            Artifacts ({artifacts.length})
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => refetchArtifacts()}
          >
            <RefreshCw size={14} />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100%-41px)]">
          <div className="space-y-1 p-2">
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                className={`hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors ${
                  selectedArtifact?.id === artifact.id ? 'bg-muted' : ''
                }`}
                onClick={() => {
                  setSelectedArtifact(artifact);
                  setSelectedFile(null);
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold">
                    v{artifact.version}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm font-medium">
                  {artifact.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {artifact.file_count} files
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* File Explorer */}
      {selectedArtifact && (
        <div className="w-64 border-r">
          <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
            <h3 className="text-xs font-semibold uppercase">Files</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() =>
                handleDownload(selectedArtifact.id, selectedArtifact.title)
              }
            >
              <Download size={14} />
            </Button>
          </div>
          <ScrollArea className="h-[calc(100%-41px)]">
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="py-2">
                <FileTree
                  nodes={convertToFileNode(fileTree)}
                  selectedFile={selectedFile || ''}
                  onFileSelect={setSelectedFile}
                  onFolderToggle={toggleFolder}
                />
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* File Viewer */}
      <div className="flex-1">
        {selectedFile && selectedArtifact ? (
          <div className="flex h-full flex-col">
            <div className="bg-muted/50 flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <File size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{selectedFile}</span>
              </div>
            </div>
            <div className="flex-1">
              {isLoadingFile ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Editor
                  height="100%"
                  language={getLanguageFromPath(selectedFile)}
                  value={fileData?.content || ''}
                  theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Eye className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-4">
                {selectedArtifact
                  ? 'Select a file to view its content'
                  : 'Select an artifact to explore files'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
