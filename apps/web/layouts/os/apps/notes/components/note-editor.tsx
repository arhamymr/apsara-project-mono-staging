'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { FileText, Plus } from 'lucide-react';
import { EditorLite } from '@/components/blocks/editor-lite';
import type { SerializedEditorState } from 'lexical';
import type { NoteId } from '../types';
import { useCallback, useRef } from 'react';

interface NoteEditorProps {
  selectedId: NoteId | null;
  title: string;
  content: SerializedEditorState;
  isCreating: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: SerializedEditorState) => void;
  onCreateNote: () => void;
}

export function NoteEditor({
  selectedId,
  title,
  content,
  isCreating,
  onTitleChange,
  onContentChange,
  onCreateNote,
}: NoteEditorProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce content changes to reduce serialization overhead
  const handleContentChange = useCallback(
    (newContent: SerializedEditorState) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onContentChange(newContent);
      }, 300);
    },
    [onContentChange]
  );

  if (!selectedId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <FileText className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <p className="text-muted-foreground text-lg">No note selected</p>
          <p className="text-muted-foreground mt-1 text-sm">Select a note or create a new one</p>
          <Button className="mt-4" onClick={onCreateNote} disabled={isCreating}>
            <Plus className="mr-2 h-4 w-4" />
            Create Note
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <label className="text-xs">Title</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Note title"
          className="text-lg font-semibold"
        />
      </div>

      <div className="min-h-0 flex-1">
        <EditorLite editorSerializedState={content} onSerializedChange={handleContentChange} />
      </div>
    </div>
  );
}
