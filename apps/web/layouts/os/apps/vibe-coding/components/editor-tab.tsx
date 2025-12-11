'use client';

import { useEffect, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { useTheme } from '@/layouts/dark-mode/useTheme';
import Editor from '@monaco-editor/react';
import { getLanguageFromPath } from '@/lib/file-utils';
import { ChevronLeft, ChevronRight, File, FileCode, Loader2 } from 'lucide-react';
import { FileNode } from '../hooks/use-artifacts';

interface EditorTabProps {
  isExplorerOpen: boolean;
  fileTree: FileNode[];
  selectedFile: string;
  fileContent: string;
  hasArtifacts: boolean;
  isLoadingArtifacts: boolean;
  loadingFile?: string | null;
  isViewingOldVersion?: boolean;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  justSaved?: boolean;
  onToggleExplorer: () => void;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onFileChange?: (filePath: string, content: string) => void;
  onSaveFile?: () => void;
}

export function EditorTab({
  isExplorerOpen,
  fileTree,
  selectedFile,
  fileContent,
  hasArtifacts,
  isLoadingArtifacts,
  loadingFile,
  isViewingOldVersion,
  isSaving,
  hasUnsavedChanges,
  justSaved,
  onFileSelect,
  onFileChange,
  onSaveFile,
}: EditorTabProps) {
  const { theme } = useTheme();
  
  // Handle editor content change
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (value !== undefined && onFileChange && selectedFile) {
      onFileChange(selectedFile, value);
    }
  }, [onFileChange, selectedFile]);
  
  // Handle Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSaveFile && hasUnsavedChanges) {
          console.log('[EditorTab] Ctrl+S pressed, saving...');
          onSaveFile();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSaveFile, hasUnsavedChanges]);
  
  // Editor is read-only when viewing old versions
  const isReadOnly = isViewingOldVersion || !onFileChange;
  
  // Debug logging
  console.log('[EditorTab] State:', {
    selectedFile,
    hasFileContent: !!fileContent,
    fileContentLength: fileContent?.length,
    hasArtifacts,
    isLoadingArtifacts,
    fileTreeLength: fileTree.length,
    isReadOnly,
    isSaving,
  });

  return (
    <TabsContent value="editor" className="m-0 flex flex-1 overflow-hidden h-full">
      {/* File Explorer - Left Side */}
      {isExplorerOpen && (
        <div className="bg-muted/30 w-64 flex-shrink-0 overflow-y-auto border-r">
          <div className="bg-muted/50 border-b px-3 py-2">
            <h3 className="text-muted-foreground text-xs font-semibold uppercase">
              Explorer
            </h3>
          </div>
          <div className="py-2">
            {isLoadingArtifacts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : fileTree.length > 0 ? (
              <FileTreeView
                nodes={fileTree}
                selectedFile={selectedFile}
                loadingFile={loadingFile}
                onFileSelect={onFileSelect}
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <FileCode className="text-muted-foreground h-8 w-8" />
                <p className="text-muted-foreground mt-2 text-xs">
                  No files yet. Start chatting to generate code.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 min-w-0 overflow-hidden h-full">
        {isLoadingArtifacts ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
              <p className="text-muted-foreground mt-4 text-sm">
                Loading artifacts...
              </p>
            </div>
          </div>
        ) : !hasArtifacts ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <FileCode className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">
                No Code Generated Yet
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Start chatting with the agent to generate code.
              </p>
            </div>
          </div>
        ) : fileContent ? (
          <div className="h-full w-full flex flex-col">
            {/* Save status bar */}
            {(isSaving || hasUnsavedChanges || isViewingOldVersion || justSaved) && (
              <div className={`px-3 py-1 text-xs flex items-center gap-2 border-b ${
                isViewingOldVersion 
                  ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                  : isSaving 
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : hasUnsavedChanges
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                      : 'bg-green-500/10 text-green-600 dark:text-green-400'
              }`}>
                {isViewingOldVersion ? (
                  <>
                    <FileCode size={12} />
                    <span>Viewing old version (read-only)</span>
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span>Unsaved changes • Press Ctrl+S to save</span>
                  </>
                ) : justSaved ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Saved</span>
                  </>
                ) : null}
              </div>
            )}
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageFromPath(selectedFile)}
                value={fileContent}
                onChange={handleEditorChange}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: isReadOnly,
                  wordWrap: 'on',
                }}
                loading={
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                  </div>
                }
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <File className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-4">
                Select a file to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}

interface EditorHeaderProps {
  isExplorerOpen: boolean;
  selectedFile?: string;
  onToggleExplorer: () => void;
}

export function EditorHeader({
  isExplorerOpen,
  selectedFile,
  onToggleExplorer,
}: EditorHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={onToggleExplorer}
      >
        {isExplorerOpen ? (
          <ChevronLeft size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </Button>
      <File size={16} className="text-muted-foreground" />
      <span className="text-sm font-medium">
        {selectedFile || 'No file selected'}
      </span>
    </div>
  );
}

// Simple file tree component
interface FileTreeViewProps {
  nodes: FileNode[];
  selectedFile: string;
  loadingFile?: string | null;
  onFileSelect: (path: string) => void;
  level?: number;
}

function FileTreeView({
  nodes,
  selectedFile,
  loadingFile,
  onFileSelect,
  level = 0,
}: FileTreeViewProps) {
  return (
    <div>
      {nodes.map((node) => {
        const isLoading = node.type === 'file' && node.path === loadingFile;
        
        return (
          <div key={node.path}>
            <button
              onClick={() => node.type === 'file' && onFileSelect(node.path)}
              className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors ${
                selectedFile === node.path ? 'bg-muted' : ''
              } ${isLoading ? 'bg-primary/10' : ''}`}
              style={{ paddingLeft: `${level * 12 + 12}px` }}
            >
              {node.type === 'folder' ? (
                <FileCode size={14} className="text-muted-foreground" />
              ) : isLoading ? (
                <Loader2 size={14} className="text-primary animate-spin" />
              ) : (
                <File size={14} className="text-muted-foreground" />
              )}
              <span className={`truncate ${isLoading ? 'text-primary' : ''}`}>{node.name}</span>
            </button>
            {node.children && node.children.length > 0 && (
              <FileTreeView
                nodes={node.children}
                selectedFile={selectedFile}
                loadingFile={loadingFile}
                onFileSelect={onFileSelect}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}


