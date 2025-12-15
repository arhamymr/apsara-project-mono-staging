import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { cn } from '@/lib/utils';
import { FileIcon, FolderIcon, ImageIcon, Loader2, Upload } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import type { StorageEntry } from './queries';
import { useStorageActions, useStorageList } from './queries';

type FinderTabProps = {
  open: boolean;
  kindFilter?: string | string[];
  onSelectUrl: (url: string) => void;
  onClose: () => void;
};

export function FinderTab({
  open,
  kindFilter,
  onSelectUrl,
  onClose,
}: FinderTabProps) {
  const [prefix, setPrefix] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const list = useStorageList(prefix);
  const { uploadFiles } = useStorageActions(prefix);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      await uploadFiles(files);
      toast.success('Image uploaded successfully');
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  React.useEffect(() => {
    if (!open) {
      setPrefix('');
    }
  }, [open]);

  const folders = list.data?.folders ?? [];
  const files = list.data?.files ?? [];

  const filters = React.useMemo(() => {
    if (!kindFilter) return [] as string[];
    return Array.isArray(kindFilter) ? kindFilter : [kindFilter];
  }, [kindFilter]);

  const filteredFiles = React.useMemo(() => {
    if (filters.length === 0) return files;
    return files.filter((file) => {
      if (filters.includes('image')) {
        return (
          file.previewCategory === 'image' || file.mime?.startsWith('image/')
        );
      }
      return true;
    });
  }, [files, filters]);

  const isLoading = list.isLoading && !list.data;
  const isFetching = list.isFetching;

  const breadcrumbs = React.useMemo(() => {
    const segments = prefix.split('/').filter(Boolean);
    const items: { label: string; value: string }[] = [
      { label: 'Root', value: '' },
    ];
    segments.reduce((acc, segment) => {
      const next = `${acc}${segment}/`;
      items.push({ label: segment, value: next });
      return next;
    }, '');
    return items;
  }, [prefix]);

  const handleSelect = React.useCallback(
    async (entry: StorageEntry) => {
      if (entry.is_folder) {
        setPrefix(entry.key);
        return;
      }

      if (filters.includes('image')) {
        const isImage =
          entry.previewCategory === 'image' || entry.mime?.startsWith('image/');
        if (!isImage) {
          toast.error('Select an image file.');
          return;
        }
      }

      if (!entry.public_url) {
        toast.error(
          'This file is private. Make it public from Finder before using it.',
        );
        return;
      }

      onSelectUrl(entry.public_url);
      onClose();
    },
    [filters, onClose, onSelectUrl],
  );

  const goUp = React.useCallback(() => {
    if (!prefix) return;
    const trimmed = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
    const parent = trimmed.includes('/')
      ? `${trimmed.slice(0, trimmed.lastIndexOf('/') + 1)}`
      : '';
    setPrefix(parent);
  }, [prefix]);

  return (
    <TabsContent value="finder" className="mt-0">
      <div className="flex flex-col gap-3 px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={crumb.value}>
                  <button
                    type="button"
                    className={cn(
                      'hover:text-primary text-xs font-medium transition-colors',
                      prefix === crumb.value && 'text-primary',
                    )}
                    onClick={() => setPrefix(crumb.value)}
                  >
                    {crumb.label}
                  </button>
                  {index < breadcrumbs.length - 1 ? (
                    <span className="text-muted-foreground mx-1">/</span>
                  ) : null}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleUploadClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Upload className="mr-1.5 h-3.5 w-3.5" />
              )}
              Upload
            </Button>
            <Button variant="outline" size="sm" onClick={goUp} disabled={!prefix}>
              Up one level
            </Button>
          </div>
        </div>

        <div className="border-border h-72 overflow-y-auto rounded-md border p-3">
          {isLoading ? (
            <div className="text-muted-foreground flex h-full items-center justify-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {folders.map((folder) => (
                <button
                  type="button"
                  key={folder.key}
                  className="hover:border-primary/60 flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
                  onClick={() => handleSelect(folder)}
                >
                  <FolderIcon className="text-primary h-5 w-5" />
                  <span className="truncate text-sm font-medium">
                    {folder.name}
                  </span>
                </button>
              ))}

              {filteredFiles.map((file) => (
                <button
                  type="button"
                  key={file.key}
                  className="hover:border-primary/60 flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
                  onClick={() => handleSelect(file)}
                  disabled={!file.public_url}
                >
                  {file.previewCategory === 'image' ? (
                    <ImageIcon className="text-foreground h-5 w-5" />
                  ) : (
                    <FileIcon className="text-muted-foreground h-5 w-5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {file.name}
                    </div>
                    <div className="text-muted-foreground truncate text-[11px]">
                      {file.public_url ? 'Public file' : 'Private file'}
                    </div>
                  </div>
                </button>
              ))}

              {!isFetching &&
              folders.length === 0 &&
              filteredFiles.length === 0 ? (
                <div className="text-muted-foreground col-span-full flex h-full items-center justify-center rounded-lg border border-dashed py-10 text-sm">
                  Folder is empty.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
}
