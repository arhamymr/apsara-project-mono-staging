import type { Id } from '@/convex/_generated/dataModel';

export type BoardId = Id<'kanbanBoards'>;
export type ColumnId = Id<'kanbanColumns'>;
export type CardId = Id<'kanbanCards'>;

export type Priority = 'low' | 'medium' | 'high';

export type ColumnColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export const COLUMN_COLORS: Record<ColumnColor, { label: string; dot: string; bg: string }> = {
  default: { label: 'Default', dot: 'bg-primary/60', bg: 'bg-muted/40' },
  red: { label: 'Red', dot: 'bg-red-500', bg: 'bg-red-500/10' },
  orange: { label: 'Orange', dot: 'bg-orange-500', bg: 'bg-orange-500/10' },
  yellow: { label: 'Yellow', dot: 'bg-yellow-500', bg: 'bg-yellow-500/10' },
  green: { label: 'Green', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  blue: { label: 'Blue', dot: 'bg-blue-500', bg: 'bg-blue-500/10' },
  purple: { label: 'Purple', dot: 'bg-purple-500', bg: 'bg-purple-500/10' },
  pink: { label: 'Pink', dot: 'bg-pink-500', bg: 'bg-pink-500/10' },
};

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
  color?: ColumnColor;
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
