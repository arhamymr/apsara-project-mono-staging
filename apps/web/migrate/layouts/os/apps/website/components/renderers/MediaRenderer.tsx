import { getLucideIconComponent } from '@/layouts/os/apps/website/build/properties/node-editor/icon-utils';
import { cn } from '@/lib/utils';
import type React from 'react';
import type { TemplateNode } from '../../template-schema';

export type ImageRendererProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  node: TemplateNode;
};

export function ImageRenderer({
  node,
  className,
  style,
  ...interactive
}: ImageRendererProps) {
  const nodeStyle =
    node.style && typeof node.style === 'object'
      ? (node.style as React.CSSProperties)
      : undefined;
  const mergedStyle =
    nodeStyle || style ? { ...(nodeStyle ?? {}), ...(style ?? {}) } : undefined;

  return (
    <img
      className={cn(node.class, className)}
      style={mergedStyle}
      src={node.src}
      alt={node.alt}
      width={node.width}
      height={node.height}
      {...interactive}
    />
  );
}

type IconProps = React.HTMLAttributes<SVGSVGElement> & {
  node: TemplateNode;
};

export function IconRenderer({ node, className, ...interactive }: IconProps) {
  const IconComp = getLucideIconComponent(
    typeof node.iconName === 'string' ? node.iconName : undefined,
  );
  const strokeWidth =
    typeof node.strokeWidth === 'number' ? node.strokeWidth : undefined;
  const ariaLabel =
    typeof node.ariaLabel === 'string' && node.ariaLabel.trim().length
      ? node.ariaLabel
      : undefined;

  return (
    <IconComp
      className={cn(node.class, className)}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      {...interactive}
    />
  );
}
