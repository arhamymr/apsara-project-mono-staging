'use client';

import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Archive, Code2, Globe, Terminal, ChevronDown, Check } from 'lucide-react';
import { EditorTab, EditorHeader } from './editor-tab';
import { PreviewTab } from './preview-tab';
import { TerminalTab } from './terminal-tab';
import { ArtifactsTab } from './artifacts-tab';
import { FileNode, VersionInfo } from '../hooks/use-artifacts';
import { Id } from '@/convex/_generated/dataModel';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';

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
  activeTab: string;
  isExplorerOpen: boolean;
  fileTree: FileNode[];
  selectedFile: string;
  fileContent: string;
  artifacts: Artifact[];
  hasArtifacts: boolean;
  isLoadingArtifacts: boolean;
  loadingFile?: string | null;
  onTabChange: (tab: string) => void;
  onToggleExplorer: () => void;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  // Version props
  currentVersion: number;
  totalVersions: number;
  isViewingOldVersion: boolean;
  versionHistory: VersionInfo[];
  onGoToVersion: (version: number) => void;
  onGoToLatest: () => void;
}

export function CodePanel({
  sessionId,
  activeTab,
  isExplorerOpen,
  fileTree,
  selectedFile,
  fileContent,
  artifacts,
  hasArtifacts,
  isLoadingArtifacts,
  loadingFile,
  onTabChange,
  onToggleExplorer,
  onFileSelect,
  onFolderToggle,
  // Version props
  currentVersion,
  totalVersions,
  isViewingOldVersion,
  versionHistory,
  onGoToVersion,
  onGoToLatest,
}: CodePanelProps) {
  return (
    <div className="flex-1 flex flex-col h-full">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex h-full flex-col gap-0 flex-1"
      >
        {/* Tabs Header */}
        <div className="bg-muted/50 border-b">
          <div className="flex items-center justify-between px-4">
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

              {/* Version Dropdown - right of Artifacts tab */}
              {totalVersions > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors
                        ${isViewingOldVersion 
                          ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      v{currentVersion}
                      <ChevronDown size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 max-h-64 overflow-y-auto z-[9999]">
                    {versionHistory.map((v) => {
                      const isSelected = v.version === currentVersion;
                      const isLatest = v.version === totalVersions;
                      return (
                        <DropdownMenuItem
                          key={v._id}
                          onClick={() => isLatest ? onGoToLatest() : onGoToVersion(v.version)}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              Version {v.version}
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

        {/* Tab Contents */}
        <EditorTab
          isExplorerOpen={isExplorerOpen}
          fileTree={fileTree}
          selectedFile={selectedFile}
          fileContent={fileContent}
          hasArtifacts={hasArtifacts}
          isLoadingArtifacts={isLoadingArtifacts}
          loadingFile={loadingFile}
          onToggleExplorer={onToggleExplorer}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
        />
        <PreviewTab artifact={artifacts[0] || null} />
        <TerminalTab artifact={artifacts[0] || null} />
        <ArtifactsTab
          artifacts={artifacts}
          isLoading={isLoadingArtifacts}
        />
      </Tabs>
    </div>
  );
}
