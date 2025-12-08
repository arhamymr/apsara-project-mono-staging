'use client';

import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Archive, Code2, Globe, Terminal } from 'lucide-react';
import { EditorTab, EditorHeader } from './editor-tab';
import { PreviewTab } from './preview-tab';
import { TerminalTab } from './terminal-tab';
import { ArtifactsTab } from './artifacts-tab';
import { FileNode } from '../hooks/use-artifacts-convex';
import { Id } from '@/convex/_generated/dataModel';

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
  onTabChange: (tab: string) => void;
  onToggleExplorer: () => void;
  onFileSelect: (path: string) => void;
  onFolderToggle: (path: string[]) => void;
  onCreateDummyArtifact: (projectType?: 'react' | 'html') => Promise<void>;
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
  onTabChange,
  onToggleExplorer,
  onFileSelect,
  onFolderToggle,
  onCreateDummyArtifact,
}: CodePanelProps) {
  return (
    <div className="flex-1 flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={onTabChange}
        className="flex h-full flex-col"
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
          onToggleExplorer={onToggleExplorer}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
          onCreateDummyArtifact={onCreateDummyArtifact}
        />
        <PreviewTab artifact={artifacts[0] || null} />
        <TerminalTab artifact={artifacts[0] || null} />
        <ArtifactsTab
          artifacts={artifacts}
          isLoading={isLoadingArtifacts}
          onCreateDummyArtifact={onCreateDummyArtifact}
        />
      </Tabs>
    </div>
  );
}
