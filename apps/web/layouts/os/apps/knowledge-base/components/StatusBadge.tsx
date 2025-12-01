import { Badge } from '@workspace/ui/components/badge';
import type { IngestStatus } from './types';

const STATUS_STYLES: Record<
  IngestStatus,
  { label: string; className: string }
> = {
  processing: {
    label: 'Processing',
    className:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  },
  error: {
    label: 'Error',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  },
  complete: {
    label: 'Completed',
    className:
      'bg-emerald-200 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200',
  },
};

export function StatusBadge({ status }: { status: IngestStatus }) {
  console.log(status, 'status');
  if (!status) return;

  const style = STATUS_STYLES[status];
  return (
    <Badge className={`h-6 px-2 ${style?.className}`}>{style?.label}</Badge>
  );
}
