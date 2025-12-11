/**
 * Stream Parser Utilities
 *
 * Handles parsing of Server-Sent Events (SSE) from the backend.
 * 
 * Supports two event formats:
 * 1. Agent events: {"type":"event-type","runId":"...","from":"AGENT","payload":{...}}
 * 2. File streaming events (Mastra): {"type":"file-start","fileId":"...","path":"..."}
 */

import type {
  StreamPart,
  StreamState,
  StreamCallbacks,
  StreamingFile,
  TextDeltaPart,
  ToolCallPart,
  ToolCallDeltaPart,
  ReasoningDeltaPart,
  ToolResultPart,
  ToolResultsEvent,
  AgentErrorEvent,
  FileStartEvent,
  FileChunkEvent,
  FileEndEvent,
  FileUrlEvent,
  FileErrorEvent,
  SessionStartEvent,
  StreamingDoneEvent,
  StreamingErrorEvent,
} from '../types/stream-types';

/**
 * Parse SSE lines from buffer
 * Handles both \n\n (standard SSE) and \n followed by data: (compact format)
 */
export function parseSSEBuffer(buffer: string): {
  lines: string[];
  remaining: string;
} {
  const lines = buffer.split(/\n\n|\n(?=data:)/);
  const remaining = lines.pop() || '';
  return { lines, remaining };
}

/**
 * Parse a single SSE line into a StreamPart
 * Expects format: "data: {json}"
 */
export function parseSSELine(line: string): StreamPart | null {
  const trimmedLine = line.trim();
  if (!trimmedLine.startsWith('data: ')) return null;

  try {
    return JSON.parse(trimmedLine.slice(6)) as StreamPart;
  } catch {
    return null;
  }
}

/**
 * Process a stream part and update state accordingly
 * Handles both agent events (with payload wrapper) and Mastra file streaming events
 */
export function processStreamPart(
  part: StreamPart,
  state: StreamState,
  callbacks: StreamCallbacks,
): void {
  switch (part.type) {
    // ============================================
    // Session Events (Mastra)
    // ============================================
    case 'session-start': {
      const sessionStart = part as SessionStartEvent;
      console.log('[StreamParser] session-start:', sessionStart.sessionId);
      state.sessionId = sessionStart.sessionId;
      callbacks.onSessionStart?.(sessionStart.sessionId);
      break;
    }

    // ============================================
    // Text Content Streaming
    // ============================================
    case 'text-delta': {
      const textPart = part as TextDeltaPart;
      console.log('[StreamParser] text-delta part:', JSON.stringify(textPart).slice(0, 200));
      
      // Use payload.text as the main source
      const delta = textPart.payload?.text;
      
      if (typeof delta === 'string' && delta.length > 0) {
        state.assistantContent += delta;
        
        // Clean up obvious duplicate words (e.g., "word word" -> "word")
        // This handles AI model stuttering issues
        const cleanedContent = state.assistantContent
          .replace(/\b(\w+)\s+\1\b/g, '$1') // Remove duplicate words
          .replace(/(\w)''\1/g, "$1'$1"); // Fix patterns like "I'm'm" -> "I'm"
        
        callbacks.onTextDelta(cleanedContent);
      } else {
        console.log('[StreamParser] text-delta: no valid delta found in:', Object.keys(textPart));
      }
      break;
    }

    // ============================================
    // Tool Execution Events
    // ============================================
    case 'tool-call': {
      const toolCall = part as ToolCallPart;
      const toolName = toolCall.payload?.toolName;
      if (toolName) {
        callbacks.onToolCall(toolName);
      }
      break;
    }

    case 'tool-call-delta': {
      const delta = part as ToolCallDeltaPart;
      const payload = delta.payload;
      if (payload?.toolName) {
        callbacks.onToolCall(payload.toolName);
      }
      if (payload?.toolCallId && payload?.argsTextDelta) {
        const currentArgs = state.toolArgs.get(payload.toolCallId) || '';
        const newArgs = currentArgs + payload.argsTextDelta;
        state.toolArgs.set(payload.toolCallId, newArgs);
        callbacks.onToolArgs(new Map(state.toolArgs));
        
        // For createStreamingFile, try to extract and stream file content in real-time
        if (payload.toolName === 'createStreamingFile' || payload.toolName === 'createFile') {
          try {
            // Try to parse partial JSON to extract filePath and content
            // This is a best-effort attempt - may fail for incomplete JSON
            const partialArgs = newArgs;
            
            // Extract filePath using regex (more robust for partial JSON)
            const filePathMatch = partialArgs.match(/"filePath"\s*:\s*"([^"]+)"/);
            const pathMatch = partialArgs.match(/"path"\s*:\s*"([^"]+)"/);
            const filePath = filePathMatch?.[1] || pathMatch?.[1];
            
            // Extract content - look for content field and get everything after it
            const contentMatch = partialArgs.match(/"content"\s*:\s*"([\s\S]*)$/);
            if (filePath && contentMatch && contentMatch[1] !== undefined) {
              // Unescape the content (handle \n, \t, etc.)
              let content: string = contentMatch[1];
              // Remove trailing incomplete parts (unfinished escape sequences, etc.)
              if (content.endsWith('\\')) {
                content = content.slice(0, -1);
              }
              // Unescape common escape sequences
              content = content
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\r/g, '\r')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
              
              // Update files map for real-time display
              state.files.set(filePath, content);
              if (!state.createdFilesList.includes(filePath)) {
                state.createdFilesList.push(filePath);
                callbacks.onFileCreated([...state.createdFilesList]);
              }
              callbacks.onFileContent?.(filePath, content);
            }
          } catch {
            // Ignore parse errors for partial JSON
          }
        }
      }
      break;
    }

    case 'tool-result': {
      const toolResult = part as ToolResultPart;
      console.log('[StreamParser] tool-result:', JSON.stringify(toolResult).slice(0, 500));
      callbacks.onToolCall(null);

      const toolCallId = toolResult.payload?.toolCallId;
      const toolName = toolResult.payload?.toolName;
      const result = toolResult.payload?.result 
        ?? (toolResult as unknown as { result?: ToolResultPart['payload']['result'] }).result;
      
      // For createStreamingFile tool, extract content from accumulated args
      if (toolName === 'createStreamingFile' || toolName === 'createFile') {
        const accumulatedArgs = toolCallId ? state.toolArgs.get(toolCallId) : null;
        console.log('[StreamParser] createStreamingFile args:', accumulatedArgs?.slice(0, 200));
        
        if (accumulatedArgs) {
          try {
            const parsedArgs = JSON.parse(accumulatedArgs);
            const filePath = parsedArgs.filePath || parsedArgs.path;
            const content = parsedArgs.content || '';
            
            if (filePath) {
              console.log('[StreamParser] Extracted file from args:', filePath, content.length, 'chars');
              state.files.set(filePath, content);
              if (!state.createdFilesList.includes(filePath)) {
                state.createdFilesList.push(filePath);
              }
              callbacks.onFileCreated([...state.createdFilesList]);
              callbacks.onFileContent?.(filePath, content);
            }
          } catch (e) {
            console.error('[StreamParser] Failed to parse tool args:', e);
          }
        }
      } else if (result?.success && result?.filePath) {
        // Fallback for other tools that return file info in result
        const content = result.content || '';
        state.files.set(result.filePath, content);
        state.createdFilesList.push(result.filePath);
        callbacks.onFileCreated([...state.createdFilesList]);
        callbacks.onFileContent?.(result.filePath, content);
        console.log('[StreamParser] File added from result:', result.filePath);
      }
      break;
    }

    case 'tool_results': {
      const toolResults = part as ToolResultsEvent;
      const results = toolResults.payload?.results;
      if (results) {
        results.forEach((result) => {
          if (result?.success && result?.filePath) {
            const content = result.content || '';
            state.files.set(result.filePath, content);
            if (!state.createdFilesList.includes(result.filePath)) {
              state.createdFilesList.push(result.filePath);
              callbacks.onFileContent?.(result.filePath, content);
            }
          }
        });
        callbacks.onFileCreated([...state.createdFilesList]);
      }
      break;
    }

    // ============================================
    // Reasoning/Thinking Content
    // ============================================
    case 'reasoning-delta': {
      const reasoningPart = part as ReasoningDeltaPart;
      const payload = reasoningPart.payload;

      if (payload?.text) {
        state.reasoning += payload.text;
        callbacks.onReasoning(state.reasoning);
      }

      const details = payload?.providerMetadata?.openrouter?.reasoning_details;
      if (details) {
        for (const detail of details) {
          if (detail.summary) {
            state.reasoning += detail.summary;
            callbacks.onReasoning(state.reasoning);
          }
        }
      }
      break;
    }

    // ============================================
    // File Streaming Events (Mastra)
    // ============================================
    case 'file-start': {
      const fileStart = part as FileStartEvent;
      const { fileId, path, fileName } = fileStart;
      
      console.log('[StreamParser] file-start:', fileId, path, fileName);
      
      // Initialize streaming file state
      const streamingFile: StreamingFile = {
        fileId,
        path,
        fileName,
        content: '',
        chunks: [],
        url: null,
        expiresAt: null,
        status: 'streaming',
      };
      state.streamingFiles.set(fileId, streamingFile);
      state.fileBuffers.set(fileId, '');
      
      // Add to created files list
      if (!state.createdFilesList.includes(path)) {
        state.createdFilesList.push(path);
        callbacks.onFileCreated([...state.createdFilesList]);
      }
      
      callbacks.onFileStart?.(fileId, path, fileName);
      break;
    }

    case 'file-chunk': {
      const fileChunk = part as FileChunkEvent;
      const { fileId, chunk, chunkIndex } = fileChunk;
      
      console.log('[StreamParser] file-chunk:', fileId, 'index:', chunkIndex, 'size:', chunk.length);
      
      // Append chunk to buffer
      const currentContent = state.fileBuffers.get(fileId) || '';
      const newContent = currentContent + chunk;
      state.fileBuffers.set(fileId, newContent);
      
      // Update streaming file state
      const streamingFile = state.streamingFiles.get(fileId);
      if (streamingFile) {
        streamingFile.content = newContent;
        streamingFile.chunks.push({ index: chunkIndex, content: chunk });
        state.streamingFiles.set(fileId, streamingFile);
        
        // Update files map for real-time display (using path as key)
        state.files.set(streamingFile.path, newContent);
        callbacks.onFileContent?.(streamingFile.path, newContent);
      }
      
      callbacks.onFileChunk?.(fileId, chunk, chunkIndex, newContent);
      break;
    }

    case 'file-end': {
      const fileEnd = part as FileEndEvent;
      const { fileId, path, content } = fileEnd;
      
      console.log('[StreamParser] file-end:', fileId, path, content.length, 'chars');
      
      // Update streaming file state
      const streamingFile = state.streamingFiles.get(fileId);
      if (streamingFile) {
        streamingFile.content = content;
        streamingFile.status = 'uploading';
        state.streamingFiles.set(fileId, streamingFile);
      }
      
      // Ensure files map has final content
      state.files.set(path, content);
      state.fileBuffers.set(fileId, content);
      
      callbacks.onFileEnd?.(fileId, path, content);
      callbacks.onFileContent?.(path, content);
      break;
    }

    case 'file-url': {
      const fileUrl = part as FileUrlEvent;
      const { fileId, path, url, expiresAt } = fileUrl;
      
      console.log('[StreamParser] file-url:', fileId, path);
      
      // Update streaming file state
      const streamingFile = state.streamingFiles.get(fileId);
      if (streamingFile) {
        streamingFile.url = url;
        streamingFile.expiresAt = expiresAt;
        streamingFile.status = 'complete';
        state.streamingFiles.set(fileId, streamingFile);
      }
      
      state.fileUrls.set(path, url);
      callbacks.onFileUrl?.(fileId, path, url, expiresAt);
      break;
    }

    case 'file-error': {
      const fileError = part as FileErrorEvent;
      const { fileId, error } = fileError;
      
      console.error('[StreamParser] file-error:', fileId, error);
      
      // Update streaming file state
      const streamingFile = state.streamingFiles.get(fileId);
      if (streamingFile) {
        streamingFile.status = 'error';
        streamingFile.error = error;
        state.streamingFiles.set(fileId, streamingFile);
      }
      
      callbacks.onFileError?.(fileId, error);
      break;
    }

    // ============================================
    // Error Handling
    // ============================================
    case 'error': {
      // Check if it's a streaming error or agent error
      const errorPart = part as AgentErrorEvent | StreamingErrorEvent;
      
      if ('payload' in errorPart && errorPart.payload?.error) {
        // Agent error format
        const errorMsg = errorPart.payload.error;
        state.assistantContent += `\n\nError: ${errorMsg}`;
        callbacks.onTextDelta(state.assistantContent);
      } else if ('error' in errorPart) {
        // Streaming error format
        const streamingError = errorPart as StreamingErrorEvent;
        console.error('[StreamParser] streaming error:', streamingError.error);
        callbacks.onStreamingError?.(streamingError.error);
      }
      break;
    }

    // ============================================
    // Stream Lifecycle Events
    // ============================================
    case 'done': {
      // Check if it's a streaming done event
      const doneEvent = part as StreamingDoneEvent;
      if (doneEvent.sessionId) {
        console.log('[StreamParser] streaming done:', doneEvent.sessionId);
        callbacks.onStreamingDone?.(doneEvent.sessionId);
      }
      break;
    }

    case 'finish':
    case 'step-finish':
    case 'text-end':
      // Stream lifecycle events - no action needed
      break;

    default:
      console.log('[StreamParser] Unknown event type:', part.type);
      break;
  }
}

/**
 * Create initial stream state
 */
export function createStreamState(): StreamState {
  return {
    assistantContent: '',
    reasoning: '',
    files: new Map<string, string>(),
    toolArgs: new Map<string, string>(),
    createdFilesList: [],
    streamingFiles: new Map<string, StreamingFile>(),
    fileBuffers: new Map<string, string>(),
    fileUrls: new Map<string, string>(),
    sessionId: null,
  };
}
