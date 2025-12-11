'use client';

import { useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { STREAMING_SAVE_DEBOUNCE_MS } from './constants';
import { buildFinalMessageContent } from './message-builder';

interface UsePersistenceOptions {
  sessionId: string;
  latestArtifact: { files?: unknown } | null | undefined;
}

export function useConvexPersistence({ sessionId, latestArtifact }: UsePersistenceOptions) {
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const createStreamingMessage = useMutation(api.chat.createStreamingMessage);
  const updateStreamingMessage = useMutation(api.chat.updateStreamingMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

  // Refs for debounced saving
  const lastSavedContentRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Save streaming content to Convex
  const saveStreamingContent = useCallback(
    async (messageId: Id<'chatMessages'>, content: string) => {
      if (content === lastSavedContentRef.current) return;

      try {
        await updateStreamingMessage({ messageId, content });
        lastSavedContentRef.current = content;
        console.log('[Stream] Saved streaming content to Convex:', content.length, 'chars');
      } catch (error) {
        console.error('[Stream] Failed to save streaming content:', error);
      }
    },
    [updateStreamingMessage],
  );

  // Debounced save for streaming content
  const debouncedSaveStreamingContent = useCallback(
    (messageId: Id<'chatMessages'>, content: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveStreamingContent(messageId, content);
      }, STREAMING_SAVE_DEBOUNCE_MS);
    },
    [saveStreamingContent],
  );

  // Save final results to Convex
  const saveResults = useCallback(
    async (
      streamingMessageId: Id<'chatMessages'> | null,
      content: string,
      newFiles: Map<string, string>,
      description: string,
    ) => {
      console.log('[saveResults] Saving results:', {
        contentLength: content?.length,
        newFilesCount: newFiles.size,
        existingFilesCount: latestArtifact?.files ? Object.keys(latestArtifact.files as object).length : 0,
      });

      // Merge new files with existing artifact files
      const mergedFiles = new Map<string, string>();

      if (latestArtifact?.files) {
        const existingFiles = latestArtifact.files as Record<string, string>;
        Object.entries(existingFiles).forEach(([path, fileContent]) => {
          mergedFiles.set(path, fileContent);
        });
      }

      newFiles.forEach((fileContent, path) => {
        mergedFiles.set(path, fileContent);
      });

      const newFileNames = Array.from(newFiles.keys());
      const fullContent = buildFinalMessageContent(content, newFileNames);

      // Update or create assistant message
      if (streamingMessageId && fullContent?.trim()) {
        await updateStreamingMessage({
          messageId: streamingMessageId,
          content: fullContent,
          isComplete: true,
        });
      } else if (fullContent?.trim()) {
        await addAssistantMessage({
          sessionId: sessionId as Id<'chatSessions'>,
          content: fullContent,
        });
      } else if (streamingMessageId) {
        await updateStreamingMessage({
          messageId: streamingMessageId,
          content: '',
          isComplete: true,
        });
      }

      // Save merged files as new artifact version
      if (mergedFiles.size > 0) {
        const filesObject = Object.fromEntries(mergedFiles);
        const result = await saveArtifact({
          sessionId: sessionId as Id<'chatSessions'>,
          messageId: streamingMessageId ?? undefined,
          name: 'Generated Code',
          description: description.slice(0, 100),
          files: JSON.stringify(filesObject),
          metadata: { framework: 'React', language: 'TypeScript' },
        });
        console.log('[saveResults] Artifact saved as version', result.version);
      }
    },
    [sessionId, addAssistantMessage, updateStreamingMessage, saveArtifact, latestArtifact],
  );

  // Clear debounce refs
  const clearSaveRefs = useCallback(() => {
    lastSavedContentRef.current = '';
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  return {
    sendMessage,
    addAssistantMessage,
    createStreamingMessage,
    updateStreamingMessage,
    debouncedSaveStreamingContent,
    saveResults,
    clearSaveRefs,
  };
}
