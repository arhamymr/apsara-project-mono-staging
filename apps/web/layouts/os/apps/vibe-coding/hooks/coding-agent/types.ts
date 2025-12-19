'use client';

/**
 * Type definitions for the AI coding agent streaming interface.
 * These types define the SSE (Server-Sent Events) protocol between
 * the frontend and the backend coding agent API.
 */

// API endpoint for the coding agent's streaming interface
export const CODING_AGENT_API_URL =
  process.env.NEXT_PUBLIC_CODING_AGENT_URL ||
  'http://localhost:4111/streaming-coding-agent/stream';

/** Represents a file being streamed from the coding agent */
export interface StreamingFile {
  filePath: string;
  fileName: string;
  content: string;
}

/** A chat message in the coding agent conversation */
export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: StreamingFile[];
}

/**
 * SSE event types emitted by the coding agent during streaming.
 * Events flow: start → step-start → (reasoning/text/tool events) → step-finish → finish
 */
export type StreamEventType =
  | 'start'           // Stream session started
  | 'step-start'      // New processing step began
  | 'reasoning-start' // Agent started thinking/reasoning
  | 'reasoning-delta' // Incremental reasoning content
  | 'text-delta'      // Incremental text response content
  | 'tool-call'       // Agent is calling a tool (e.g., createFile)
  | 'tool-result'     // Tool execution completed
  | 'step-finish'     // Processing step completed
  | 'finish'          // Stream session completed
  | 'error';          // Error occurred

/** Payload data included with stream events */
export interface StreamEventPayload {
  id?: string;
  text?: string;
  toolName?: string;
  /** Arguments passed to tool calls (e.g., file path and content for createFile) */
  args?: {
    filePath?: string;
    content?: string;
  };
  result?: unknown;
  /** Provider-specific metadata (e.g., OpenRouter reasoning details) */
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
}

/** A single SSE event from the coding agent stream */
export interface StreamEvent {
  type: StreamEventType;
  runId: string;      // Unique identifier for this stream session
  from: string;       // Source identifier
  payload?: StreamEventPayload;
}

/** Configuration options for the useCodingAgentStream hook */
export interface UseCodingAgentStreamOptions {
  sessionId: string;
  onFilesGenerated?: (files: Record<string, string>) => void;
  onReasoningUpdate?: (reasoning: string) => void;
}

/** Internal state tracked during streaming */
export interface StreamState {
  assistantContent: string;           // Accumulated text response
  reasoning: string;                  // Accumulated reasoning/thinking
  files: Map<string, string>;         // Generated files (path → content)
}

/** Return type of the useCodingAgentStream hook */
export interface CodingAgentStreamReturn {
  isStreaming: boolean;
  streamingContent: string;           // Current text being streamed
  reasoningContent: string;           // Current reasoning being streamed
  generatedFiles: Map<string, string>;
  currentRunId: string | null;
  streamCodingAgent: (prompt: string) => Promise<string>;
  cancelStream: () => void;
}
