'use client';

import type { Id } from '@/convex/_generated/dataModel';
import type { StreamCallbacks } from '../../types/stream-types';
import type { ActivityLogEntry } from './types';
import { buildStreamingMessageContent } from './message-builder';

interface CallbackDeps {
  addActivity: (type: ActivityLogEntry['type'], message: string, filePath?: string) => void;
  setStreamingContent: (content: string) => void;
  setReasoningContent: (content: string) => void;
  setCurrentToolCall: (tool: string | null) => void;
  setToolCallArgs: (args: Map<string, string>) => void;
  setCreatedFiles: React.Dispatch<React.SetStateAction<string[]>>;
  setStreamingFiles: React.Dispatch<React.SetStateAction<Map<string, string>>>;
  setLoadingFile: (file: string | null) => void;
  debouncedSave: (messageId: Id<'chatMessages'>, content: string) => void;
  getStreamingMessageId: () => Id<'chatMessages'> | null;
  getCurrentState: () => {
    streamingContent: string;
    currentToolCall: string | null;
    createdFiles: string[];
    reasoningContent: string;
  };
}

export function createStreamCallbacks(deps: CallbackDeps): StreamCallbacks {
  const {
    addActivity,
    setStreamingContent,
    setReasoningContent,
    setCurrentToolCall,
    setToolCallArgs,
    setCreatedFiles,
    setStreamingFiles,
    setLoadingFile,
    debouncedSave,
    getStreamingMessageId,
    getCurrentState,
  } = deps;

  const saveToConvex = (content: string) => {
    const msgId = getStreamingMessageId();
    if (msgId) {
      debouncedSave(msgId, content);
    }
  };

  return {
    onTextDelta: (content) => {
      console.log('[Stream] Text delta:', content.slice(-50));
      setStreamingContent(content);

      const state = getCurrentState();
      const richContent = buildStreamingMessageContent(
        content,
        state.currentToolCall,
        state.createdFiles,
        state.reasoningContent,
      );
      saveToConvex(richContent);
    },

    onToolCall: (toolName) => {
      console.log('[Stream] Tool call:', toolName);
      setCurrentToolCall(toolName);
      if (toolName) {
        addActivity('tool-start', `Running ${toolName}...`);

        const state = getCurrentState();
        const richContent = buildStreamingMessageContent(
          state.streamingContent,
          `Running ${toolName}...`,
          state.createdFiles,
          state.reasoningContent,
        );
        saveToConvex(richContent);
      }
      if (!toolName) {
        setLoadingFile(null);
      }
    },

    onToolArgs: (args) => {
      console.log('[Stream] Tool args:', Object.fromEntries(args));
      setToolCallArgs(args);

      args.forEach((argsJson) => {
        try {
          const parsed = JSON.parse(argsJson);
          if (parsed.filePath) {
            setLoadingFile(parsed.filePath);
          }
        } catch {
          // Args still streaming
        }
      });
    },

    onReasoning: (reasoning) => {
      console.log('[Stream] Reasoning:', reasoning.slice(-50));
      setReasoningContent(reasoning);
      
      // Add thinking to activity log (will be shown in collapsible accordion)
      // Only add once when reasoning starts, then update the same entry
      addActivity('thinking', reasoning);

      const state = getCurrentState();
      const richContent = buildStreamingMessageContent(
        state.streamingContent,
        state.currentToolCall,
        state.createdFiles,
        reasoning,
      );
      saveToConvex(richContent);
    },

    onFileCreated: (files) => {
      console.log('[Stream] Files created:', files);
      setCreatedFiles((currentFiles) => {
        const newFiles = files.filter((f) => !currentFiles.includes(f));
        newFiles.forEach((file) => {
          addActivity('file-created', `Created ${file}`, file);
        });
        return files;
      });
    },

    onFileContent: (filePath: string, content: string) => {
      console.log('[Stream] File content received:', filePath);
      setStreamingFiles((prev) => new Map(prev).set(filePath, content));
    },

    onSessionStart: (streamSessionId: string) => {
      console.log('[Stream] Session start:', streamSessionId);
    },

    onFileStart: (fileId: string, path: string, fileName: string) => {
      console.log('[Stream] File start:', fileId, path, fileName);
      setLoadingFile(path);
      addActivity('tool-start', `Creating ${fileName}...`, path);

      const state = getCurrentState();
      const richContent = buildStreamingMessageContent(
        state.streamingContent,
        `Creating ${fileName}...`,
        state.createdFiles,
        state.reasoningContent,
      );
      saveToConvex(richContent);
    },

    onFileChunk: (fileId: string, _chunk: string, chunkIndex: number, accumulated: string) => {
      console.log('[Stream] File chunk:', fileId, 'index:', chunkIndex, accumulated.length, 'chars total');
    },

    onFileEnd: (fileId: string, path: string, finalContent: string) => {
      console.log('[Stream] File end:', fileId, path, finalContent.length, 'chars');
      setLoadingFile(null);
      setStreamingFiles((prev) => new Map(prev).set(path, finalContent));

      setCreatedFiles((prev) => {
        const updatedFiles = [...prev];
        if (!updatedFiles.includes(path)) {
          updatedFiles.push(path);
        }
        addActivity('file-created', `Created ${path}`, path);

        const state = getCurrentState();
        const richContent = buildStreamingMessageContent(
          state.streamingContent,
          null,
          updatedFiles,
          state.reasoningContent,
        );
        saveToConvex(richContent);

        return updatedFiles;
      });
    },

    onFileUrl: (fileId: string, path: string, url: string, expiresAt: string) => {
      console.log('[Stream] File URL:', fileId, path, url.slice(0, 50), 'expires:', expiresAt);
    },

    onFileError: (fileId: string, error: string) => {
      console.error('[Stream] File error:', fileId, error);
      setLoadingFile(null);
    },

    onStreamingDone: (streamSessionId: string) => {
      console.log('[Stream] Streaming done:', streamSessionId);
    },

    onStreamingError: (error: string) => {
      console.error('[Stream] Streaming error:', error);
    },
  };
}
