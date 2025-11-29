import type { ReactNode } from 'react';

type ToolButtonProps = {
  active?: boolean;
  label: string;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  children: ReactNode;
};

export function ToolButton({
  active,
  label,
  onClick,
  onDragStart,
  children,
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      onDragStart={onDragStart}
      draggable={!!onDragStart}
      className={
        'group inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition ' +
        (active
          ? 'border-foreground/30 bg-foreground/5'
          : 'border-border hover:bg-foreground/5')
      }
      aria-label={label}
      title={label}
      type="button"
    >
      <div className="opacity-80 group-hover:opacity-100">{children}</div>
    </button>
  );
}
