'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { formatWhen, type BoardId } from '../types';

interface Board {
  _id: BoardId;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface KanbanSidebarProps {
  boards: Board[] | undefined;
  selectedBoardId: BoardId | null;
  isCreatingBoard: boolean;
  onSelectBoard: (id: BoardId) => void;
  onCreateBoard: (name: string) => void;
  onDeleteBoard: (id: BoardId) => void;
}

export function KanbanSidebar({
  boards,
  selectedBoardId,
  isCreatingBoard,
  onSelectBoard,
  onCreateBoard,
  onDeleteBoard,
}: KanbanSidebarProps) {
  const [newBoardName, setNewBoardName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCreate = () => {
    if (newBoardName.trim()) {
      onCreateBoard(newBoardName.trim());
      setNewBoardName('');
      setShowInput(false);
    }
  };

  return (
    <aside className="flex flex-col space-y-3">
      <p className="text-muted-foreground text-xs">
        Organize your tasks with boards and columns.
      </p>

      <div className="flex gap-2">
        {showInput ? (
          <div className="flex flex-1 gap-2">
            <Input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <Button size="sm" onClick={handleCreate} disabled={isCreatingBoard || !newBoardName.trim()}>
              {isCreatingBoard ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" className="w-full" onClick={() => setShowInput(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Board
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-2">
          {!boards ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : boards.length === 0 ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              No boards yet
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board._id}
                onClick={() => onSelectBoard(board._id)}
                className={`group cursor-pointer rounded-md border p-3 transition-colors ${
                  selectedBoardId === board._id
                    ? 'bg-accent border-primary'
                    : 'hover:bg-accent/50 border-transparent'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{board.name}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatWhen(board.updatedAt)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBoard(board._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
