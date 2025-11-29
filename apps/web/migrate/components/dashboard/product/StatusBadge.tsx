'use client';

import { Badge } from '@/components/ui/badge';
import type { ProductStatus } from './types';

export function StatusBadge({ status }: { status: ProductStatus }) {
  const map: Record<
    ProductStatus,
    {
      label: string;
      variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    }
  > = {
    active: { label: 'Active', variant: 'default' },
    draft: { label: 'Draft', variant: 'secondary' },
    archived: { label: 'Archived', variant: 'outline' },
    'out-of-stock': { label: 'Out of stock', variant: 'destructive' },
  };
  const s = map[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
