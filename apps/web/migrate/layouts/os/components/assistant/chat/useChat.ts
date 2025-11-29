import { fetcher } from '@/lib/fetcher';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { detectAppIntent } from './intent-detector';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface ChatResponse {
  success: boolean;
  output: string;
  status: string;
}

export function useChat(onOpenApp?: (appId: string) => void) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatMutation = useMutation({
    mutationFn: async (query: string) => {
      return fetcher<ChatResponse>('/api/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ query }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onError: (error) => {
      console.error('Chat error:', error);
      toast.error('Sorry, there was an error processing your message.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your message.',
        },
      ]);
    },
  });

  const sendChat = useCallback(
    async (text: string, opts?: { speak?: (t: string) => void }) => {
      const content = text.trim();
      if (!content) return;

      setMessages((prev) => [...prev, { role: 'user', content }]);

      // Check for app opening intent
      const intent = detectAppIntent(content);
      if (intent && intent.type === 'open-app') {
        const reply = `Opening ${intent.appName}...`;
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);

        // Call the app opener callback
        if (onOpenApp) {
          onOpenApp(intent.appId);
        }

        if (opts?.speak) opts.speak(reply);
        return;
      }

      try {
        const response = await chatMutation.mutateAsync(content);
        const reply =
          response.output || 'Sorry, I could not process your request.';
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        if (opts?.speak) opts.speak(reply);
      } catch (error) {
        // Error already handled by mutation onError
      }
    },
    [chatMutation, onOpenApp],
  );

  return {
    messages,
    sendChat,
    isLoading: chatMutation.isPending,
  } as const;
}
