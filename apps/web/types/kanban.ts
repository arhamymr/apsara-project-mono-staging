export type Priority = 'low' | 'medium' | 'high';

export interface Board {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
  columns?: Column[];
}

export interface Column {
  id: number;
  board_id: number;
  name: string;
  position: number;
  created_at: string;
  updated_at: string;
  cards?: Card[];
}

export interface Card {
  id: number;
  column_id: number;
  title: string;
  description: string | null;
  priority: Priority;
  assignee_id: number | null;
  position: number;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface MoveCardPayload {
  card_id: number;
  target_column_id: number;
  target_position: number;
}

export interface ReorderColumnsPayload {
  column_positions: Array<{
    id: number;
    position: number;
  }>;
}
