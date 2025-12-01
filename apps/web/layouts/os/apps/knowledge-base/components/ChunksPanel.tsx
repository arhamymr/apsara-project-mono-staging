import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useMemo } from 'react';

import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import type { KBChunk } from './types';

type ChunksPanelProps = {
  selectedSourceId: string | null;
  sources: Source[];
  chunks: KBChunk[];
  onEditChunk: (chunk: KBChunk) => void;
  onCreateFromSource: () => void;
  disableCreate?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  errorMessage?: string | null;
  onRefresh?: () => void;
};

export function ChunksPanel({
  selectedSourceId,
  sources,
  chunks,
  onEditChunk,
  onCreateFromSource,
  disableCreate = false,
  isLoading = false,
  isFetching = false,
  errorMessage = null,
  onRefresh,
}: ChunksPanelProps) {
  const selectedSourceTitle = useMemo(() => {
    if (!selectedSourceId) return '';
    return (
      sources.find((source) => source.id === selectedSourceId)?.title ?? ''
    );
  }, [selectedSourceId, sources]);

  const content = useMemo(() => {
    if (!selectedSourceId) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-muted-foreground py-8 text-center text-sm"
          >
            Select a source to view chunks
          </TableCell>
        </TableRow>
      );
    }
    if (errorMessage) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-destructive py-8 text-center text-sm"
          >
            {errorMessage}
          </TableCell>
        </TableRow>
      );
    }
    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-muted-foreground py-8 text-center text-sm"
          >
            Loading chunks...
          </TableCell>
        </TableRow>
      );
    }
    if (!chunks.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={4}
            className="text-muted-foreground py-8 text-center text-sm"
          >
            No chunks yet — run ingestion to generate chunks.
          </TableCell>
        </TableRow>
      );
    }
    return chunks.map((chunk) => (
      <TableRow key={chunk.id} className="hover:bg-muted/40">
        <TableCell className="text-muted-foreground">#{chunk.index}</TableCell>
        <TableCell
          className="max-w-[300px] truncate align-top"
          onClick={() => onEditChunk(chunk)}
        >
          {chunk.text}
        </TableCell>
        <TableCell className="text-muted-foreground align-top">
          {chunk.updatedAt ?? '—'}
        </TableCell>
        <TableCell className="text-right align-top">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onEditChunk(chunk)}
          >
            Edit
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [chunks, errorMessage, isLoading, onEditChunk, selectedSourceId]);

  return (
    <Card className="min-h-[260px] rounded-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">
              Chunks {selectedSourceTitle ? `— ${selectedSourceTitle}` : ''}
            </CardTitle>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {onRefresh ? (
              <Button
                size="sm"
                variant="ghost"
                className="gap-2"
                onClick={onRefresh}
                disabled={!selectedSourceId || isLoading}
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="outline"
              onClick={onCreateFromSource}
              disabled={disableCreate || !selectedSourceId || isLoading}
            >
              New Chunk
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Index</TableHead>
              <TableHead>Text (preview)</TableHead>
              <TableHead className="w-[200px]">Updated</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>{content}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
