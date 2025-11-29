import Link from '@tiptap/extension-link';
import { EditorContent, type Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect } from 'react';
import { Separator } from '../ui/separator';
import { ImageExtension } from './extensions/image';
import { ImagePlaceholder } from './extensions/image-placeholder';

import TextStyle from '@tiptap/extension-text-style';
import { FontSize } from './extensions/font-size';
import { BlockquoteToolbar } from './toolbars/blockquote';
import { BoldToolbar } from './toolbars/bold';
import { BulletListToolbar } from './toolbars/bullet-list';
import { CodeToolbar } from './toolbars/code';
import { CodeBlockToolbar } from './toolbars/code-block';
import { FontSizeToolbar } from './toolbars/font-size';
import { HardBreakToolbar } from './toolbars/hard-break';
import { HorizontalRuleToolbar } from './toolbars/horizontal-rule';
import { ImageUploadToolbar } from './toolbars/image-upload-toolbar';
import { ItalicToolbar } from './toolbars/italic';
import { LinkToolbar } from './toolbars/link';
import { OrderedListToolbar } from './toolbars/ordered-list';
import { RedoToolbar } from './toolbars/redo';
import { StrikeThroughToolbar } from './toolbars/strikethrough';
import { ToolbarProvider } from './toolbars/toolbar-provider';
import { UndoToolbar } from './toolbars/undo';

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: { class: 'list-decimal ms-6' },
    },
    bulletList: {
      HTMLAttributes: { class: 'list-disc ms-6' },
    },
    code: {
      HTMLAttributes: {
        class: 'bg-accent text-foreground rounded-md px-1 py-0.5',
      },
    },
    horizontalRule: {
      HTMLAttributes: { class: 'my-2 border-border' },
    },
    codeBlock: {
      HTMLAttributes: {
        class:
          'bg-primary text-primary-foreground p-3 text-sm rounded-md overflow-x-auto',
      },
    },
    heading: {
      levels: [1, 2, 3, 4],
      HTMLAttributes: { class: 'font-bold text-foreground' },
    },
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-border pl-4 italic text-muted-foreground',
      },
    },
  }),
  TextStyle.configure({ mergeNestedSpanStyles: true }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class:
        'text-primary underline underline-offset-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring rounded-sm',
    },
  }),
  ImageExtension,
  ImagePlaceholder,
  FontSize,
];

interface StarterKitExampleProps {
  value: string;
  onChange: (value: string) => void;
}

const StarterKitExample: React.FC<StarterKitExampleProps> = ({
  value,
  onChange,
}) => {
  const editor = useEditor({
    extensions: extensions as Extension[],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border-border bg-card text-foreground relative max-h-[600px] w-full overflow-y-auto rounded-md border pb-3">
      {/* Toolbar */}
      <div className="border-border bg-card/80 supports-[backdrop-filter]:bg-card/60 sticky top-0 z-10 flex w-full items-center justify-between border-b px-2 py-2 backdrop-blur">
        <ToolbarProvider editor={editor}>
          <div className="w-full">
            <div className="flex items-center gap-2">
              <UndoToolbar />
              <RedoToolbar />
              <BulletListToolbar />
              <OrderedListToolbar />
              <CodeToolbar />
              <CodeBlockToolbar />
              <HorizontalRuleToolbar />
              <BlockquoteToolbar />
              <HardBreakToolbar />
              <LinkToolbar />
              <ImageUploadToolbar />
            </div>
            <Separator className="mt-2" />
            <div className="mt-2 flex items-center gap-2">
              <FontSizeToolbar />
              <BoldToolbar />
              <ItalicToolbar />
              <StrikeThroughToolbar />
            </div>
          </div>
        </ToolbarProvider>
      </div>

      {/* Editor area */}
      <div
        onClick={() => editor?.chain().focus().run()}
        className="min-h-72 cursor-text"
      >
        <EditorContent
          editor={editor}
          className="prose prose-zinc dark:prose-invert [&_hr]:border-border [&_a]:text-primary max-w-none p-4 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default StarterKitExample;
