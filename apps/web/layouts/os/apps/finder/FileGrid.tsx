// removed Card
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
import type {
  KnowledgeBase,
  KnowledgeBaseCollection,
} from '@/layouts/os/apps/knowledge-base/types';
import { useStorageActions, type StorageEntry } from './queries';

export function FileGrid({
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
        <div className="flex-start flex min-h-[500px] w-full flex-wrap content-start items-start gap-3 rounded-md border border-dashed p-2">
          {isEmpty && (
            <div className="text-muted-foreground flex w-full flex-col items-center justify-center rounded-sm border border-dashed p-10 text-center text-sm">
              <div className="bg-muted mb-2 rounded-full p-3">
                <span className="text-2xl" role="img" aria-label="folder">
                  📁
                </span>
              </div>
              <div className="text-foreground font-medium">
                This folder is empty
              </div>
              <div className="text-muted-foreground text-xs">
                Upload files or create a new folder to get started
              </div>
            </div>
          )}

          {/* Folders */}
          {folders.map((f) => (
            <ContextMenu key={f.key}>
              <ContextMenuTrigger asChild>
                <div
                  onClick={() => onOpen(f.key, true)}
                  onDoubleClick={() => onOpen(f.key, true)}
                  className="hover:bg-muted/10 focus-visible:ring-primary flex min-w-[90px] cursor-pointer flex-col items-center justify-center gap-2 rounded-sm p-4"
                >
                  <div className="flex items-center justify-center rounded-lg bg-transparent">
                    <span className="text-4xl" role="img" aria-label="folder">
                      📁
                    </span>
                  </div>
                  <p className="max-w-[60px] truncate text-xs">{f.name}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => onOpen(f.key, true)}>
                  Open
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onRename(f)}>
                  Rename
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onMove(f)}>
                  Move
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onShowDetails(f)}>
                  Details
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="text-destructive"
                  onSelect={() => onDelete(f)}
                >
                  Delete
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  disabled={isCreatingFolder}
                  onSelect={() => void onCreateFolder()}
                >
                  New Folder
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Upload Files</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onSelect={() => onTriggerUpload('private')}
                    >
                      Private
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onTriggerUpload('public')}>
                      Public
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuContent>
            </ContextMenu>
          ))}

          {/* Files */}
          {files.map((file) => (
            <ContextMenu key={file.key}>
              <ContextMenuTrigger asChild>
                <div
                  onClick={() => onPreview(file)}
                  className="hover:bg-muted/10 focus-visible:ring-primary flex min-w-[90px] cursor-pointer flex-col items-center justify-center gap-2 rounded-sm p-4"
                >
                  <div className="flex items-center justify-center rounded-lg bg-transparent">
                    <span
                      className="text-4xl"
                      role="img"
                      aria-label={ariaForFile(file.type, file.name)}
                    >
                      {emojiForFile(file.type, file.name)}
                    </span>
                  </div>
                  <p className="max-w-[60px] truncate text-xs">{file.name}</p>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onSelect={() => onOpen(file.key, false)}>
                  Open
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onPreview(file)}>
                  Preview
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onRename(file)}>
                  Rename
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onMove(file)}>
                  Move
                </ContextMenuItem>
                <ContextMenuItem onSelect={() => onShowDetails(file)}>
                  Details
                </ContextMenuItem>
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
                        const status = collectionStatusByKnowledgeBase[
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
                                  onAddToKnowledgeBase(file, kb.id, null)
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
                                    disabled={isAddingToKnowledgeBase}
                                    onSelect={() =>
                                      onAddToKnowledgeBase(
                                        file,
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
                <ContextMenuSeparator />
                <ContextMenuItem
                  className="text-destructive"
                  onSelect={() => onDelete(file)}
                >
                  Delete
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Visibility</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuRadioGroup
                      value={
                        (file.visibility ?? 'private') as 'public' | 'private'
                      }
                      onValueChange={(value) =>
                        onSetVisibility(file, value as 'public' | 'private')
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
                <ContextMenuSeparator />
                <ContextMenuItem
                  disabled={isCreatingFolder}
                  onSelect={() => void onCreateFolder()}
                >
                  New Folder
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Upload Files</ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuItem
                      onSelect={() => onTriggerUpload('private')}
                    >
                      Private
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={() => onTriggerUpload('public')}>
                      Public
                    </ContextMenuItem>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
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

/* ---------- Helpers ---------- */

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

/** Emoji mapping */
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
