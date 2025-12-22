import type { Id } from "@/convex/_generated/dataModel";

// Shop Interface
export interface Shop {
  _id: Id<"shops">;
  ownerId: Id<"users">;
  slug: string;
  name: string;
  description?: string;
  logo?: string;
  whatsappNumber: string;
  currency: string;
  createdAt: number;
  updatedAt: number;
}

// Product Interface
export interface Product {
  _id: Id<"products">;
  shopId: Id<"shops">;
  slug: string;
  name: string;
  description?: string;
  price: number;
  inventory: number;
  status: "draft" | "active" | "archived";
  category?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

// Product Image Interface
export interface ProductImage {
  _id: Id<"productImages">;
  productId: Id<"products">;
  url: string;
  position: number;
  isPrimary: boolean;
  createdAt: number;
}

// Banner Interface
export interface Banner {
  _id: Id<"banners">;
  shopId: Id<"shops">;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  status: "active" | "inactive";
  position: number;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  updatedAt: number;
}

// Input types for mutations
export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  inventory: number;
  status: "draft" | "active" | "archived";
  category?: string;
  tags?: string[];
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  inventory?: number;
  status?: "draft" | "active" | "archived";
  category?: string;
  tags?: string[];
}

export interface ShopInput {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  whatsappNumber: string;
  currency?: string;
}

export interface ShopUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  logo?: string;
  whatsappNumber?: string;
  currency?: string;
}

// Cart Item (Client-side)
export interface CartItem {
  productId: string;
  shopId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number; // Based on inventory
}

// Cart State (localStorage)
export interface CartState {
  shopId: string;
  items: CartItem[];
  updatedAt: number;
}
