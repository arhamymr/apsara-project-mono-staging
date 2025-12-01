import { Badge } from '@workspace/ui/components/badge';
import { Card } from '@workspace/ui/components/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import type {
  KnowledgeBase,
  KnowledgeBaseCollection,
} from '@/layouts/os/apps/knowledge-base/types';
import { useStorageActions, type StorageEntry } from './queries';

export function FileList({
  prefix,
  folders,
  files,
  onOpen,
  onPreview,
  onShowDetails,
  isLoading = false,
  onCreateFolder,
  onTriggerUpload,
  onSetVisibility,
  isCreatingFolder = false,
  knowledgeBases,
  knowledgeBasesLoading,
  knowledgeBasesError,
  collectionsByKnowledgeBase,
  collectionStatusByKnowledgeBase,
  onAddToKnowledgeBase,
  isAddingToKnowledgeBase,
}: {
  prefix: string;
  folders: StorageEntry[];
  files: StorageEntry[];
  onOpen: (prefixOrKey: string, isFolder: boolean) => void;
  onPreview: (entry: StorageEntry) => void;
  onShowDetails: (entry: StorageEntry) => void;
  isLoading?: boolean;
  onCreateFolder: () => void | Promise<void>;
  onTriggerUpload: (visibility?: 'public' | 'private') => void;
  onSetVisibility: (
    entry: StorageEntry,
    visibility: 'public' | 'private',
  ) => void | Promise<void>;
  isCreatingFolder?: boolean;
  knowledgeBases: KnowledgeBase[];
  knowledgeBasesLoading: boolean;
  knowledgeBasesError: boolean;
  collectionsByKnowledgeBase: Record<number, KnowledgeBaseCollection[]>;
  collectionStatusByKnowledgeBase: Record<
    number,
    { isLoading: boolean; isError: boolean }
  >;
  onAddToKnowledgeBase: (
    entry: StorageEntry,
    knowledgeBaseId: number,
    collectionId: number | null,
  ) => void;
  isAddingToKnowledgeBase: boolean;
}) {
  const actions = useStorageActions(prefix);

  const onDelete = async (entry: StorageEntry) => {
    if (!confirm(`Delete ${entry.name}${entry.is_folder ? ' (folder)' : ''}?`))
      return;
    await actions.remove.mutateAsync({
      key: entry.key,
      recursive: entry.is_folder,
    });
  };
  const onRename = async (entry: StorageEntry) => {
    const nn = prompt('Rename to:', entry.name);
    if (!nn || nn === entry.name) return;
    await actions.rename.mutateAsync({ key: entry.key, newName: nn });
  };
  const onMove = async (entry: StorageEntry) => {
    const dest = prompt(
      'Move to folder (prefix, e.g. "projects/design/"):',
      '',
    );
    if (!dest) return;
    await actions.move.mutateAsync({ key: entry.key, destPrefix: dest });
  };
  const isEmpty = !isLoading && folders.length === 0 && files.length === 0;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card className="bg-card/70 overflow-hidden rounded-sm border">
          {isEmpty ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 px-6 py-10 text-sm">
              <span className="text-xl" role="img" aria-label="folder">
                📁
              </span>
              This folder is empty. Upload files or create a folder.
            </div>
          ) : (
            <ScrollArea className="max-h-[420px]">
              <Table>
                <TableBody>
                  {[...folders, ...files].map((entry) => (
                    <ContextMenu key={entry.key}>
                      <ContextMenuTrigger asChild>
                        <TableRow
                          className="hover:bg-muted/50 cursor-pointer"
                          onDoubleClick={() =>
                            onOpen(entry.key, entry.is_folder)
                          }
                          onClick={() =>
                            entry.is_folder
                              ? onOpen(entry.key, true)
                              : onPreview(entry)
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 items-center justify-center">
                                {entry.is_folder ? (
                                  <span
                                    className="text-xl"
                                    role="img"
                                    aria-label="folder"
                                  >
                                    📁
                                  </span>
                                ) : (
                                  <span
                                    className="text-xl"
                                    role="img"
                                    aria-label={ariaForFile(
                                      entry.type,
                                      entry.name,
                                    )}
                                  >
                                    {emojiForFile(entry.type, entry.name)}
                                  </span>
                                )}
                              </span>
                              <div className="space-y-1">
                                <p className="truncate text-xs">
                                  {entry.name}
                                  {entry.is_folder ? '/' : ''}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {!entry.is_folder ? humanSize(entry.size) : '—'}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {entry.is_folder ? (
                              '—'
                            ) : (
                              <Badge
                                variant={
                                  entry.visibility === 'public'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className="text-[10px] uppercase"
                              >
                                {entry.visibility === 'public'
                                  ? 'Public'
                                  : 'Private'}
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {entry.updated_at
                              ? new Date(entry.updated_at).toLocaleString()
                              : '—'}
                          </TableCell>
                        </TableRow>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          onSelect={() => onOpen(entry.key, entry.is_folder)}
                        >
                          Open
                        </ContextMenuItem>
                        {!entry.is_folder && (
                          <ContextMenuItem onSelect={() => onPreview(entry)}>
                            Preview
                          </ContextMenuItem>
                        )}
                        <ContextMenuItem onSelect={() => onRename(entry)}>
                          Rename
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => onMove(entry)}>
                          Move
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => onShowDetails(entry)}>
                          Details
                        </ContextMenuItem>
                        {!entry.is_folder && (
                          <>
                            <ContextMenuSeparator />
                            <ContextMenuSub>
                              <ContextMenuSubTrigger>
                                Add to Knowledge Base
                              </ContextMenuSubTrigger>
                              <ContextMenuSubContent>
                                {knowledgeBasesLoading ? (
                                  <ContextMenuItem disabled>
                                    Loading knowledge bases...
                                  </ContextMenuItem>
                                ) : knowledgeBasesError ? (
                                  <ContextMenuItem disabled>
                                    Failed to load knowledge bases
                                  </ContextMenuItem>
                                ) : knowledgeBases.length === 0 ? (
                                  <ContextMenuItem disabled>
                                    No knowledge bases available
                                  </ContextMenuItem>
                                ) : (
                                  knowledgeBases.map((kb) => {
                                    const status =
                                      collectionStatusByKnowledgeBase[
                                        kb.id
                                      ] ?? {
                                        isLoading: false,
                                        isError: false,
                                      };
                                    const collections =
                                      collectionsByKnowledgeBase[kb.id] ?? [];
                                    return (
                                      <ContextMenuSub key={kb.id}>
                                        <ContextMenuSubTrigger>
                                          {kb.title}
                                        </ContextMenuSubTrigger>
                                        <ContextMenuSubContent>
                                          <ContextMenuItem
                                            disabled={isAddingToKnowledgeBase}
                                            onSelect={() =>
                                              onAddToKnowledgeBase(
                                                entry,
                                                kb.id,
                                                null,
                                              )
                                            }
                                          >
                                            No collection
                                          </ContextMenuItem>
                                          {status.isLoading ? (
                                            <ContextMenuItem disabled>
                                              Loading collections...
                                            </ContextMenuItem>
                                          ) : status.isError ? (
                                            <ContextMenuItem disabled>
                                              Failed to load collections
                                            </ContextMenuItem>
                                          ) : collections.length === 0 ? (
                                            <ContextMenuItem disabled>
                                              No collections available
                                            </ContextMenuItem>
                                          ) : (
                                            collections.map((collection) => (
                                              <ContextMenuItem
                                                key={collection.id}
                                                disabled={
                                                  isAddingToKnowledgeBase
                                                }
                                                onSelect={() =>
                                                  onAddToKnowledgeBase(
                                                    entry,
                                                    kb.id,
                                                    collection.id,
                                                  )
                                                }
                                              >
                                                {collection.name}
                                              </ContextMenuItem>
                                            ))
                                          )}
                                        </ContextMenuSubContent>
                                      </ContextMenuSub>
                                    );
                                  })
                                )}
                              </ContextMenuSubContent>
                            </ContextMenuSub>
                          </>
                        )}
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          className="text-destructive"
                          onSelect={() => onDelete(entry)}
                        >
                          Delete
                        </ContextMenuItem>
                        {!entry.is_folder && (
                          <>
                            <ContextMenuSeparator />
                            <ContextMenuSub>
                              <ContextMenuSubTrigger>
                                Visibility
                              </ContextMenuSubTrigger>
                              <ContextMenuSubContent>
                                <ContextMenuRadioGroup
                                  value={
                                    (entry.visibility ?? 'private') as
                                      | 'public'
                                      | 'private'
                                  }
                                  onValueChange={(value) =>
                                    onSetVisibility(
                                      entry,
                                      value as 'public' | 'private',
                                    )
                                  }
                                >
                                  <ContextMenuRadioItem value="public">
                                    Public
                                  </ContextMenuRadioItem>
                                  <ContextMenuRadioItem value="private">
                                    Private
                                  </ContextMenuRadioItem>
                                </ContextMenuRadioGroup>
                              </ContextMenuSubContent>
                            </ContextMenuSub>
                          </>
                        )}
                        <ContextMenuSeparator />
                        <ContextMenuItem
                          disabled={isCreatingFolder}
                          onSelect={() => void onCreateFolder()}
                        >
                          New Folder
                        </ContextMenuItem>
                        <ContextMenuSub>
                          <ContextMenuSubTrigger>
                            Upload Files
                          </ContextMenuSubTrigger>
                          <ContextMenuSubContent>
                            <ContextMenuItem
                              onSelect={() => onTriggerUpload('private')}
                            >
                              Private
                            </ContextMenuItem>
                            <ContextMenuItem
                              onSelect={() => onTriggerUpload('public')}
                            >
                              Public
                            </ContextMenuItem>
                          </ContextMenuSubContent>
                        </ContextMenuSub>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          disabled={isCreatingFolder}
          onSelect={() => void onCreateFolder()}
        >
          New Folder
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Upload Files</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onSelect={() => onTriggerUpload('private')}>
              Private
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => onTriggerUpload('public')}>
              Public
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function humanSize(bytes?: number) {
  if (bytes === undefined || bytes === null) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(bytes >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function getExt(name?: string) {
  const n = name || '';
  const idx = n.lastIndexOf('.');
  return idx > -1 ? n.slice(idx + 1).toLowerCase() : '';
}

function isImage(mime?: string | null, name?: string) {
  const ext = getExt(name);
  return (
    (mime?.startsWith('image/') ?? false) ||
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)
  );
}

function isAudio(mime?: string | null, name?: string) {
  const ext = getExt(name);
  return (
    (mime?.startsWith('audio/') ?? false) ||
    ['mp3', 'wav', 'ogg', 'm4a'].includes(ext)
  );
}

function isVideo(mime?: string | null, name?: string) {
  const ext = getExt(name);
  return (
    (mime?.startsWith('video/') ?? false) ||
    ['mp4', 'mov', 'webm', 'mkv'].includes(ext)
  );
}

function isArchive(name?: string) {
  const ext = getExt(name);
  return ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);
}

function isCode(name?: string) {
  const ext = getExt(name);
  return [
    'js',
    'ts',
    'tsx',
    'jsx',
    'json',
    'html',
    'css',
    'md',
    'py',
    'rb',
    'go',
    'rs',
    'php',
    'java',
    'cs',
    'c',
    'cpp',
    'sh',
    'yml',
    'yaml',
  ].includes(ext);
}

function isSpreadsheet(name?: string) {
  const ext = getExt(name);
  return ['xls', 'xlsx', 'csv'].includes(ext);
}

function isTextDoc(name?: string) {
  const ext = getExt(name);
  return ['txt', 'md', 'pdf', 'doc', 'docx', 'rtf'].includes(ext);
}

/** Emoji + aria helpers aligned with FileGrid */
function emojiForFile(mime?: string | null, name?: string) {
  if (isImage(mime, name)) return '🖼️';
  if (isAudio(mime, name)) return '🎵';
  if (isVideo(mime, name)) return '🎬';
  if (isArchive(name)) return '🗜️';
  if (isSpreadsheet(name)) return '📊';
  if (isCode(name)) return '💻';
  if (getExt(name) === 'json') return '🧾';
  if (isTextDoc(name)) return '📄';
  return '📄';
}

function ariaForFile(mime?: string | null, name?: string) {
  if (isImage(mime, name)) return 'image file';
  if (isAudio(mime, name)) return 'audio file';
  if (isVideo(mime, name)) return 'video file';
  if (isArchive(name)) return 'archive file';
  if (isSpreadsheet(name)) return 'spreadsheet file';
  if (isCode(name)) return 'code file';
  if (getExt(name) === 'json') return 'json file';
  if (isTextDoc(name)) return 'text document';
  return 'file';
}
