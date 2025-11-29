import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type CreateCollectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBaseName?: string;
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  error: string | null;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  portalContainer?: HTMLElement;
};

export function CreateCollectionDialog({
  open,
  onOpenChange,
  knowledgeBaseName,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  error,
  onSubmit,
  isSubmitting,
  portalContainer,
}: CreateCollectionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent portalContainer={portalContainer}>
        <DialogHeader>
          <DialogTitle>Create collection</DialogTitle>
          <DialogDescription>
            {knowledgeBaseName
              ? `Add a new collection to ${knowledgeBaseName}.`
              : 'Select a knowledge base to create a collection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Knowledge base</Label>
            <Input value={knowledgeBaseName ?? ''} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="collection-name">Name</Label>
            <Input
              id="collection-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. API Docs"
              disabled={isSubmitting}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="collection-description">
              Description (optional)
            </Label>
            <Textarea
              id="collection-description"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Add context for this collection"
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
            <Button type="submit" disabled={isSubmitting || !knowledgeBaseName}>
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
