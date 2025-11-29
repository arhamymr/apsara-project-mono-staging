import { cn } from '@/lib/utils';
import type React from 'react';
import type { TemplateNode } from '../../template-schema';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  node: TemplateNode;
  orientation: 'vertical' | 'horizontal' | 'stack';
  onContainerClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: React.ReactNode;
};

export function StackRenderer({
  node,
  orientation,
  onContainerClick,
  children,
  className,
  ...interactive
}: Props) {
  const layoutClass =
    orientation === 'vertical'
      ? 'flex flex-col gap-4'
      : orientation === 'horizontal'
        ? 'flex flex-row flex-wrap gap-4'
        : 'grid gap-4';

  return (
    <div
      className={cn(layoutClass, node.class, className)}
      onClickCapture={onContainerClick}
      {...interactive}
    >
      {children}
    </div>
  );
}
