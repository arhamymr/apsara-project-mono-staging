'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';
import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { nodesLite } from './nodes-lite';
import { PluginsLite } from './plugins-lite';
import { useMemo } from 'react';

const editorConfig: InitialConfigType = {
  namespace: 'EditorLite',
  theme: editorTheme,
  nodes: nodesLite,
  onError: (error: Error) => {
    console.error(error);
  },
};

// Check if serialized state has valid content
function isValidEditorState(state?: SerializedEditorState): boolean {
  if (!state) return false;
  if (!state.root) return false;
  if (!state.root.children || state.root.children.length === 0) return false;
  return true;
}

interface EditorLiteProps {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  placeholder?: string;
}

export function EditorLite({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  placeholder = 'Start writing...',
}: EditorLiteProps) {
  // Memoize the initial config to prevent unnecessary re-renders
  const initialConfig = useMemo(() => {
    const config = { ...editorConfig };
    
    if (editorState) {
      return { ...config, editorState };
    }
    
    // Only use serialized state if it's valid (has non-empty root)
    if (isValidEditorState(editorSerializedState)) {
      return { ...config, editorState: JSON.stringify(editorSerializedState) };
    }
    
    // Return config without editorState - Lexical will create default empty state
    return config;
  }, [editorState, editorSerializedState]);

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden rounded-lg border shadow">
      <LexicalComposer initialConfig={initialConfig}>
        <TooltipProvider>
          <PluginsLite placeholder={placeholder} />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
