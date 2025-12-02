'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { cn } from '@/lib/utils';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  Loader2,
  Scale,
  User,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import type { Template, TemplateStrings } from './types';

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strings: TemplateStrings;
}

export function TemplatePreviewModal({
  template,
  open,
  onOpenChange,
  strings,
}: TemplatePreviewModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reset states when modal opens/closes or template changes
  useEffect(() => {
    if (open && template) {
      setIframeLoaded(false);
      setIframeError(false);
      setCopied(false);
    }
  }, [open, template]);

  const handleCopyLink = useCallback(async () => {
    if (!template) return;
    try {
      await navigator.clipboard.writeText(window.location.origin + template.downloadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [template]);

  const handleDownload = useCallback(() => {
    if (!template) return;
    const link = document.createElement('a');
    link.href = template.downloadUrl;
    link.download = `${template.id}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [template]);

  const handleOpenPreview = useCallback(() => {
    if (!template) return;
    const url = template.previewUrl || template.previewImage;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, [template]);

  if (!template) return null;

  const licenseColors = {
    free: 'bg-green-500/10 text-green-600 border-green-500/20',
    premium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    commercial: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!w-[95vw] !h-[95vh] !max-w-[95vw] overflow-hidden p-0 gap-0"
        aria-describedby="template-description"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Preview Panel */}
          <div className="relative flex-1 min-h-[300px] lg:min-h-0 bg-muted border-b lg:border-b-0 lg:border-r">
            {/* Loading state */}
            {!iframeLoaded && !iframeError && template.previewUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Iframe preview */}
            {template.previewUrl && !iframeError ? (
              <iframe
                src={template.previewUrl}
                title={`${template.title} preview`}
                className={cn(
                  'w-full h-full border-0 transition-opacity duration-300',
                  iframeLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setIframeLoaded(true)}
                onError={() => setIframeError(true)}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : template.previewImage ? (
              /* Fallback image */
              <div className="relative w-full h-full">
                <Image
                  src={template.previewImage}
                  alt={`${template.title} preview`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            ) : (
              /* No preview available */
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <ExternalLink className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm">{strings.modal.previewUnavailable}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={handleOpenPreview}
                >
                  {strings.modal.openPreview}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-[340px] flex flex-col overflow-y-auto">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-xl font-semibold pr-8">
                {template.title}
              </DialogTitle>
              <DialogDescription id="template-description" className="text-sm text-muted-foreground mt-2">
                {template.description}
              </DialogDescription>
            </DialogHeader>

            {/* Metadata */}
            <div className="px-6 pb-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{strings.modal.author}:</span>
                <span className="text-foreground">{template.author}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileArchive className="h-4 w-4" />
                <span>{strings.modal.fileSize}:</span>
                <span className="text-foreground">{template.fileSize}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Scale className="h-4 w-4" />
                <span>{strings.modal.license}:</span>
                <Badge variant="outline" className={cn('capitalize', licenseColors[template.license])}>
                  {strings.licenses[template.license]}
                </Badge>
              </div>
            </div>

            {/* Tags */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto p-6 pt-4 border-t space-y-3">
              <Button className="w-full" size="lg" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                {strings.modal.download}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleOpenPreview}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {strings.modal.openPreview}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  aria-label={strings.modal.copyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
