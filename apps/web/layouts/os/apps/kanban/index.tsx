'use client';

import { useKanban } from './use-kanban';
import { KanbanHeader } from './components/kanban-header';
import { KanbanSidebar } from './components/kanban-sidebar';
import { KanbanBoardView } from './components/kanban-board-view';
import { CardModal } from './components/card-modal';
import { ColumnModal } from './components/column-modal';

export default function KanbanApp() {
  const kanban = useKanban();

  return (
    <div className="text-foreground flex h-full flex-col">
      <KanbanHeader
        board={kanban.board}
        isCreatingColumn={kanban.isCreatingColumn}
        onCreateColumn={kanban.openCreateColumn}
      />

      <div className="flex-1 overflow-hidden p-4">
        <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-4">
          <KanbanSidebar
            boards={kanban.boards}
            selectedBoardId={kanban.selectedBoardId}
            isCreatingBoard={kanban.isCreatingBoard}
            onSelectBoard={kanban.setSelectedBoardId}
            onCreateBoard={kanban.handleCreateBoard}
            onDeleteBoard={kanban.handleDeleteBoard}
          />

          <div className="relative md:col-span-3 overflow-hidden">
            <KanbanBoardView
              board={kanban.board}
              selectedBoardId={kanban.selectedBoardId}
              isCreatingBoard={kanban.isCreatingBoard}
              onCreateBoard={kanban.handleCreateBoard}
              onCreateCard={kanban.openCreateCard}
              onEditCard={kanban.openEditCard}
              onEditColumn={kanban.openEditColumn}
              onDeleteColumn={kanban.handleDeleteColumn}
              onMoveCard={kanban.handleMoveCard}
              onReorderColumns={kanban.handleReorderColumns}
            />
          </div>
        </div>
      </div>

      <CardModal
        open={kanban.cardModalOpen}
        onOpenChange={kanban.setCardModalOpen}
        card={kanban.editingCard}
        columnId={kanban.activeColumnId}
        mode={kanban.editingCard ? 'edit' : 'create'}
        isCreating={kanban.isCreatingCard}
        onCreateCard={kanban.handleCreateCard}
        onUpdateCard={kanban.handleUpdateCard}
        onDeleteCard={kanban.handleDeleteCard}
      />

      <ColumnModal
        open={kanban.columnModalOpen}
        onOpenChange={kanban.setColumnModalOpen}
        column={kanban.editingColumn}
        mode={kanban.editingColumn ? 'edit' : 'create'}
        isCreating={kanban.isCreatingColumn}
        onCreateColumn={kanban.handleCreateColumn}
        onUpdateColumn={kanban.handleUpdateColumn}
      />
    </div>
  );
}
