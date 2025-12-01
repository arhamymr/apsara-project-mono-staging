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
import { Loader2 } from 'lucide-react';

type CreateKnowledgeBaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  portalContainer?: HTMLElement;
};

export function CreateKnowledgeBaseDialog({
  open,
  onOpenChange,
  title,
  onTitleChange,
  error,
  onSubmit,
  isSubmitting,
  portalContainer,
}: CreateKnowledgeBaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent portalContainer={portalContainer}>
        <DialogHeader>
          <DialogTitle>Create knowledge base</DialogTitle>
          <DialogDescription>
            Give your knowledge base a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="kb-title">Title</Label>
            <Input
              id="kb-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="e.g. Product Documentation"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          {error ? <p className="text-destructive text-sm">{error}</p> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                </>
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
