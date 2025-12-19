'use client';

import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useStreamHandler } from '../use-stream-handler';
import { useStreamingState } from './use-streaming-state';
import { useConvexPersistence } from './use-convex-persistence';
import { createStreamCallbacks } from './create-stream-callbacks';
import type { TransformedMessage, UseVibeEditorReturn } from './types';

export function useVibeEditorConvex(
  sessionId: string,
  initialMessage?: string,
): UseVibeEditorReturn {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Stream handler hook
  const { streamFromAgent } = useStreamHandler();

  // Streaming state management
  const state = useStreamingState();

  // Convex queries
  const messagesQuery = useQuery(
    api.chat.getChatMessages,
    sessionId ? { sessionId: sessionId as Id<'chatSessions'> } : 'skip',
  );
  const messages = useMemo(() => messagesQuery || [], [messagesQuery]);
  const isLoadingMessages = messagesQuery === undefined;

  const latestArtifact = useQuery(
    api.vibeCoding.getLatestArtifact,
    sessionId ? { sessionId: sessionId as Id<'chatSessions'> } : 'skip',
  );

  // Convex persistence
  const persistence = useConvexPersistence({ sessionId, latestArtifact });

  // Streaming message ID ref
  const streamingMessageIdRef = useRef<Id<'chatMessages'> | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, state.streamingContent]);

  // Create callbacks factory
  const createCallbacks = useCallback(() => {
    return createStreamCallbacks({
      addActivity: state.addActivity,
      setStreamingContent: state.setStreamingContent,
      setReasoningContent: state.setReasoningContent,
      setCurrentToolCall: state.setCurrentToolCall,
      setToolCallArgs: state.setToolCallArgs,
      setCreatedFiles: state.setCreatedFiles,
      setStreamingFiles: state.setStreamingFiles,
      setLoadingFile: state.setLoadingFile,
      debouncedSave: (msgId, content) => persistence.debouncedSaveStreamingContent(msgId, content),
      getStreamingMessageId: () => streamingMessageIdRef.current,
      getCurrentState: () => ({
        streamingContent: state.streamingContent,
        currentToolCall: state.currentToolCall,
        createdFiles: state.createdFiles,
        reasoningContent: state.reasoningContent,
      }),
    });
  }, [state, persistence]);

  // Handle send message
  const handleSendMessage = useCallback(
    async (message?: string, skipSaveMessage = false) => {
      const messageToSend = message || state.inputMessage.trim();

      if (!messageToSend || !sessionId || state.isStreaming) {
        return;
      }

      state.setInputMessage('');
      state.initStreamState();

      try {
        if (!skipSaveMessage) {
          await persistence.sendMessage({
            sessionId: sessionId as Id<'chatSessions'>,
            content: messageToSend,
          });
        }

        const streamingMsgId = await persistence.createStreamingMessage({
          sessionId: sessionId as Id<'chatSessions'>,
        });
        streamingMessageIdRef.current = streamingMsgId;
        persistence.clearSaveRefs();

        const { assistantContent, files } = await streamFromAgent(
          messageToSend,
          createCallbacks(),
        );

        await persistence.saveResults(
          streamingMessageIdRef.current,
          assistantContent,
          files,
          messageToSend,
        );
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          if (streamingMessageIdRef.current) {
            await persistence.updateStreamingMessage({
              messageId: streamingMessageIdRef.current,
              content: '[Stream cancelled]',
              isComplete: true,
            });
          }
        } else {
          console.error('[handleSendMessage] Stream error:', error);
          const errorMsg = `Error: ${error instanceof Error ? error.message : 'Failed to connect to coding agent'}`;
          if (streamingMessageIdRef.current) {
            await persistence.updateStreamingMessage({
              messageId: streamingMessageIdRef.current,
              content: errorMsg,
              isComplete: true,
            });
          } else {
            await persistence.addAssistantMessage({
              sessionId: sessionId as Id<'chatSessions'>,
              content: errorMsg,
            });
          }
        }
      } finally {
        state.resetStreamState();
        streamingMessageIdRef.current = null;
      }
    },
    [sessionId, state, persistence, streamFromAgent, createCallbacks],
  );

  // Auto-send initial message (only for NEW sessions - first conversation only)
  useEffect(() => {
    // Skip if no initial message, no session, already initialized, or still loading messages
    if (!initialMessage || !sessionId || hasInitialized.current || isLoadingMessages) return;
    
    // Check if this is a fresh session that needs initial streaming:
    // - messages.length === 0: brand new session (no messages yet)
    // - messages.length === 1 AND only user message: session just created with initial message, no AI response yet
    // - messages.length > 1: existing conversation with responses, skip streaming
    const hasAssistantResponse = messages.some(msg => msg.role === 'assistant');
    const isFirstConversation = messages.length <= 1 && !hasAssistantResponse;
    
    if (!isFirstConversation) {
      hasInitialized.current = true;
      return;
    }
    
    hasInitialized.current = true;

    const triggerInitialStream = async () => {
      state.initStreamState();

      try {
        const streamingMsgId = await persistence.createStreamingMessage({
          sessionId: sessionId as Id<'chatSessions'>,
        });
        streamingMessageIdRef.current = streamingMsgId;
        persistence.clearSaveRefs();

        const { assistantContent, files } = await streamFromAgent(
          initialMessage,
          createCallbacks(),
        );

        await persistence.saveResults(
          streamingMessageIdRef.current,
          assistantContent,
          files,
          initialMessage,
        );
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Stream error:', error);
          const errorMsg = `Error: ${error instanceof Error ? error.message : 'Failed to connect to coding agent'}`;
          if (streamingMessageIdRef.current) {
            await persistence.updateStreamingMessage({
              messageId: streamingMessageIdRef.current,
              content: errorMsg,
              isComplete: true,
            });
          } else {
            await persistence.addAssistantMessage({
              sessionId: sessionId as Id<'chatSessions'>,
              content: errorMsg,
            });
          }
        }
      } finally {
        state.resetStreamState();
        streamingMessageIdRef.current = null;
      }
    };

    triggerInitialStream();
  }, [initialMessage, sessionId, state, persistence, streamFromAgent, createCallbacks, isLoadingMessages, messages]);

  // Transform messages
  const transformedMessages: TransformedMessage[] = useMemo(
    () =>
      messages
        .filter((msg) => (msg.content != null && msg.content !== '') || msg.isStreaming)
        .map((msg) => ({
          id: String(msg._id),
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.createdAt),
          isStreaming: msg.isStreaming,
        })),
    [messages],
  );

  // Clear pending message when Convex updates
  useEffect(() => {
    if (state.pendingMessage && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'assistant') {
        state.setPendingMessage(null);
      }
    }
  }, [messages, state.pendingMessage, state]);

  // Combine messages with pending
  const allMessages = state.pendingMessage
    ? [
        ...transformedMessages,
        {
          id: 'pending-' + Date.now(),
          role: 'assistant' as const,
          content: state.pendingMessage.content,
          timestamp: state.pendingMessage.timestamp,
        },
      ]
    : transformedMessages;

  return {
    messages: allMessages,
    isLoadingMessages,
    inputMessage: state.inputMessage,
    setInputMessage: state.setInputMessage,
    isStreaming: state.isStreaming,
    streamingContent: state.streamingContent,
    reasoningContent: state.reasoningContent,
    currentToolCall: state.currentToolCall,
    toolCallArgs: state.toolCallArgs,
    createdFiles: state.createdFiles,
    streamingFiles: state.streamingFiles,
    activityLog: state.activityLog,
    loadingFile: state.loadingFile,
    scrollRef: scrollRef as React.RefObject<HTMLDivElement>,
    handleSendMessage,
  };
}
