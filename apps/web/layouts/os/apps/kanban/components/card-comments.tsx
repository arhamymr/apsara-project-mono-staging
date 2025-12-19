'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { Button } from '@workspace/ui/components/button';
import { Textarea } from '@workspace/ui/components/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@workspace/ui/components/collapsible';
import { ChevronDown, ChevronRight, MessageSquare, MoreVertical, Pencil, Send, Trash2, X } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { CardId, KanbanComment } from '../types';
import { formatTimeAgo } from '../types';

interface CardCommentsProps {
  cardId: CardId;
  currentUserId?: string;
  currentUserImage?: string;
  currentUserName?: string;
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

function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
}: {
  comment: KanbanComment;
  currentUserId?: string;
  onEdit: (id: KanbanComment['_id'], content: string) => void;
  onDelete: (id: KanbanComment['_id']) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const isOwner = currentUserId === comment.userId;

  const handleSaveEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      onEdit(comment._id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="group flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.user?.image} />
        <AvatarFallback className="text-xs">
          {getInitials(comment.user?.name, comment.user?.email)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">
            {comment.user?.name || comment.user?.email || 'Unknown'}
          </span>
          <span className="text-muted-foreground text-xs">{formatTimeAgo(comment.createdAt)}</span>
          {comment.updatedAt > comment.createdAt && (
            <span className="text-muted-foreground text-xs">(edited)</span>
          )}
          {isOwner && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(comment._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {isEditing ? (
          <div className="mt-1 space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] text-sm resize-none"
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit} disabled={!editContent.trim()}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm mt-0.5 whitespace-pre-wrap break-words">{comment.content}</p>
        )}
      </div>
    </div>
  );
}


export function CardComments({ cardId, currentUserId, currentUserImage, currentUserName }: CardCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const comments = useQuery(api.kanban.getCardComments, { cardId }) as KanbanComment[] | undefined;
  const addCommentMutation = useMutation(api.kanban.addComment);
  const updateCommentMutation = useMutation(api.kanban.updateComment);
  const deleteCommentMutation = useMutation(api.kanban.deleteComment);

  const handleAddComment = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await addCommentMutation({ cardId, content: newComment.trim() });
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (id: KanbanComment['_id'], content: string) => {
    await updateCommentMutation({ id, content });
  };

  const handleDeleteComment = async (id: KanbanComment['_id']) => {
    await deleteCommentMutation({ id });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const commentCount = comments?.length ?? 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-0 hover:bg-transparent">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{isOpen ? 'Hide comments' : 'Show comments'}</span>
          {commentCount > 0 && (
            <span className="text-muted-foreground text-xs">({commentCount})</span>
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 pt-2 overflow-hidden">
        {/* Comment list */}
        <div className="h-[200px]">
          <ScrollArea className="h-full">
            <div className="space-y-4 pr-3">
              {comments?.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
              {commentCount === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Add comment */}
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={currentUserImage} />
            <AvatarFallback className="text-xs">{getInitials(currentUserName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment... (Ctrl+Enter to send)"
              className="min-h-[60px] text-sm resize-none flex-1"
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim() || isSubmitting}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
