/* eslint-disable @typescript-eslint/no-explicit-any */
// Asset Picker: shared types

export type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (assetIdOrUrl: string) => void;
  /** optional filter: "image" | "svg" | "file" | "icon" or array of them (applies to Library only) */
  kindFilter?: string | string[];
  /** optional callback when selecting an Unsplash photo (if omitted, we call onSelect with photo.urls.full) */
  onSelectUnsplash?: (photo: UnsplashPhoto) => void;
};

export type UnsplashPhoto = {
  id: string;
  alt: string;
  width: number;
  height: number;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: { html: string; download: string; download_location: string };
  user: { name: string; username: string; links: any };
};
