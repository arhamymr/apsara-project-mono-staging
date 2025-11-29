import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { StatusBadge } from '@/layouts/os/apps/knowledge-base/components/StatusBadge';
import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import type { MastraIngestStatus } from '@/layouts/os/apps/knowledge-base/utils/network';
import { toDisplayStatus } from '@/layouts/os/apps/knowledge-base/utils/sourceTransforms';
import { Loader2, Play, RefreshCcw, Trash2 } from 'lucide-react';

type SourceDetailsPanelProps = {
  source: Source | null;
  ingestStatus?: MastraIngestStatus;
  isStatusFetching: boolean;
  statusErrorMessage: string | null;
  onRefreshStatus: () => void;
  onDelete: () => void;
  isDeleting: boolean;
  onIngest: () => void;
  canIngest: boolean;
  isIngesting: boolean;
};

function formatBytes(bytes: number | null | undefined): string {
  if (!bytes || Number.isNaN(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function SourceDetailsPanel({
  source,
  ingestStatus,
  isStatusFetching,
  statusErrorMessage,
  onRefreshStatus,
  onDelete,
  isDeleting,
  onIngest,
  canIngest,
  isIngesting,
}: SourceDetailsPanelProps) {
  const statusText = useMemo(() => {
    if (!ingestStatus) return null;
    const state = ingestStatus.state;
    if (state && typeof state === 'object' && 'status' in state) {
      const stateStatus = state.status;
      if (typeof stateStatus === 'string' && stateStatus.length) {
        return stateStatus;
      }
    }
    if (typeof ingestStatus.status === 'string') {
      return ingestStatus.status;
    }
    return null;
  }, [ingestStatus]);

  const runId = useMemo(() => {
    if (ingestStatus?.runId && ingestStatus.runId !== '') {
      return ingestStatus.runId;
    }
    if (source?.mastraRunId && source.mastraRunId !== '') {
      return source.mastraRunId;
    }
    return null;
  }, [ingestStatus?.runId, source?.mastraRunId]);

  const displayStatus = source ? toDisplayStatus(source.statusRaw) : null;
  const showLifecycleControls = Boolean(source) && displayStatus !== 'complete';

  return (
    <Card className="rounded-md">
      <CardHeader className="flex flex-col gap-2 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-sm font-semibold">
            Source details
          </CardTitle>
          {source ? (
            <p className="text-muted-foreground text-xs">{source.title}</p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Select a source to view its details and ingestion status.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showLifecycleControls && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={onIngest}
                disabled={!source || !canIngest || isIngesting}
              >
                {isIngesting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Ingest source
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={onRefreshStatus}
                disabled={!source || !source.mastraRunId || isStatusFetching}
              >
                {isStatusFetching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Refreshing
                  </>
                ) : (
                  <>
                    <RefreshCcw className="h-4 w-4" /> Refresh
                  </>
                )}
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="destructive"
            className="gap-2"
            onClick={onDelete}
            disabled={!source || isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-4 py-4">
        {!source ? (
          <p className="text-muted-foreground text-sm">
            Pick a source from the list to inspect its metadata and ingestion
            status.
          </p>
        ) : (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Status
                </dt>
                <dd>
                  {displayStatus ? <StatusBadge status={displayStatus} /> : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Mastra run ID
                </dt>
                <dd className="text-sm break-all">{runId ?? '—'}</dd>
              </div>
              {/* <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Source URI
                </dt>
                <dd className="text-sm break-all">{source.sourceUri ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Public URL
                </dt>
                <dd className="text-sm break-all">{source.publicUrl ?? '—'}</dd>
              </div> */}
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  MIME type
                </dt>
                <dd className="text-sm">{source.mime ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Size
                </dt>
                <dd className="text-sm">{formatBytes(source.bytes ?? null)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Tokens
                </dt>
                <dd className="text-sm">
                  {source.tokens != null ? source.tokens.toLocaleString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Chunks
                </dt>
                <dd className="text-sm">
                  {source.chunks != null ? source.chunks : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1 text-xs tracking-wide uppercase">
                  Updated at
                </dt>
                <dd className="text-sm">{source.updatedAt ?? '—'}</dd>
              </div>
            </dl>

            <Separator />

            <div className="space-y-2 text-sm">
              <p className="text-sm font-semibold">Ingest status</p>
              {statusErrorMessage ? (
                <p className="text-destructive text-sm">{statusErrorMessage}</p>
              ) : runId ? (
                ingestStatus ? (
                  <div className="space-y-2 text-sm">
                    <p>
                      Run status: <strong>{statusText ?? 'Unknown'}</strong>
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {isStatusFetching
                      ? 'Fetching latest ingest status...'
                      : 'Status will appear here once fetched.'}
                  </p>
                )
              ) : (
                <p className="text-muted-foreground text-sm">
                  This source has not started an ingest run yet. Trigger an
                  ingest to receive a run ID.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
