import type { Value } from 'platejs';

import { Plate, usePlateEditor } from 'platejs/react';

import { Button } from '@workspace/ui/components/button';
import { BasicBlocksKit } from '@/components/editor/plugins/basic-blocks-kit';
import { AIKit } from './editor/plugins/ai-kit';
import { cn } from '@/lib/utils';

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
        <div className="flex justify-start gap-1 rounded-t-lg border-b p-2">
          <Button variant="ghost" size="sm" onClick={() => editor.tf.h1.toggle()}>
            H1
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.tf.h2.toggle()}>
            H2
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.tf.h3.toggle()}>
            H3
          </Button>
          <Button variant="ghost" size="sm" onClick={() => editor.tf.blockquote.toggle()}>
            Quote
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.tf.setValue(initialValue)}
          >
            Reset
          </Button>
        </div>
        <div className="p-4">
          <div
            className={cn(
              'relative w-full overflow-x-auto',
              '[&_.slate-SelectionArea]:border [&_.slate-SelectionArea]:border-primary [&_.slate-SelectionArea]:bg-primary/10'
            )}
          >
            <div className="min-h-[200px] w-full" />
          </div>
        </div>
      </Plate>
    </div>
  );
}
