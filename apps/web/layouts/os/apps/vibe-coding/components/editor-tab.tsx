'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { useTheme } from '@/layouts/dark-mode/useTheme';
import Editor from '@monaco-editor/react';
import { getLanguageFromPath } from '@/lib/file-utils';
import { ChevronLeft, ChevronRight, File, FileCode, Loader2, Plus } from 'lucide-react';
import { FileNode } from '../hooks/use-artifacts-convex';

interface EditorTabProps {
  isExplorerOpen: boolean;
  fileTree: FileNode[];
  selectedFile: string;
  fileContent: string;
  hasArtifacts: boolean;
  isLoadingArtifacts: boolean;
  onToggleExplorer: () => void;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onCreateDummyArtifact: (projectType?: 'react' | 'html') => Promise<void>;
}

export function EditorTab({
  isExplorerOpen,
  fileTree,
  selectedFile,
  fileContent,
  hasArtifacts,
  isLoadingArtifacts,
  onFileSelect,
  onCreateDummyArtifact,
}: EditorTabProps) {
  const { theme } = useTheme();

  return (
    <TabsContent value="editor" className="m-0 flex flex-1 overflow-hidden">
      {/* File Explorer */}
      {isExplorerOpen && (
        <div className="bg-muted/30 w-64 overflow-y-auto border-r">
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
                onFileSelect={onFileSelect}
              />
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <FileCode className="text-muted-foreground h-8 w-8" />
                <p className="text-muted-foreground mt-2 text-xs mb-3">
                  No files yet. Create a dummy artifact to test.
                </p>
                <div className="flex flex-col gap-2 w-full px-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateDummyArtifact('react')}
                    className="w-full text-xs"
                  >
                    <Plus size={12} className="mr-1" />
                    React App
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCreateDummyArtifact('html')}
                    className="w-full text-xs"
                  >
                    <Plus size={12} className="mr-1" />
                    HTML App
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1">
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
              <p className="text-muted-foreground mt-2 text-sm mb-4">
                Start chatting with the agent to generate code, or create a dummy artifact to test the editor.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => onCreateDummyArtifact('react')}
                >
                  <Plus size={16} className="mr-2" />
                  Create React App
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onCreateDummyArtifact('html')}
                >
                  <Plus size={16} className="mr-2" />
                  Create HTML App
                </Button>
              </div>
            </div>
          </div>
        ) : fileContent ? (
          <Editor
            height="100%"
            language={getLanguageFromPath(selectedFile)}
            value={fileContent}
            theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              readOnly: true,
            }}
          />
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
  onFileSelect: (path: string) => void;
  level?: number;
}

function FileTreeView({
  nodes,
  selectedFile,
  onFileSelect,
  level = 0,
}: FileTreeViewProps) {
  return (
    <div>
      {nodes.map((node) => (
        <div key={node.path}>
          <button
            onClick={() => node.type === 'file' && onFileSelect(node.path)}
            className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted/50 transition-colors ${
              selectedFile === node.path ? 'bg-muted' : ''
            }`}
            style={{ paddingLeft: `${level * 12 + 12}px` }}
          >
            {node.type === 'folder' ? (
              <FileCode size={14} className="text-muted-foreground" />
            ) : (
              <File size={14} className="text-muted-foreground" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
          {node.children && node.children.length > 0 && (
            <FileTreeView
              nodes={node.children}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
}


