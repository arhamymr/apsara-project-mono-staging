'use client';

import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, SerializedEditorState } from 'lexical';
import { editorTheme } from '@/components/editor/themes/editor-theme';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { nodesLite } from './nodes-lite';
import { PluginsLite } from './plugins-lite';

const editorConfig: InitialConfigType = {
  namespace: 'EditorLite',
  theme: editorTheme,
  nodes: nodesLite,
  onError: (error: Error) => {
    console.error(error);
  },
};

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
  return (
    <div className="bg-background flex h-full flex-col overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
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
