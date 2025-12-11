'use client';

import { useState, useRef, useCallback } from 'react';
import type { Id } from '@/convex/_generated/dataModel';
import type { ActivityLogEntry, PendingMessage, StreamingRefs } from './types';

export function useStreamingState() {
  // UI Input
  const [inputMessage, setInputMessage] = useState('');

  // Streaming status
  const [isStreaming, setIsStreaming] = useState(false);

  // Real-time streaming content
  const [streamingContent, setStreamingContent] = useState('');
  const [reasoningContent, setReasoningContent] = useState('');
  const [currentToolCall, setCurrentToolCall] = useState<string | null>(null);
  const [toolCallArgs, setToolCallArgs] = useState<Map<string, string>>(new Map());
  const [createdFiles, setCreatedFiles] = useState<string[]>([]);
  const [streamingFiles, setStreamingFiles] = useState<Map<string, string>>(new Map());
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  // Activity log
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

  // Pending message (shown after streaming ends but before Convex updates)
  const [pendingMessage, setPendingMessage] = useState<PendingMessage | null>(null);

  // Refs for streaming message tracking
  const streamingMessageIdRef = useRef<Id<'chatMessages'> | null>(null);
  const lastSavedContentRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to add activity log entry
  const addActivity = useCallback(
    (
      type: ActivityLogEntry['type'],
      message: string,
      filePath?: string,
    ) => {
      setActivityLog((prev) => {
        // For thinking type, update existing entry instead of creating new ones
        if (type === 'thinking') {
          const existingThinkingIndex = prev.findIndex((item) => item.type === 'thinking');
          if (existingThinkingIndex >= 0 && prev[existingThinkingIndex]) {
            // Update existing thinking entry
            const updated = [...prev];
            const existing = prev[existingThinkingIndex]!;
            updated[existingThinkingIndex] = {
              id: existing.id,
              type: existing.type,
              message,
              timestamp: new Date(),
              filePath: existing.filePath,
            };
            return updated;
          }
        }
        
        // Add new entry
        return [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            type,
            message,
            timestamp: new Date(),
            filePath,
          },
        ];
      });
    },
    [],
  );

  // Reset all streaming state
  const resetStreamState = useCallback(() => {
    setIsStreaming(false);
    setStreamingContent('');
    setReasoningContent('');
    setCurrentToolCall(null);
    setToolCallArgs(new Map());
    setCreatedFiles([]);
    setStreamingFiles(new Map());
    setActivityLog([]);
    setLoadingFile(null);
    streamingMessageIdRef.current = null;
    lastSavedContentRef.current = '';
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  // Initialize streaming state for new message
  const initStreamState = useCallback(() => {
    setStreamingContent('');
    setReasoningContent('');
    setCurrentToolCall(null);
    setToolCallArgs(new Map());
    setCreatedFiles([]);
    setStreamingFiles(new Map());
    setIsStreaming(true);
  }, []);

  const refs: StreamingRefs = {
    get streamingMessageId() { return streamingMessageIdRef.current; },
    set streamingMessageId(val) { streamingMessageIdRef.current = val; },
    get lastSavedContent() { return lastSavedContentRef.current; },
    set lastSavedContent(val) { lastSavedContentRef.current = val; },
    get saveTimeout() { return saveTimeoutRef.current; },
    set saveTimeout(val) { saveTimeoutRef.current = val; },
  };

  return {
    // State
    inputMessage,
    setInputMessage,
    isStreaming,
    setIsStreaming,
    streamingContent,
    setStreamingContent,
    reasoningContent,
    setReasoningContent,
    currentToolCall,
    setCurrentToolCall,
    toolCallArgs,
    setToolCallArgs,
    createdFiles,
    setCreatedFiles,
    streamingFiles,
    setStreamingFiles,
    loadingFile,
    setLoadingFile,
    activityLog,
    pendingMessage,
    setPendingMessage,

    // Refs
    refs,

    // Actions
    addActivity,
    resetStreamState,
    initStreamState,
  };
}
