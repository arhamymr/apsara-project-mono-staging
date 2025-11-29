import type { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prd_1001',
    name: 'Apsara Hoodie — Black',
    sku: 'APS-HOOD-BLK',
    price: 49,
    currency: 'USD',
    category: 'Apparel',
    status: 'active',
    stock: 42,
    thumbnail:
      'https://images.unsplash.com/photo-1520975922284-7b683b949146?q=80&w=480&auto=format&fit=crop',
    tags: ['new', 'bestseller'],
    updatedAt: '2025-10-02 10:24',
  },
  {
    id: 'prd_1002',
    name: 'Minimalist Tote Bag',
    sku: 'APS-TOTE-NAT',
    price: 29,
    currency: 'USD',
    category: 'Accessories',
    status: 'out-of-stock',
    stock: 0,
    thumbnail:
      'https://images.unsplash.com/photo-1520975889620-1a4cbe5e9bfb?q=80&w=480&auto=format&fit=crop',
    tags: ['eco'],
    updatedAt: '2025-09-28 16:10',
  },
  {
    id: 'prd_1003',
    name: 'Sticker Pack — Glyphs',
    sku: 'APS-STICK-GLY',
    price: 9,
    currency: 'USD',
    category: 'Merch',
    status: 'draft',
    stock: 200,
    thumbnail:
      'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=480&auto=format&fit=crop',
    tags: ['limited'],
    updatedAt: '2025-09-12 08:02',
  },
  {
    id: 'prd_1004',
    name: 'Desk Mat — Graphite',
    sku: 'APS-DESK-GRA',
    price: 39,
    currency: 'USD',
    category: 'Workspace',
    status: 'archived',
    stock: 12,
    thumbnail:
      'https://images.unsplash.com/photo-1600267185393-e158a98703de?q=80&w=480&auto=format&fit=crop',
    tags: ['bundle-ready'],
    updatedAt: '2025-07-21 14:30',
  },
];
