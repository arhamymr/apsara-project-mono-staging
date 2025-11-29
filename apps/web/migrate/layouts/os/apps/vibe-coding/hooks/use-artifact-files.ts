import { fetcher } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface FileManifestItem {
  path: string;
  size: number;
  hash: string;
}

interface Artifact {
  id: string;
  version: number;
  title: string;
  description?: string;
  file_count: number;
  total_size: number;
  trigger: 'manual' | 'auto' | 'milestone';
  file_manifest: FileManifestItem[];
  metadata?: {
    framework?: string;
    language?: string;
  };
  created_at: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  expanded?: boolean;
  children?: FileNode[];
}

export function useArtifactFiles(sessionId: string) {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [latestArtifact, setLatestArtifact] = useState<Artifact | null>(null);

  // Fetch latest artifact
  const {
    data: artifactsData,
    isLoading: isLoadingArtifacts,
    refetch: refetchArtifacts,
  } = useQuery<{ artifacts: Artifact[] }>({
    queryKey: ['artifacts', sessionId],
    queryFn: () => fetcher(`/api/sessions/${sessionId}/artifacts`),
    enabled: !!sessionId,
    refetchInterval: 5000, // Refetch every 5 seconds to get new artifacts
  });

  // Get artifact details when latest artifact changes
  const { data: artifactDetails } = useQuery<{ artifact: Artifact }>({
    queryKey: ['artifact-details', latestArtifact?.id],
    queryFn: () => fetcher(`/api/artifacts/${latestArtifact?.id}`),
    enabled: !!latestArtifact?.id,
  });

  // Update latest artifact when artifacts list changes
  useEffect(() => {
    if (artifactsData?.artifacts && artifactsData.artifacts.length > 0) {
      // Get the artifact with the highest version (latest)
      const latest = artifactsData.artifacts.reduce((prev, current) =>
        current.version > prev.version ? current : prev,
      );
      setLatestArtifact(latest);
    }
  }, [artifactsData]);

  // Build file tree from artifact manifest
  useEffect(() => {
    if (artifactDetails?.artifact?.file_manifest) {
      const manifest = artifactDetails.artifact.file_manifest;
      const tree = buildFileTree(manifest);
      setFileTree(tree);

      // Auto-select first file
      if (manifest.length > 0 && !selectedFile) {
        setSelectedFile(manifest[0].path);
      }
    }
  }, [artifactDetails]);

  const buildFileTree = (manifest: FileManifestItem[]): FileNode[] => {
    const root: FileNode[] = [];
    const folderMap = new Map<string, FileNode>();

    manifest.forEach((item) => {
      const parts = item.path.split('/');
      let currentLevel = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const isFile = index === parts.length - 1;

        if (isFile) {
          currentLevel.push({
            name: part,
            path: item.path,
            type: 'file',
          });
        } else {
          let folder = folderMap.get(currentPath);
          if (!folder) {
            folder = {
              name: part,
              path: currentPath,
              type: 'folder',
              expanded: true, // Auto-expand all folders
              children: [],
            };
            folderMap.set(currentPath, folder);
            currentLevel.push(folder);
          }
          currentLevel = folder.children!;
        }
      });
    });

    return root;
  };

  const toggleFolder = (path: string[]) => {
    const updateTree = (
      nodes: FileNode[],
      currentPath: string[],
    ): FileNode[] => {
      return nodes.map((node) => {
        if (currentPath.length === 1 && node.name === currentPath[0]) {
          return { ...node, expanded: !node.expanded };
        }
        if (node.children && currentPath[0] === node.name) {
          return {
            ...node,
            children: updateTree(node.children, currentPath.slice(1)),
          };
        }
        return node;
      });
    };
    setFileTree(updateTree(fileTree, path));
  };

  // Fetch file content when selected
  const { data: fileData, isLoading: isLoadingFile } = useQuery<{
    path: string;
    content: string;
  }>({
    queryKey: ['artifact-file-content', latestArtifact?.id, selectedFile],
    queryFn: () =>
      fetcher(
        `/api/artifacts/${latestArtifact?.id}/files?path=${encodeURIComponent(selectedFile!)}`,
      ),
    enabled: !!latestArtifact?.id && !!selectedFile,
  });

  // Cache file content
  useEffect(() => {
    if (fileData && selectedFile) {
      setFileContents((prev) => ({
        ...prev,
        [selectedFile]: fileData.content,
      }));
    }
  }, [fileData, selectedFile]);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
  };

  const handleContentChange = (content: string) => {
    if (selectedFile) {
      setFileContents((prev) => ({
        ...prev,
        [selectedFile]: content,
      }));
    }
  };

  return {
    fileTree,
    selectedFile: selectedFile || '',
    fileContent: selectedFile ? fileContents[selectedFile] || '' : '',
    isLoadingArtifacts,
    isLoadingFile,
    latestArtifact,
    hasArtifacts: (artifactsData?.artifacts?.length || 0) > 0,
    onFileSelect: handleFileSelect,
    onFolderToggle: toggleFolder,
    onContentChange: handleContentChange,
    refetchArtifacts,
  };
}
