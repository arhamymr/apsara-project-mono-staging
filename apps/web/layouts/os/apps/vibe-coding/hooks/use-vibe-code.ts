import { fetcher } from '@/lib/fetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export function useVibeCode() {
  const queryClient = useQueryClient();
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    undefined,
  );
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<
    'code' | 'preview' | 'debug'
  >('code');
  const [welcomeInput, setWelcomeInput] = useState('');

  const handleNewChat = async () => {
    setCurrentSessionId(undefined);
    setHasStartedChat(false);
    setWelcomeInput('');
  };

  const handleSessionSelect = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setHasStartedChat(true);
  };

  const handleSessionChange = async (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setHasStartedChat(true);
  };

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (message: string) => {
      return fetcher<{ session: { id: string } }>('/api/agent/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
    },
    onSuccess: (data) => {
      setCurrentSessionId(data.session.id);
      setHasStartedChat(true);
      // Invalidate sessions query to refetch the list
      queryClient.invalidateQueries({
        queryKey: ['vibe-coding', 'conversations'],
      });
    },
  });

  const handleStartChat = async (message: string): Promise<string | null> => {
    if (!message.trim() || createSessionMutation.isPending) return null;

    try {
      const data = await createSessionMutation.mutateAsync(message);
      return data.session.id;
    } catch (error) {
      console.error('Error creating session:', error);
      return null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // This will be handled by the parent component
    }
  };

  const showWelcome = !hasStartedChat;

  // Fetch recent conversations
  const {
    data: recentConversations,
    isLoading: isLoadingConversations,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ['vibe-coding', 'conversations'],
    queryFn: async () => {
      return fetcher<{ sessions: unknown[] }>('/api/agent/sessions');
    },
  });

  return {
    // State
    currentSessionId,
    hasStartedChat,
    rightPanelTab,
    welcomeInput,
    isStarting: createSessionMutation.isPending,
    showWelcome,

    // Conversations
    recentConversations: (recentConversations?.sessions || []) as Array<{
      id: string;
      title?: string;
      first_message?: string;
      message_count?: number;
    }>,
    isLoadingConversations,

    // Handlers
    handleNewChat,
    handleSessionSelect,
    handleSessionChange,
    handleStartChat,
    handleKeyDown,
    setRightPanelTab,
    setWelcomeInput,
    refetchConversations,
  };
}
