'use client';

import type { Id } from '@/convex/_generated/dataModel';

export interface ActivityLogEntry {
  id: string;
  type: 'tool-start' | 'tool-end' | 'file-created' | 'text' | 'thinking';
  message: string;
  timestamp: Date;
  filePath?: string;
}

export interface PendingMessage {
  content: string;
  files: string[];
  timestamp: Date;
}

export interface TransformedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface StreamingState {
  isStreaming: boolean;
  streamingContent: string;
  reasoningContent: string;
  currentToolCall: string | null;
  toolCallArgs: Map<string, string>;
  createdFiles: string[];
  streamingFiles: Map<string, string>;
  activityLog: ActivityLogEntry[];
  loadingFile: string | null;
}

export interface StreamingRefs {
  streamingMessageId: Id<'chatMessages'> | null;
  lastSavedContent: string;
  saveTimeout: NodeJS.Timeout | null;
}

export interface UseVibeEditorReturn {
  messages: TransformedMessage[];
  isLoadingMessages: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  reasoningContent: string;
  currentToolCall: string | null;
  toolCallArgs: Map<string, string>;
  createdFiles: string[];
  streamingFiles: Map<string, string>;
  activityLog: ActivityLogEntry[];
  loadingFile: string | null;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleSendMessage: (message?: string, skipSaveMessage?: boolean) => Promise<void>;
}
