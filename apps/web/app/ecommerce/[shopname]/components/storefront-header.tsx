'use client';

import { ShoppingCart, Search, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

interface StorefrontHeaderProps {
  shop: {
    name: string;
    description?: string;
    logo?: string;
    slug: string;
  };
  cartItemCount: number;
  onCartClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export function StorefrontHeader({ 
  shop, 
  cartItemCount, 
  onCartClick,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: StorefrontHeaderProps) {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        {/* Top Row: Logo and Cart */}
        <div className="flex items-center justify-between py-4">
          {/* Shop Branding */}
          <Link href={`/ecommerce/${shop.slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            {shop.logo ? (
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={shop.logo}
                  alt={shop.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {shop.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">{shop.name}</h1>
              {shop.description && (
                <p className="text-sm text-muted-foreground line-clamp-1 max-w-md hidden sm:block">
                  {shop.description}
                </p>
              )}
            </div>
          </Link>

          {/* Cart Icon with Badge */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${cartItemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </Button>
        </div>

        {/* Search Bar Row */}
        <div className="pb-4 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
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
          {categories.length > 0 && (
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
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
          )}
        </div>
      </div>
    </header>
  );
}
