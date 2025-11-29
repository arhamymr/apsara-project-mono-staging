import { fetcher } from '@/lib/fetcher';
import type { AgentMessage, ChatMessage } from '@/types/agent';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseChatOptions {
  sessionId: string | null;
  initialMessage?: string;
  onSessionCreated?: (sessionId: string) => void;
}

interface UseChatReturn {
  messages: AgentMessage[];
  inputMessage: string;
  isStreaming: boolean;
  streamingContent: string;
  streamingTools: string[];
  scrollRef: React.RefObject<HTMLDivElement>;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => Promise<void>;
}

export function useChat({
  sessionId,
  initialMessage,
  onSessionCreated,
}: UseChatOptions): UseChatReturn {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingTools, setStreamingTools] = useState<string[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasAutoSentRef = useRef(false);

  // Load messages for a session
  const loadSessionMessages = useCallback(async (id: string) => {
    setIsLoadingMessages(true);
    try {
      console.log('Loading messages for session:', id);
      const response = await fetcher<{
        session: {
          id: string;
          messages: Array<{
            id: number;
            role: 'user' | 'assistant';
            content: string;
            created_at: string;
          }>;
        };
      }>(`/api/agent/sessions/${id}`);

      const loadedMessages: AgentMessage[] = response.session.messages.map(
        (msg) => ({
          id: msg.id.toString(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }),
      );

      console.log('Loaded messages:', loadedMessages.length);
      setMessages(loadedMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load conversation history');
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  // Load messages when session changes
  useEffect(() => {
    // Reset auto-send flag when session changes
    hasAutoSentRef.current = false;

    if (sessionId) {
      loadSessionMessages(sessionId);
    } else {
      setMessages([]);
    }
  }, [sessionId, loadSessionMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages, streamingContent]);

  // Session sync mutation
  const syncSessionMutation = useMutation({
    mutationFn: async ({
      firstMessage,
      existingSessionId,
      messageCount,
    }: {
      firstMessage: string | null;
      existingSessionId: string | null;
      messageCount: number;
    }) => {
      return fetcher<{
        success: boolean;
        session: { id: string; mastra_thread_id: string | null };
      }>('/api/agent/sessions/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: existingSessionId,
          first_message: firstMessage,
          message_count: messageCount,
        }),
      });
    },
    onSuccess: (response) => {
      if (response.success && response.session.id && !sessionId) {
        onSessionCreated?.(response.session.id);
      }
    },
    onError: (error) => {
      console.error('Failed to sync session:', error);
    },
  });

  // Get CSRF tokens from both meta tag and cookie
  const getCsrfHeaders = (): HeadersInit => {
    const headers: HeadersInit = {};

    // Try meta tag (X-CSRF-TOKEN)
    const metaToken = document
      .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
      ?.getAttribute('content');
    if (metaToken) {
      headers['X-CSRF-TOKEN'] = metaToken;
    }

    // Try cookie (X-XSRF-TOKEN)
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'XSRF-TOKEN') {
        headers['X-XSRF-TOKEN'] = decodeURIComponent(value);
        break;
      }
    }

    return headers;
  };

  // Ensure CSRF cookie is fresh
  const ensureCsrfCookie = async (): Promise<void> => {
    try {
      await fetch('/sanctum/csrf-cookie', {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to refresh CSRF cookie:', error);
    }
  };

  // Handle sending messages with streaming
  const handleSendMessage = useCallback(
    async (messageOverride?: string) => {
      const messageToSend = messageOverride || inputMessage;
      if (!messageToSend.trim() || isStreaming) return;

      const userMessage: AgentMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageToSend.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage('');
      setIsStreaming(true);
      setStreamingContent('');
      setStreamingTools([]);

      const conversationMessages: ChatMessage[] = [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ];

      try {
        abortControllerRef.current = new AbortController();

        // Ensure CSRF cookie is fresh before making the request
        await ensureCsrfCookie();

        // Build headers with CSRF tokens
        const csrfHeaders = getCsrfHeaders();
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
          'X-Requested-With': 'XMLHttpRequest',
          ...csrfHeaders,
        };

        // Note: Using raw fetch() here instead of fetcher utility because
        // Server-Sent Events (SSE) require streaming response body access
        const response = await fetch('/api/mastra/agent/chat/stream', {
          method: 'POST',
          headers,
          credentials: 'include',
          body: JSON.stringify({
            messages: conversationMessages,
            sessionId: sessionId,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error('No response body');
        }

        let accumulatedContent = '';
        let newSessionId: string | null = null;
        const toolCallsUsed = new Set<string>();

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));

                // Handle different event types from Mastra agent
                if (data.type === 'start') {
                  // Agent started thinking
                  if (data.sessionId) {
                    newSessionId = data.sessionId;
                  }
                  setStreamingContent('Thinking...');
                } else if (data.type === 'step') {
                  // Agent is processing a step
                  if (data.text) {
                    accumulatedContent += data.text;
                    setStreamingContent(accumulatedContent);
                  }
                  // Track tool calls
                  if (data.toolCalls && data.toolCalls.length > 0) {
                    data.toolCalls.forEach(
                      (toolCall: { payload?: { toolName?: string } }) => {
                        if (toolCall.payload?.toolName) {
                          toolCallsUsed.add(toolCall.payload.toolName);
                        }
                      },
                    );
                    // Update streaming tools for real-time display
                    setStreamingTools(Array.from(toolCallsUsed));
                    console.log('Tool calls:', data.toolCalls);
                  }
                } else if (data.type === 'complete') {
                  // Agent completed - use the final response
                  if (data.response) {
                    accumulatedContent = data.response;
                    setStreamingContent(accumulatedContent);
                  }
                  if (data.sessionId) {
                    newSessionId = data.sessionId;
                  }
                } else if (data.type === 'text' && data.text) {
                  // Legacy format support
                  accumulatedContent += data.text;
                  setStreamingContent(accumulatedContent);
                } else if (data.type === 'error') {
                  toast.error(data.message || 'An error occurred');
                } else if (data.type === 'done') {
                  // Legacy format support
                  if (data.sessionId) {
                    newSessionId = data.sessionId;
                  }
                }
              } catch (e) {
                console.error('Failed to parse SSE data:', e);
              }
            }
          }
        }

        // Add assistant message to history with tool calls
        if (accumulatedContent) {
          const assistantMessage: AgentMessage = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: accumulatedContent,
            timestamp: new Date(),
            toolCalls: Array.from(toolCallsUsed),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }

        // Sync session with backend and store messages
        if (!sessionId && userMessage.content) {
          // First message - create session
          syncSessionMutation.mutate({
            firstMessage: userMessage.content,
            existingSessionId: newSessionId,
            messageCount: messages.length + 2, // user + assistant
          });
        } else if (sessionId) {
          // Existing session - store both user and assistant messages
          try {
            // Only store user message if it's not the first message
            // (first message is already stored when session is created)
            if (messages.length > 0) {
              await fetcher(`/api/agent/sessions/${sessionId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  role: 'user',
                  content: userMessage.content,
                }),
              });
            }

            // Store assistant message if we got a response
            if (accumulatedContent) {
              await fetcher(`/api/agent/sessions/${sessionId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  role: 'assistant',
                  content: accumulatedContent,
                }),
              });
            }
          } catch (error) {
            console.error('Failed to store messages:', error);
            // Don't show error to user - messages are still in UI
          }

          // Update session metadata
          syncSessionMutation.mutate({
            firstMessage: null,
            existingSessionId: sessionId,
            messageCount: messages.length + 2,
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          toast.info('Message cancelled');
        } else {
          console.error('Stream error:', error);
          toast.error('Failed to send message');
        }
      } finally {
        setIsStreaming(false);
        setStreamingContent('');
        setStreamingTools([]);
        abortControllerRef.current = null;
      }
    },
    [inputMessage, isStreaming, messages, sessionId, syncSessionMutation],
  );

  // Auto-send initial message when session is created
  useEffect(() => {
    if (
      sessionId &&
      initialMessage &&
      !hasAutoSentRef.current &&
      !isLoadingMessages &&
      messages.length === 0
    ) {
      hasAutoSentRef.current = true;
      // Send the initial message automatically
      handleSendMessage(initialMessage);
    }
  }, [
    sessionId,
    initialMessage,
    messages.length,
    isLoadingMessages,
    handleSendMessage,
  ]);

  return {
    messages,
    inputMessage,
    isStreaming,
    streamingContent,
    streamingTools,
    scrollRef,
    setInputMessage,
    handleSendMessage,
  };
}
