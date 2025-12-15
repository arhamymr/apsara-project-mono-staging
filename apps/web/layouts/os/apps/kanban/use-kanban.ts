'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { BoardId, ColumnId, KanbanCard, KanbanColumn, Priority } from './types';

export function useKanban() {
  const boards = useQuery(api.kanban.listBoards, {});
  const [selectedBoardId, setSelectedBoardId] = useState<BoardId | null>(null);
  const board = useQuery(api.kanban.getBoard, selectedBoardId ? { id: selectedBoardId } : 'skip');

  // Mutations
  const createBoardMutation = useMutation(api.kanban.createBoard);
  const updateBoardMutation = useMutation(api.kanban.updateBoard);
  const deleteBoardMutation = useMutation(api.kanban.deleteBoard);
  const createColumnMutation = useMutation(api.kanban.createColumn);
  const updateColumnMutation = useMutation(api.kanban.updateColumn);
  const deleteColumnMutation = useMutation(api.kanban.deleteColumn);
  const reorderColumnsMutation = useMutation(api.kanban.reorderColumns);
  const createCardMutation = useMutation(api.kanban.createCard);
  const updateCardMutation = useMutation(api.kanban.updateCard);
  const deleteCardMutation = useMutation(api.kanban.deleteCard);
  const moveCardMutation = useMutation(api.kanban.moveCard);

  // Loading states
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  // Modal states
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<KanbanCard | null>(null);
  const [editingColumn, setEditingColumn] = useState<KanbanColumn | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<ColumnId | null>(null);

  // Board actions
  const handleCreateBoard = useCallback(async (name: string) => {
    if (isCreatingBoard) return;
    setIsCreatingBoard(true);
    try {
      const id = await createBoardMutation({ name });
      setSelectedBoardId(id);
      toast.success('Board created');
    } catch {
      toast.error('Failed to create board');
    } finally {
      setIsCreatingBoard(false);
    }
  }, [createBoardMutation, isCreatingBoard]);

  const handleUpdateBoard = useCallback(async (id: BoardId, name: string) => {
    try {
      await updateBoardMutation({ id, name });
      toast.success('Board updated');
    } catch {
      toast.error('Failed to update board');
    }
  }, [updateBoardMutation]);

  const handleDeleteBoard = useCallback(async (id: BoardId) => {
    try {
      await deleteBoardMutation({ id });
      if (selectedBoardId === id) setSelectedBoardId(null);
      toast.success('Board deleted');
    } catch {
      toast.error('Failed to delete board');
    }
  }, [deleteBoardMutation, selectedBoardId]);

  // Column actions
  const handleCreateColumn = useCallback(async (name: string) => {
    if (!selectedBoardId || isCreatingColumn) return;
    setIsCreatingColumn(true);
    try {
      await createColumnMutation({ boardId: selectedBoardId, name });
      setColumnModalOpen(false);
      toast.success('Column created');
    } catch {
      toast.error('Failed to create column');
    } finally {
      setIsCreatingColumn(false);
    }
  }, [createColumnMutation, selectedBoardId, isCreatingColumn]);

  const handleUpdateColumn = useCallback(async (id: ColumnId, name: string) => {
    try {
      await updateColumnMutation({ id, name });
      setColumnModalOpen(false);
      setEditingColumn(null);
      toast.success('Column updated');
    } catch {
      toast.error('Failed to update column');
    }
  }, [updateColumnMutation]);

  const handleDeleteColumn = useCallback(async (id: ColumnId) => {
    try {
      await deleteColumnMutation({ id });
      toast.success('Column deleted');
    } catch {
      toast.error('Failed to delete column');
    }
  }, [deleteColumnMutation]);

  const handleReorderColumns = useCallback(async (
    columnPositions: Array<{ id: ColumnId; position: number }>
  ) => {
    if (!selectedBoardId) return;
    try {
      await reorderColumnsMutation({ boardId: selectedBoardId, columnPositions });
    } catch {
      toast.error('Failed to reorder columns');
    }
  }, [reorderColumnsMutation, selectedBoardId]);

  // Card actions
  const handleCreateCard = useCallback(async (columnId: ColumnId, title: string, priority: Priority = 'medium') => {
    if (isCreatingCard) return;
    setIsCreatingCard(true);
    try {
      await createCardMutation({ columnId, title, priority });
      setCardModalOpen(false);
      toast.success('Card created');
    } catch {
      toast.error('Failed to create card');
    } finally {
      setIsCreatingCard(false);
    }
  }, [createCardMutation, isCreatingCard]);

  const handleUpdateCard = useCallback(async (
    id: Parameters<typeof updateCardMutation>[0]['id'],
    data: Omit<Parameters<typeof updateCardMutation>[0], 'id'>
  ) => {
    try {
      await updateCardMutation({ id, ...data });
      setCardModalOpen(false);
      setEditingCard(null);
      toast.success('Card updated');
    } catch {
      toast.error('Failed to update card');
    }
  }, [updateCardMutation]);

  const handleDeleteCard = useCallback(async (id: Parameters<typeof deleteCardMutation>[0]['id']) => {
    try {
      await deleteCardMutation({ id });
      setCardModalOpen(false);
      setEditingCard(null);
      toast.success('Card deleted');
    } catch {
      toast.error('Failed to delete card');
    }
  }, [deleteCardMutation]);

  const handleMoveCard = useCallback(async (
    cardId: Parameters<typeof moveCardMutation>[0]['cardId'],
    targetColumnId: ColumnId,
    targetPosition: number
  ) => {
    try {
      await moveCardMutation({ cardId, targetColumnId, targetPosition });
    } catch {
      toast.error('Failed to move card');
    }
  }, [moveCardMutation]);

  // Modal helpers
  const openCreateCard = (columnId: ColumnId) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setCardModalOpen(true);
  };

  const openEditCard = (card: KanbanCard) => {
    setEditingCard(card);
    setActiveColumnId(card.columnId);
    setCardModalOpen(true);
  };

  const openCreateColumn = () => {
    setEditingColumn(null);
    setColumnModalOpen(true);
  };

  const openEditColumn = (column: KanbanColumn) => {
    setEditingColumn(column);
    setColumnModalOpen(true);
  };

  return {
    // Data
    boards,
    board,
    selectedBoardId,
    // Loading states
    isCreatingBoard,
    isCreatingColumn,
    isCreatingCard,
    // Modal states
    cardModalOpen,
    columnModalOpen,
    editingCard,
    editingColumn,
    activeColumnId,
    // Setters
    setSelectedBoardId,
    setCardModalOpen,
    setColumnModalOpen,
    // Board actions
    handleCreateBoard,
    handleUpdateBoard,
    handleDeleteBoard,
    // Column actions
    handleCreateColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleReorderColumns,
    // Card actions
    handleCreateCard,
    handleUpdateCard,
    handleDeleteCard,
    handleMoveCard,
    // Modal helpers
    openCreateCard,
    openEditCard,
    openCreateColumn,
    openEditColumn,
  };
}
