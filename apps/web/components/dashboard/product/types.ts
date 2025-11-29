// Types for Product module
export type ProductStatus = 'draft' | 'active' | 'archived' | 'out-of-stock';

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  currency: string;
  category: string;
  status: ProductStatus;
  stock: number;
  thumbnail?: string;
  tags?: string[];
  updatedAt: string;
};
