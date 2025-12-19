'use client';

import { useState, useEffect, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useVibeEditorConvex } from './hooks/use-vibe-editor';
import { useArtifactsConvex } from './hooks/use-artifacts';
import { useWindowContext } from '@/layouts/os/WindowContext';
import { ChatPanel } from './components/chat-panel';
import { CodePanel } from './components/code-panel';
import { getReactViteBoilerplate } from './hooks/webcontainer/boilerplate';

interface VibeCodeEditorProps {
  sessionId: string;
  initialMessage?: string;
  initialBoilerplate?: 'react-vite' | 'none';
}

export default function VibeCodeEditor({
  sessionId,
  initialMessage,
  initialBoilerplate,
}: VibeCodeEditorProps) {
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const { closeWindow, activeId } = useWindowContext();
  const boilerplateSavedRef = useRef(false);
  const saveGeneratedArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

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
    currentFiles,
    artifacts,
    hasArtifacts,
    isLoadingArtifacts,
    onFileSelect,
    onFolderToggle,
    onFileChange,
    onSaveFile,
    // Save state
    isSaving,
    hasUnsavedChanges,
    justSaved,
    // Version management
    currentVersion,
    totalVersions,
    isViewingOldVersion,
    versionHistory,
    goToVersion,
    goToLatest,
  } = useArtifactsConvex(sessionId, { streamingFiles, loadingFile });

  // Save boilerplate as initial artifact when editor mounts (only once)
  useEffect(() => {
    if (
      initialBoilerplate &&
      initialBoilerplate !== 'none' &&
      !boilerplateSavedRef.current &&
      !isLoadingArtifacts &&
      !hasArtifacts
    ) {
      boilerplateSavedRef.current = true;

      const boilerplateFiles =
        initialBoilerplate === 'react-vite' ? getReactViteBoilerplate() : {};

      if (Object.keys(boilerplateFiles).length > 0) {
        saveGeneratedArtifact({
          sessionId: sessionId as Id<'chatSessions'>,
          name: 'Initial Boilerplate',
          description: `${initialBoilerplate} template`,
          files: JSON.stringify(boilerplateFiles),
          metadata: {
            framework: 'react',
            language: 'typescript',
          },
        }).catch((err) => {
          console.error('Failed to save initial boilerplate:', err);
          boilerplateSavedRef.current = false; // Allow retry on error
        });
      }
    }
  }, [
    initialBoilerplate,
    sessionId,
    isLoadingArtifacts,
    hasArtifacts,
    saveGeneratedArtifact,
  ]);

  const handleNewChat = () => {
    if (activeId) {
      closeWindow(activeId);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatPanel
        sessionId={sessionId}
        sessionTitle={initialMessage}
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
        isExplorerOpen={isExplorerOpen}
        fileTree={fileTree}
        selectedFile={selectedFile}
        fileContent={fileContent}
        artifacts={artifacts}
        currentFiles={currentFiles}
        hasArtifacts={hasArtifacts}
        isLoadingArtifacts={isLoadingArtifacts}
        loadingFile={loadingFile}
        onToggleExplorer={() => setIsExplorerOpen(!isExplorerOpen)}
        onFileSelect={onFileSelect}
        onFolderToggle={onFolderToggle}
        onFileChange={onFileChange}
        onSaveFile={onSaveFile}
        // Save state
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        justSaved={justSaved}
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
