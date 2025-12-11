'use client';

// Main hook
export { useCodingAgentStream } from './use-coding-agent-stream';

// Types
export type {
  StreamingFile,
  AgentMessage,
  StreamEvent,
  StreamEventType,
  UseCodingAgentStreamOptions,
  CodingAgentStreamReturn,
} from './types';

// Utilities (for testing or advanced usage)
export { parseSSELine, extractCompleteLines } from './sse-parser';
export { processStreamEvent } from './stream-processor';
