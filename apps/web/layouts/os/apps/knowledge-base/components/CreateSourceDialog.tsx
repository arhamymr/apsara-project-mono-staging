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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

type CreateSourceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  knowledgeBaseName?: string;
  collectionName?: string;
  title: string;
  sourceUri: string;
  mode: 'url' | 'file';
  onModeChange: (mode: 'url' | 'file') => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  isSubmitting: boolean;
  error: string | null;
  onChangeTitle: (value: string) => void;
  onChangeSourceUri: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  portalContainer?: HTMLElement;
};

export function CreateSourceDialog({
  open,
  onOpenChange,
  knowledgeBaseName,
  collectionName,
  title,
  sourceUri,
  mode,
  onModeChange,
  file,
  onFileChange,
  isSubmitting,
  error,
  onChangeTitle,
  onChangeSourceUri,
  onSubmit,
  portalContainer,
}: CreateSourceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent portalContainer={portalContainer}>
        <DialogHeader>
          <DialogTitle>Upload source manually</DialogTitle>
          <DialogDescription>
            Provide a title and a URL to enqueue the source for ingestion.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label>Knowledge base</Label>
            <Input value={knowledgeBaseName ?? ''} readOnly disabled />
          </div>
          <div className="grid gap-2">
            <Label>Collection</Label>
            <Input value={collectionName ?? ''} readOnly disabled />
          </div>
          <Tabs
            value={mode}
            onValueChange={(value) => onModeChange(value as 'url' | 'file')}
            className="grid gap-4"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="url" disabled={isSubmitting}>
                From URL
              </TabsTrigger>
              <TabsTrigger value="file" disabled={isSubmitting}>
                Upload file
              </TabsTrigger>
            </TabsList>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="source-title">Title</Label>
                <Input
                  id="source-title"
                  value={title}
                  onChange={(event) => onChangeTitle(event.target.value)}
                  placeholder="e.g. API Reference"
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              <TabsContent value="url" className="grid gap-2">
                <Label htmlFor="source-uri">Source URL</Label>
                <Textarea
                  id="source-uri"
                  value={sourceUri}
                  onChange={(event) => onChangeSourceUri(event.target.value)}
                  placeholder="https://example.com/article"
                  disabled={isSubmitting}
                  rows={3}
                />
                <p className="text-muted-foreground text-xs">
                  Supports website links and direct document URLs (PDF).
                </p>
              </TabsContent>
              <TabsContent value="file" className="grid gap-2">
                <Label htmlFor="source-file">Select file</Label>
                <input
                  id="source-file"
                  type="file"
                  accept=".md,.markdown,.pdf"
                  onChange={(event) =>
                    onFileChange(event.target.files?.[0] ?? null)
                  }
                  disabled={isSubmitting}
                  className="file:bg-primary file:text-primary-foreground border-input bg-background cursor-pointer rounded-md border text-sm file:cursor-pointer file:border-0 file:px-3 file:py-1.5"
                />
                <p className="text-muted-foreground text-xs">
                  Upload Markdown (.md) or PDF (.pdf) files up to the allowed
                  size.
                </p>
                {file ? (
                  <p className="text-xs">Selected file: {file.name}</p>
                ) : null}
              </TabsContent>
            </div>
          </Tabs>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                'Upload'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
