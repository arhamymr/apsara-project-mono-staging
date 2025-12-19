'use client';

import type { StreamEvent, StreamState } from './types';

export interface StreamProcessorCallbacks {
  onRunStart: (runId: string) => void;
  onReasoningUpdate: (reasoning: string) => void;
  onContentUpdate: (content: string) => void;
  onFilesUpdate: (files: Map<string, string>) => void;
  onError: (error: string) => void;
}

/**
 * Process a single stream event and update state accordingly
 */
export function processStreamEvent(
  event: StreamEvent,
  state: StreamState,
  callbacks: StreamProcessorCallbacks
): StreamState {
  const newState = { ...state };

  switch (event.type) {
    case 'start':
      callbacks.onRunStart(event.runId);
      break;

    case 'step-start':
      // Step beginning - could extract model info if needed
      break;

    case 'reasoning-start':
    case 'reasoning-delta':
      newState.reasoning = processReasoningEvent(event, state.reasoning);
      callbacks.onReasoningUpdate(newState.reasoning);
      break;

    case 'text-delta':
      if (event.payload?.text) {
        newState.assistantContent = state.assistantContent + event.payload.text;
        callbacks.onContentUpdate(newState.assistantContent);
      }
      break;

    case 'tool-call':
      newState.files = processToolCallEvent(event, state.files);
      if (newState.files !== state.files) {
        callbacks.onFilesUpdate(newState.files);
      }
      break;

    case 'tool-result':
    case 'step-finish':
    case 'finish':
      // These events don't require state updates
      break;

    case 'error': {
      const errorMsg = `\n\nError: ${JSON.stringify(event.payload)}`;
      newState.assistantContent = state.assistantContent + errorMsg;
      callbacks.onError(errorMsg);
      callbacks.onContentUpdate(newState.assistantContent);
      break;
    }
  }

  return newState;
}

/**
 * Process reasoning events (reasoning-start, reasoning-delta)
 */
function processReasoningEvent(event: StreamEvent, currentReasoning: string): string {
  let reasoning = currentReasoning;

  // Accumulate reasoning/thinking content
  if (event.payload?.text) {
    reasoning += event.payload.text;
  }

  // Also check providerMetadata for reasoning details
  const reasoningDetails = event.payload?.providerMetadata?.openrouter?.reasoning_details;
  if (reasoningDetails) {
    for (const detail of reasoningDetails) {
      if (detail.summary) {
        reasoning += detail.summary;
      }
    }
  }

  return reasoning;
}

/**
 * Process tool-call events for file creation
 */
function processToolCallEvent(
  event: StreamEvent,
  currentFiles: Map<string, string>
): Map<string, string> {
  if (event.payload?.toolName === 'createFile' && event.payload?.args) {
    const { filePath, content } = event.payload.args;
    if (filePath && content) {
      const newFiles = new Map(currentFiles);
      newFiles.set(filePath, content);
      return newFiles;
    }
  }
  return currentFiles;
}
