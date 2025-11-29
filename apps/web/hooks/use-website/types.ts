/* eslint-disable @typescript-eslint/no-explicit-any */

export type AdFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'always';

export type WebsiteAd = {
  id: string;
  image: string;
  ctaHref?: string;
  enabled: boolean;
  frequency: AdFrequency;
};

export interface ComponentData {
  id: string;
  type:
    | 'header'
    | 'hero'
    | 'features'
    | 'cta'
    | 'footer'
    | 'text'
    | 'image'
    | 'button'
    | 'contact'
    | 'postDetail'
    | 'posts';
  props: Record<string, any>;
  content?: string;
}

export interface IPageData {
  id: string;
  title: string;
  path: string;
  sections: ComponentData[];
}

export interface IWebsiteData {
  id: string;
  type: string;
  name: string;
  pages: Record<string, IPageData>;
  description: string;
  preview?: string;
  themeId: string;
  typographyId: string;
  ads?: WebsiteAd[];
  globals: any;
}

export type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export interface ComponentBuilderContextType {
  form: any;

  // State
  website: IWebsiteData;
  activePage: IPageData;
  isPreview: boolean;

  // Actions
  setWebsite: (website: IWebsiteData) => void;
  setActivePage: (page: IPageData) => void;
  addComponent: (type: ComponentData['type']) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentData>) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  handleCreateFromScratch: () => IWebsiteData;
  handleSelectTemplate: (template: IWebsiteData) => IWebsiteData;
  setIsPreview: (isPreview: boolean) => void;

  // submit
  handleSubmit: (value: any, routeKey: string) => Promise<any>;

  // viewport
  viewportSize: ViewportSize;
  setViewportSize: (size: ViewportSize) => void;
  getViewportStyles: (size: ViewportSize) => any;
  getViewportIcon: (size: ViewportSize) => any;

  // pages
  addPage: (input: {
    title: string;
    id?: string;
    path?: string;
    sections?: ComponentData[];
  }) => void;
  removePage: (pageId: string) => void;

  // ui tab
  tabState: string;
  setTabState: (tab: string) => void;
}
