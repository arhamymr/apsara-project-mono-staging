'use client';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

export function useConvexActions() {
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

  const saveUserMessage = async (sessionId: string, content: string) => {
    await sendMessage({
      sessionId: sessionId as Id<'chatSessions'>,
      content,
    });
  };

  const saveAssistantMessage = async (sessionId: string, content: string) => {
    await addAssistantMessage({
      sessionId: sessionId as Id<'chatSessions'>,
      content,
    });
  };

  const saveGeneratedFiles = async (
    sessionId: string,
    files: Map<string, string>,
    prompt: string
  ) => {
    if (files.size === 0) return;

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
  };

  return {
    saveUserMessage,
    saveAssistantMessage,
    saveGeneratedFiles,
  };
}
