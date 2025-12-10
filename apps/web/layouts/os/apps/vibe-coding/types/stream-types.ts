/**
 * Mastra/Backend Stream Event Types
 *
 * The backend sends SSE events in this format:
 * {"type":"event-type","runId":"...","from":"AGENT","payload":{...}}
 *
 * Each event type has specific payload structure.
 */

// ============================================
// Base Event Structure
// ============================================

export interface BaseStreamEvent {
  type: string;
  runId?: string;
  from?: string;
  payload?: unknown;
}

// ============================================
// Agent/Chat Stream Events
// ============================================

// Text delta - streaming text content
export interface TextDeltaPart extends BaseStreamEvent {
  type: 'text-delta';
  payload: {
    text: string;
  };
}

// Tool call start
export interface ToolCallPart extends BaseStreamEvent {
  type: 'tool-call';
  payload: {
    toolCallId: string;
    toolName: string;
    args?: Record<string, unknown>;
  };
}

// Tool call arguments streaming
export interface ToolCallDeltaPart extends BaseStreamEvent {
  type: 'tool-call-delta';
  payload: {
    toolCallId: string;
    toolName: string;
    argsTextDelta: string;
  };
}

// Reasoning/thinking content
export interface ReasoningDeltaPart extends BaseStreamEvent {
  type: 'reasoning-delta';
  payload: {
    id?: string;
    text?: string;
    providerMetadata?: {
      openrouter?: {
        reasoning_details?: Array<{
          type: string;
          summary: string;
          format: string;
          index: number;
        }>;
      };
    };
  };
}

// Tool execution result
export interface ToolResultPart extends BaseStreamEvent {
  type: 'tool-result';
  payload: {
    toolCallId: string;
    toolName: string;
    result: {
      success?: boolean;
      filePath?: string;
      fileName?: string;
      content?: string;
      [key: string]: unknown;
    };
  };
}

// Multiple tool results (batch)
export interface ToolResultsEvent extends BaseStreamEvent {
  type: 'tool_results';
  payload: {
    results: Array<{
      success?: boolean;
      filePath?: string;
      fileName?: string;
      content?: string;
    }>;
  };
}

// Error event (agent)
export interface AgentErrorEvent extends BaseStreamEvent {
  type: 'error';
  payload: {
    error: string;
  };
}

// Stream completion
export interface DoneEvent extends BaseStreamEvent {
  type: 'done';
}

// Step finish event
export interface StepFinishEvent extends BaseStreamEvent {
  type: 'step-finish';
}

// Finish event
export interface FinishEvent extends BaseStreamEvent {
  type: 'finish';
}

// ============================================
// File Streaming Events (Mastra Backend)
// Flow:
// 1. file-start → Frontend creates editor panel
// 2. file-chunk → Frontend appends content (Monaco incremental edits)
// 3. file-end → Server finalizes buffer
// 4. file-url → Server uploads to R2, returns presigned URL
// 5. done → All files complete
// ============================================

export interface FileStartEvent {
  type: 'file-start';
  fileId: string;
  path: string;
  fileName: string;
}

export interface FileChunkEvent {
  type: 'file-chunk';
  fileId: string;
  chunk: string;
  chunkIndex: number;
}

export interface FileEndEvent {
  type: 'file-end';
  fileId: string;
  path: string;
  content: string;
}

export interface FileUrlEvent {
  type: 'file-url';
  fileId: string;
  path: string;
  url: string;
  expiresAt: string;
}

export interface FileErrorEvent {
  type: 'file-error';
  fileId: string;
  error: string;
}

export interface SessionStartEvent {
  type: 'session-start';
  sessionId: string;
}

export interface StreamingDoneEvent {
  type: 'done';
  sessionId: string;
}

export interface StreamingErrorEvent {
  type: 'error';
  error: string;
}

// ============================================
// Union Types
// ============================================

// Union type for all file stream events
export type FileStreamEvent =
  | FileStartEvent
  | FileChunkEvent
  | FileEndEvent
  | FileUrlEvent
  | FileErrorEvent;

// Union type for all SSE events (including session events)
export type StreamingEvent =
  | SessionStartEvent
  | FileStreamEvent
  | StreamingDoneEvent
  | StreamingErrorEvent;

// Union of all stream part types (agent + file streaming)
export type StreamPart =
  | TextDeltaPart
  | ToolCallPart
  | ToolCallDeltaPart
  | ReasoningDeltaPart
  | ToolResultPart
  | ToolResultsEvent
  | AgentErrorEvent
  | DoneEvent
  | StepFinishEvent
  | FinishEvent
  | FileStartEvent
  | FileChunkEvent
  | FileEndEvent
  | FileUrlEvent
  | FileErrorEvent
  | SessionStartEvent
  | StreamingDoneEvent
  | StreamingErrorEvent
  | BaseStreamEvent;

// ============================================
// Event Type Constants
// ============================================

export const STREAMING_EVENT_TYPES = {
  SESSION_START: 'session-start',
  FILE_START: 'file-start',
  FILE_CHUNK: 'file-chunk',
  FILE_END: 'file-end',
  FILE_URL: 'file-url',
  FILE_ERROR: 'file-error',
  DONE: 'done',
  ERROR: 'error',
} as const;

// ============================================
// File Status & State Types
// ============================================

export type FileStatus = 'streaming' | 'uploading' | 'complete' | 'error';

// File state for frontend tracking
export interface StreamingFile {
  fileId: string;
  path: string;
  fileName: string;
  content: string;
  chunks: Array<{ index: number; content: string }>;
  url: string | null;
  expiresAt: string | null;
  status: FileStatus;
  error?: string;
}

// ============================================
// Accumulated State During Streaming
// ============================================

export interface StreamState {
  assistantContent: string;
  reasoning: string;
  files: Map<string, string>;
  toolArgs: Map<string, string>;
  createdFilesList: string[];
  // File streaming state (Mastra)
  streamingFiles: Map<string, StreamingFile>;
  fileBuffers: Map<string, string>;
  fileUrls: Map<string, string>;
  sessionId: string | null;
}

// ============================================
// Callbacks Invoked as Stream Events Arrive
// ============================================

export interface StreamCallbacks {
  // Agent/chat callbacks
  onTextDelta: (content: string) => void;
  onToolCall: (toolName: string | null) => void;
  onToolArgs: (args: Map<string, string>) => void;
  onReasoning: (reasoning: string) => void;
  onFileCreated: (files: string[]) => void;
  onFileContent?: (filePath: string, content: string) => void;
  
  // File streaming callbacks (Mastra)
  onSessionStart?: (sessionId: string) => void;
  onFileStart?: (fileId: string, path: string, fileName: string) => void;
  onFileChunk?: (fileId: string, chunk: string, chunkIndex: number, accumulated: string) => void;
  onFileEnd?: (fileId: string, path: string, finalContent: string) => void;
  onFileUrl?: (fileId: string, path: string, url: string, expiresAt: string) => void;
  onFileError?: (fileId: string, error: string) => void;
  onStreamingDone?: (sessionId: string) => void;
  onStreamingError?: (error: string) => void;
}

// ============================================
// Request/Response Types
// ============================================

export interface StreamingCodingRequest {
  prompt?: string;
  messages?: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string | Array<{ type: string; text?: string }>;
  }>;
  sessionId?: string;
}

export interface GenerateCodingResponse {
  sessionId: string;
  response: string;
  toolResults: unknown[];
  files: Array<{
    fileId: string;
    path: string;
    url: string;
    expiresAt: string;
  }>;
}
