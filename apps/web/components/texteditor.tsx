import type { Value } from 'platejs';

import { Plate, usePlateEditor } from 'platejs/react';

import { Editor, EditorContainer } from '@workspace/ui/components/editor';
import { FixedToolbar } from '@workspace/ui/components/fixed-toolbar';
import { MarkToolbarButton } from '@workspace/ui/components/mark-toolbar-button';

import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { ToolbarButton } from '@workspace/ui/components/toolbar';
import { AIKit } from './editor/plugins/ai-kit';
import { AIToolbarButton } from './ui/ai-toolbar-button';

const initialValue: Value = [
  {
    children: [{ text: 'Title' }],
    type: 'h3',
  },
  {
    children: [{ text: 'This is a quote.' }],
    type: 'blockquote',
  },
  {
    children: [
      { text: 'With some ' },
      { bold: true, text: 'bold' },
      { text: ' text for emphasis!' },
    ],
    type: 'p',
  },
];

export default function App() {
  const editor = usePlateEditor({
    plugins: [...BasicBlocksKit, ...AIKit],
    value: () => {
      const savedValue = localStorage.getItem('installation-react-demo');
      return savedValue ? JSON.parse(savedValue) : initialValue;
    },
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Plate
        editor={editor}
        onChange={({ value }) => {
          localStorage.setItem(
            'installation-react-demo',
            JSON.stringify(value),
          );
        }}
      >
        <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
          <AIToolbarButton>AI Assistant</AIToolbarButton>
          <ToolbarButton onClick={() => editor.tf.h1.toggle()}>
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.tf.h2.toggle()}>
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.tf.h3.toggle()}>
            H3
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>
            Quote
          </ToolbarButton>
          <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
            B
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
            I
          </MarkToolbarButton>
          <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
            U
          </MarkToolbarButton>
          <div className="flex-1" />
          <ToolbarButton
            className="px-2"
            onClick={() => editor.tf.setValue(initialValue)}
          >
            Reset
          </ToolbarButton>
        </FixedToolbar>
        <EditorContainer>
          <Editor placeholder="Type your amazing content here..." />
        </EditorContainer>
      </Plate>
    </div>
  );
}
