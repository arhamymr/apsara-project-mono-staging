'use client';

import { useState, useRef, useCallback } from 'react';

export function useStreamState() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [reasoningContent, setReasoningContent] = useState('');
  const [generatedFiles, setGeneratedFiles] = useState<Map<string, string>>(new Map());
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const resetState = useCallback(() => {
    setStreamingContent('');
    setReasoningContent('');
    setGeneratedFiles(new Map());
    setCurrentRunId(null);
  }, []);

  const startStreaming = useCallback(() => {
    setIsStreaming(true);
    resetState();
  }, [resetState]);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    resetState();
    abortControllerRef.current = null;
  }, [resetState]);

  const createAbortController = useCallback(() => {
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current;
  }, []);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    // State
    isStreaming,
    streamingContent,
    reasoningContent,
    generatedFiles,
    currentRunId,

    // Setters
    setStreamingContent,
    setReasoningContent,
    setGeneratedFiles,
    setCurrentRunId,

    // Actions
    startStreaming,
    stopStreaming,
    createAbortController,
    cancelStream,
  };
}
