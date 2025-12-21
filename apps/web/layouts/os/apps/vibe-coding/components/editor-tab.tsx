'use client';

import { useEffect, useCallback, useRef } from 'react';
import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { useTheme } from '@/components/dark-mode/useTheme';
import Editor, { Monaco } from '@monaco-editor/react';
import { getLanguageFromPath } from '@/lib/file-utils';
import { ChevronLeft, ChevronRight, File, FileCode, Loader2 } from 'lucide-react';
import { FileNode } from '../hooks/use-artifacts';
import { FileTree, FileNode as TreeFileNode } from './file-tree';

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
  isViewingOldVersion,
  isSaving,
  hasUnsavedChanges,
  justSaved,
  onFileSelect,
  onFolderToggle,
  onFileChange,
  onSaveFile,
}: EditorTabProps) {
  const { theme } = useTheme();
  const monacoRef = useRef<Monaco | null>(null);
  
  // Configure Monaco for JSX/TSX support
  const handleEditorBeforeMount = useCallback((monaco: Monaco) => {
    monacoRef.current = monaco;
    
    // Configure TypeScript compiler options for JSX support
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });
    
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });
    
    // Disable all diagnostics to avoid false errors in sandbox environment
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
    
    // Add React type definitions for better JSX support
    const reactTypes = `
      declare namespace React {
        interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {}
        type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<P, any>);
        class Component<P = {}, S = {}> {}
        function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
        function useMemo<T>(factory: () => T, deps: any[]): T;
        function useRef<T>(initialValue: T): { current: T };
        function useContext<T>(context: Context<T>): T;
        interface Context<T> {}
        function createContext<T>(defaultValue: T): Context<T>;
        type FC<P = {}> = (props: P) => ReactElement | null;
        type ReactNode = ReactElement | string | number | boolean | null | undefined;
      }
      declare const React: typeof React;
    `;
    
    monaco.languages.typescript.typescriptDefaults.addExtraLib(reactTypes, 'react.d.ts');
    monaco.languages.typescript.javascriptDefaults.addExtraLib(reactTypes, 'react.d.ts');
  }, []);
  
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
          onSaveFile();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSaveFile, hasUnsavedChanges]);
  
  // Editor is read-only when viewing old versions
  const isReadOnly = isViewingOldVersion || !onFileChange;

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
              <FileTree
                nodes={convertToTreeNodes(fileTree)}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
                onFolderToggle={onFolderToggle}
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
                beforeMount={handleEditorBeforeMount}
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  readOnly: isReadOnly,
                  wordWrap: 'on',
                  // Performance optimizations
                  renderWhitespace: 'none',
                  renderControlCharacters: false,
                  renderLineHighlight: 'none',
                  renderValidationDecorations: 'editable',
                  // folding: false,
                  // glyphMargin: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  overviewRulerBorder: false,
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto',
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                  quickSuggestions: false,
                  suggestOnTriggerCharacters: false,
                  acceptSuggestionOnEnter: 'off',
                  tabCompletion: 'off',
                  parameterHints: { enabled: false },
                  hover: { enabled: false, delay: 500 },
                  links: false,
                  contextmenu: false,
                  matchBrackets: 'never',
                  occurrencesHighlight: 'off',
                  selectionHighlight: false,
                  codeLens: false,

                  inlayHints: { enabled: 'off' },
                  bracketPairColorization: { enabled: false },
                  guides: { indentation: false, bracketPairs: false },
                  smoothScrolling: false,
                  cursorBlinking: 'solid',
                  cursorSmoothCaretAnimation: 'off',
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

// Convert FileNode from use-artifacts to TreeFileNode for file-tree component
function convertToTreeNodes(nodes: FileNode[]): TreeFileNode[] {
  return nodes.map((node) => ({
    name: node.name,
    type: node.type,
    expanded: node.isOpen ?? true,
    children: node.children ? convertToTreeNodes(node.children) : undefined,
  }));
}


