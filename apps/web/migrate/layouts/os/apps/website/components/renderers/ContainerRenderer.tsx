import { cn } from '@/lib/utils';
import type React from 'react';
import type { TemplateNode } from '../../template-schema';

type Props = React.HTMLAttributes<HTMLElement> & {
  node: TemplateNode;
  onContainerClick?: React.MouseEventHandler<HTMLElement>;
  children?: React.ReactNode;
};

export function ContainerRenderer({
  node,
  onContainerClick,
  children,
  className,
  ...interactive
}: Props) {
  const Element = resolveElement(node.type, node.as);
  return (
    <Element
      className={cn(node.class, className)}
      onClickCapture={onContainerClick}
      {...interactive}
    >
      {children}
    </Element>
  );
}

function resolveElement(
  type: string,
  explicit?: keyof JSX.IntrinsicElements,
): keyof JSX.IntrinsicElements {
  if (explicit) return explicit;
  switch (type) {
    case 'section':
      return 'section';
    case 'article':
      return 'article';
    default:
      return 'div';
  }
}
