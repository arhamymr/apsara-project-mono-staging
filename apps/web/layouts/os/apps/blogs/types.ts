export type PostWebsiteSummary = {
  id: number | string;
  slug: string;
  name?: string | null;
};

export type PostListItem = {
  id: number | string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'publish' | string;
  image_url?: string | null;
  description?: string | null;
  content?: string | null;
  websites?: PostWebsiteSummary[];
  category?: { id: number; name: string } | null;
  excerpt?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type Category = { id: number | string; name: string };

export type PostDetail = PostListItem & {
  published_at?: string | null;
  author?: { name?: string | null } | null;
  cover_credit?: string | null;
  tags?: string[];
};
