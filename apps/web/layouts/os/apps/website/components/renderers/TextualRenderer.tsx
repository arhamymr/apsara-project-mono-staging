import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type React from 'react';
import type { TemplateNode } from '../../template-schema';

type CommonTextProps = {
  node: TemplateNode;
  editable: boolean;
  interactiveProps?: React.HTMLAttributes<HTMLElement>;
  onSelect?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onTextChange?: (value: string) => void;
};

export function TextRenderer({
  node,
  editable,
  interactiveProps,
  onSelect,
  onHoverStart,
  onHoverEnd,
  onTextChange,
}: CommonTextProps) {
  const Tag = (node.as ?? 'span') as keyof JSX.IntrinsicElements;
  const text = node.text ?? node.i18n?.fallback ?? '';
  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    onTextChange?.(event.currentTarget.textContent ?? '');
    onHoverEnd?.();
  };

  return (
    <Tag
      className={cn(node.class)}
      role={node.role}
      aria-label={node.ariaLabel}
      contentEditable={editable}
      suppressContentEditableWarning={editable}
      onBlur={editable ? handleBlur : undefined}
      onClick={editable ? onSelect : undefined}
      onFocus={editable ? onHoverStart : undefined}
      {...interactiveProps}
    >
      {text}
    </Tag>
  );
}

type LinkProps = CommonTextProps;

export function LinkRenderer({
  node,
  editable,
  interactiveProps,
  onSelect,
  onHoverStart,
  onHoverEnd,
  onTextChange,
}: LinkProps) {
  const label = node.text ?? node.i18n?.fallback ?? '';
  const href = node.action?.kind === 'link' ? node.action.href : '#';
  const target = node.action?.kind === 'link' ? node.action.target : '_self';
  const handleBlur = (event: React.FocusEvent<HTMLAnchorElement>) => {
    onTextChange?.(event.currentTarget.textContent ?? '');
    onHoverEnd?.();
  };
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (editable) {
      event.preventDefault();
      onSelect?.();
      return;
    }
  };
  return (
    <a
      className={cn(node.class)}
      href={href}
      target={target}
      aria-label={node.ariaLabel}
      contentEditable={editable}
      suppressContentEditableWarning={editable}
      onBlur={editable ? handleBlur : undefined}
      onClick={handleClick}
      onFocus={editable ? onHoverStart : undefined}
      {...interactiveProps}
    >
      {label}
    </a>
  );
}

type ButtonProps = CommonTextProps;

export function ButtonRenderer({
  node,
  editable,
  interactiveProps,
  onSelect,
  onHoverStart,
  onHoverEnd,
  onTextChange,
}: ButtonProps) {
  const label = node.text ?? node.i18n?.fallback ?? '';
  const handleBlur = (event: React.FocusEvent<HTMLButtonElement>) => {
    onTextChange?.(event.currentTarget.textContent ?? '');
    onHoverEnd?.();
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      event.preventDefault();
      onSelect?.();
      return;
    }
  };
  return (
    <Button
      className={cn(node.class)}
      aria-label={node.ariaLabel}
      contentEditable={editable}
      suppressContentEditableWarning={editable}
      onBlur={editable ? handleBlur : undefined}
      onClick={handleClick}
      onFocus={editable ? onHoverStart : undefined}
      {...interactiveProps}
    >
      {label}
    </Button>
  );
}
