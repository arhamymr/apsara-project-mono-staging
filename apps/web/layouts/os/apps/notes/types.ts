import type { SerializedEditorState } from 'lexical';
import type { Id } from '@/convex/_generated/dataModel';

export type NoteId = Id<'notes'>;

export interface Note {
  _id: NoteId;
  title: string;
  content: string;
  userId: Id<'users'>;
  createdAt: number;
  updatedAt: number;
}

export const initialEditorState = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

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
