import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean;
}

export interface VersionInfo {
  _id: string;
  version: number;
  description?: string;
  messageId?: string;
  fileCount: number;
  filePaths: string[];
  createdAt: number;
}

interface UseArtifactsOptions {
  streamingFiles?: Map<string, string>; // Files being streamed in real-time
  loadingFile?: string | null; // Currently loading file path (for auto-selection)
}

export function useArtifactsConvex(sessionId: string, options: UseArtifactsOptions = {}) {
  const { streamingFiles, loadingFile } = options;
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [prevArtifactId, setPrevArtifactId] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null); // null = latest
  const [localEdits, setLocalEdits] = useState<Record<string, string>>({}); // Local edits before save
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null); // Timestamp of last save
  const savedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevSelectedFileRef = useRef<string>('');
  
  // Mutation for updating artifact files
  const updateArtifactFile = useMutation(api.vibeCoding.updateArtifactFile);

  // Query to get the latest artifact
  const latestArtifact = useQuery(
    api.vibeCoding.getLatestArtifact,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  );

  // Query to get version history (lightweight)
  const versionHistory = useQuery(
    api.vibeCoding.getVersionHistory,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  ) || [];

  // Query to get specific version (only when not viewing latest)
  const specificVersionArtifact = useQuery(
    api.vibeCoding.getArtifactByVersion,
    sessionId && selectedVersion !== null
      ? { sessionId: sessionId as Id<"chatSessions">, version: selectedVersion }
      : 'skip'
  );

  // Query to get all artifacts (for backwards compatibility)
  const artifacts = useQuery(
    api.vibeCoding.getSessionArtifacts,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  ) || [];

  // Determine which artifact to display
  const activeArtifact = selectedVersion !== null ? specificVersionArtifact : latestArtifact;
  const currentVersion = activeArtifact?.version ?? latestArtifact?.version ?? 0;
  const totalVersions = versionHistory.length;

  // Merge persisted artifact files with streaming files and local edits
  const mergedFiles = useMemo(() => {
    console.log('[useArtifacts] Computing mergedFiles:', {
      hasActiveArtifact: !!activeArtifact,
      selectedVersion,
      currentVersion,
      hasFiles: !!activeArtifact?.files,
      filesType: typeof activeArtifact?.files,
      streamingFilesSize: streamingFiles?.size || 0,
      localEditsCount: Object.keys(localEdits).length,
    });
    
    const files: Record<string, string> = {};
    
    // Add persisted files first (from active artifact - either latest or selected version)
    if (activeArtifact?.files) {
      try {
        const artifactFiles = typeof activeArtifact.files === 'string' 
          ? JSON.parse(activeArtifact.files) 
          : activeArtifact.files;
        console.log('[useArtifacts] Parsed artifact files:', {
          version: activeArtifact.version,
          keys: Object.keys(artifactFiles),
          sampleContent: Object.values(artifactFiles)[0]?.toString().slice(0, 50),
        });
        Object.assign(files, artifactFiles);
      } catch (error) {
        console.error('[useArtifacts] Failed to parse artifact files:', error);
      }
    }
    
    // Overlay streaming files only when viewing latest version (these take precedence during streaming)
    if (selectedVersion === null && streamingFiles && streamingFiles.size > 0) {
      streamingFiles.forEach((content, path) => {
        files[path] = content;
      });
      console.log('[useArtifacts] Added streaming files:', Array.from(streamingFiles.keys()));
    }
    
    // Overlay local edits (highest priority - user's unsaved changes)
    if (selectedVersion === null && Object.keys(localEdits).length > 0) {
      Object.assign(files, localEdits);
      console.log('[useArtifacts] Added local edits:', Object.keys(localEdits));
    }
    
    console.log('[useArtifacts] Final merged files:', {
      count: Object.keys(files).length,
      keys: Object.keys(files),
    });
    return files;
  }, [activeArtifact, streamingFiles, selectedVersion, currentVersion, localEdits]);

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
    
    const currentArtifactId = activeArtifact?._id ? String(activeArtifact._id) : null;
    
    // Select first file if no file selected or if artifact changed
    if (filePaths[0]) {
      if (!selectedFile || (currentArtifactId && currentArtifactId !== prevArtifactId)) {
        setSelectedFile(filePaths[0]);
        setPrevArtifactId(currentArtifactId);
      }
    }
  }, [mergedFiles, activeArtifact?._id, selectedFile, prevArtifactId, loadingFile]);

  // Reset to latest version when new version is created during streaming
  useEffect(() => {
    if (latestArtifact?.version && selectedVersion !== null) {
      // If we're viewing an old version and a new one is created, stay on old version
      // User can manually switch to latest
      console.log('[useArtifacts] New version available:', latestArtifact.version);
    }
  }, [latestArtifact?.version, selectedVersion]);

  // Version navigation handlers
  const goToVersion = useCallback((version: number) => {
    console.log('[useArtifacts] Switching to version:', version);
    setSelectedVersion(version);
    setSelectedFile(''); // Reset file selection when changing versions
  }, []);

  const goToLatest = useCallback(() => {
    console.log('[useArtifacts] Switching to latest version');
    setSelectedVersion(null);
    setSelectedFile(''); // Reset file selection
  }, []);

  const goToPreviousVersion = useCallback(() => {
    if (currentVersion > 1) {
      goToVersion(currentVersion - 1);
    }
  }, [currentVersion, goToVersion]);

  const goToNextVersion = useCallback(() => {
    const latestVersion = latestArtifact?.version ?? 0;
    if (selectedVersion !== null && selectedVersion < latestVersion) {
      if (selectedVersion + 1 === latestVersion) {
        goToLatest();
      } else {
        goToVersion(selectedVersion + 1);
      }
    }
  }, [selectedVersion, latestArtifact?.version, goToVersion, goToLatest]);

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

  // Save a specific file to Convex
  const saveFile = useCallback(async (filePath: string, content: string) => {
    if (!sessionId || selectedVersion !== null || isSaving) return;
    
    try {
      setIsSaving(true);
      console.log('[useArtifacts] Saving file:', filePath);
      await updateArtifactFile({
        sessionId: sessionId as Id<"chatSessions">,
        filePath,
        content,
      });
      console.log('[useArtifacts] File saved successfully');
      
      // Clear local edit for this file after successful save
      setLocalEdits(prev => {
        const next = { ...prev };
        delete next[filePath];
        return next;
      });
      
      // Show "Saved" indicator for 2 seconds
      setLastSavedAt(Date.now());
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
      savedTimeoutRef.current = setTimeout(() => {
        setLastSavedAt(null);
      }, 2000);
      
    } catch (error) {
      console.error('[useArtifacts] Failed to save file:', error);
    } finally {
      setIsSaving(false);
    }
  }, [sessionId, selectedVersion, isSaving, updateArtifactFile]);

  // Handle file content change (from editor) - just update local state, no auto-save
  const handleFileChange = useCallback((filePath: string, content: string) => {
    console.log('[useArtifacts] File changed:', filePath, 'length:', content.length);
    
    // Clear "saved" indicator when user starts editing again
    setLastSavedAt(null);
    if (savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
    }
    
    // Update local edits immediately for responsive UI
    setLocalEdits(prev => ({
      ...prev,
      [filePath]: content,
    }));
  }, []);

  // Manual save (Ctrl+S)
  const handleSaveFile = useCallback(async () => {
    if (!selectedFile || !localEdits[selectedFile]) {
      console.log('[useArtifacts] Nothing to save');
      return;
    }
    await saveFile(selectedFile, localEdits[selectedFile]);
  }, [selectedFile, localEdits, saveFile]);

  // Save on file deselect (when switching files)
  useEffect(() => {
    const prevFile = prevSelectedFileRef.current;
    
    // If we had a previous file selected and it has unsaved changes, save it
    if (prevFile && prevFile !== selectedFile && localEdits[prevFile]) {
      console.log('[useArtifacts] File deselected, saving:', prevFile);
      saveFile(prevFile, localEdits[prevFile]);
    }
    
    // Update ref for next comparison
    prevSelectedFileRef.current = selectedFile;
  }, [selectedFile, localEdits, saveFile]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  const hasStreamingFiles = !!(streamingFiles && streamingFiles.size > 0);
  const isViewingOldVersion = selectedVersion !== null;
  const hasUnsavedChanges = Object.keys(localEdits).length > 0;
  const justSaved = lastSavedAt !== null;

  return {
    fileTree,
    selectedFile,
    fileContent,
    currentFiles: mergedFiles, // All files for current version (for sandbox)
    artifacts,
    latestArtifact,
    hasArtifacts: artifacts.length > 0 || hasStreamingFiles,
    isLoadingArtifacts: latestArtifact === undefined,
    isStreaming: hasStreamingFiles,
    onFileSelect: handleFileSelect,
    onFolderToggle: handleFolderToggle,
    onFileChange: handleFileChange, // For editor edits
    onSaveFile: handleSaveFile, // Manual save (Ctrl+S)
    
    // Save state
    isSaving,
    hasUnsavedChanges,
    justSaved,
    
    // Version management
    currentVersion,
    totalVersions,
    selectedVersion,
    isViewingOldVersion,
    versionHistory: versionHistory as VersionInfo[],
    goToVersion,
    goToLatest,
    goToPreviousVersion,
    goToNextVersion,
  };
}
