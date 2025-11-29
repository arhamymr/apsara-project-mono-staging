import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import { cn } from '@/lib/utils';
import type { SimpleEditorConfig } from './editor-types';
import { RenderNode } from './node-renderer';
import { NavbarRenderer } from './renderers/NavbarRenderer';

export type RenderSectionProps = {
  id?: string;
  type?: string;
  className?: string;
  nodes: TemplateNode[];
  ctx?: Record<string, any>;
  editor?: SimpleEditorConfig;
};

export function RenderSection({
  id,
  type,
  className = '',
  nodes,
  ctx = {},
  editor,
}: RenderSectionProps) {
  const safeNodes = nodes ?? [];
  if (safeNodes.length === 0) return null;
  const isHeader = type === 'header' || type === 'navbar';

  const content = isHeader ? (
    <NavbarRenderer
      id={id}
      className={className}
      nodes={safeNodes}
      ctx={ctx}
      editor={editor}
    />
  ) : (
    <SectionElement
      id={id}
      type={type}
      className={className}
      nodes={safeNodes}
      ctx={ctx}
      editor={editor}
    />
  );

  return content;
}

type SectionElementProps = {
  id?: string;
  type?: string;
  className: string;
  nodes: TemplateNode[];
  ctx: Record<string, any>;
  editor?: SimpleEditorConfig;
};

function SectionElement({
  id,
  type,
  className,
  nodes,
  ctx,
  editor,
}: SectionElementProps) {
  const elementTag =
    type === 'header'
      ? 'header'
      : type === 'footer'
        ? 'footer'
        : type === 'main'
          ? 'main'
          : 'section';
  const Element = elementTag as keyof JSX.IntrinsicElements;
  const sectionRole =
    type === 'header' || type === 'navbar'
      ? 'navigation'
      : type === 'footer'
        ? 'contentinfo'
        : type === 'aside'
          ? 'complementary'
          : undefined;

  return (
    <Element
      id={id ?? type}
      role={sectionRole}
      aria-label={type ?? 'section'}
      className={cn('@container w-full', className)}
    >
      {nodes.map((node, index) => (
        <RenderNode
          key={node.id ?? `section:${index}`}
          node={node}
          ctx={ctx}
          path={[index]}
          editor={editor}
        />
      ))}
    </Element>
  );
}
