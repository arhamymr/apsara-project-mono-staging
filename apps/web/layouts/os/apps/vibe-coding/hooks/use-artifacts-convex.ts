import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

export function useArtifactsConvex(sessionId: string) {
  const [selectedFile, setSelectedFile] = useState<string>('');

  // Query to get the latest artifact
  const latestArtifact = useQuery(
    api.vibeCoding.getLatestArtifact,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  );

  // Query to get all artifacts
  const artifacts = useQuery(
    api.vibeCoding.getSessionArtifacts,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  ) || [];

  // Build file tree from artifact files
  const fileTree = useMemo(() => {
    if (!latestArtifact?.files) return [];

    const tree: FileNode[] = [];
    const folders = new Map<string, FileNode>();

    // Get all file paths
    const filePaths = Object.keys(latestArtifact.files);

    filePaths.forEach((path) => {
      const parts = path.split('/');
      let currentPath = '';

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;

        if (isFile) {
          // Add file to its parent folder or root
          const parentPath = parts.slice(0, -1).join('/');
          const file: FileNode = {
            name: part,
            path: currentPath,
            type: 'file',
          };

          if (parentPath) {
            const parent = folders.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(file);
            }
          } else {
            tree.push(file);
          }
        } else {
          // Create or get folder
          if (!folders.has(currentPath)) {
            const folder: FileNode = {
              name: part,
              path: currentPath,
              type: 'folder',
              children: [],
              isOpen: true,
            };

            folders.set(currentPath, folder);

            // Add folder to its parent or root
            const parentPath = parts.slice(0, index).join('/');
            if (parentPath) {
              const parent = folders.get(parentPath);
              if (parent && parent.children) {
                parent.children.push(folder);
              }
            } else {
              tree.push(folder);
            }
          }
        }
      });
    });

    // Sort: folders first, then files, both alphabetically
    const sortNodes = (nodes: FileNode[]) => {
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      nodes.forEach((node) => {
        if (node.children) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(tree);

    // Auto-select first file if none selected
    if (!selectedFile && filePaths.length > 0 && filePaths[0]) {
      setSelectedFile(filePaths[0]);
    }

    return tree;
  }, [latestArtifact, selectedFile]);

  // Get content of selected file
  const fileContent = useMemo(() => {
    if (!selectedFile || !latestArtifact?.files) return '';
    const files = latestArtifact.files as Record<string, string>;
    return files[selectedFile] || '';
  }, [selectedFile, latestArtifact]);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
  };

  const handleFolderToggle = (path: string[]) => {
    // This would update the isOpen state of folders
    console.log('Toggle folder:', path);
  };

  return {
    fileTree,
    selectedFile,
    fileContent,
    artifacts,
    latestArtifact,
    hasArtifacts: artifacts.length > 0,
    isLoadingArtifacts: latestArtifact === undefined,
    onFileSelect: handleFileSelect,
    onFolderToggle: handleFolderToggle,
  };
}
