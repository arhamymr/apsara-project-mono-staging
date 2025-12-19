'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Search, Trash2, Loader2 } from 'lucide-react';
import { formatWhen, type NoteId, type Note } from '../types';

interface NotesSidebarProps {
  notes: Note[] | undefined;
  filteredNotes: Note[] | undefined;
  selectedId: NoteId | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: NoteId) => void;
  onDeleteNote: (id: NoteId) => void;
}

export function NotesSidebar({
  notes,
  filteredNotes,
  selectedId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onDeleteNote,
}: NotesSidebarProps) {
  return (
    <aside className="flex flex-col space-y-3">
      <p className="text-muted-foreground text-xs">
        Your personal notes, synced across devices.
      </p>

      <div className="relative">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes..."
          className="pl-9"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-2">
          {!notes ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : filteredNotes?.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </div>
          ) : (
            filteredNotes?.map((note) => (
              <div
                key={note._id}
                onClick={() => onSelectNote(note._id)}
                className={`group cursor-pointer rounded-md border p-3 transition-colors ${
                  selectedId === note._id
                    ? 'bg-accent border-primary'
                    : 'hover:bg-accent/50 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{note.title || 'Untitled'}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatWhen(note.updatedAt)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
