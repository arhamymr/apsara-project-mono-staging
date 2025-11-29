'use client';

import { useWindowContext } from '@/layouts/os/WindowContext';
import { ChatPanel } from './components/chat-panel';
import { TabbedCodePanel } from './components/tabbed-code-panel';
import { useArtifactFiles } from './hooks/use-artifact-files';

interface VibeCodeEditorProps {
  sessionId: string;
  initialMessage?: string;
}

export default function VibeCodeEditor({
  sessionId,
  initialMessage,
}: VibeCodeEditorProps) {
  const { closeWindow, activeId } = useWindowContext();

  // Use real artifact data instead of mock data
  const {
    fileTree,
    selectedFile,
    fileContent,
    isLoadingArtifacts,
    hasArtifacts,
    onFileSelect,
    onFolderToggle,
    onContentChange,
  } = useArtifactFiles(sessionId);

  const handleNewChat = () => {
    if (activeId) {
      closeWindow(activeId);
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-[40%] max-w-[450px] min-w-[250px]">
        <ChatPanel
          sessionId={sessionId}
          initialMessage={initialMessage}
          onNewChat={handleNewChat}
        />
      </div>
      <div className="flex-1">
        <TabbedCodePanel
          sessionId={sessionId}
          fileTree={fileTree}
          selectedFile={selectedFile}
          fileContent={fileContent}
          isLoadingArtifacts={isLoadingArtifacts}
          hasArtifacts={hasArtifacts}
          onFileSelect={onFileSelect}
          onFolderToggle={onFolderToggle}
          onContentChange={onContentChange}
        />
      </div>
    </div>
  );
}
