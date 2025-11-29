/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { RenderPage } from '@/layouts/os/apps/website/components/page-renderer';
import { DEFAULT_NAVBAR_SETTINGS } from '@/layouts/os/apps/website/components/renderers/navbar-types';
import { RenderSection } from '@/layouts/os/apps/website/components/section-renderer';
import { SectionFont } from '@/layouts/os/apps/website/components/theme/components/font-manager';
import type {
  TemplateNode,
  TemplatePage,
} from '@/layouts/os/apps/website/template-schema';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';

type WebsiteStructure = {
  pages?: Record<string, TemplatePage>;
  globals?: Record<string, TemplateNode[]>;
  themeId?: string;
  typographyId?: string;
  metadata?: Record<string, any>;
};

type WebsitePayload = {
  id: number;
  name: string;
  slug: string;
  status?: string | null;
  structure?: WebsiteStructure | null;
  activePageId?: string;
};

const ensureNodes = (value?: unknown): TemplateNode[] =>
  Array.isArray(value) ? (value as TemplateNode[]) : [];

const normalizeNavbarNodes = (nodes: TemplateNode[]): TemplateNode[] => {
  if (!nodes.length) return nodes;
  if (nodes.some((node) => node.type === 'navbar')) return nodes;
  const cloned =
    typeof structuredClone === 'function'
      ? structuredClone(nodes)
      : nodes.map((node) => ({ ...node }));
  const normalizedChildren = cloned.map((child, index) => {
    const slot =
      index === 0 && (child.type === 'image' || child.type === 'text')
        ? 'brand'
        : child.slot;
    return { ...child, slot };
  });
  return [
    {
      id: 'legacy-navbar',
      type: 'navbar',
      class: 'w-full',
      navbar: { ...DEFAULT_NAVBAR_SETTINGS },
      children: normalizedChildren,
    },
  ];
};

const ensurePages = (value?: unknown): Record<string, TemplatePage> => {
  if (!value || typeof value !== 'object') return {};
  return value as Record<string, TemplatePage>;
};

const pageUrl = (slug: string, pageKey: string) =>
  pageKey === 'home' ? `/sites/${slug}` : `/sites/${slug}/${pageKey}`;

export default function PublishedWebsitePage({
  website,
}: {
  website: WebsitePayload;
}) {
  const structure = (website?.structure ?? {}) as WebsiteStructure;
  const pages = ensurePages(structure.pages);
  const pageEntries = Object.entries(pages) as Array<[string, TemplatePage]>;

  const preferredKey = (() => {
    if (website?.activePageId && pages[website.activePageId]) {
      return website.activePageId;
    }
    if (pages.home) return 'home';
    return pageEntries[0]?.[0] ?? null;
  })();

  const activeKey = preferredKey;
  const activePage = activeKey ? pages[activeKey] : undefined;

  if (!activePage) {
    return (
      <div className="bg-muted/10 text-foreground flex min-h-screen items-center justify-center px-6">
        <Head title="Website unavailable" />
        <div className="max-w-xl space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Content unavailable</h1>
          <p className="text-muted-foreground">
            This website does not have any pages configured yet. Publish a page
            in the builder to see it live here.
          </p>
        </div>
      </div>
    );
  }

  const headerNodes = normalizeNavbarNodes(
    ensureNodes(structure.globals?.header),
  );
  const footerNodes = ensureNodes(structure.globals?.footer);
  const pageSections = Array.isArray(activePage.sections)
    ? activePage.sections
    : [];
  const hasContent =
    headerNodes.length > 0 || pageSections.length > 0 || footerNodes.length > 0;

  const themeId =
    typeof structure.themeId === 'string' && structure.themeId.trim().length > 0
      ? structure.themeId
      : 'light';
  const typographyId =
    typeof structure.typographyId === 'string' &&
    structure.typographyId.trim().length > 0
      ? structure.typographyId
      : 'inter';

  const pageLinks = pageEntries.map(([key, page]) => ({
    key,
    title: page?.title ?? key,
    href: pageUrl(website.slug, key),
    active: key === activeKey,
  }));

  const ctx = useMemo(
    () => ({
      website: {
        slug: website.slug,
        name: website.name,
        metadata: structure.metadata ?? {},
      },
      page: activePage,
      websiteSlug: website.slug,
    }),
    [website.slug, website.name, structure.metadata, activePage],
  );

  const pageTitle =
    activePage?.title ?? structure.metadata?.title ?? website.name;

  return (
    <>
      <Head title={`${pageTitle} — ${website.name}`} />
      <div
        className="bg-background text-foreground min-h-screen"
        data-theme={themeId}
      >
        <SectionFont typo={typographyId as any}>
          <div className="@container mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 @md:px-6 @lg:px-10">
            <header className="mb-6 flex flex-col gap-6">
              <div>
                <p className="text-muted-foreground text-sm tracking-wide uppercase">
                  {website.name}
                </p>
                <h1 className="text-3xl leading-tight font-semibold">
                  {pageTitle}
                </h1>
              </div>
              {pageLinks.length > 1 && (
                <nav className="flex flex-wrap gap-2 text-sm">
                  {pageLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.href}
                      className={cn(
                        'rounded-full border px-4 py-2 transition',
                        link.active
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                      )}
                      preserveScroll
                    >
                      {link.title}
                    </Link>
                  ))}
                </nav>
              )}
            </header>

            <main className="flex-1 space-y-8">
              {hasContent ? (
                <div className="flex flex-col gap-0">
                  <RenderSection
                    id="published-header"
                    type="header"
                    nodes={headerNodes}
                    ctx={ctx}
                  />
                  <RenderPage
                    page={activePage}
                    ctx={ctx}
                    className="flex flex-col"
                  />
                  <RenderSection
                    id="published-footer"
                    type="footer"
                    nodes={footerNodes}
                    ctx={ctx}
                  />
                </div>
              ) : (
                <div className="border-border bg-muted/20 text-muted-foreground rounded-xl border p-8 text-center">
                  <p>
                    This page does not have any sections yet. Use the builder to
                    add components, then publish again.
                  </p>
                </div>
              )}
            </main>
          </div>
        </SectionFont>
      </div>
    </>
  );
}
