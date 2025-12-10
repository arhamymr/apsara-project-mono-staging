import type { AgentMessage } from '@/types/agent';

export interface ActivityLogItem {
  id: string;
  type: 'tool-start' | 'tool-end' | 'file-created' | 'text' | 'thinking';
  message: string;
  timestamp: Date;
  filePath?: string;
}

export interface ChatPanelProps {
  messages: AgentMessage[];
  inputMessage: string;
  isStreaming: boolean;
  isLoadingMessages?: boolean;
  streamingContent?: string;
  loadingFile?: string | null;
  activityLog?: ActivityLogItem[];
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onNewChat: () => void;
}
