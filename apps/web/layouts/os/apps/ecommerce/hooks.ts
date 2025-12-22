"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// User Query Hooks
export function useBasicUserInfo(userId: Id<"users"> | undefined) {
  return useQuery(api.user.getBasicUserInfo, userId ? { userId } : "skip");
}

// Shop Query Hooks
export function useMyShop() {
  return useQuery(api.shops.getByOwner, {});
}

export function useShopBySlug(slug: string | undefined) {
  return useQuery(api.shops.getBySlug, slug ? { slug } : "skip");
}

export function useSharedShops() {
  return useQuery(api.shops.getSharedShops, {});
}

export function useSharedProducts() {
  return useQuery(api.products.listFromSharedShops, {});
}

// Shop Mutation Hooks
export function useCreateShop() {
  return useMutation(api.shops.create);
}

export function useUpdateShop() {
  return useMutation(api.shops.update);
}

export function useDeleteShop() {
  return useMutation(api.shops.remove);
}

// Product Query Hooks
export function useMyProducts() {
  const shop = useMyShop();
  return useQuery(
    api.products.listByShop,
    shop ? { shopId: shop._id } : "skip"
  );
}

export function useProduct(id: Id<"products"> | undefined) {
  return useQuery(api.products.getById, id ? { id } : "skip");
}

export function useProductBySlug(shopId: Id<"shops"> | undefined, slug: string | undefined) {
  return useQuery(
    api.products.getBySlug,
    shopId && slug ? { shopId, slug } : "skip"
  );
}

export function useSearchProducts(query: string) {
  const shop = useMyShop();
  return useQuery(
    api.products.search,
    shop && query ? { shopId: shop._id, query } : "skip"
  );
}

// Product Mutation Hooks
export function useCreateProduct() {
  return useMutation(api.products.create);
}

export function useUpdateProduct() {
  return useMutation(api.products.update);
}

export function useDeleteProduct() {
  return useMutation(api.products.remove);
}

export function useBulkUpdateProductStatus() {
  return useMutation(api.products.bulkUpdateStatus);
}

// Product Image Query Hooks
export function useProductImages(productId: Id<"products"> | undefined) {
  return useQuery(
    api.productImages.listByProduct,
    productId ? { productId } : "skip"
  );
}

// Product Image Mutation Hooks
export function useAddProductImage() {
  return useMutation(api.productImages.add);
}

export function useRemoveProductImage() {
  return useMutation(api.productImages.remove);
}

export function useReorderProductImages() {
  return useMutation(api.productImages.reorder);
}

// Banner Query Hooks
export function useBanners() {
  const shop = useMyShop();
  return useQuery(
    api.banners.listByShop,
    shop ? { shopId: shop._id } : "skip"
  );
}

export function useBanner(id: Id<"banners"> | undefined) {
  return useQuery(api.banners.getById, id ? { id } : "skip");
}

export function useActiveBanners() {
  const shop = useMyShop();
  return useQuery(
    api.banners.listActiveByShop,
    shop ? { shopId: shop._id } : "skip"
  );
}

// Banner Mutation Hooks
export function useCreateBanner() {
  return useMutation(api.banners.create);
}

export function useUpdateBanner() {
  return useMutation(api.banners.update);
}

export function useDeleteBanner() {
  return useMutation(api.banners.remove);
}

// Organization Sharing Hooks
export function useShareShop() {
  return useMutation(api.sharedResources.shareResource);
}

export function useUnshareShop() {
  return useMutation(api.sharedResources.unshareResource);
}

export function useShopOrganizations(shopId: Id<"shops"> | undefined) {
  return useQuery(
    api.sharedResources.getResourceOrganizations,
    shopId ? { resourceType: "shop", resourceId: shopId } : "skip"
  );
}

export function useCanAccessShop(shopId: Id<"shops"> | undefined) {
  return useQuery(
    api.sharedResources.canAccessResource,
    shopId ? { resourceType: "shop", resourceId: shopId } : "skip"
  );
}
