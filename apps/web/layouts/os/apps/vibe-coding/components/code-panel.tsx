'use client';

/**
 * CodePanel Component
 *
 * The right-side panel of the Vibe Code Editor containing three tabs:
 * - Editor: Monaco code editor with file explorer
 * - Preview: Live preview of the app running in WebContainer
 * - Terminal: Interactive terminal for running commands in the sandbox
 *
 * Also includes version history dropdown for navigating between artifact versions.
 */

import { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Code2, Globe, Terminal, ChevronDown, Check } from 'lucide-react';
import { EditorTab, EditorHeader } from './editor-tab';
import { PreviewTab } from './preview-tab';
import { SandboxTerminal } from './sandbox-terminal';
import { FileNode, VersionInfo } from '../hooks/use-artifacts';
import { useWebContainer } from '../hooks/use-webcontainer';
import { Id } from '@/convex/_generated/dataModel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

/** Artifact data structure stored in Convex */
interface Artifact {
  _id: Id<"artifacts">;
  _creationTime: number;
  sessionId: Id<"chatSessions">;
  userId: Id<"users">;
  name: string;
  description?: string;
  files: Record<string, string>;
  metadata?: {
    framework?: string;
    language?: string;
    dependencies?: string[];
  };
  createdAt: number;
  updatedAt: number;
}

interface CodePanelProps {
  sessionId: string;
  isExplorerOpen: boolean;
  fileTree: FileNode[];
  selectedFile: string;
  fileContent: string;
  artifacts: Artifact[];
  /** All files for the currently selected version (merged with streaming files) */
  currentFiles: Record<string, string>;
  hasArtifacts: boolean;
  isLoadingArtifacts: boolean;
  /** File path currently being streamed from AI agent */
  loadingFile?: string | null;
  onToggleExplorer: () => void;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onFileChange?: (filePath: string, content: string) => void;
  onSaveFile?: () => void;
  // Save state indicators
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  justSaved?: boolean;
  // Version navigation props
  currentVersion: number;
  totalVersions: number;
  isViewingOldVersion: boolean;
  versionHistory: VersionInfo[];
  onGoToVersion: (version: number) => void;
  onGoToLatest: () => void;
}

/**
 * CodePanel - Main code editing and preview panel
 *
 * Manages three tabs (Editor, Preview, Terminal) and shares a single
 * WebContainer instance between Preview and Terminal for efficiency.
 */
export function CodePanel({
  isExplorerOpen,
  fileTree,
  selectedFile,
  fileContent,
  artifacts,
  currentFiles,
  hasArtifacts,
  isLoadingArtifacts,
  loadingFile,
  onToggleExplorer,
  onFileSelect,
  onFolderToggle,
  onFileChange,
  onSaveFile,
  // Save state
  isSaving,
  hasUnsavedChanges,
  justSaved,
  // Version props
  currentVersion,
  totalVersions,
  isViewingOldVersion,
  versionHistory,
  onGoToVersion,
  onGoToLatest,
}: CodePanelProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // Build artifact object for preview - combines files with metadata
  const currentArtifact = hasArtifacts ? {
    files: currentFiles,
    metadata: artifacts[0]?.metadata,
  } : null;

  // WebContainer instance shared between Preview and Terminal tabs
  // Boots immediately when we have files (for faster preview loading)
  const {
    status: sandboxStatus,
    previewUrl,
    error: sandboxError,
    restart: restartSandbox,
    runCommand,
  } = useWebContainer({
    files: currentFiles,
    enabled: hasArtifacts, // Start immediately when artifacts are available
    // Keep last 200 log entries to prevent memory bloat
    onLog: (log: string) => setTerminalLogs((prev) => [...prev.slice(-200), log]),
  });

  /** Clear terminal output history */
  const handleClearTerminal = useCallback(() => {
    setTerminalLogs([]);
  }, []);
  return (
    <div className="flex-1 flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex h-full flex-col gap-0 flex-1"
      >
        {/* Tabs Header */}
        <div className="bg-muted/50 border-b">
          <div className="flex items-center justify-between px-4">
            <TabsList className="bg-transparent">
              <TabsTrigger value="editor" className="gap-2">
                <Code2 size={16} />
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2 relative">
                <Globe size={16} />
                {/* Sandbox status indicator dot */}
                {hasArtifacts && (
                  <span 
                    className={`h-2 w-2 rounded-full ${
                      sandboxStatus === 'running' ? 'bg-green-500' :
                      sandboxStatus === 'error' ? 'bg-red-500' :
                      sandboxStatus === 'idle' ? 'bg-gray-400' :
                      'bg-yellow-500 animate-pulse'
                    }`}
                    title={`Sandbox: ${sandboxStatus}`}
                  />
                )}
              </TabsTrigger>
              <TabsTrigger value="terminal" className="gap-2">
                <Terminal size={16} />
              </TabsTrigger>

              {/* Version History Dropdown - allows switching between artifact versions */}
              {totalVersions > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* Yellow highlight when viewing historical version (read-only mode) */}
                    <button
                      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors
                        ${isViewingOldVersion 
                          ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      {currentVersion === 0 ? 'v0 (Boilerplate)' : `v${currentVersion}`}
                      <ChevronDown size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  {/* High z-index ensures dropdown appears above all panel content */}
                  <DropdownMenuContent align="start" className="w-48 max-h-64 overflow-y-auto z-[9999]">
                    {versionHistory.map((v, index) => {
                      const isSelected = v.version === currentVersion;
                      const isLatest = index === 0; // First item in desc order is latest
                      const displayLabel = v.version === 0 ? 'Boilerplate' : `Version ${v.version}`;
                      return (
                        <DropdownMenuItem
                          key={v._id}
                          // Latest version uses goToLatest to enable editing mode
                          onClick={() => isLatest ? onGoToLatest() : onGoToVersion(v.version)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {displayLabel}
                              {isLatest && <span className="ml-1 text-green-500">(latest)</span>}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {v.fileCount} files • {new Date(v.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          {isSelected && <Check size={14} className="text-primary shrink-0" />}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </TabsList>

            {activeTab === 'editor' && (
              <EditorHeader
                isExplorerOpen={isExplorerOpen}
                selectedFile={selectedFile}
                onToggleExplorer={onToggleExplorer}
              />
            )}
          </div>
        </div>

        {/* Tab Contents - Each tab renders its own TabsContent */}
        
        {/* Monaco Editor with file explorer sidebar */}
        <EditorTab
          isExplorerOpen={isExplorerOpen}
          fileTree={fileTree}
          selectedFile={selectedFile}
          fileContent={fileContent}
          hasArtifacts={hasArtifacts}
          isLoadingArtifacts={isLoadingArtifacts}
          loadingFile={loadingFile}
          isViewingOldVersion={isViewingOldVersion}
          isSaving={isSaving}
          hasUnsavedChanges={hasUnsavedChanges}
          justSaved={justSaved}
          onToggleExplorer={onToggleExplorer}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
          onFileChange={onFileChange}
          onSaveFile={onSaveFile}
        />
        
        {/* Live preview iframe - shares WebContainer with terminal */}
        <PreviewTab 
          artifact={currentArtifact} 
          isActive={activeTab === 'preview'}
          sandboxStatus={sandboxStatus}
          previewUrl={previewUrl}
          sandboxError={sandboxError}
          onRestart={restartSandbox}
        />
        
        {/* Interactive terminal for running commands in sandbox */}
        <SandboxTerminal
          logs={terminalLogs}
          status={sandboxStatus}
          onRunCommand={runCommand}
          onClear={handleClearTerminal}
        />
      </Tabs>
    </div>
  );
}
