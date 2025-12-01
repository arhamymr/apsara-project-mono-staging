import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Loader2 } from 'lucide-react';
import type { FormEvent, RefObject } from 'react';

type FolderDialogProps = {
  open: boolean;
  portalContainer?: HTMLElement;
  isCreatingFolder: boolean;
  name: string;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onNameChange: (value: string) => void;
  onSubmit: (event?: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function FolderDialog({
  open,
  portalContainer,
  isCreatingFolder,
  name,
  error,
  onOpenChange,
  onNameChange,
  onSubmit,
  onCancel,
  inputRef,
}: FolderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm"
        portalContainer={portalContainer}
        overlayClassName="bg-black/60"
      >
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="new-folder-name">Folder name</Label>
            <Input
              id="new-folder-name"
              ref={inputRef}
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              autoComplete="off"
              disabled={isCreatingFolder}
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreatingFolder}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatingFolder}>
              {isCreatingFolder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
