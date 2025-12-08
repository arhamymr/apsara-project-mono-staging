'use client';

import { Button } from '@workspace/ui/components/button';
import { TabsContent } from '@workspace/ui/components/tabs';
import { Archive, Loader2, Plus } from 'lucide-react';

interface ArtifactsTabProps {
  artifacts: any[];
  isLoading: boolean;
  onCreateDummyArtifact: (projectType?: 'react' | 'html') => Promise<void>;
}

export function ArtifactsTab({
  artifacts,
  isLoading,
  onCreateDummyArtifact,
}: ArtifactsTabProps) {
  return (
    <TabsContent value="artifacts" className="m-0 flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-col">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : artifacts.length > 0 ? (
          <div className="flex-1 overflow-auto p-4">
            <div className="space-y-3">
              {artifacts.map((artifact) => (
                <div
                  key={artifact._id}
                  className="border-border hover:bg-muted/50 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Archive className="text-primary h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{artifact.name}</h3>
                      {artifact.description && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {artifact.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {artifact.metadata?.framework && (
                          <span className="bg-muted rounded px-2 py-0.5 text-xs">
                            {artifact.metadata.framework}
                          </span>
                        )}
                        {artifact.metadata?.language && (
                          <span className="bg-muted rounded px-2 py-0.5 text-xs">
                            {artifact.metadata.language}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-2 text-xs">
                        {Object.keys(artifact.files || {}).length} files
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md">
              <Archive className="text-muted-foreground mx-auto h-12 w-12" />
              <h3 className="mt-4 text-lg font-semibold">No Artifacts</h3>
              <p className="text-muted-foreground mt-2 text-sm mb-4">
                Artifacts will appear here as the agent generates code. Create a dummy artifact to test.
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={() => onCreateDummyArtifact('react')}
                >
                  <Plus size={16} className="mr-2" />
                  React App
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onCreateDummyArtifact('html')}
                >
                  <Plus size={16} className="mr-2" />
                  HTML App
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
}
