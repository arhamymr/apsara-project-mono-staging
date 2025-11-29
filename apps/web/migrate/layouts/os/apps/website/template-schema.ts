/* eslint-disable @typescript-eslint/no-explicit-any */

export type TemplateNode = {
  id?: string;
  type: string;
  class?: string;
  children?: TemplateNode[];
  [key: string]: any;
};

export type TemplatePage = {
  id: string;
  title: string;
  path: string;
  sections: TemplateNode[];
};

export type TemplateDefinition = {
  id: string;
  type: string;
  themeId: string;
  typographyId: string;
  name: string;
  preview: string;
  description: string;
  globals: Record<string, TemplateNode[]>;
  pages?: Record<string, TemplatePage>;
};

export type SectionTemplate = {
  id: string;
  title: string;
  description: string;
  preview: () => React.ReactNode;
  template: TemplateNode;
};
