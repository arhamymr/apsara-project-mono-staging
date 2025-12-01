/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Plate, usePlateEditor } from 'platejs/react';
import { createContext, useContext } from 'react';

import { EditorKit } from '@/components/editor/editor-kit';
import { SettingsDialog } from '@/components/editor/settings-dialog';
import { Editor, EditorContainer } from '@workspace/ui/components/editor';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { normalizeNodeId } from 'platejs';

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
    plugins: EditorKit,
    value: normalizeNodeId([]),
  });

  const portalRef = useWindowPortalContainer();
  const portalContainer = portalRef?.current ?? undefined;

  // editor.onChange = () => {
  //   const { value } = editor;
  //   onChange?.(value);
  // };

  return (
    <EditorPortalContext.Provider value={portalContainer}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant="fullWidth" />
        </EditorContainer>
        <SettingsDialog />
      </Plate>
    </EditorPortalContext.Provider>
  );
}
