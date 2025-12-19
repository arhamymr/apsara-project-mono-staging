'use client';

/**
 * useConvexPersistence Hook
 *
 * Handles all Convex database operations for the Vibe Code Editor:
 * - Saving user and assistant messages
 * - Creating/updating streaming messages in real-time
 * - Persisting generated code artifacts with version history
 *
 * Uses debounced saves during streaming to reduce database writes
 * while maintaining responsive UI updates.
 */

import { useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { STREAMING_SAVE_DEBOUNCE_MS } from './constants';
import { buildFinalMessageContent } from './message-builder';
import { getReactViteBoilerplate } from '../webcontainer/boilerplate';

interface UsePersistenceOptions {
  sessionId: string;
  /** Latest artifact from Convex - used to merge new files with existing ones */
  latestArtifact: { files?: unknown; version?: number } | null | undefined;
}

export function useConvexPersistence({ sessionId, latestArtifact }: UsePersistenceOptions) {
  // Convex mutations for chat and artifact persistence
  const sendMessage = useMutation(api.vibeCoding.sendVibeCodeMessage);
  const addAssistantMessage = useMutation(api.chat.addAssistantMessage);
  const createStreamingMessage = useMutation(api.chat.createStreamingMessage);
  const updateStreamingMessage = useMutation(api.chat.updateStreamingMessage);
  const saveArtifact = useMutation(api.vibeCoding.saveGeneratedArtifact);

  // Track last saved content to avoid redundant saves
  const lastSavedContentRef = useRef<string>('');
  // Timeout ref for debounced saving during streaming
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Immediately saves streaming content to Convex.
   * Skips save if content hasn't changed since last save.
   */
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

  /**
   * Debounced version of saveStreamingContent.
   * Batches rapid updates during streaming to reduce database writes.
   */
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

  /**
   * Saves final streaming results to Convex after stream completes.
   *
   * File merging strategy (layered, later layers override earlier):
   * 1. Boilerplate files (only for first artifact v0) - provides base config
   * 2. Existing artifact files (for subsequent versions) - preserves prior work
   * 3. Newly generated files - AI-generated code takes highest priority
   *
   * @param streamingMessageId - ID of the streaming message to finalize (or null to create new)
   * @param content - Final text content from the AI response
   * @param newFiles - Map of file paths to content generated in this stream
   * @param description - Description for the artifact (truncated to 100 chars)
   */
  const saveResults = useCallback(
    async (
      streamingMessageId: Id<'chatMessages'> | null,
      content: string,
      newFiles: Map<string, string>,
      description: string,
    ) => {
      // Check if this is the first artifact (no existing version)
      const isFirstArtifact = !latestArtifact || latestArtifact.version === undefined;

      console.log('[saveResults] Saving results:', {
        contentLength: content?.length,
        newFilesCount: newFiles.size,
        existingFilesCount: latestArtifact?.files ? Object.keys(latestArtifact.files as object).length : 0,
        isFirstArtifact,
      });

      // Build merged file set using layered override strategy
      const mergedFiles = new Map<string, string>();

      // Layer 1: For first artifact, start with React+Vite boilerplate as base
      // This ensures generated code has all necessary config files (package.json, vite.config, etc.)
      if (isFirstArtifact) {
        const boilerplate = getReactViteBoilerplate();
        Object.entries(boilerplate).forEach(([path, fileContent]) => {
          mergedFiles.set(path, fileContent);
        });
        console.log('[saveResults] Applied boilerplate as base for v0:', Object.keys(boilerplate).length, 'files');
      }

      // Layer 2: Overlay existing artifact files (preserves user's prior work)
      if (latestArtifact?.files) {
        const existingFiles = latestArtifact.files as Record<string, string>;
        Object.entries(existingFiles).forEach(([path, fileContent]) => {
          mergedFiles.set(path, fileContent as string);
        });
      }

      // Layer 3: Overlay newly generated files (AI output takes highest priority)
      newFiles.forEach((fileContent, path) => {
        mergedFiles.set(path, fileContent);
      });

      // Build final message content with file list summary
      const newFileNames = Array.from(newFiles.keys());
      const fullContent = buildFinalMessageContent(content, newFileNames);

      // Finalize the streaming message or create a new assistant message
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
        // Mark streaming message complete even if empty
        await updateStreamingMessage({
          messageId: streamingMessageId,
          content: '',
          isComplete: true,
        });
      }

      // Save merged files as a new artifact version (incremental versioning)
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

  /**
   * Resets debounce state between streaming sessions.
   * Call this before starting a new stream to ensure clean state.
   */
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
