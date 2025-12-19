'use client';

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
import { cn } from '@/lib/utils';
import { useWindowPortalContainer } from '@/layouts/os/WindowPortalContext';
import {
  Bug,
  Check,
  ChevronDown,
  Code,
  GraduationCap,
  Kanban,
  Layout,
  Loader2,
  Megaphone,
  Rocket,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const BOARD_TEMPLATES = [
  {
    id: 'empty',
    name: 'Empty Board',
    description: 'Start from scratch',
    icon: Layout,
    columns: [],
  },
  {
    id: 'kanban',
    name: 'Kanban',
    description: 'To Do, In Progress, Done',
    icon: Kanban,
    columns: ['To Do', 'In Progress', 'Done'],
  },
  {
    id: 'project',
    name: 'Project Management',
    description: 'Backlog, Planning, Development, Review, Complete',
    icon: Rocket,
    columns: ['Backlog', 'Planning', 'Development', 'Review', 'Complete'],
  },
  {
    id: 'goals',
    name: 'Goal Tracking',
    description: 'Not Started, In Progress, Blocked, Achieved',
    icon: Target,
    columns: ['Not Started', 'In Progress', 'Blocked', 'Achieved'],
  },
  {
    id: 'sprint',
    name: 'Sprint Planning',
    description: 'Sprint Backlog, In Sprint, Testing, Done',
    icon: Zap,
    columns: ['Sprint Backlog', 'In Sprint', 'Testing', 'Done'],
  },
  {
    id: 'bugs',
    name: 'Bug Tracking',
    description: 'Reported, Triaged, Fixing, Resolved',
    icon: Bug,
    columns: ['Reported', 'Triaged', 'Fixing', 'Resolved'],
  },
  {
    id: 'marketing',
    name: 'Marketing Campaign',
    description: 'Ideas, Planning, Creating, Review, Published',
    icon: Megaphone,
    columns: ['Ideas', 'Planning', 'Creating', 'Review', 'Published'],
  },
  {
    id: 'hiring',
    name: 'Hiring Pipeline',
    description: 'Applied, Screening, Interview, Offer, Hired',
    icon: Users,
    columns: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
  },
  {
    id: 'learning',
    name: 'Learning Tracker',
    description: 'To Learn, Learning, Practicing, Mastered',
    icon: GraduationCap,
    columns: ['To Learn', 'Learning', 'Practicing', 'Mastered'],
  },
  {
    id: 'dev',
    name: 'Software Development',
    description: 'Backlog, Design, Development, Code Review, QA, Deployed',
    icon: Code,
    columns: ['Backlog', 'Design', 'Development', 'Code Review', 'QA', 'Deployed'],
  },
];

interface BoardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating: boolean;
  onCreateBoard: (name: string, templateColumns?: string[]) => void;
}

export function BoardModal({ open, onOpenChange, isCreating, onCreateBoard }: BoardModalProps) {
  const [boardName, setBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('kanban');
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const portalContainer = useWindowPortalContainer();

  const visibleTemplates = showAllTemplates ? BOARD_TEMPLATES : BOARD_TEMPLATES.slice(0, 4);
  const hasMoreTemplates = BOARD_TEMPLATES.length > 4;

  const handleCreate = () => {
    if (!boardName.trim()) return;
    const template = BOARD_TEMPLATES.find((t) => t.id === selectedTemplate);
    onCreateBoard(boardName.trim(), template?.columns);
    setBoardName('');
    setSelectedTemplate('kanban');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setBoardName('');
      setSelectedTemplate('kanban');
      setShowAllTemplates(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]" portalContainer={portalContainer?.current ?? undefined}>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>Give your board a name and choose a template to get started.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="board-name">Board Name</Label>
            <Input
              id="board-name"
              placeholder="My Project Board"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && boardName.trim() && handleCreate()}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Template</Label>
            <div className="grid grid-cols-2 gap-2">
              {visibleTemplates.map((template) => {
                const Icon = template.icon;
                const isSelected = selectedTemplate === template.id;
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-lg border p-2.5 text-left transition-all',
                      'hover:border-primary/50 hover:bg-accent/50',
                      isSelected && 'border-primary bg-primary/5 ring-1 ring-primary/20'
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                    <span className="truncate text-sm font-medium">{template.name}</span>
                    {isSelected && <Check className="text-primary ml-auto h-4 w-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {hasMoreTemplates && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground w-full"
                onClick={() => setShowAllTemplates(!showAllTemplates)}
              >
                <ChevronDown className={cn('mr-1 h-4 w-4 transition-transform', showAllTemplates && 'rotate-180')} />
                {showAllTemplates ? 'Show less' : `Show ${BOARD_TEMPLATES.length - 4} more templates`}
              </Button>
            )}
          </div>

          {selectedTemplate !== 'empty' && (
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">Columns that will be created:</Label>
              <div className="flex flex-wrap gap-1.5">
                {BOARD_TEMPLATES.find((t) => t.id === selectedTemplate)?.columns.map((col) => (
                  <span
                    key={col}
                    className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!boardName.trim() || isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Board'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
