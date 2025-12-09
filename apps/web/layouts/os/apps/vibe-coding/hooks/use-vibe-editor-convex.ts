import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

// API URL for the coding agent
const CODING_AGENT_API_URL =
  process.env.NEXT_PUBLIC_CODING_AGENT_URL || 'http://localhost:4111/coding-agent/stream';

// Mastra stream part types
interface TextDeltaPart {
  type: 'text-delta';
  textDelta: string;
}

interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: {
    success?: boolean;
    filePath?: string;
    fileName?: string;
    content?: string;
    [key: string]: unknown;
  };
}

interface ToolResultsEvent {
  type: 'tool_results';
  results: Array<{
    success?: boolean;
    filePath?: string;
    fileName?: string;
    content?: string;
  }>;
}

interface ErrorEvent {
  type: 'error';
  error: string;
}

interface DoneEvent {
  type: 'done';
}

type StreamPart = TextDeltaPart | ToolCallPart | ToolResultPart | ToolResultsEvent | ErrorEvent | DoneEvent | { type: string; [key: string]: unknown };

export function useVibeEditorConvex(sessionId: string, initialMessage?: string) {
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentToolCall, setCurrentToolCall] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Query to get messages for this session
  const messages =
    useQuery(
      api.chat.getChatMessages,
      sessionId ? { sessionId: sessionId as Id<'chatSessions'> } : 'skip',
    ) || [];

  // Mutations
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, streamingContent]);

  const handleSendMessage = useCallback(
    async (message?: string) => {
      const messageToSend = message || inputMessage.trim();
      if (!messageToSend || !sessionId || isStreaming) return;

      setIsStreaming(true);
      setInputMessage('');
      setStreamingContent('');
      setCurrentToolCall(null);

      let assistantContent = '';
      const files = new Map<string, string>();

      try {
        // Add user message to Convex
        await sendMessage({
          sessionId: sessionId as Id<'chatSessions'>,
          content: messageToSend,
        });

        // Create abort controller for cancellation
        abortControllerRef.current = new AbortController();

        // Stream from coding agent API
        const response = await fetch(CODING_AGENT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: messageToSend }),
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
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const part: StreamPart = JSON.parse(line.slice(6));

                switch (part.type) {
                  case 'text-delta': {
                    // Streaming text content from Mastra
                    assistantContent += (part as TextDeltaPart).textDelta;
                    setStreamingContent(assistantContent);
                    break;
                  }

                  case 'tool-call': {
                    // Tool is being called
                    const toolCall = part as ToolCallPart;
                    setCurrentToolCall(toolCall.toolName);
                    console.log('Tool call:', toolCall.toolName, toolCall.args);
                    break;
                  }

                  case 'tool-result': {
                    // Single tool result
                    const toolResult = part as ToolResultPart;
                    setCurrentToolCall(null);
                    if (toolResult.result?.success && toolResult.result?.filePath) {
                      files.set(toolResult.result.filePath, toolResult.result.content || '');
                    }
                    console.log('Tool result:', toolResult.toolName, toolResult.result);
                    break;
                  }

                  case 'tool_results': {
                    // Multiple tool results (sent at end)
                    const toolResults = part as ToolResultsEvent;
                    if (toolResults.results) {
                      toolResults.results.forEach((result) => {
                        if (result?.success && result?.filePath) {
                          files.set(result.filePath, result.content || '');
                        }
                      });
                    }
                    break;
                  }

                  case 'error': {
                    const errorPart = part as ErrorEvent;
                    assistantContent += `\n\nError: ${errorPart.error}`;
                    setStreamingContent(assistantContent);
                    break;
                  }

                  case 'done':
                    // Generation complete
                    break;

                  default:
                    // Handle other Mastra stream parts
                    console.log('Stream part:', part.type, part);
                    break;
                }
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        }

        // Save assistant message to Convex
        if (assistantContent) {
          await addAssistantMessage({
            sessionId: sessionId as Id<'chatSessions'>,
            content: assistantContent,
          });
        }

        // Save generated files as artifact
        if (files.size > 0) {
          await saveArtifact({
            sessionId: sessionId as Id<'chatSessions'>,
            name: 'Generated Code',
            description: messageToSend.slice(0, 100),
            files: JSON.stringify(Object.fromEntries(files)),
            metadata: {
              framework: 'React',
              language: 'TypeScript',
            },
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Stream cancelled');
        } else {
          console.error('Stream error:', error);
          // Add error message
          await addAssistantMessage({
            sessionId: sessionId as Id<'chatSessions'>,
            content: `Error: ${error instanceof Error ? error.message : 'Failed to connect to coding agent'}`,
          });
        }
      } finally {
        setIsStreaming(false);
        setStreamingContent('');
        setCurrentToolCall(null);
        abortControllerRef.current = null;
      }
    },
    [sessionId, inputMessage, isStreaming, sendMessage, addAssistantMessage, saveArtifact],
  );

  // Send initial message if provided
  const hasInitialized = useRef(false);
  const initialMessageRef = useRef(initialMessage);

  useEffect(() => {
    // Only run once when component mounts with initial message
    if (initialMessageRef.current && sessionId && !hasInitialized.current) {
      hasInitialized.current = true;
      // Small delay to ensure session is ready
      const timer = setTimeout(() => {
        handleSendMessage(initialMessageRef.current);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sessionId, handleSendMessage]);

  // Transform messages to expected format
  const transformedMessages = messages.map((msg) => ({
    id: msg._id,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.createdAt),
  }));

  return {
    messages: transformedMessages,
    inputMessage,
    isStreaming,
    streamingContent,
    currentToolCall,
    scrollRef,
    setInputMessage,
    handleSendMessage,
  };
}
