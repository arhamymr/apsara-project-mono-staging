import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import type { KBChunk } from './types';

type ChunkEditorSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chunk: KBChunk | null;
  onChangeText: (value: string) => void;
  onSave: () => void;
  portalContainer?: HTMLElement;
};

export function ChunkEditorSheet({
  open,
  onOpenChange,
  chunk,
  onChangeText,
  onSave,
  portalContainer,
}: ChunkEditorSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex w-[720px] max-w-[calc(100%-16px)] flex-col gap-4"
        portalContainer={portalContainer}
      >
        <SheetHeader>
          <SheetTitle>Clean &amp; Upsert Chunk</SheetTitle>
        </SheetHeader>
        <div className="grid gap-2">
          <div className="text-muted-foreground text-xs">Chunk ID</div>
          <div className="bg-muted/40 rounded-md border p-2 text-xs">
            {chunk?.id ?? '—'}
          </div>
          <div className="text-muted-foreground text-xs">Index</div>
          <div className="bg-muted/40 rounded-md border p-2 text-xs">
            {chunk?.index ?? '—'}
          </div>
        </div>
        <div className="grid gap-2">
          <div className="text-xs font-medium">Chunk Text</div>
          <Textarea
            className="min-h-[260px]"
            value={chunk?.text ?? ''}
            onChange={(event) => onChangeText(event.target.value)}
            placeholder="Edit text to clean up noise, remove boilerplate, etc."
          />
        </div>
        <Separator />
        <SheetFooter className="flex gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Upsert Chunk</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
