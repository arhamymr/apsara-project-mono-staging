import { Button } from '@workspace/ui/components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { useTheme } from '@/layouts/dark-mode/useTheme';
import { fetcher } from '@/lib/fetcher';
import { getLanguageFromPath } from '@/lib/file-utils';
import Editor from '@monaco-editor/react';
import { useQuery } from '@tanstack/react-query';
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Code2,
  File,
  FileCode,
  Globe,
  Loader2,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useState } from 'react';
import { ArtifactExplorer } from './artifact-explorer';
import { FileNode, FileTree } from './file-tree';

interface TabbedCodePanelProps {
  sessionId: string;
  fileTree: FileNode[];
  selectedFile: string;
  fileContent: string;
  isLoadingArtifacts?: boolean;
  hasArtifacts?: boolean;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onContentChange: (content: string) => void;
}

export function TabbedCodePanel({
  sessionId,
  fileTree,
  selectedFile,
  fileContent,
  isLoadingArtifacts = false,
  hasArtifacts = false,
  onFileSelect,
  onFolderToggle,
  onContentChange,
}: TabbedCodePanelProps) {
  const { theme } = useTheme();
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');
  const [iframeKey, setIframeKey] = useState(0);

  // Fetch sandbox preview URL when preview tab is active
  const {
    data: previewData,
    isLoading: isLoadingPreview,
    refetch: refetchPreview,
  } = useQuery<{ url: string }>({
    queryKey: ['sandbox-preview', sessionId],
    queryFn: () =>
      fetcher<{ url: string }>(`/api/sessions/${sessionId}/sandbox/url`),
    enabled: activeTab === 'preview' && !!sessionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const previewUrl = previewData?.url || '';

  // Fetch sandbox logs when terminal tab is active
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useQuery<{ logs: string; timestamp: string }>({
    queryKey: ['sandbox-logs', sessionId],
    queryFn: () =>
      fetcher<{ logs: string; timestamp: string }>(
        `/api/sessions/${sessionId}/sandbox/logs?type=all`,
      ),
    enabled: activeTab === 'terminal' && !!sessionId,
    refetchInterval: activeTab === 'terminal' ? 3000 : false, // Auto-refresh every 3s
    retry: 1,
  });

  const sandboxLogs = logsData?.logs || '';

  const handleRefreshPreview = () => {
    setIframeKey((prev) => prev + 1);
    refetchPreview();
  };

  return (
    <div className="flex h-full flex-2 flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col"
      >
        {/* Tabs Header */}
        <div className="bg-muted/50 border-b">
          <div className="flex items-center justify-between px-4">

            <TabsContent value="editor" className="m-0 mt-0">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setIsExplorerOpen(!isExplorerOpen)}
                >
                  {isExplorerOpen ? (
                    <ChevronLeft size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </Button>
                <File size={16} className="text-muted-foreground" />
                <span className="text-sm font-medium">{selectedFile}</span>
              </div>
            </TabsContent>


            <TabsList className="bg-transparent">
              <TabsTrigger value="editor" className="gap-2">
                <Code2 size={16} />
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Globe size={16} />
              </TabsTrigger>
              <TabsTrigger value="terminal" className="gap-2">
                <Terminal size={16} />
              </TabsTrigger>
              <TabsTrigger value="artifacts" className="gap-2">
                <Archive size={16} />
                Artifacts
              </TabsTrigger>
            </TabsList>

            
          </div>
        </div>

        {/* Editor Tab Content */}
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
                  <FileTree
                    nodes={fileTree}
                    selectedFile={selectedFile}
                    onFileSelect={onFileSelect}
                    onFolderToggle={onFolderToggle}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                    <FileCode className="text-muted-foreground h-8 w-8" />
                    <p className="text-muted-foreground mt-2 text-xs">
                      No files yet. Ask the agent to save an artifact.
                    </p>
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
                <div className="text-center">
                  <FileCode className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Code Generated Yet
                  </h3>
                  <p className="text-muted-foreground mt-2 max-w-sm text-sm">
                    Start chatting with the agent to generate code. The agent
                    will automatically save artifacts as it builds your project.
                  </p>
                </div>
              </div>
            ) : fileContent ? (
              <Editor
                height="100%"
                language={getLanguageFromPath(selectedFile)}
                value={fileContent}
                onChange={(value) => onContentChange(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
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

        {/* Preview Tab Content */}
        <TabsContent
          value="preview"
          className="m-0 flex flex-1 flex-col overflow-hidden"
        >
          {/* Browser-like Title Bar */}
          <div className="bg-muted/50 flex items-center gap-2 border-b px-3 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRefreshPreview}
              disabled={!previewUrl || isLoadingPreview}
            >
              <RefreshCw size={14} />
            </Button>
            <div className="bg-background flex flex-1 items-center gap-2 rounded-md border px-3 py-1.5">
              <Globe size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground flex-1 truncate text-xs">
                {isLoadingPreview
                  ? 'Loading...'
                  : previewUrl || 'No preview available'}
              </span>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-hidden">
            {isLoadingPreview ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground mt-4 text-sm">
                    Deploying to sandbox...
                  </p>
                  <p className="text-muted-foreground mt-2 text-xs">
                    This may take 30-60 seconds for npm install
                  </p>
                </div>
              </div>
            ) : previewUrl ? (
              <iframe
                key={iframeKey}
                src={previewUrl}
                className="h-full w-full border-0"
                title="Sandbox Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-md text-center">
                  <Globe className="text-muted-foreground mx-auto h-12 w-12" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No Sandbox Running
                  </h3>
                  <p className="text-muted-foreground mt-2 text-sm">
                    To preview your application, ask the agent:
                  </p>
                  <div className="bg-muted mt-4 rounded-lg p-4 font-mono text-sm">
                    "Deploy this to a sandbox and start the dev server&quot;
                  </div>
                  <p className="text-muted-foreground mt-4 text-xs">
                    The agent will create an E2B sandbox, install dependencies,
                    and start the development server for you.
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Terminal Tab Content */}
        <TabsContent
          value="terminal"
          className="m-0 flex flex-1 flex-col overflow-hidden"
        >
          {/* Terminal Header */}
          <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium">Sandbox Terminal</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchLogs()}
              disabled={isLoadingLogs}
            >
              <RefreshCw
                size={14}
                className={isLoadingLogs ? 'animate-spin' : ''}
              />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>

          {/* Terminal Content */}
          <div className="flex-1 overflow-auto bg-black p-4 font-mono text-sm text-green-400">
            {isLoadingLogs ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading logs...</span>
              </div>
            ) : sandboxLogs ? (
              <pre className="whitespace-pre-wrap">{sandboxLogs}</pre>
            ) : (
              <div className="text-muted-foreground">
                <p>No logs available yet.</p>
                <p className="mt-2">
                  Logs will appear here when the sandbox is running.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Artifacts Tab Content */}
        <TabsContent
          value="artifacts"
          className="m-0 flex flex-1 overflow-hidden"
        >
          <ArtifactExplorer sessionId={sessionId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
