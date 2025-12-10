import { useState, useMemo, useEffect } from 'react';
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

interface UseArtifactsOptions {
  streamingFiles?: Map<string, string>; // Files being streamed in real-time
  loadingFile?: string | null; // Currently loading file path (for auto-selection)
}

export function useArtifactsConvex(sessionId: string, options: UseArtifactsOptions = {}) {
  const { streamingFiles, loadingFile } = options;
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [prevArtifactId, setPrevArtifactId] = useState<string | null>(null);

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

  // Merge persisted artifact files with streaming files
  const mergedFiles = useMemo(() => {
    console.log('[useArtifacts] Computing mergedFiles:', {
      hasLatestArtifact: !!latestArtifact,
      hasFiles: !!latestArtifact?.files,
      filesType: typeof latestArtifact?.files,
      filesPreview: typeof latestArtifact?.files === 'string' 
        ? latestArtifact.files.slice(0, 100) 
        : 'object',
      streamingFilesSize: streamingFiles?.size || 0,
    });
    
    const files: Record<string, string> = {};
    
    // Add persisted files first
    if (latestArtifact?.files) {
      try {
        const artifactFiles = typeof latestArtifact.files === 'string' 
          ? JSON.parse(latestArtifact.files) 
          : latestArtifact.files;
        console.log('[useArtifacts] Parsed artifact files:', {
          keys: Object.keys(artifactFiles),
          sampleContent: Object.values(artifactFiles)[0]?.toString().slice(0, 50),
        });
        Object.assign(files, artifactFiles);
      } catch (error) {
        console.error('[useArtifacts] Failed to parse artifact files:', error);
      }
    }
    
    // Overlay streaming files (these take precedence during streaming)
    if (streamingFiles && streamingFiles.size > 0) {
      streamingFiles.forEach((content, path) => {
        files[path] = content;
      });
      console.log('[useArtifacts] Added streaming files:', Array.from(streamingFiles.keys()));
    }
    
    console.log('[useArtifacts] Final merged files:', {
      count: Object.keys(files).length,
      keys: Object.keys(files),
    });
    return files;
  }, [latestArtifact, streamingFiles]);

  // Build file tree from merged files (persisted + streaming)
  const fileTree = useMemo(() => {
    const filePaths = Object.keys(mergedFiles);
    if (filePaths.length === 0) return [];

    const tree: FileNode[] = [];
    const folders = new Map<string, FileNode>();

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

    return tree;
  }, [mergedFiles]);

  // Auto-select loading file when streaming, or first file when files change
  useEffect(() => {
    const filePaths = Object.keys(mergedFiles);
    if (filePaths.length === 0) return;
    
    // Auto-select the file being streamed so user sees content in real-time
    if (loadingFile && mergedFiles[loadingFile]) {
      setSelectedFile(loadingFile);
      return;
    }
    
    const currentArtifactId = latestArtifact?._id ? String(latestArtifact._id) : null;
    
    // Select first file if no file selected or if artifact changed
    if (filePaths[0]) {
      if (!selectedFile || (currentArtifactId && currentArtifactId !== prevArtifactId)) {
        setSelectedFile(filePaths[0]);
        setPrevArtifactId(currentArtifactId);
      }
    }
  }, [mergedFiles, latestArtifact?._id, selectedFile, prevArtifactId, loadingFile]);

  // Get content of selected file (from merged files - streaming takes precedence)
  const fileContent = useMemo(() => {
    if (!selectedFile) {
      console.log('[useArtifacts] No file selected');
      return '';
    }
    const content = mergedFiles[selectedFile] || '';
    console.log('[useArtifacts] File content:', {
      selectedFile,
      hasContent: !!content,
      contentLength: content.length,
      availableFiles: Object.keys(mergedFiles),
    });
    return content;
  }, [selectedFile, mergedFiles]);

  const handleFileSelect = (path: string) => {
    console.log('[useArtifacts] File selected:', path);
    setSelectedFile(path);
  };

  const handleFolderToggle = (path: string[]) => {
    // This would update the isOpen state of folders
    console.log('Toggle folder:', path);
  };

  const hasStreamingFiles = !!(streamingFiles && streamingFiles.size > 0);

  return {
    fileTree,
    selectedFile,
    fileContent,
    artifacts,
    latestArtifact,
    hasArtifacts: artifacts.length > 0 || hasStreamingFiles,
    isLoadingArtifacts: latestArtifact === undefined,
    isStreaming: hasStreamingFiles,
    onFileSelect: handleFileSelect,
    onFolderToggle: handleFolderToggle,
  };
}
