'use client';

import { Button } from '@workspace/ui/components/button';
import {
  useBoard,
  useBoards,
  useCreateBoard,
  useDeleteColumn,
  useMoveCard,
  useReorderColumns,
} from '@/hooks/useKanban';
import type { Card, Column } from '@/types/kanban';
import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { CardModal } from './kanban/CardModal';
import { ColumnModal } from './kanban/ColumnModal';
import { KanbanBoard } from './kanban/KanbanBoard';

export default function KanbanApp() {
  // const { openSubWindow, activeId, closeWindow } = useWindowContext();
  const [selectedBoardId, setSelectedBoardId] = React.useState<number | null>(
    null,
  );
  const [isColumnModalOpen, setIsColumnModalOpen] = React.useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const [editingCard, setEditingCard] = React.useState<Card | null>(null);
  const [editingColumn, setEditingColumn] = React.useState<Column | null>(null);
  const [creatingCardColumnId, setCreatingCardColumnId] = React.useState<
    number | null
  >(null);

  const {
    data: boards,
    isLoading: isLoadingBoards,
    error: boardsError,
  } = useBoards();
  const {
    data: boardData,
    isLoading: isLoadingBoard,
    error: boardError,
  } = useBoard(selectedBoardId);
  const createBoard = useCreateBoard();
  const moveCard = useMoveCard();
  const reorderColumns = useReorderColumns();
  const deleteColumn = useDeleteColumn();

  // Auto-select first board or create one if none exist
  React.useEffect(() => {
    if (!isLoadingBoards && boards) {
      const firstBoard = boards[0];
      if (boards.length > 0 && !selectedBoardId && firstBoard) {
        setSelectedBoardId(firstBoard.id);
      } else if (boards.length === 0) {
        // Auto-create a default board
        createBoard.mutate(
          { name: 'My Board' },
          {
            onSuccess: (newBoard) => {
              setSelectedBoardId(newBoard.data.id);
              toast.success('Board created');
            },
            onError: (error) => {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Failed to create board',
              );
            },
          },
        );
      }
    }
  }, [isLoadingBoards, boards, selectedBoardId, createBoard]);

  // Use detailed board data if available, otherwise fall back to boards list
  const selectedBoard = React.useMemo(() => {
    if (boardData) {
      return boardData;
    }
    return boards?.find((b) => b.id === selectedBoardId);
  }, [boardData, boards, selectedBoardId]);

  // Show error toast if there's an error
  React.useEffect(() => {
    if (boardsError) {
      toast.error('Failed to load boards');
    }
    if (boardError) {
      toast.error('Failed to load board details');
    }
  }, [boardsError, boardError]);

  const handleDeleteColumn = async (columnId: number) => {
    if (!selectedBoardId) return;

    const column = selectedBoard?.columns?.find((c) => c.id === columnId);
    const hasCards = column?.cards && column.cards.length > 0;

    if (hasCards) {
      const confirmed = window.confirm(
        'This column has cards. Deleting it will also delete all cards. Continue?',
      );
      if (!confirmed) return;
    }

    try {
      await deleteColumn.mutateAsync({
        id: columnId,
        boardId: selectedBoardId,
      });
      toast.success('Column deleted');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete column',
      );
    }
  };

  const handleMoveCard = async (
    cardId: number,
    targetColumnId: number,
    targetPosition: number,
  ) => {
    if (!selectedBoardId) return;

    try {
      await moveCard.mutateAsync({
        card_id: cardId,
        target_column_id: targetColumnId,
        target_position: targetPosition,
        board_id: selectedBoardId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to move card',
      );
    }
  };

  const handleReorderColumns = async (
    columnPositions: Array<{ id: number; position: number }>,
  ) => {
    if (!selectedBoardId) return;

    try {
      await reorderColumns.mutateAsync({
        column_positions: columnPositions,
        board_id: selectedBoardId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reorder columns',
      );
    }
  };

  const handleCreateCard = (columnId: number) => {
    setCreatingCardColumnId(columnId);
    setEditingCard(null);
    setIsCardModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setCreatingCardColumnId(null);
    setIsCardModalOpen(true);
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setIsColumnModalOpen(true);
  };

  if (isLoadingBoards || (selectedBoardId && isLoadingBoard)) {
    return (
      <div className="from-background via-background to-muted/20 flex h-full flex-col bg-gradient-to-br">
        {/* Loading Header Skeleton */}
        <div className="bg-card/80 sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b px-5 py-3.5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-8 animate-pulse rounded-lg" />
            <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-9 w-28 animate-pulse rounded-md" />
        </div>

        {/* Loading Board Skeleton */}
        <div className="flex h-full overflow-x-auto overflow-y-hidden p-6">
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-muted/40 border-border flex w-80 flex-shrink-0 flex-col rounded-xl border shadow-sm"
              >
                {/* Column Header Skeleton */}
                <div className="border-border flex items-center justify-between border-b p-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="bg-muted h-2 w-2 animate-pulse rounded-full" />
                    <div className="bg-muted h-4 w-24 animate-pulse rounded" />
                    <div className="bg-muted h-5 w-8 animate-pulse rounded-full" />
                  </div>
                </div>

                {/* Cards Skeleton */}
                <div className="flex-1 space-y-2.5 p-3">
                  {[1, 2].map((j) => (
                    <div
                      key={j}
                      className="bg-card border-border rounded-lg border p-3.5"
                    >
                      <div className="bg-muted mb-2 h-4 w-3/4 animate-pulse rounded" />
                      <div className="bg-muted mb-3 h-3 w-full animate-pulse rounded" />
                      <div className="flex items-center justify-between">
                        <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
                        <div className="bg-muted h-6 w-6 animate-pulse rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (boardsError || boardError) {
    return (
      <div className="from-background via-background to-muted/20 flex h-full flex-col bg-gradient-to-br">
        <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
          <div className="max-w-md text-center">
            <div className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <svg
                className="text-destructive h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-destructive mb-2 text-xl font-bold">
              Error Loading Board
            </h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              {boardsError?.message ||
                boardError?.message ||
                'An unexpected error occurred while loading the board.'}
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBoard) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground text-sm">No board available</div>
      </div>
    );
  }

  const hasColumns = selectedBoard.columns && selectedBoard.columns.length > 0;

  return (
    <div className="text-foreground from-background via-background to-muted/20 flex h-full flex-col bg-gradient-to-br">
      {/* Header */}
      <div className="bg-card/80 sticky top-0 z-10 flex w-full items-center justify-between gap-2 border-b px-5 py-3.5 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
            <div className="bg-primary/60 h-4 w-4 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold tracking-tight">
              {selectedBoard.name}
            </h1>
            {hasColumns && (
              <span className="text-muted-foreground bg-muted/50 rounded-full px-3 py-1 text-xs font-medium">
                {selectedBoard.columns?.length || 0} columns
              </span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsColumnModalOpen(true)}
          className="shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Column
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-hidden">
        {!hasColumns ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 p-8">
            <div className="max-w-md text-center">
              <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
                <Plus className="text-muted-foreground h-8 w-8" />
              </div>
              <h2 className="mb-2 text-xl font-bold">No columns yet</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Create your first column to start organizing tasks and managing
                your workflow
              </p>
              <Button
                onClick={() => setIsColumnModalOpen(true)}
                size="lg"
                className="shadow-md"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Column
              </Button>
            </div>
          </div>
        ) : (
          <KanbanBoard
            board={selectedBoard}
            onMoveCard={handleMoveCard}
            onReorderColumns={handleReorderColumns}
            onCreateCard={handleCreateCard}
            onEditCard={handleEditCard}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
          />
        )}
      </div>

      {/* Column Modal */}
      {selectedBoardId && (
        <ColumnModal
          open={isColumnModalOpen}
          onOpenChange={(open) => {
            setIsColumnModalOpen(open);
            if (!open) setEditingColumn(null);
          }}
          column={editingColumn}
          boardId={selectedBoardId}
          mode={editingColumn ? 'edit' : 'create'}
        />
      )}

      {/* Card Modal */}
      {selectedBoardId && (creatingCardColumnId || editingCard) && (
        <CardModal
          open={isCardModalOpen}
          onOpenChange={(open) => {
            setIsCardModalOpen(open);
            if (!open) {
              setEditingCard(null);
              setCreatingCardColumnId(null);
            }
          }}
          card={editingCard}
          columnId={editingCard?.column_id || creatingCardColumnId || 0}
          boardId={selectedBoardId}
          mode={editingCard ? 'edit' : 'create'}
        />
      )}
    </div>
  );
}
