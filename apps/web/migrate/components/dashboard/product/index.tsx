'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { ChevronDown, Filter } from 'lucide-react';

import { CreateProductSheet } from './CreateProductSheet';
import { InspectorTabs } from './InspectorTabs';
import { ProductCards } from './ProductCards';
import { ProductTable } from './ProductTable';
import { ProductToolbar } from './ProductToolbar';
import { MOCK_PRODUCTS } from './mock';

export default function ProductManagement() {
  return (
    <div className="@container space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 @md:items-center">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight @md:text-2xl">
            Products
          </h1>
          <p className="text-muted-foreground text-sm">
            Create, organize, and publish products for your storefront.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" />
                <span>Filters</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Quick filters</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Active</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem>Out of stock</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <CreateProductSheet />
        </div>
      </div>

      {/* Toolbar */}
      <ProductToolbar />

      {/* Content */}
      <div className="grid gap-3">
        {/* Desktop table */}
        <ProductTable />

        {/* Mobile cards */}
        <ProductCards />

        {/* Pagination (dummy) */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            Showing {MOCK_PRODUCTS.length} of {MOCK_PRODUCTS.length}
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink href="#" aria-disabled>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" aria-disabled>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" aria-disabled>
                  3
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Details panel (static preview tabbed) */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Inspector (preview)</CardTitle>
        </CardHeader>
        <CardContent>
          <InspectorTabs />
        </CardContent>
      </Card>
    </div>
  );
}
