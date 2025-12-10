import { Button } from '@workspace/ui/components/button';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Loader2, RefreshCw } from 'lucide-react';
import type { Artifact } from './types';

interface ArtifactListProps {
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  isLoading: boolean;
  onSelect: (artifact: Artifact) => void;
  onRefresh: () => void;
}

export function ArtifactList({
  artifacts,
  selectedArtifact,
  isLoading,
  onSelect,
  onRefresh,
}: ArtifactListProps) {
  if (isLoading) {
    return (
      <div className="flex h-full w-64 items-center justify-center border-r">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-64 border-r">
      <div className="bg-muted/50 flex items-center justify-between border-b px-3 py-2">
        <h3 className="text-xs font-semibold uppercase">
          Artifacts ({artifacts.length})
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onRefresh}
        >
          <RefreshCw size={14} />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100%-41px)]">
        <div className="space-y-1 p-2">
          {artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className={`hover:bg-muted cursor-pointer rounded-lg p-2 transition-colors ${
                selectedArtifact?.id === artifact.id ? 'bg-muted' : ''
              }`}
              onClick={() => onSelect(artifact)}
            >
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-xs font-semibold">
                  v{artifact.version}
                </span>
              </div>
              <p className="mt-1 truncate text-sm font-medium">
                {artifact.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {artifact.file_count} files
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
