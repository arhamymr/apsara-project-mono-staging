import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, RefreshCcw, Upload } from 'lucide-react';
import { useMemo } from 'react';

import type { Source } from '@/layouts/os/apps/knowledge-base/types';
import { toDisplayKind } from '@/layouts/os/apps/knowledge-base/utils/sourceTransforms';

type SourceTableProps = {
  sources: Source[];
  isLoading: boolean;
  isFetching: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onManualUpload: () => void;
  manualUploadDisabled?: boolean;
  onOpenSource: (sourceId: string) => void;
  selectedSourceId: string | null;
  emptyMessage?: string;
};

export function SourceTable({
  sources,
  isLoading,
  isFetching,
  errorMessage,
  onRefresh,
  onManualUpload,
  manualUploadDisabled,
  onOpenSource,
  selectedSourceId,
  emptyMessage = 'No sources yet.',
}: SourceTableProps) {
  const content = useMemo(() => {
    if (errorMessage) {
      return (
        <TableRow>
          <TableCell
            colSpan={5}
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
            colSpan={5}
            className="text-muted-foreground py-8 text-center text-sm"
          >
            Loading sources...
          </TableCell>
        </TableRow>
      );
    }
    if (!sources.length) {
      return (
        <TableRow>
          <TableCell
            colSpan={5}
            className="text-muted-foreground py-8 text-center text-sm"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }
    return sources.map((source, index) => (
      <TableRow
        key={source.id}
        className="cursor-pointer"
        data-selected={selectedSourceId === source.id}
        onClick={() => onOpenSource(source.id)}
      >
        <TableCell className="text-muted-foreground">{index + 1}</TableCell>
        <TableCell className="truncate font-medium">{source.title}</TableCell>
        <TableCell className="text-muted-foreground capitalize">
          {toDisplayKind(source.kind)}
        </TableCell>
        <TableCell>{source.chunks ?? 0}</TableCell>
        <TableCell className="text-muted-foreground">
          {source.updatedAt ?? '—'}
        </TableCell>
      </TableRow>
    ));
  }, [
    errorMessage,
    isLoading,
    sources,
    selectedSourceId,
    onOpenSource,
    emptyMessage,
  ]);

  return (
    <Card className="rounded-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Sources</CardTitle>
            {isFetching && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={'ghost'}
              className="gap-2"
              onClick={onManualUpload}
              disabled={manualUploadDisabled}
            >
              <Upload className="h-4 w-4" /> Upload
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={onRefresh}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[42px]">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[140px]">Kind</TableHead>
              <TableHead className="w-[110px]">Chunks</TableHead>
              <TableHead className="w-[160px]">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{content}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
