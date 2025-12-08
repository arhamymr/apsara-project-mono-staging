/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Plate, PlateContent, usePlateEditor } from 'platejs/react';
import { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

// Create context for portal container
const EditorPortalContext = createContext<HTMLElement | undefined>(undefined);

export function useEditorPortalContainer() {
  return useContext(EditorPortalContext);
}

export function PlateEditor({
  value,
  onChange,
}: {
  value: any;
  onChange?: (val: any) => void;
}) {
  const editor = usePlateEditor({
    value: value || [{ type: 'p', children: [{ text: '' }] }],
  });

  // Handle onChange manually
  if (onChange && editor) {
    editor.onChange = onChange;
  }

  return (
    <EditorPortalContext.Provider value={undefined}>
      <Plate editor={editor}>
        <div
          className={cn(
            'relative w-full overflow-x-auto',
            '[&_.slate-SelectionArea]:border [&_.slate-SelectionArea]:border-primary [&_.slate-SelectionArea]:bg-primary/10'
          )}
        >
          <PlateContent
            className="min-h-[500px] w-full p-4 focus:outline-none"
            placeholder="Start writing your article..."
          />
        </div>
      </Plate>
    </EditorPortalContext.Provider>
  );
}
