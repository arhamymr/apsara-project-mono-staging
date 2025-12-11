'use client';

import { useCallback } from 'react';
import { useStreamState } from './use-stream-state';
import { useConvexActions } from './use-convex-actions';
import { parseSSELine, extractCompleteLines } from './sse-parser';
import { processStreamEvent } from './stream-processor';
import type {
  UseCodingAgentStreamOptions,
  CodingAgentStreamReturn,
  StreamState,
} from './types';
import { CODING_AGENT_API_URL } from './types';

/**
 * Hook for streaming responses from the AI coding agent.
 * Handles SSE streaming, state management, and Convex persistence.
 *
 * @param sessionId - The chat session ID for message persistence
 * @param onFilesGenerated - Callback when files are created by the agent
 * @param onReasoningUpdate - Callback when agent's reasoning/thinking updates
 */
export function useCodingAgentStream({
  sessionId,
  onFilesGenerated,
  onReasoningUpdate,
}: UseCodingAgentStreamOptions): CodingAgentStreamReturn {
  // Streaming state (content, files, status)
  const {
    isStreaming,
    streamingContent,
    reasoningContent,
    generatedFiles,
    currentRunId,
    setStreamingContent,
    setReasoningContent,
    setGeneratedFiles,
    setCurrentRunId,
    startStreaming,
    stopStreaming,
    createAbortController,
    cancelStream,
  } = useStreamState();

  // Convex mutations for persisting messages and artifacts
  const { saveUserMessage, saveAssistantMessage, saveGeneratedFiles } =
    useConvexActions();

  /**
   * Initiates a streaming request to the coding agent API.
   * Processes SSE events in real-time and updates UI state accordingly.
   *
   * @param prompt - The user's message/prompt to send to the agent
   * @returns The complete assistant response content
   */
  const streamCodingAgent = useCallback(
    async (prompt: string): Promise<string> => {
      if (!prompt.trim() || isStreaming) return '';

      startStreaming();

      // Initialize accumulator state for the stream
      let state: StreamState = {
        assistantContent: '',
        reasoning: '',
        files: new Map(),
      };

      try {
        // Persist user message before starting stream
        await saveUserMessage(sessionId, prompt);

        const abortController = createAbortController();

        // Initiate SSE stream from coding agent backend
        const response = await fetch(CODING_AGENT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        // Read and process SSE stream chunks
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Accumulate chunks and extract complete lines
          buffer += decoder.decode(value, { stream: true });
          const { lines, remaining } = extractCompleteLines(buffer);
          buffer = remaining;

          // Process each complete SSE line
          for (const line of lines) {
            if (!line.trim()) continue;

            // Parse SSE data and process each event
            const events = parseSSELine(line);
            for (const event of events) {
              state = processStreamEvent(event, state, {
                onRunStart: setCurrentRunId,
                onReasoningUpdate: (reasoning) => {
                  setReasoningContent(reasoning);
                  onReasoningUpdate?.(reasoning);
                },
                onContentUpdate: setStreamingContent,
                onFilesUpdate: (files) => {
                  setGeneratedFiles(new Map(files));
                  onFilesGenerated?.(Object.fromEntries(files));
                },
                onError: console.error,
              });
            }
          }
        }

        // Persist final assistant response and generated files to Convex
        await saveAssistantMessage(sessionId, state.assistantContent);
        await saveGeneratedFiles(sessionId, state.files, prompt);

        return state.assistantContent;
      } catch (error) {
        // Handle user-initiated cancellation gracefully
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Stream cancelled');
        } else {
          console.error('Stream error:', error);
          throw error;
        }
        return state.assistantContent;
      } finally {
        stopStreaming();
      }
    },
    [
      sessionId,
      isStreaming,
      startStreaming,
      stopStreaming,
      createAbortController,
      saveUserMessage,
      saveAssistantMessage,
      saveGeneratedFiles,
      setCurrentRunId,
      setStreamingContent,
      setReasoningContent,
      setGeneratedFiles,
      onFilesGenerated,
      onReasoningUpdate,
    ]
  );

  return {
    isStreaming,
    streamingContent,
    reasoningContent,
    generatedFiles,
    currentRunId,
    streamCodingAgent,
    cancelStream,
  };
}
