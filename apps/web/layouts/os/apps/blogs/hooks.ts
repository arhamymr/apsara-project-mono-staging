"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// Types
export type BlogStatus = "draft" | "published";

export interface BlogInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: BlogStatus;
  tags?: string[];
}

export interface BlogUpdateInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: BlogStatus;
  tags?: string[];
}

// Query hooks
export function useBlogs(limit?: number) {
  return useQuery(api.blogs.listPublished, { limit });
}

export function useMyBlogs(limit?: number) {
  return useQuery(api.blogs.listByAuthor, { limit });
}

export function useBlog(id: Id<"blogs"> | undefined) {
  return useQuery(api.blogs.getById, id ? { id } : "skip");
}

export function useBlogBySlug(slug: string | undefined) {
  return useQuery(api.blogs.getBySlug, slug ? { slug } : "skip");
}

export function useSearchBlogs(query: string, limit?: number) {
  return useQuery(api.blogs.search, query ? { query, limit } : "skip");
}

// Mutation hooks
export function useCreateBlog() {
  return useMutation(api.blogs.create);
}

export function useUpdateBlog() {
  return useMutation(api.blogs.update);
}

export function useDeleteBlog() {
  return useMutation(api.blogs.remove);
}
