import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { SourceKind } from '@/layouts/os/apps/knowledge-base/types';
import { fetcher } from '@/lib/fetcher';

export type StorageEntry = {
  key: string;
  name: string;
  is_folder: boolean;
  size?: number;
  type?: string | null;
  updated_at?: string | null;
  visibility?: 'public' | 'private' | null;
  public_url?: string | null;
  extension?: string | null;
  directory?: string | null;
  relativePath?: string;
  mime?: string | null;
  sizeLabel?: string | null;
  updatedAtLabel?: string | null;
  updatedAtUnix?: number | null;
  sourceKindHint?: SourceKind | null;
  previewCategory?:
    | 'image'
    | 'video'
    | 'audio'
    | 'document'
    | 'sheet'
    | 'code'
    | 'archive'
    | 'other'
    | null;
  isPreviewable?: boolean;
  isTextLike?: boolean;
};

export type ListResult = {
  prefix: string;
  folders: StorageEntry[];
  files: StorageEntry[];
};

export function useStorageList(prefix: string) {
  const key = useMemo(() => ['storage-list', prefix] as const, [prefix]);
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const data = await fetcher<ListResult>(
        `/api/storage/list?prefix=${encodeURIComponent(prefix)}`,
      );
      const normalizeName = (value: string) => {
        const trimmed = value.replace(/\/+$/, '');
        return trimmed.length ? trimmed : value;
      };
      const ensureFolderKey = (value: string) =>
        value.endsWith('/') ? value : `${value}/`;

      const baseFolders = (data.folders ?? []).map((entry) => {
        const name = normalizeName(entry.name);
        const folder = enrichStorageEntry({
          ...entry,
          key: ensureFolderKey(entry.key),
          name,
          is_folder: true,
          visibility: entry.visibility ?? null,
          public_url: entry.public_url ?? null,
        });
        return folder;
      });

      const folderKeySet = new Set(baseFolders.map((f) => f.key));
      const syntheticFolders: StorageEntry[] = [];

      const normalizedFiles = (data.files ?? [])
        .map((entry) => {
          const folderKey = ensureFolderKey(entry.key);
          const isMarkedFolder =
            entry.is_folder ||
            entry.key.endsWith('/') ||
            (typeof entry.name === 'string' && entry.name.endsWith('/')) ||
            ((!entry.type || entry.type === 'inode/directory') &&
              (!entry.size || entry.size === 0) &&
              !entry.name.includes('.') &&
              !entry.key.includes('.')) ||
            folderKeySet.has(folderKey);
          if (isMarkedFolder) {
            if (!folderKeySet.has(folderKey)) {
              folderKeySet.add(folderKey);
              syntheticFolders.push(
                enrichStorageEntry({
                  ...entry,
                  key: folderKey,
                  name: normalizeName(entry.name),
                  is_folder: true,
                  visibility: entry.visibility ?? null,
                  public_url: entry.public_url ?? null,
                }),
              );
            }
            return null;
          }
          return enrichStorageEntry({
            ...entry,
            is_folder: false,
            visibility: entry.visibility ?? 'private',
            public_url: entry.public_url ?? null,
          });
        })
        .filter((entry): entry is StorageEntry => Boolean(entry));

      const folders = [...baseFolders, ...syntheticFolders].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      const files = normalizedFiles.sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      return { ...data, folders, files };
    },
    staleTime: 45_000,
  });
  return query;
}

const SOURCE_KIND_EXTENSION_MAP: Record<string, SourceKind> = {
  pdf: 'pdf',
  doc: 'docx',
  docx: 'docx',
  ppt: 'docx',
  pptx: 'docx',
  txt: 'md',
  md: 'md',
  markdown: 'md',
  csv: 'sheet',
  tsv: 'sheet',
  xls: 'sheet',
  xlsx: 'sheet',
  numbers: 'sheet',
  ods: 'sheet',
  html: 'web',
  htm: 'web',
};

const MIME_TO_SOURCE_KIND: Record<string, SourceKind> = {
  'application/pdf': 'pdf',
  'application/msword': 'docx',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'application/vnd.ms-powerpoint': 'docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation':
    'docx',
  'text/plain': 'md',
  'text/markdown': 'md',
  'text/csv': 'sheet',
  'text/tab-separated-values': 'sheet',
  'application/vnd.ms-excel': 'sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'sheet',
  'text/html': 'web',
};

const EXTENSION_MIME_MAP: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  md: 'text/markdown',
  markdown: 'text/markdown',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  numbers: 'application/vnd.apple.numbers',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  html: 'text/html',
  htm: 'text/html',
  json: 'application/json',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  mdx: 'text/markdown',
};

type PreviewCategory =
  | 'image'
  | 'video'
  | 'audio'
  | 'document'
  | 'sheet'
  | 'code'
  | 'archive'
  | 'other';

const CODE_EXTENSIONS = new Set([
  'js',
  'jsx',
  'ts',
  'tsx',
  'py',
  'rb',
  'php',
  'java',
  'c',
  'cpp',
  'cs',
  'go',
  'rs',
  'swift',
  'kt',
  'm',
  'sh',
  'bash',
  'json',
  'xml',
  'yaml',
  'yml',
  'mdx',
]);

const ARCHIVE_EXTENSIONS = new Set([
  'zip',
  'rar',
  '7z',
  'tar',
  'gz',
  'tgz',
  'bz2',
]);

function enrichStorageEntry(entry: StorageEntry): StorageEntry {
  const normalizedKey = entry.key ?? '';
  const trimmedKey = entry.is_folder
    ? normalizedKey.replace(/\/+/g, '/').replace(/\/+$/, '/')
    : normalizedKey.replace(/\/+/g, '/');

  const segments = trimmedKey.split('/').filter(Boolean);
  const parentSegments = entry.is_folder
    ? segments.slice(0, -1)
    : segments.slice(0, -1);
  const directory = parentSegments.length > 0 ? parentSegments.join('/') : null;

  const extension = !entry.is_folder ? guessExtension(entry.name) : null;
  const mime =
    entry.type ?? (extension ? (EXTENSION_MIME_MAP[extension] ?? null) : null);

  const sourceKind = !entry.is_folder ? inferSourceKind(extension, mime) : null;

  const inferredCategory = entry.is_folder
    ? null
    : inferPreviewCategory(extension, mime);

  const previewCategory = entry.is_folder
    ? null
    : (inferredCategory ?? 'other');

  const isPreviewable = previewCategory
    ? ['image', 'document', 'code', 'sheet'].includes(previewCategory)
    : false;

  const isTextLike = previewCategory
    ? ['document', 'code', 'sheet'].includes(previewCategory)
    : false;

  const sizeLabel =
    typeof entry.size === 'number' ? formatBytes(entry.size) : null;

  let updatedAtUnix: number | null = null;
  let updatedAtLabel: string | null = null;
  if (entry.updated_at) {
    const parsed = Date.parse(entry.updated_at);
    if (!Number.isNaN(parsed)) {
      updatedAtUnix = parsed;
      updatedAtLabel = new Date(parsed).toLocaleString();
    }
  }

  return {
    ...entry,
    key: trimmedKey,
    relativePath: trimmedKey,
    directory,
    extension,
    mime,
    sourceKindHint: sourceKind,
    previewCategory,
    isPreviewable,
    isTextLike,
    sizeLabel,
    updatedAtLabel,
    updatedAtUnix,
  };
}

function guessExtension(name: string): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot === -1 || lastDot === trimmed.length - 1) {
    return null;
  }
  return trimmed.slice(lastDot + 1).toLowerCase();
}

function inferSourceKind(
  extension: string | null,
  mime: string | null,
): SourceKind | null {
  if (extension && SOURCE_KIND_EXTENSION_MAP[extension]) {
    return SOURCE_KIND_EXTENSION_MAP[extension];
  }
  if (mime && MIME_TO_SOURCE_KIND[mime]) {
    return MIME_TO_SOURCE_KIND[mime];
  }
  return null;
}

function inferPreviewCategory(
  extension: string | null,
  mime: string | null,
): PreviewCategory {
  if (mime) {
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime === 'text/csv' || mime === 'text/tab-separated-values') {
      return 'sheet';
    }
    if (mime.startsWith('text/') || mime === 'application/pdf') {
      return 'document';
    }
    if (
      mime === 'application/json' ||
      mime === 'application/xml' ||
      mime === 'application/javascript'
    ) {
      return 'code';
    }
  }

  if (extension) {
    if (CODE_EXTENSIONS.has(extension)) return 'code';
    if (ARCHIVE_EXTENSIONS.has(extension)) return 'archive';
    if (['csv', 'tsv', 'xls', 'xlsx', 'numbers', 'ods'].includes(extension)) {
      return 'sheet';
    }
    if (
      [
        'pdf',
        'md',
        'markdown',
        'txt',
        'doc',
        'docx',
        'ppt',
        'pptx',
        'html',
        'htm',
      ].includes(extension)
    ) {
      return 'document';
    }
    if (
      [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'svg',
        'bmp',
        'tiff',
        'ico',
      ].includes(extension)
    ) {
      return 'image';
    }
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
      return 'video';
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
      return 'audio';
    }
  }

  return 'other';
}

function formatBytes(size: number): string {
  if (!Number.isFinite(size) || size < 0) {
    return '—';
  }
  if (size === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let index = 0;
  let value = size;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const precision = value >= 10 || index === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[index]}`;
}

export function useStorageActions(prefix: string) {
  const qc = useQueryClient();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ['storage-list', prefix] });

  const createFolder = useMutation({
    mutationFn: async (name: string) =>
      fetcher(`/api/storage/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, name }),
      }),
    onSuccess: invalidate,
  });

  const uploadOne = useMutation({
    mutationFn: async ({
      file,
      visibility,
    }: {
      file: File;
      visibility: 'public' | 'private';
    }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('prefix', prefix);
      form.append('visibility', visibility);
      return fetcher(`/api/storage/upload`, { method: 'POST', body: form });
    },
    onSuccess: invalidate,
  });

  async function uploadFiles(
    files: FileList | File[],
    visibility: 'public' | 'private' = 'private',
  ) {
    const iterable = Array.isArray(files) ? files : Array.from(files);
    for (const file of iterable) {
      await uploadOne.mutateAsync({ file, visibility });
    }
  }

  const rename = useMutation({
    mutationFn: async ({ key, newName }: { key: string; newName: string }) =>
      fetcher(`/api/storage/rename`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, new_name: newName }),
      }),
    onSuccess: invalidate,
  });

  const move = useMutation({
    mutationFn: async ({
      key,
      destPrefix,
    }: {
      key: string;
      destPrefix: string;
    }) =>
      fetcher(`/api/storage/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, dest_prefix: destPrefix }),
      }),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async ({
      key,
      recursive,
    }: {
      key: string;
      recursive: boolean;
    }) =>
      fetcher(
        `/api/storage/object?key=${encodeURIComponent(key)}&recursive=${recursive ? '1' : '0'}`,
        {
          method: 'DELETE',
        },
      ),
    onSuccess: invalidate,
  });

  const setVisibility = useMutation({
    mutationFn: async ({
      key,
      visibility,
    }: {
      key: string;
      visibility: 'public' | 'private';
    }) =>
      fetcher(`/api/storage/visibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, visibility }),
      }),
    onSuccess: invalidate,
  });

  async function downloadUrl(key: string, ttl = 600): Promise<string> {
    const data = await fetcher<{ url: string }>(
      `/api/storage/download-url?key=${encodeURIComponent(key)}&ttl=${ttl}`,
    );
    return data.url;
  }

  return {
    createFolder,
    uploadOne,
    uploadFiles,
    rename,
    move,
    remove,
    setVisibility,
    downloadUrl,
  };
}
