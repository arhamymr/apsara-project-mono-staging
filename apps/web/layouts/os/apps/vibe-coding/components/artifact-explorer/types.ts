import type { FileManifestItem } from '@/lib/file-utils';

export interface Artifact {
  id: string;
  version: number;
  title: string;
  description?: string;
  file_count: number;
  total_size: number;
  trigger: 'manual' | 'auto' | 'milestone';
  metadata?: {
    framework?: string;
    language?: string;
  };
  created_at: string;
}

export interface ArtifactDetails extends Artifact {
  file_manifest: FileManifestItem[];
}

export interface ArtifactsResponse {
  artifacts: Artifact[];
}

export interface ArtifactDetailsResponse {
  artifact: ArtifactDetails;
}

export interface FileContentResponse {
  path: string;
  content: string;
}
