export interface Template {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  previewUrl?: string; // Live preview URL for iframe
  previewImage?: string; // Fallback high-res image
  author: string;
  category: string;
  tags: string[];
  downloadUrl: string;
  fileSize: string;
  license: 'free' | 'premium' | 'commercial';
}

export interface TemplateStrings {
  hero: { title: string; subtitle: string };
  requestCard: { title: string; description: string; button: string; whatsappMessage: string };
  modal: {
    download: string;
    openPreview: string;
    copyLink: string;
    linkCopied: string;
    previewUnavailable: string;
    author: string;
    category: string;
    fileSize: string;
    license: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
  empty: string;
  licenses: { free: string; premium: string; commercial: string };
}
