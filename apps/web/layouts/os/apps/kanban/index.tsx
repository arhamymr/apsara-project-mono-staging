'use client';

import { useKanban } from './use-kanban';
import { KanbanHeader } from './components/kanban-header';
import { KanbanBoardView } from './components/kanban-board-view';
import { BoardModal } from './components/board-modal';
import { CardModal } from './components/card-modal';
import { ColumnModal } from './components/column-modal';
import { ArchivedCardsDrawer } from './components/archived-cards-drawer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function KanbanApp() {
  const kanban = useKanban();
  const currentUser = useQuery(api.user.profile);

  return (
    <div className="text-foreground flex h-full flex-col">
      <KanbanHeader
        board={kanban.board}
        boards={kanban.boards}
        selectedBoardId={kanban.selectedBoardId}
        isCreatingColumn={kanban.isCreatingColumn}
        isCreatingBoard={kanban.isCreatingBoard}
        archivedCount={kanban.archivedCards?.length}
        onCreateColumn={kanban.openCreateColumn}
        onSelectBoard={kanban.setSelectedBoardId}
        onOpenBoardModal={() => kanban.setBoardModalOpen(true)}
        onDeleteBoard={kanban.handleDeleteBoard}
        onUpdateBoard={kanban.handleUpdateBoard}
        onOpenArchive={() => kanban.setArchiveDrawerOpen(true)}
      />

      <div className="flex-1 overflow-hidden p-4">
        <KanbanBoardView
          board={kanban.board}
          selectedBoardId={kanban.selectedBoardId}
          isCreatingBoard={kanban.isCreatingBoard}
          onCreateBoard={kanban.handleCreateBoard}
          onCreateCard={kanban.openCreateCard}
          onEditCard={kanban.openEditCard}
          onDeleteCard={(card) => kanban.handleDeleteCard(card._id)}
          onArchiveCard={(card) => kanban.handleArchiveCard(card._id)}
          onEditColumn={kanban.openEditColumn}
          onDeleteColumn={kanban.handleDeleteColumn}
          onUpdateColumn={kanban.handleUpdateColumn}
          onMoveCard={kanban.handleMoveCard}
          onReorderColumns={kanban.handleReorderColumns}
        />
      </div>

      <CardModal
        open={kanban.cardModalOpen}
        onOpenChange={kanban.setCardModalOpen}
        card={kanban.editingCard}
        columnId={kanban.activeColumnId}
        boardId={kanban.selectedBoardId}
        mode={kanban.editingCard ? 'edit' : 'create'}
        isCreating={kanban.isCreatingCard}
        currentUserId={currentUser?._id}
        currentUserImage={currentUser?.image}
        currentUserName={currentUser?.name}
        onCreateCard={kanban.handleCreateCard}
        onUpdateCard={kanban.handleUpdateCard}
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

      <BoardModal
        open={kanban.boardModalOpen}
        onOpenChange={kanban.setBoardModalOpen}
        isCreating={kanban.isCreatingBoard}
        onCreateBoard={kanban.handleCreateBoard}
      />

      <ArchivedCardsDrawer
        open={kanban.archiveDrawerOpen}
        onOpenChange={kanban.setArchiveDrawerOpen}
        cards={kanban.archivedCards}
        onRestore={kanban.handleUnarchiveCard}
        onDelete={kanban.handleDeleteCard}
      />
    </div>
  );
}
