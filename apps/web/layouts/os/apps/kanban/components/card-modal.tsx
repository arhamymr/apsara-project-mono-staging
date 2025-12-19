'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';

import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Calendar, Loader2, User, UserX } from 'lucide-react';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import { Editor } from '@/components/blocks/editor-x/editor';
import type { SerializedEditorState } from 'lexical';
import type { BoardId, ColumnId, KanbanCard, Priority } from '../types';
import { formatWhen } from '../types';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { CardComments } from './card-comments';
import { Separator } from '@workspace/ui/components/separator';
import { ScrollArea } from '@workspace/ui/components/scroll-area';

interface BoardMember {
  _id: Id<'users'>;
  name?: string;
  email?: string;
  image?: string;
}

interface CardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: KanbanCard | null;
  columnId: ColumnId | null;
  boardId: BoardId | null;
  mode: 'create' | 'edit';
  isCreating: boolean;
  currentUserId?: string;
  currentUserImage?: string;
  currentUserName?: string;
  onCreateCard: (columnId: ColumnId, title: string, priority: Priority, assigneeId?: Id<'users'>) => void;
  onUpdateCard: (
    id: KanbanCard['_id'],
    data: { title?: string; description?: string; priority?: Priority; assigneeId?: Id<'users'> | null }
  ) => void;
}


// Parse description - could be JSON editor state or plain text
function parseDescription(description: string | undefined): SerializedEditorState | undefined {
  if (!description) return undefined;
  try {
    const parsed = JSON.parse(description);
    if (parsed.root) return parsed;
    return undefined;
  } catch {
    return undefined;
  }
}

function getInitials(name?: string, email?: string): string {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email[0]?.toUpperCase() || '?';
  return '?';
}

export function CardModal({
  open,
  onOpenChange,
  card,
  columnId,
  boardId,
  mode,
  isCreating,
  currentUserId,
  currentUserImage,
  currentUserName,
  onCreateCard,
  onUpdateCard,
}: CardModalProps) {
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(undefined);
  const [editorKey, setEditorKey] = useState(0);
  const [priority, setPriority] = useState<Priority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const portalContainer = useWindowPortalContainer();

  // Fetch board members for assignee selection
  const boardMembers = useQuery(
    api.kanban.getBoardMembers,
    boardId ? { boardId } : 'skip'
  ) as BoardMember[] | undefined;

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && card) {
        setTitle(card.title);
        setEditorState(parseDescription(card.description));
        setPriority(card.priority);
        setAssigneeId(card.assigneeId || undefined);
      } else {
        setTitle('');
        setEditorState(undefined);
        setPriority('medium');
        setAssigneeId(undefined);
      }
      setEditorKey((k) => k + 1);
    }
  }, [open, mode, card]);

  const handleEditorChange = useCallback((state: SerializedEditorState) => {
    setEditorState(state);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const descriptionJson = editorState ? JSON.stringify(editorState) : undefined;

    if (mode === 'create' && columnId) {
      onCreateCard(columnId, title.trim(), priority, assigneeId as Id<'users'> | undefined);
    } else if (mode === 'edit' && card) {
      onUpdateCard(card._id, {
        title: title.trim(),
        description: descriptionJson,
        priority,
        assigneeId: assigneeId ? (assigneeId as Id<'users'>) : null,
      });
    }
  };

  const selectedAssignee = boardMembers?.find((m) => m._id === assigneeId);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto"
          portalContainer={portalContainer?.current ?? undefined}
        >
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create Card' : 'Edit Card'}</DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Add a new task card.' : 'Update the card details.'}
            </DialogDescription>
            {mode === 'edit' && card && (
              <div className="text-muted-foreground flex items-center gap-1.5 pt-1 text-xs">
                <Calendar className="h-3.5 w-3.5" />
                Created {formatWhen(card.createdAt)}
              </div>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[1fr_140px_180px] gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={assigneeId || 'unassigned'}
                  onValueChange={(v) => setAssigneeId(v === 'unassigned' ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned">
                      {selectedAssignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={selectedAssignee.image} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(selectedAssignee.name, selectedAssignee.email)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{selectedAssignee.name || selectedAssignee.email}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>Unassigned</span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        <span>Unassigned</span>
                      </div>
                    </SelectItem>
                    {boardMembers?.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={member.image} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(member.name, member.email)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{member.name || member.email}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <ScrollArea className="h-[200px] rounded-lg border">
                <Editor
                  key={editorKey}
                  editorSerializedState={editorState}
                  onSerializedChange={handleEditorChange}
                  lite
                />
              </ScrollArea>
            </div>

            {/* Comments section - only show in edit mode */}
            {mode === 'edit' && card && (
              <>
                <Separator />
                <CardComments
                  cardId={card._id}
                  currentUserId={currentUserId}
                  currentUserImage={currentUserImage}
                  currentUserName={currentUserName}
                />
              </>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || !title.trim()}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </>
  );
}
