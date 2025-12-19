'use client';

import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { getReactViteBoilerplate } from '../webcontainer/boilerplate';

/**
 * Hook providing Convex mutations for persisting chat messages and artifacts.
 * Handles merging generated code with boilerplate for first-time artifact creation.
 */
export function useConvexActions(sessionId?: string) {
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);
  
  // Query latest artifact to determine if this is the first save
  const latestArtifact = useQuery(
    api.vibeCoding.getLatestArtifact,
    sessionId ? { sessionId: sessionId as Id<'chatSessions'> } : 'skip'
  );

  const saveUserMessage = async (targetSessionId: string, content: string) => {
    await sendMessage({
      sessionId: targetSessionId as Id<'chatSessions'>,
      content,
    });
  };

  const saveAssistantMessage = async (targetSessionId: string, content: string) => {
    await addAssistantMessage({
      sessionId: targetSessionId as Id<'chatSessions'>,
      content,
    });
  };

  /**
   * Save generated files as an artifact.
   * For the first artifact (v1), merges generated code with React+Vite boilerplate
   * to ensure all necessary config files are present.
   */
  const saveGeneratedFiles = async (
    targetSessionId: string,
    files: Map<string, string>,
    prompt: string
  ) => {
    if (files.size === 0) return;

    const isFirstArtifact = !latestArtifact;
    const mergedFiles = new Map<string, string>();

    // For first artifact, start with boilerplate as base
    if (isFirstArtifact) {
      const boilerplate = getReactViteBoilerplate();
      Object.entries(boilerplate).forEach(([path, content]) => {
        mergedFiles.set(path, content);
      });
      console.log('[saveGeneratedFiles] Applied boilerplate for v1:', Object.keys(boilerplate).length, 'files');
    }

    // Overlay generated files (takes precedence over boilerplate)
    files.forEach((content, path) => {
      mergedFiles.set(path, content);
    });

    await saveArtifact({
      sessionId: targetSessionId as Id<'chatSessions'>,
      name: 'Generated Code',
      description: prompt.slice(0, 100),
      files: JSON.stringify(Object.fromEntries(mergedFiles)),
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
