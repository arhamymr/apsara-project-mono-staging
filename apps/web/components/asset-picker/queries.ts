import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export type StorageEntry = {
  key: string;
  name: string;
  is_folder: boolean;
  size?: number;
  type?: string | null;
  updated_at?: string | null;
  public_url?: string | null;
  // Enriched fields
  extension?: string | null;
  mime?: string | null;
  previewCategory?: 'image' | 'video' | 'audio' | 'document' | 'code' | 'archive' | 'other' | null;
};

export type ListResult = {
  prefix: string;
  folders: StorageEntry[];
  files: StorageEntry[];
};

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

function enrichEntry(entry: StorageEntry): StorageEntry {
  if (entry.is_folder) return entry;

  const extension = guessExtension(entry.name);
  const mime = entry.type || guessMime(extension);
  const previewCategory = inferPreviewCategory(extension, mime);

  return {
    ...entry,
    extension,
    mime,
    previewCategory,
  };
}

function guessExtension(name: string): string | null {
  if (!name) return null;
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1 || lastDot === name.length - 1) return null;
  return name.slice(lastDot + 1).toLowerCase();
}

function guessMime(ext: string | null): string | null {
  if (!ext) return null;
  const map: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', ico: 'image/x-icon',
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
    pdf: 'application/pdf', json: 'application/json',
  };
  return map[ext] || null;
}

function inferPreviewCategory(ext: string | null, mime: string | null): StorageEntry['previewCategory'] {
  if (mime?.startsWith('image/')) return 'image';
  if (mime?.startsWith('video/')) return 'video';
  if (mime?.startsWith('audio/')) return 'audio';

  const codeExts = new Set(['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'json', 'yaml', 'yml', 'md', 'html', 'css']);
  const archiveExts = new Set(['zip', 'rar', '7z', 'tar', 'gz']);
  const docExts = new Set(['pdf', 'doc', 'docx', 'txt']);

  if (ext && codeExts.has(ext)) return 'code';
  if (ext && archiveExts.has(ext)) return 'archive';
  if (ext && docExts.has(ext)) return 'document';

  return 'other';
}

export function useStorageList(prefix: string) {
  const key = useMemo(() => ['storage-list', prefix] as const, [prefix]);

  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const data = await fetcher<ListResult>(
        `/storage/list?prefix=${encodeURIComponent(prefix)}`
      );

      const folders = (data.folders ?? []).map(enrichEntry);
      const files = (data.files ?? []).map(enrichEntry);

      return { ...data, folders, files };
    },
    staleTime: 45_000,
  });
}

export function useStorageActions(prefix: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['storage-list', prefix] });

  const createFolder = useMutation({
    mutationFn: async (name: string) =>
      fetcher(`/storage/folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prefix, name }),
      }),
    onSuccess: invalidate,
  });

  const uploadOne = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const form = new FormData();
      form.append('file', file);
      form.append('prefix', prefix);
      return fetcher<StorageEntry>(`/storage/upload`, { method: 'POST', body: form });
    },
    onSuccess: invalidate,
  });

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.isArray(files) ? files : Array.from(files);
    for (const file of arr) {
      await uploadOne.mutateAsync({ file });
    }
  }

  const remove = useMutation({
    mutationFn: async ({ key, recursive }: { key: string; recursive: boolean }) =>
      fetcher(`/storage/object?key=${encodeURIComponent(key)}&recursive=${recursive ? '1' : '0'}`, {
        method: 'DELETE',
      }),
    onSuccess: invalidate,
  });

  async function downloadUrl(key: string, ttl = 600): Promise<string> {
    const data = await fetcher<{ url: string }>(
      `/storage/download-url?key=${encodeURIComponent(key)}&ttl=${ttl}`
    );
    return data.url;
  }

  return {
    createFolder,
    uploadOne,
    uploadFiles,
    remove,
    downloadUrl,
  };
}
