'use client';

import { Button } from '@workspace/ui/components/button';
import { FileText, Plus, Loader2 } from 'lucide-react';
import type { NoteId } from '../types';

interface NotesHeaderProps {
  selectedId: NoteId | null;
  isCreating: boolean;
  isSaving: boolean;
  onCreateNote: () => void;
  onSave: () => void;
}

export function NotesHeader({
  selectedId,
  isCreating,
  isSaving,
  onCreateNote,
  onSave,
}: NotesHeaderProps) {
  return (
    <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5" />
        <h2 className="text-base font-semibold">Notes</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onCreateNote} disabled={isCreating}>
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Note
        </Button>
        {selectedId && (
          <Button size="sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
}
