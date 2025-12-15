import type { Id } from '@/convex/_generated/dataModel';

export type BoardId = Id<'kanbanBoards'>;
export type ColumnId = Id<'kanbanColumns'>;
export type CardId = Id<'kanbanCards'>;

export type Priority = 'low' | 'medium' | 'high';

export interface KanbanCard {
  _id: CardId;
  columnId: ColumnId;
  title: string;
  description?: string;
  priority: Priority;
  position: number;
  createdAt: number;
  updatedAt: number;
}

export interface KanbanColumn {
  _id: ColumnId;
  boardId: BoardId;
  name: string;
  position: number;
  createdAt: number;
  updatedAt: number;
  cards: KanbanCard[];
}

export interface KanbanBoard {
  _id: BoardId;
  name: string;
  userId: Id<'users'>;
  createdAt: number;
  updatedAt: number;
  columns: KanbanColumn[];
}

export const formatWhen = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};
