"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { cn } from "@/lib/utils";
import {
  Archive,
  ChevronDown,
  Kanban,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type { BoardId, KanbanBoard } from "../types";
import { ShareWithOrgButton } from "../../organizations/components/share-with-org-button";
import { OrgMembersAvatars } from "../../organizations/components/org-members-avatars";

interface Board {
  _id: BoardId;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface KanbanHeaderProps {
  board: KanbanBoard | null | undefined;
  boards: Board[] | undefined;
  selectedBoardId: BoardId | null;
  isCreatingColumn: boolean;
  isCreatingBoard: boolean;
  archivedCount?: number;
  onCreateColumn: () => void;
  onSelectBoard: (id: BoardId) => void;
  onOpenBoardModal: () => void;
  onDeleteBoard: (id: BoardId) => void;
  onUpdateBoard: (id: BoardId, name: string) => void;
  onOpenArchive: () => void;
}

export function KanbanHeader({
  board,
  boards,
  selectedBoardId,
  isCreatingColumn,
  isCreatingBoard,
  archivedCount = 0,
  onCreateColumn,
  onSelectBoard,
  onOpenBoardModal,
  onDeleteBoard,
  onUpdateBoard,
  onOpenArchive,
}: KanbanHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<{
    id: BoardId;
    name: string;
  } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleDeleteClick = (
    e: React.MouseEvent,
    boardId: BoardId,
    boardName: string
  ) => {
    e.stopPropagation();
    setBoardToDelete({ id: boardId, name: boardName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (boardToDelete) {
      onDeleteBoard(boardToDelete.id);
    }
    setDeleteDialogOpen(false);
    setBoardToDelete(null);
  };

  const handleStartEditing = () => {
    if (board) {
      setEditedName(board.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = () => {
    if (board && editedName.trim() && editedName.trim() !== board.name) {
      onUpdateBoard(board._id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="border p-2 rounded-sm">
            <Kanban className="h-5 w-5" />
          </div>

          {isEditingName && board ? (
            <Input
              ref={inputRef}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              className="h-9 w-[200px] text-base"
            />
          ) : (
            <div className="group flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 gap-2 px-3 hover:bg-accent"
                  >
                    <span className="max-w-[200px] truncate text-base">
                      {board?.name || "Select Board"}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-[9999] w-64">
                  {boards && boards.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {boards.map((b) => (
                        <DropdownMenuItem
                          key={b._id}
                          onClick={() => onSelectBoard(b._id)}
                          className={cn(
                            "group flex cursor-pointer items-center justify-between gap-2 px-2 py-2.5",
                            selectedBoardId === b._id && "bg-accent"
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <div
                              className={cn(
                                "h-2 w-2 shrink-0 rounded-full",
                                selectedBoardId === b._id
                                  ? "bg-primary"
                                  : "bg-muted-foreground/30"
                              )}
                            />
                            <span className="truncate">{b.name}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={(e) =>
                                handleDeleteClick(e, b._id, b.name)
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground px-2 py-4 text-center text-sm">
                      No boards yet
                    </div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onOpenBoardModal}
                    disabled={isCreatingBoard}
                    className="text-primary focus:text-primary cursor-pointer"
                  >
                    {isCreatingBoard ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create New Board
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {board && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={handleStartEditing}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {board && (
            <OrgMembersAvatars
              resourceType="kanbanBoard"
              resourceId={board._id}
            />
          )}
          {board && (
            <ShareWithOrgButton
              resourceType="kanbanBoard"
              resourceId={board._id}
              resourceName={board.name}
              variant="outline"
              size="sm"
            />
          )}
          {board && (
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateColumn}
              disabled={isCreatingColumn}
            >
              {isCreatingColumn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Column
            </Button>
          )}
          {board && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onOpenArchive}
              className="relative"
            >
              <Archive className="h-4 w-4" />
              {archivedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {archivedCount > 9 ? '9+' : archivedCount}
                </span>
              )}
            </Button>
          )}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Board</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &ldquo;{boardToDelete?.name}
                &rdquo;? This will permanently remove the board and all its
                columns and cards. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
