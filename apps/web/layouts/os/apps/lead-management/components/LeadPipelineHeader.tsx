'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { cn } from '@/lib/utils';
import { ChevronDown, Layout, Loader2, Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { ShareWithOrgButton } from '../../organizations/components/share-with-org-button';

interface Pipeline {
  _id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface LeadPipelineHeaderProps {
  pipeline: any;
  pipelines: Pipeline[] | undefined;
  selectedPipelineId: string | null;
  totalLeads: number;
  isCreatingPipeline: boolean;
  isCreatingColumn: boolean;
  onAddColumn: () => void;
  onSelectPipeline: (id: string) => void;
  onOpenTemplateModal: () => void;
  onOpenPipelineModal: () => void;
  onDeletePipeline: (id: string) => void;
  onUpdatePipeline: (id: string, name: string) => void;
}

export function LeadPipelineHeader({
  pipeline,
  pipelines,
  selectedPipelineId,
  totalLeads,
  isCreatingPipeline,
  isCreatingColumn,
  onAddColumn,
  onSelectPipeline,
  onOpenTemplateModal,
  onOpenPipelineModal,
  onDeletePipeline,
  onUpdatePipeline,
}: LeadPipelineHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pipelineToDelete, setPipelineToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleDeleteClick = (e: React.MouseEvent, pipelineId: string, pipelineName: string) => {
    e.stopPropagation();
    setPipelineToDelete({ id: pipelineId, name: pipelineName });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pipelineToDelete) {
      onDeletePipeline(pipelineToDelete.id);
    }
    setDeleteDialogOpen(false);
    setPipelineToDelete(null);
  };

  const handleStartEditing = () => {
    if (pipeline) {
      setEditedName(pipeline.name);
      setIsEditingName(true);
    }
  };

  const handleSaveName = () => {
    if (pipeline && editedName.trim() && editedName.trim() !== pipeline.name) {
      onUpdatePipeline(pipeline._id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
    }
  };

  return (
    <>
      <div className="bg-card sticky top-0 flex w-full items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="border p-2 rounded-sm">
            <Layout className="h-5 w-5" />
          </div>

          {isEditingName && pipeline ? (
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
                  <Button variant="ghost" className="h-9 gap-2 px-3 hover:bg-accent">
                    <span className="max-w-[200px] truncate text-base">
                      {pipeline?.name || 'Select Pipeline'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="z-[9999] w-64">
                  {pipelines && pipelines.length > 0 ? (
                    <div className="max-h-[300px] overflow-y-auto">
                      {pipelines.map((p) => (
                        <DropdownMenuItem
                          key={p._id}
                          onClick={() => onSelectPipeline(p._id)}
                          className={cn(
                            'group flex cursor-pointer items-center justify-between gap-2 px-2 py-2.5',
                            selectedPipelineId === p._id && 'bg-accent'
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <div
                              className={cn(
                                'h-2 w-2 shrink-0 rounded-full',
                                selectedPipelineId === p._id ? 'bg-primary' : 'bg-muted-foreground/30'
                              )}
                            />
                            <span className="truncate">{p.name}</span>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-muted-foreground hover:text-destructive h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={(e) => handleDeleteClick(e, p._id, p.name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground px-2 py-4 text-center text-sm">No pipelines yet</div>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onOpenTemplateModal}
                    disabled={isCreatingPipeline}
                    className="text-primary focus:text-primary cursor-pointer"
                  >
                    {isCreatingPipeline ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Create from Template
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {pipeline && (
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

          {pipeline && (
            <Badge variant="secondary" className="text-xs">
              {totalLeads} leads
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pipeline && (
            <ShareWithOrgButton
              resourceType="leadPipeline"
              resourceId={pipeline._id}
              resourceName={pipeline.name}
              variant="outline"
              size="sm"
            />
          )}
          {pipeline && (
            <Button variant="outline" size="sm" onClick={onOpenPipelineModal}>
              <Settings className="mr-1.5 h-4 w-4" />
              Customize
            </Button>
          )}
          {pipeline && (
            <Button size="sm" onClick={onAddColumn} disabled={isCreatingColumn}>
              {isCreatingColumn ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Stage
            </Button>
          )}
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pipeline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{pipelineToDelete?.name}&rdquo;? This will permanently remove the
              pipeline and all its stages and leads. This action cannot be undone.
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
    </>
  );
}
