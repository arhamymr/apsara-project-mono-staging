'use client';

import { useState } from 'react';
import { useVibeEditorConvex } from './hooks/use-vibe-editor';
import { useArtifactsConvex } from './hooks/use-artifacts';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { ChatPanel } from './components/chat-panel';
import { CodePanel } from './components/code-panel';

interface VibeCodeEditorProps {
  sessionId: string;
  initialMessage?: string;
}

export default function VibeCodeEditor({
  sessionId,
  initialMessage,
}: VibeCodeEditorProps) {
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('editor');
  const { closeWindow, activeId } = useWindowContext();

  const {
    messages,
    inputMessage,
    isStreaming,
    isLoadingMessages,
    streamingContent,
    streamingFiles,
    activityLog,
    loadingFile,
    scrollRef,
    setInputMessage,
    handleSendMessage,
  } = useVibeEditorConvex(sessionId, initialMessage);

  const {
    fileTree,
    selectedFile,
    fileContent,
    artifacts,
    hasArtifacts,
    isLoadingArtifacts,
    onFileSelect,
    onFolderToggle,
    // Version management
    currentVersion,
    totalVersions,
    isViewingOldVersion,
    versionHistory,
    goToVersion,
    goToLatest,
  } = useArtifactsConvex(sessionId, { streamingFiles, loadingFile });

  const handleNewChat = () => {
    if (activeId) {
      closeWindow(activeId);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatPanel
        messages={messages}
        inputMessage={inputMessage}
        isStreaming={isStreaming}
        isLoadingMessages={isLoadingMessages}
        streamingContent={streamingContent}
        loadingFile={loadingFile}
        activityLog={activityLog}
        scrollRef={scrollRef}
        onInputChange={setInputMessage}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
      />
      <CodePanel
        sessionId={sessionId}
        activeTab={activeTab}
        isExplorerOpen={isExplorerOpen}
        fileTree={fileTree}
        selectedFile={selectedFile}
        fileContent={fileContent}
        artifacts={artifacts}
        hasArtifacts={hasArtifacts}
        isLoadingArtifacts={isLoadingArtifacts}
        loadingFile={loadingFile}
        onTabChange={setActiveTab}
        onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
        onFileSelect={onFileSelect}
        onFolderToggle={onFolderToggle}
        // Version props
        currentVersion={currentVersion}
        totalVersions={totalVersions}
        isViewingOldVersion={isViewingOldVersion}
        versionHistory={versionHistory}
        onGoToVersion={goToVersion}
        onGoToLatest={goToLatest}
      />
    </div>
  );
}
