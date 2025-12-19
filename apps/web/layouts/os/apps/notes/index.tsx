'use client';

import { useNotes } from './use-notes';
import { NotesHeader } from './components/notes-header';
import { NotesSidebar } from './components/notes-sidebar';
import { NoteEditor } from './components/note-editor';

export default function NotesApp() {
  const {
    notes,
    filteredNotes,
    selectedId,
    title,
    setTitle,
    content,
    setContent,
    searchQuery,
    setSearchQuery,
    isSaving,
    isCreating,
    handleCreate,
    handleSave,
    handleDelete,
    selectNote,
  } = useNotes();

  return (
    <div className="text-foreground flex h-full flex-col">
      <NotesHeader
        selectedId={selectedId}
        selectedTitle={title}
        isCreating={isCreating}
        isSaving={isSaving}
        onCreateNote={handleCreate}
        onSave={handleSave}
      />

      <div className="flex-1 overflow-auto p-4">
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-3">
          <NotesSidebar
            notes={notes}
            filteredNotes={filteredNotes}
            selectedId={selectedId}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectNote={selectNote}
            onDeleteNote={handleDelete}
          />

          <div className="relative md:col-span-2">
            <NoteEditor
              selectedId={selectedId}
              title={title}
              content={content}
              isCreating={isCreating}
              onTitleChange={setTitle}
              onContentChange={setContent}
              onCreateNote={handleCreate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
