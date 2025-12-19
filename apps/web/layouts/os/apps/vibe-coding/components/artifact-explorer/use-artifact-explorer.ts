import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';
import { toast } from 'sonner';
import type {
  Artifact,
  ArtifactsResponse,
  ArtifactDetailsResponse,
  FileContentResponse,
} from './types';

export function useArtifactExplorer(sessionId: string) {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  // Fetch artifacts list
  const {
    data: artifactsData,
    isLoading: isLoadingArtifacts,
    refetch: refetchArtifacts,
  } = useQuery<ArtifactsResponse>({
    queryKey: ['artifacts', sessionId],
    queryFn: () => fetcher(`/api/sessions/${sessionId}/artifacts`),
    enabled: !!sessionId,
  });

  // Fetch selected artifact details
  const { data: artifactDetails, isLoading: isLoadingDetails } = useQuery<ArtifactDetailsResponse>({
    queryKey: ['artifact', selectedArtifact?.id],
    queryFn: () => fetcher(`/api/artifacts/${selectedArtifact?.id}`),
    enabled: !!selectedArtifact?.id,
  });

  // Fetch selected file content
  const { data: fileData, isLoading: isLoadingFile } = useQuery<FileContentResponse>({
    queryKey: ['artifact-file', selectedArtifact?.id, selectedFile],
    queryFn: () =>
      fetcher(
        `/api/artifacts/${selectedArtifact?.id}/files?path=${encodeURIComponent(selectedFile!)}`,
      ),
    enabled: !!selectedArtifact?.id && !!selectedFile,
  });

  const artifacts = artifactsData?.artifacts || [];

  const toggleFolder = useCallback((pathArray: string[]) => {
    const path = pathArray.join('/');
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  // Collect all folder paths from file manifest
  const getAllFolderPaths = useCallback((): string[] => {
    const folders = new Set<string>();
    const manifest = artifactDetails?.artifact.file_manifest || [];

    manifest.forEach((item) => {
      const parts = item.path.split('/');
      for (let i = 1; i < parts.length; i++) {
        folders.add(parts.slice(0, i).join('/'));
      }
    });

    return Array.from(folders);
  }, [artifactDetails?.artifact.file_manifest]);

  const expandAll = useCallback(() => {
    const allFolders = getAllFolderPaths();
    setExpandedFolders(new Set(allFolders));
  }, [getAllFolderPaths]);

  const collapseAll = useCallback(() => {
    setExpandedFolders(new Set());
  }, []);

  const handleSelectArtifact = useCallback((artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setSelectedFile(null);
  }, []);

  const handleDownload = useCallback(async (artifactId: string, title: string) => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}/download`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Artifact downloaded successfully');
    } catch {
      toast.error('Failed to download artifact');
    }
  }, []);

  return {
    // State
    artifacts,
    selectedArtifact,
    selectedFile,
    expandedFolders,
    artifactDetails,
    fileData,
    // Loading states
    isLoadingArtifacts,
    isLoadingDetails,
    isLoadingFile,
    // Actions
    setSelectedFile,
    toggleFolder,
    expandAll,
    collapseAll,
    handleSelectArtifact,
    handleDownload,
    refetchArtifacts,
  };
}
