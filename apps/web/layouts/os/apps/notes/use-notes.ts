'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { SerializedEditorState } from 'lexical';
import { initialEditorState, type NoteId } from './types';

export function useNotes() {
  const notes = useQuery(api.notes.list, { limit: 100 });
  const createNote = useMutation(api.notes.create);
  const updateNote = useMutation(api.notes.update);
  const deleteNote = useMutation(api.notes.remove);

  const [selectedId, setSelectedId] = useState<NoteId | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<SerializedEditorState>(initialEditorState);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const selectedNote = notes?.find((n) => n._id === selectedId);

  // Load note content when selection changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      try {
        setContent(JSON.parse(selectedNote.content));
      } catch {
        setContent(initialEditorState);
      }
    }
  }, [selectedNote]);

  // Filter notes by search
  const filteredNotes = notes?.filter((note) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return note.title.toLowerCase().includes(q);
  });

  const handleCreate = useCallback(async () => {
    if (isCreating) return;
    setIsCreating(true);

    try {
      const id = await createNote({
        title: 'Untitled',
        content: JSON.stringify(initialEditorState),
      });
      setSelectedId(id);
      setTitle('Untitled');
      setContent(initialEditorState);
      toast.success('Note created');
    } catch {
      toast.error('Failed to create note');
    } finally {
      setIsCreating(false);
    }
  }, [createNote, isCreating]);

  const handleSave = useCallback(async () => {
    if (!selectedId || isSaving) return;
    setIsSaving(true);

    try {
      await updateNote({
        id: selectedId,
        title: title.trim() || 'Untitled',
        content: JSON.stringify(content),
      });
      toast.success('Note saved');
    } catch {
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  }, [selectedId, title, content, updateNote, isSaving]);

  const handleDelete = useCallback(
    async (id: NoteId) => {
      try {
        await deleteNote({ id });
        if (selectedId === id) {
          setSelectedId(null);
          setTitle('');
          setContent(initialEditorState);
        }
        toast.success('Note deleted');
      } catch {
        toast.error('Failed to delete note');
      }
    },
    [deleteNote, selectedId]
  );

  const selectNote = (id: NoteId) => {
    setSelectedId(id);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
      if (mod && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleCreate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleSave, handleCreate]);

  return {
    notes,
    filteredNotes,
    selectedId,
    selectedNote,
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
  };
}
