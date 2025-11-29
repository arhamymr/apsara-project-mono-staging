export interface AgentSession {
  id: string;
  mastra_thread_id: string | null;
  title: string | null;
  first_message: string | null;
  message_count: number;
  last_activity_at: string;
  created_at: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: string[]; // Array of tool names used
}

export interface StreamEvent {
  type: 'start' | 'step' | 'complete' | 'text' | 'error' | 'done';
  message?: string;
  text?: string;
  response?: string;
  sessionId?: string;
  stepType?: string;
  toolCalls?: Array<{
    type: string;
    runId: string;
    from: string;
    payload: {
      toolCallId: string;
      toolName: string;
      args: Record<string, unknown>;
    };
  }>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
