import { useState, useRef, useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// API URL for the coding agent
const CODING_AGENT_API_URL = process.env.NEXT_PUBLIC_CODING_AGENT_URL || 'http://localhost:4111/coding-agent/stream';

export interface StreamingFile {
  filePath: string;
  fileName: string;
  content: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: StreamingFile[];
}

// Stream event types from the coding agent
type StreamEventType = 
  | 'start'
  | 'step-start'
  | 'reasoning-start'
  | 'reasoning-delta'
  | 'text-delta'
  | 'tool-call'
  | 'tool-result'
  | 'step-finish'
  | 'finish'
  | 'error';

interface StreamEvent {
  type: StreamEventType;
  runId: string;
  from: string;
  payload?: {
    id?: string;
    text?: string;
    toolName?: string;
    args?: {
      filePath?: string;
      content?: string;
    };
    result?: unknown;
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

interface UseCodingAgentStreamOptions {
  sessionId: string;
  onFilesGenerated?: (files: Record<string, string>) => void;
  onReasoningUpdate?: (reasoning: string) => void;
}

export function useCodingAgentStream({ sessionId, onFilesGenerated, onReasoningUpdate }: UseCodingAgentStreamOptions) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [reasoningContent, setReasoningContent] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<Map<string, string>>(new Map());
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Convex mutations
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

  // Parse SSE data line - handles multiple data: entries on same line
  const parseSSELine = useCallback((line: string): StreamEvent[] => {
    const events: StreamEvent[] = [];
    // Split by 'data: ' but keep the delimiter for parsing
    const dataParts = line.split(/(?=data: )/);
    
    for (const part of dataParts) {
      if (part.startsWith('data: ')) {
        try {
          const jsonStr = part.slice(6).trim();
          if (jsonStr) {
            events.push(JSON.parse(jsonStr));
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
    return events;
  }, []);

  const streamCodingAgent = useCallback(async (prompt: string): Promise<string> => {
    if (!prompt.trim() || isStreaming) return '';

    setIsStreaming(true);
    setStreamingContent('');
    setReasoningContent('');
    setGeneratedFiles(new Map());
    setCurrentRunId(null);

    let assistantContent = '';
    let reasoning = '';
    const files = new Map<string, string>();

    try {
      // Add user message to Convex
      await sendMessage({
        sessionId: sessionId as Id<'chatSessions'>,
        content: prompt,
      });

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      // Stream from coding agent API
      const response = await fetch(CODING_AGENT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: abortControllerRef.current.signal,
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines (SSE events can be on same line separated by 'data:')
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          
          const events = parseSSELine(line);
          
          for (const data of events) {
            switch (data.type) {
              case 'start':
                // Run started
                setCurrentRunId(data.runId);
                break;

              case 'step-start':
                // Step beginning - could extract model info if needed
                break;

              case 'reasoning-start':
              case 'reasoning-delta': {
                // Accumulate reasoning/thinking content
                if (data.payload?.text) {
                  reasoning += data.payload.text;
                  setReasoningContent(reasoning);
                  onReasoningUpdate?.(reasoning);
                }
                // Also check providerMetadata for reasoning details
                const reasoningDetails = data.payload?.providerMetadata?.openrouter?.reasoning_details;
                if (reasoningDetails) {
                  for (const detail of reasoningDetails) {
                    if (detail.summary) {
                      reasoning += detail.summary;
                      setReasoningContent(reasoning);
                      onReasoningUpdate?.(reasoning);
                    }
                  }
                }
                break;
              }

              case 'text-delta':
                // Streaming text content
                if (data.payload?.text) {
                  assistantContent += data.payload.text;
                  setStreamingContent(assistantContent);
                }
                break;

              case 'tool-call':
                // Tool being called - extract file creation
                if (data.payload?.toolName === 'createFile' && data.payload?.args) {
                  const { filePath, content } = data.payload.args;
                  if (filePath && content) {
                    files.set(filePath, content);
                    setGeneratedFiles(new Map(files));
                    onFilesGenerated?.(Object.fromEntries(files));
                  }
                }
                break;

              case 'tool-result':
                // Tool execution result - could contain file info
                break;

              case 'step-finish':
                // Step completed
                break;

              case 'finish':
                // Generation complete
                break;

              case 'error':
                assistantContent += `\n\nError: ${JSON.stringify(data.payload)}`;
                setStreamingContent(assistantContent);
                break;
            }
          }
        }
      }

      // Save assistant message to Convex
      await addAssistantMessage({
        sessionId: sessionId as Id<'chatSessions'>,
        content: assistantContent,
      });

      // Save generated files as artifact
      if (files.size > 0) {
        await saveArtifact({
          sessionId: sessionId as Id<'chatSessions'>,
          name: 'Generated Code',
          description: prompt.slice(0, 100),
          files: JSON.stringify(Object.fromEntries(files)),
          metadata: {
            framework: 'React',
            language: 'TypeScript',
          },
        });
      }

      return assistantContent;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream cancelled');
      } else {
        console.error('Stream error:', error);
        throw error;
      }
      return assistantContent;
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      setReasoningContent('');
      setCurrentRunId(null);
      abortControllerRef.current = null;
    }
  }, [sessionId, isStreaming, sendMessage, addAssistantMessage, saveArtifact, onFilesGenerated, onReasoningUpdate, parseSSELine]);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

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
