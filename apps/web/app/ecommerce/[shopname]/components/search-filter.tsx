'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Button } from '@workspace/ui/components/button';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  resultsCount: number;
  totalCount: number;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  resultsCount,
  totalCount,
}: SearchFilterProps) {
  const hasActiveFilters = searchQuery || selectedCategory !== 'all';

  const handleClearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count and Clear Filters */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {resultsCount === totalCount ? (
            <span>
              Showing <span className="font-medium text-foreground">{totalCount}</span>{' '}
              {totalCount === 1 ? 'product' : 'products'}
            </span>
          ) : (
            <span>
              Showing <span className="font-medium text-foreground">{resultsCount}</span> of{' '}
              <span className="font-medium text-foreground">{totalCount}</span>{' '}
              {totalCount === 1 ? 'product' : 'products'}
            </span>
          )}
        </p>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
