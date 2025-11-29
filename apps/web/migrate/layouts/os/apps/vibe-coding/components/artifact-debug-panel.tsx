import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetcher } from '@/lib/fetcher';
import { useQuery } from '@tanstack/react-query';
import {
  Archive,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileCode,
  Loader2,
  Package,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Artifact {
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
    dependencies?: string[];
    features?: string[];
  };
  created_at: string;
}

interface ArtifactDebugPanelProps {
  sessionId: string;
}

export function ArtifactDebugPanel({ sessionId }: ArtifactDebugPanelProps) {
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(
    null,
  );
  const [expandedArtifact, setExpandedArtifact] = useState<string | null>(null);

  const {
    data: artifactsData,
    isLoading,
    refetch,
  } = useQuery<{ artifacts: Artifact[] }>({
    queryKey: ['artifacts', sessionId],
    queryFn: () => fetcher(`/api/sessions/${sessionId}/artifacts`),
    enabled: !!sessionId,
  });

  const artifacts = artifactsData?.artifacts || [];

  const handleDownload = async (artifactId: string, title: string) => {
    try {
      const response = await fetch(`/api/artifacts/${artifactId}/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
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
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download artifact');
    }
  };

  const handleDelete = async (artifactId: string) => {
    if (!confirm('Are you sure you want to delete this artifact?')) return;

    try {
      await fetcher(`/api/artifacts/${artifactId}`, {
        method: 'DELETE',
      });

      toast.success('Artifact deleted');
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete artifact');
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTriggerBadge = (trigger: string) => {
    const colors = {
      manual: 'bg-blue-500/10 text-blue-500',
      auto: 'bg-green-500/10 text-green-500',
      milestone: 'bg-purple-500/10 text-purple-500',
    };
    return colors[trigger as keyof typeof colors] || colors.auto;
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
          <Archive className="text-muted-foreground h-10 w-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No Artifacts Yet</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          Artifacts are saved versions of your generated code. Ask the agent to
          save your work to create your first artifact.
        </p>
        <div className="bg-muted/50 mt-6 rounded-lg border p-4">
          <p className="text-sm font-medium">Try saying:</p>
          <ul className="text-muted-foreground mt-2 space-y-1 text-left text-sm">
            <li>• "Save this as version 1"</li>
            <li>• "Create a snapshot of the current code"</li>
            <li>• "Save this milestone"</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Artifacts List */}
      <ScrollArea className="w-80 border-r">
        <div className="bg-muted/50 border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Artifacts ({artifacts.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="space-y-2 p-3">
          {artifacts.map((artifact: Artifact) => (
            <div
              key={artifact.id}
              className={`border-border hover:bg-muted/50 cursor-pointer rounded-lg border p-3 transition-colors ${
                selectedArtifact?.id === artifact.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedArtifact(artifact)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold">
                      v{artifact.version}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${getTriggerBadge(artifact.trigger)}`}
                    >
                      {artifact.trigger}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-medium">{artifact.title}</h4>
                  <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <FileCode size={12} />
                      {artifact.file_count} files
                    </span>
                    <span>{formatBytes(artifact.total_size)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedArtifact(
                      expandedArtifact === artifact.id ? null : artifact.id,
                    );
                  }}
                >
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${expandedArtifact === artifact.id ? 'rotate-90' : ''}`}
                  />
                </Button>
              </div>

              {expandedArtifact === artifact.id && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(artifact.id, artifact.title);
                    }}
                  >
                    <Download size={14} className="mr-2" />
                    Download ZIP
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(artifact.id);
                    }}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Artifact Details */}
      <div className="flex-1">
        {selectedArtifact ? (
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary rounded px-3 py-1 text-sm font-semibold">
                      Version {selectedArtifact.version}
                    </span>
                    <span
                      className={`rounded px-3 py-1 text-sm font-medium ${getTriggerBadge(selectedArtifact.trigger)}`}
                    >
                      {selectedArtifact.trigger}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold">
                    {selectedArtifact.title}
                  </h2>
                  {selectedArtifact.description && (
                    <p className="text-muted-foreground mt-2">
                      {selectedArtifact.description}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() =>
                    handleDownload(selectedArtifact.id, selectedArtifact.title)
                  }
                >
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>

              {/* Stats */}
              <div className="bg-muted/50 mb-6 grid grid-cols-3 gap-4 rounded-lg p-4">
                <div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <FileCode size={16} />
                    Files
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {selectedArtifact.file_count}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Package size={16} />
                    Size
                  </div>
                  <div className="mt-1 text-2xl font-semibold">
                    {formatBytes(selectedArtifact.total_size)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar size={16} />
                    Created
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {formatDate(selectedArtifact.created_at)}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              {selectedArtifact.metadata && (
                <div className="space-y-4">
                  {selectedArtifact.metadata.framework && (
                    <div>
                      <h3 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                        Framework
                      </h3>
                      <div className="bg-muted inline-block rounded-lg px-3 py-1.5 font-mono text-sm">
                        {selectedArtifact.metadata.framework}
                      </div>
                    </div>
                  )}

                  {selectedArtifact.metadata.language && (
                    <div>
                      <h3 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                        Language
                      </h3>
                      <div className="bg-muted inline-block rounded-lg px-3 py-1.5 font-mono text-sm">
                        {selectedArtifact.metadata.language}
                      </div>
                    </div>
                  )}

                  {selectedArtifact.metadata.dependencies &&
                    selectedArtifact.metadata.dependencies.length > 0 && (
                      <div>
                        <h3 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                          Dependencies
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedArtifact.metadata.dependencies.map((dep) => (
                            <div
                              key={dep}
                              className="bg-muted rounded-lg px-3 py-1.5 font-mono text-sm"
                            >
                              {dep}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedArtifact.metadata.features &&
                    selectedArtifact.metadata.features.length > 0 && (
                      <div>
                        <h3 className="text-muted-foreground mb-2 text-sm font-semibold uppercase">
                          Features
                        </h3>
                        <ul className="space-y-2">
                          {selectedArtifact.metadata.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm"
                            >
                              <div className="bg-primary/20 h-1.5 w-1.5 rounded-full" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Eye className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-4">
                Select an artifact to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
