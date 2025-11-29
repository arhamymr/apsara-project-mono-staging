export type PostWebsiteSummary = {
  id: number;
  slug: string;
  name?: string | null;
};

export type PostListItem = {
  id: number;
  title: string;
  slug: string;
  status: 'draft' | 'publish' | string;
  image_url?: string | null;
  websites?: PostWebsiteSummary[];
  category?: { id: number; name: string } | null;
  excerpt?: string | null;
};

export type Category = { id: number; name: string };

export type PostDetail = PostListItem & {
  excerpt?: string | null;
  content?: string | null;
  created_at?: string | null;
  published_at?: string | null;
  author?: { name?: string | null } | null;
};
