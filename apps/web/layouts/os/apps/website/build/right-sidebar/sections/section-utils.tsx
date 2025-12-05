import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';

export const basicCard = (
  title: string,
  body: string,
  iconName?: string,
): TemplateNode => ({
  type: 'vstack',
  class: 'gap-2 rounded-lg border border-border bg-card p-5',
  children: [
    ...(iconName
      ? [{ type: 'icon', iconName, class: 'h-6 w-6 text-primary' }]
      : []),
    { type: 'text', as: 'h3', text: title, class: 'text-sm font-semibold' },
    {
      type: 'text',
      as: 'p',
      text: body,
      class: 'text-xs text-muted-foreground',
    },
  ],
});

export const sectionContainer = (
  heading: string,
  description: string,
  content: TemplateNode,
  options?: { centered?: boolean; background?: string },
): TemplateNode => ({
  type: 'section',
  class: `${options?.background ?? 'bg-background'} py-16 md:py-20 px-4 md:px-8 text-foreground`,
  children: [
    {
      type: 'vstack',
      class: `container mx-auto max-w-5xl gap-6 ${options?.centered ? 'items-center text-center' : 'text-left'}`,
      children: [
        {
          type: 'text',
          as: 'h2',
          text: heading,
          class: 'text-3xl font-semibold',
        },
        {
          type: 'text',
          as: 'p',
          text: description,
          class: 'text-sm text-muted-foreground max-w-3xl',
        },
        content,
      ],
    },
  ],
});

export const previewCard = (title: string, body: string) => (
  <div className="border-border bg-card flex flex-col gap-1.5 rounded-lg border p-2 text-left text-xs">
    <p className="text-foreground font-semibold">{title}</p>
    <p className="text-muted-foreground">{body}</p>
  </div>
);
