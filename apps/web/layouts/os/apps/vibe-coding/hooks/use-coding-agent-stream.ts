/**
 * Backward Compatibility Re-export Module
 *
 * This file maintains the original import path for consumers while the
 * implementation has been refactored into smaller, focused modules.
 *
 * Module structure:
 * - coding-agent/types.ts           - Type definitions for SSE events and hook options
 * - coding-agent/sse-parser.ts      - SSE line parsing and buffer extraction
 * - coding-agent/stream-processor.ts - Event-to-state transformation logic
 * - coding-agent/use-stream-state.ts - React state management for streaming
 * - coding-agent/use-convex-actions.ts - Convex mutations for persistence
 * - coding-agent/use-coding-agent-stream.ts - Main hook orchestrating the stream
 */
export {
  useCodingAgentStream,
  type StreamingFile,
  type AgentMessage,
  type StreamEvent,
  type StreamEventType,
  type UseCodingAgentStreamOptions,
  type CodingAgentStreamReturn,
} from './coding-agent';
