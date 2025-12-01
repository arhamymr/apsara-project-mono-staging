'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';
import { Image as ImageIcon, Tag } from 'lucide-react';
import { MOCK_PRODUCTS } from './mock';
import { StatusBadge } from './StatusBadge';

export function ProductTable() {
  return (
    <div className="bg-card hidden rounded-xl border @lg:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox aria-label="Select all" />
            </TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="@xl:w-[220px]">Category</TableHead>
            <TableHead className="@xl:w-[160px]">Price</TableHead>
            <TableHead className="@xl:w-[160px]">Stock</TableHead>
            <TableHead className="@xl:w-[160px]">Status</TableHead>
            <TableHead className="text-right">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_PRODUCTS.map((p) => (
            <TableRow key={p.id} className="align-middle">
              <TableCell>
                <Checkbox aria-label={`Select ${p.name}`} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted size-12 overflow-hidden rounded-md border">
                    {p.thumbnail ? (
                      <img
                        src={p.thumbnail}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <ImageIcon className="size-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate leading-tight font-medium">
                      {p.name}
                    </div>
                    <div className="text-muted-foreground truncate text-xs">
                      SKU: {p.sku}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {p.tags?.map((t) => (
                        <Badge key={t} variant="outline" className="gap-1">
                          <Tag className="size-3" /> {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {p.category}
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {p.currency} {p.price.toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                {p.stock > 0 ? (
                  <span className="text-foreground">{p.stock} in stock</span>
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={p.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-right">
                {p.updatedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
