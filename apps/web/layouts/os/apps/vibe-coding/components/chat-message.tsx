import { MarkdownContent } from '@workspace/ui/components/markdown-content';
import type { AgentMessage } from '@/types/agent';
import {
  Eye,
  FileCode,
  FilePlus,
  FileText,
  FolderPlus,
  Info,
  Play,
  Save,
  Search,
  Terminal,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';

interface ChatMessageProps {
  message: AgentMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const hasToolCalls =
    !isUser && message.toolCalls && message.toolCalls.length > 0;

  // Map tool names to icons
  const getToolIcon = (toolName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      runCode: <Play size={12} />,
      readFile: <FileText size={12} />,
      writeFile: <FilePlus size={12} />,
      writeFiles: <FileCode size={12} />,
      listFiles: <Search size={12} />,
      deleteFile: <Trash2 size={12} />,
      createDirectory: <FolderPlus size={12} />,
      getFileInfo: <Info size={12} />,
      checkFileExists: <Eye size={12} />,
      getFileSize: <Info size={12} />,
      runCommand: <Terminal size={12} />,
      saveArtifact: <Save size={12} />,
      createSandbox: <FolderPlus size={12} />,
    };

    return iconMap[toolName] || <Wrench size={12} />;
  };

  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="bg-primary text-primary-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold">
          AI
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-lg px-3 py-2 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        }`}
      >
        <div className="text-xs">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownContent content={message.content} />
          )}
        </div>

        {/* Tool Calls Display */}
        {hasToolCalls && (
          <div className="border-border mt-2 border-t pt-1.5">
            <div className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px]">
              <Wrench size={10} />
              <span className="font-medium">Tools:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {message.toolCalls!.map((toolName, index) => (
                <span
                  key={`${toolName}-${index}`}
                  className="bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px]"
                >
                  {getToolIcon(toolName)}
                  {toolName}
                </span>
              ))}
            </div>
          </div>
        )}

        <p
          className={`mt-1 text-[10px] ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
      {isUser && (
        <div className="bg-muted text-muted-foreground flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
          <User size={14} />
        </div>
      )}
    </div>
  );
}
