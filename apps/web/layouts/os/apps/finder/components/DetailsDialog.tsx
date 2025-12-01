import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Label } from '@workspace/ui/components/label';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import type {
  KnowledgeBase,
  KnowledgeBaseCollection,
} from '@/layouts/os/apps/knowledge-base/types';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StorageEntry } from '../queries';
import { formatDate, formatSize } from '../utils';

type DetailsDialogProps = {
  open: boolean;
  details: StorageEntry | null;
  detailsUrl: string | null;
  detailsUrlStatus: 'idle' | 'loading' | 'error';
  portalContainer?: HTMLElement;
  onOpenChange: (open: boolean) => void;
  onAddToKnowledgeBase: () => void;
  addSourceDisabled: boolean;
  knowledgeBases: KnowledgeBase[];
  knowledgeBasesStatus: { isLoading: boolean; isError: boolean };
  selectedKnowledgeBaseId: number | null;
  onSelectKnowledgeBase: (value: number | null) => void;
  selectedCollectionId: number | null;
  onSelectCollection: (value: number | null) => void;
  collections: KnowledgeBaseCollection[];
  collectionsStatus: { isLoading: boolean; isError: boolean };
  isAddingToKnowledgeBase: boolean;
};

export function DetailsDialog({
  open,
  details,
  detailsUrl,
  detailsUrlStatus,
  portalContainer,
  onOpenChange,
  onAddToKnowledgeBase,
  addSourceDisabled,
  knowledgeBases,
  knowledgeBasesStatus,
  selectedKnowledgeBaseId,
  onSelectKnowledgeBase,
  selectedCollectionId,
  onSelectCollection,
  collections,
  collectionsStatus,
  isAddingToKnowledgeBase,
}: DetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="h-full max-h-[600px] max-w-lg overflow-x-auto p-2"
        portalContainer={portalContainer}
        overlayClassName="bg-black/60"
      >
        <ScrollArea>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          {details && (
            <div className="mt-2 rounded border">
              <table className="min-w-full text-left text-sm">
                <tbody>
                  <DetailRow label="Name" value={details.name} />
                  <DetailRow label="Key" value={details.key} />
                  {details.directory ? (
                    <DetailRow label="Directory" value={details.directory} />
                  ) : null}
                  <DetailRow
                    label="Folder"
                    value={details.is_folder ? 'Yes' : 'No'}
                  />
                  {!details.is_folder ? (
                    <DetailRow
                      label="Extension"
                      value={details.extension ?? '—'}
                    />
                  ) : null}
                  <DetailRow
                    label="Size"
                    value={details.sizeLabel ?? formatSize(details.size)}
                  />
                  <DetailRow
                    label="MIME Type"
                    value={details.mime || details.type || '—'}
                  />
                  <DetailRow
                    label="Category"
                    value={(details.previewCategory || '—').toString()}
                  />
                  <DetailRow
                    label="Source Kind"
                    value={details.sourceKindHint ?? '—'}
                  />
                  <DetailRow
                    label="Visibility"
                    value={details.visibility ?? 'private'}
                  />
                  {!details.is_folder && (
                    <DetailRow
                      label="URL"
                      value={renderUrlCell(detailsUrlStatus, detailsUrl)}
                    />
                  )}
                  {!details.is_folder && details.public_url ? (
                    <DetailRow
                      label="Public URL"
                      value={
                        <a
                          href={details.public_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary break-all underline"
                        >
                          {details.public_url}
                        </a>
                      }
                    />
                  ) : null}
                  <DetailRow
                    label="Last Updated"
                    value={
                      details.updatedAtLabel ??
                      (details.updated_at
                        ? formatDate(details.updated_at)
                        : '—')
                    }
                  />
                </tbody>
              </table>
              {!details.is_folder && (
                <div className="border-border bg-muted/20 border-t px-3 py-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">
                        Add to Knowledge Base
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Select the destination knowledge base and collection to
                        queue this file for ingestion.
                      </p>
                    </div>
                    <div className="grid gap-3">
                      <div className="grid gap-1">
                        <Label className="text-xs">Knowledge Base</Label>
                        <Select
                          value={
                            selectedKnowledgeBaseId
                              ? String(selectedKnowledgeBaseId)
                              : undefined
                          }
                          onValueChange={(value) => {
                            const parsed = Number(value);
                            onSelectKnowledgeBase(
                              Number.isNaN(parsed) ? null : parsed,
                            );
                          }}
                          disabled={
                            knowledgeBasesStatus.isLoading ||
                            knowledgeBases.length === 0 ||
                            isAddingToKnowledgeBase
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                knowledgeBasesStatus.isLoading
                                  ? 'Loading knowledge bases...'
                                  : 'Select knowledge base'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent portalContainer={portalContainer}>
                            {knowledgeBases.map((kb) => (
                              <SelectItem key={kb.id} value={String(kb.id)}>
                                {kb.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {knowledgeBasesStatus.isError && (
                          <p className="text-destructive text-xs">
                            Unable to load knowledge bases.
                          </p>
                        )}
                        {knowledgeBases.length === 0 &&
                          !knowledgeBasesStatus.isLoading && (
                            <p className="text-muted-foreground text-xs">
                              Create a knowledge base first to start ingesting
                              files.
                            </p>
                          )}
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs">Collection (optional)</Label>
                        <Select
                          value={
                            selectedCollectionId
                              ? String(selectedCollectionId)
                              : '__none'
                          }
                          onValueChange={(value) => {
                            if (value === '__none') {
                              onSelectCollection(null);
                              return;
                            }
                            const parsed = Number(value);
                            onSelectCollection(
                              Number.isNaN(parsed) ? null : parsed,
                            );
                          }}
                          disabled={
                            !selectedKnowledgeBaseId ||
                            collectionsStatus.isLoading ||
                            collections.length === 0 ||
                            isAddingToKnowledgeBase
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !selectedKnowledgeBaseId
                                  ? 'Select a knowledge base first'
                                  : collectionsStatus.isLoading
                                    ? 'Loading collections...'
                                    : 'No collection'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent portalContainer={portalContainer}>
                            <SelectItem value="__none">
                              No collection
                            </SelectItem>
                            {collections.map((collection) => (
                              <SelectItem
                                key={collection.id}
                                value={String(collection.id)}
                              >
                                {collection.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {collectionsStatus.isError && (
                          <p className="text-destructive text-xs">
                            Unable to load collections.
                          </p>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          onClick={onAddToKnowledgeBase}
                          disabled={addSourceDisabled}
                        >
                          {isAddingToKnowledgeBase && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Add Source
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-muted/30 text-muted-foreground px-3 py-2 text-xs">
                Raw JSON
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function renderUrlCell(
  status: 'idle' | 'loading' | 'error',
  url: string | null,
) {
  if (status === 'loading') return 'Generating...';
  if (status === 'error') return 'Failed to generate';
  if (!url) return '—';
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-primary break-all underline"
    >
      {url}
    </a>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <tr className="border-b last:border-b-0">
      <th className="bg-muted/40 px-3 py-2 text-xs font-semibold tracking-wide uppercase">
        {label}
      </th>
      <td className="px-3 py-2 text-sm">{value}</td>
    </tr>
  );
}
