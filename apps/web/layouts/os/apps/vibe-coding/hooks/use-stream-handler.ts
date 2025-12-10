/**
 * useStreamHandler Hook
 *
 * Handles Server-Sent Events (SSE) streaming from the AI coding agent.
 * This hook manages the low-level HTTP streaming connection and delegates
 * parsing to the stream-parser utility.
 *
 * SSE Protocol:
 * - Server sends events as "data: {json}\n\n"
 * - Each event contains a type (text-delta, tool-call, tool-result, etc.)
 * - Events are processed in real-time and callbacks are invoked
 *
 * Usage:
 *   const { streamFromAgent, cancelStream } = useStreamHandler();
 *   const result = await streamFromAgent(prompt, callbacks);
 */

import { useRef, useCallback } from 'react';
import type { StreamCallbacks } from '../types/stream-types';
import {
  parseSSEBuffer,
  parseSSELine,
  processStreamPart,
  createStreamState,
} from '../utils/stream-parser';

// API endpoint for the coding agent (configurable via environment variable)
const CODING_AGENT_API_URL =
  process.env.NEXT_PUBLIC_CODING_AGENT_URL ||
  'http://localhost:4111/streaming-coding-agent/stream';

/**
 * Result returned after streaming completes
 */
export interface StreamResult {
  assistantContent: string; // Full accumulated text response
  files: Map<string, string>; // Map of filePath -> fileContent
}

export function useStreamHandler() {
  // AbortController for cancelling in-flight requests
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Stream a response from the AI coding agent
   *
   * @param prompt - The user's message/prompt to send
   * @param callbacks - Callback functions invoked as stream events arrive
   * @returns Promise resolving to the final accumulated content and files
   */
  const streamFromAgent = useCallback(
    async (
      prompt: string,
      callbacks: StreamCallbacks,
    ): Promise<StreamResult> => {
      console.log('[streamFromAgent] Starting stream to:', CODING_AGENT_API_URL);

      // Initialize state to accumulate stream data
      const state = createStreamState();

      // Create abort controller for this request
      abortControllerRef.current = new AbortController();

      // ============================================
      // Step 1: Initiate HTTP POST request
      // ============================================
      console.log('[streamFromAgent] Fetching...');
      const response = await fetch(CODING_AGENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
      });

      console.log('[streamFromAgent] Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // ============================================
      // Step 2: Set up stream reader
      // ============================================
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = ''; // Buffer for incomplete SSE lines
      let chunkCount = 0;

      // ============================================
      // Step 3: Read and process stream chunks
      // ============================================
      while (true) {
        const { done, value } = await reader.read();

        // Stream complete
        if (done) {
          console.log(
            '[streamFromAgent] Stream done, total chunks:',
            chunkCount,
          );
          break;
        }

        // Decode binary chunk to text
        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        console.log(
          '[streamFromAgent] Chunk',
          chunkCount,
          ':',
          chunk.slice(0, 100),
        );

        // Add to buffer and parse complete SSE lines
        buffer += chunk;
        const { lines, remaining } = parseSSEBuffer(buffer);
        buffer = remaining; // Keep incomplete line for next iteration

        console.log(
          '[streamFromAgent] Parsed lines:',
          lines.length,
          'remaining buffer:',
          remaining.length,
        );

        // ============================================
        // Step 4: Process each complete SSE line
        // ============================================
        for (const line of lines) {
          // Parse "data: {json}" format
          const part = parseSSELine(line);
          if (part) {
            console.log('[streamFromAgent] Processing part type:', part.type);
            // Update state and invoke callbacks based on event type
            processStreamPart(part, state, callbacks);
          }
        }
      }

      // ============================================
      // Step 5: Return accumulated results
      // ============================================
      console.log('[streamFromAgent] Final state:', {
        contentLength: state.assistantContent.length,
        filesCount: state.files.size,
      });

      return {
        assistantContent: state.assistantContent,
        files: state.files,
      };
    },
    [],
  );

  /**
   * Cancel an in-progress stream
   * Useful for "Stop generating" functionality
   */
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    streamFromAgent,
    cancelStream,
    abortControllerRef,
  };
}
