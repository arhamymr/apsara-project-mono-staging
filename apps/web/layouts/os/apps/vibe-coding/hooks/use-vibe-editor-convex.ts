import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useVibeEditorConvex(sessionId: string, initialMessage?: string) {
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Query to get messages for this session
  const messages = useQuery(
    api.chat.getChatMessages,
    sessionId ? { sessionId: sessionId as Id<"chatSessions"> } : 'skip'
  ) || [];

  // Mutations
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (!messageToSend || !sessionId || isStreaming) return;

    try {
      setIsStreaming(true);
      setInputMessage('');

      // Add user message
      await sendMessage({
        sessionId: sessionId as Id<"chatSessions">,
        content: messageToSend,
      });

      // Simulate AI response (placeholder)
      // In production, this would call the actual AI service
      const response = `I received your message: "${messageToSend}"\n\nThis is a placeholder response. The actual vibe-coding AI integration will be added here.`;

      await addAssistantMessage({
        sessionId: sessionId as Id<"chatSessions">,
        content: response,
      });

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  // Send initial message if provided
  const hasInitialized = useRef(false);
  const initialMessageRef = useRef(initialMessage);
  
  useEffect(() => {
    // Only run once when component mounts with initial message
    if (
      initialMessageRef.current && 
      sessionId && 
      !hasInitialized.current
    ) {
      hasInitialized.current = true;
      // Small delay to ensure session is ready
      const timer = setTimeout(() => {
        handleSendMessage(initialMessageRef.current);
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]); // Only depend on sessionId, not messages.length

  // Transform messages to expected format
  const transformedMessages = messages.map(msg => ({
    id: msg._id,
    role: msg.role,
    content: msg.content,
    timestamp: new Date(msg.createdAt),
  }));

  return {
    messages: transformedMessages,
    inputMessage,
    isStreaming,
    scrollRef,
    setInputMessage,
    handleSendMessage,
  };
}
