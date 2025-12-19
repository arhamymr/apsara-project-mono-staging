import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function useVibeCodeConvex() {
  const [welcomeInput, setWelcomeInput] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<Id<"chatSessions"> | undefined>();
  const [isStarting, setIsStarting] = useState(false);

  // Query to get recent vibe-coding conversations
  const recentConversations = useQuery(api.vibeCoding.getVibeCodeSessions) || [];
  
  // Mutations
  const createSession = useMutation(api.vibeCoding.createVibeCodeSession);

  const handleStartChat = async (message: string): Promise<string | null> => {
    if (!message.trim() || isStarting) return null;

    try {
      setIsStarting(true);

      // Create new session with initial message
      const sessionId = await createSession({
        title: message.length > 50 ? message.substring(0, 47) + "..." : message,
        initialMessage: message,
      });

      setCurrentSessionId(sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error starting chat:', error);
      return null;
    } finally {
      setIsStarting(false);
    }
  };

  const handleSessionSelect = (sessionId: Id<"chatSessions">) => {
    setCurrentSessionId(sessionId);
  };

  const refetchConversations = () => {
    // Convex queries automatically refetch, so this is a no-op
    // but we keep it for compatibility with the existing interface
  };

  // Transform conversations to match expected format
  const transformedConversations = recentConversations.map(session => ({
    id: session._id,
    title: session.title,
    first_message: session.title,
    message_count: session.messageCount || 0,
  }));

  return {
    welcomeInput,
    setWelcomeInput,
    isStarting,
    handleStartChat,
    refetchConversations,
    recentConversations: transformedConversations,
    isLoadingConversations: recentConversations === undefined,
    handleSessionSelect,
    currentSessionId,
  };
}