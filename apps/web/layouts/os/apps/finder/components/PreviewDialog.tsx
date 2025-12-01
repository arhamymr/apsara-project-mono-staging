import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { formatSize } from '../utils';

type PreviewData = {
  key: string;
  name: string;
  type?: string | null;
  size?: number;
};

type PreviewDialogProps = {
  open: boolean;
  preview: PreviewData | null;
  previewUrl: string | null;
  isLoading: boolean;
  isImage: boolean;
  portalContainer?: HTMLElement;
  onOpenChange: (open: boolean) => void;
};

export function PreviewDialog({
  open,
  preview,
  previewUrl,
  isLoading,
  isImage,
  portalContainer,
  onOpenChange,
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl"
        portalContainer={portalContainer}
        overlayClassName="bg-black/60"
      >
        <DialogHeader>
          <DialogTitle className="truncate">
            {preview?.name || 'Preview'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          {isLoading ? (
            <div className="text-muted-foreground p-6 text-sm">
              Loading preview...
            </div>
          ) : preview && previewUrl ? (
            isImage ? (
              <img
                src={previewUrl}
                alt={preview.name}
                className="max-h-[60vh] w-full rounded object-contain"
              />
            ) : (
              <div className="space-y-3">
                <div className="bg-muted/30 text-muted-foreground rounded border p-4 text-sm">
                  No inline preview available. Use Open or Download.
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => window.open(previewUrl, '_blank')}
                  >
                    Open
                  </Button>
                  <a
                    href={previewUrl}
                    target="_blank"
                    download
                    className="inline-flex items-center rounded border px-3 py-1.5 text-sm"
                    rel="noreferrer"
                  >
                    Download
                  </a>
                </div>
              </div>
            )
          ) : null}
          {preview && (
            <div className="mt-4 overflow-hidden rounded border">
              <table className="min-w-full text-left text-xs">
                <tbody>
                  <tr className="bg-muted/40 border-b">
                    <th className="px-3 py-2 font-medium">Name</th>
                    <td className="px-3 py-2">{preview.name}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-3 py-2 font-medium">Key</th>
                    <td className="px-3 py-2">{preview.key}</td>
                  </tr>
                  <tr className="border-b">
                    <th className="px-3 py-2 font-medium">MIME Type</th>
                    <td className="px-3 py-2">{preview.type || '—'}</td>
                  </tr>
                  <tr>
                    <th className="px-3 py-2 font-medium">Size</th>
                    <td className="px-3 py-2">{formatSize(preview.size)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
