import { useBuilderSelection } from '@/hooks/use-website/selection-store';
import type { TemplateNode } from '@/layouts/os/apps/website/template-schema';
import * as React from 'react';
import type { EditorSlot } from '../runtime/editor-types';
import { evaluate } from '../runtime/utils';
import type { SimpleEditorConfig } from './editor-types';
import { ContainerRenderer } from './renderers/ContainerRenderer';
import { IconRenderer, ImageRenderer } from './renderers/MediaRenderer';
import { PostsFeedRenderer } from './renderers/PostsFeedRenderer';
import { StackRenderer } from './renderers/StackRenderer';
import {
  ButtonRenderer,
  LinkRenderer,
  TextRenderer,
} from './renderers/TextualRenderer';

type RenderNodeProps = {
  node: TemplateNode;
  ctx?: Record<string, unknown>;
  path?: number[];
  editor?: SimpleEditorConfig;
};

const pathsEqual = (left: number[], right: number[]) =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const slotsEqual = (left?: EditorSlot, right?: EditorSlot) => {
  if (!left || !right) return false;
  if (left.kind !== right.kind) return false;
  if (left.kind === 'global' && right.kind === 'global') {
    return left.slot === right.slot;
  }
  if (left.kind === 'page' && right.kind === 'page') {
    return left.pageId === right.pageId;
  }
  return false;
};

const resolveWebsiteSlug = (
  ctx: Record<string, unknown>,
): string | undefined => {
  const fromCtx = ctx?.websiteSlug;
  if (typeof fromCtx === 'string' && fromCtx.trim().length > 0) {
    return fromCtx;
  }
  const website = ctx?.website;
  if (website && typeof website === 'object') {
    const slug = (website as Record<string, unknown>).slug;
    if (typeof slug === 'string' && slug.trim().length > 0) {
      return slug;
    }
  }
  return undefined;
};

export function RenderNode({
  node,
  ctx = {},
  path = [],
  editor,
}: RenderNodeProps): React.ReactNode {
  const shouldHide = !!(
    node.visibleIf && !evaluate(node.visibleIf.expression, ctx)
  );

  const slot = editor?.slot;
  const pathKey = path.length > 0 ? path.join('.') : 'root';
  const nodeId = node.id ?? node.htmlId ?? `path:${pathKey}`;
  const hovered = useBuilderSelection((state) => state.hovered);
  const selected = useBuilderSelection((state) => state.selected);

  const matchesSelection = React.useCallback(
    (target: typeof hovered) => {
      if (!target || !slot) return false;
      if (!slotsEqual(target.slot, slot)) return false;
      if (target.nodeId && target.nodeId === nodeId) return true;
      if (Array.isArray(target.path)) return pathsEqual(target.path, path);
      return false;
    },
    [nodeId, path, slot],
  );

  const isHovered = matchesSelection(hovered);
  const isSelected = matchesSelection(selected);

  const handleSelect = React.useCallback(() => {
    if (editor?.onSelect) editor.onSelect({ node, path });
  }, [editor, node, path]);

  const editable = editor?.mode === 'edit';

  const handleContainerClick = React.useCallback(
    (event: React.MouseEvent<HTMLElement | SVGElement>) => {
      if (!editable) return;
      if (event.currentTarget !== event.target) return;
      event.stopPropagation();
      handleSelect();
    },
    [editable, handleSelect],
  );

  const handleHoverStart = () => {
    if (editable && editor?.onHover) {
      editor.onHover({ node, path });
    }
  };

  const handleHoverEnd = () => {
    if (editable && editor?.onHover) {
      editor.onHover(null);
    }
  };

  const interactiveAttributes = editable
    ? {
        'data-editor-node': nodeId,
        'data-editor-node-type': node.type,
        'data-editor-hovered': isHovered ? 'true' : undefined,
        'data-editor-selected': isSelected ? 'true' : undefined,
        onMouseEnter: handleHoverStart,
        onMouseLeave: handleHoverEnd,
      }
    : {};

  const websiteSlug = resolveWebsiteSlug(ctx);
  const resolvedWebsiteSlug =
    typeof node.websiteSlug === 'string' && node.websiteSlug.trim().length > 0
      ? node.websiteSlug
      : websiteSlug;

  const renderChildren = () => {
    const childNodes = node.children ?? [];
    if (childNodes.length === 0) return null;
    return childNodes.map((child, index) => (
      <RenderNode
        key={child.id ?? `${node.id ?? 'node'}:${index}`}
        node={child}
        ctx={ctx}
        path={[...path, index]}
        editor={editor}
      />
    ));
  };

  if (shouldHide) return null;

  switch (node.type) {
    case 'vstack':
    case 'hstack':
    case 'stack': {
      const orientation: 'vertical' | 'horizontal' | 'stack' =
        node.type === 'vstack'
          ? 'vertical'
          : node.type === 'hstack'
            ? 'horizontal'
            : 'stack';
      return (
        <StackRenderer
          node={node}
          orientation={orientation}
          onContainerClick={handleContainerClick}
          {...(interactiveAttributes as React.HTMLAttributes<HTMLDivElement>)}
        >
          {renderChildren()}
        </StackRenderer>
      );
    }
    case 'section':
    case 'article':
    case 'view':
    case 'container':
    case 'fragment': {
      return (
        <ContainerRenderer
          node={node}
          onContainerClick={handleContainerClick}
          {...(interactiveAttributes as React.HTMLAttributes<HTMLElement>)}
        >
          {renderChildren()}
        </ContainerRenderer>
      );
    }
    case 'image':
      return (
        <ImageRenderer
          node={node}
          style={node.style as React.CSSProperties}
          onClick={editable ? handleSelect : undefined}
          {...(interactiveAttributes as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
      );

    case 'icon':
      return (
        <IconRenderer
          node={node}
          onClick={editable ? handleSelect : undefined}
          {...(interactiveAttributes as React.HTMLAttributes<SVGSVGElement>)}
        />
      );
    case 'text':
      return (
        <TextRenderer
          node={node}
          editable={editable}
          interactiveProps={
            interactiveAttributes as React.HTMLAttributes<HTMLElement>
          }
          onSelect={handleSelect}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onTextChange={(value) => editor?.onTextChange?.(path, value)}
        />
      );
    case 'link':
      return (
        <LinkRenderer
          node={node}
          editable={editable}
          interactiveProps={
            interactiveAttributes as React.HTMLAttributes<HTMLElement>
          }
          onSelect={handleSelect}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onTextChange={(value) => editor?.onTextChange?.(path, value)}
        />
      );
    case 'button':
      return (
        <ButtonRenderer
          node={node}
          editable={editable}
          interactiveProps={
            interactiveAttributes as React.HTMLAttributes<HTMLButtonElement>
          }
          onSelect={handleSelect}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onTextChange={(value) => editor?.onTextChange?.(path, value)}
        />
      );
    case 'postsFeed':
      return (
        <PostsFeedRenderer
          node={node}
          editable={editable}
          onSelect={editable ? handleSelect : undefined}
          wrapperProps={
            interactiveAttributes as React.HTMLAttributes<HTMLDivElement>
          }
          websiteSlug={resolvedWebsiteSlug}
        />
      );
    default:
      return renderChildren();
  }
}
