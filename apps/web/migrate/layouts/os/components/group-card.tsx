import type { DesktopAppShortcut } from '@/layouts/os/types';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cloneElement, isValidElement, type CSSProperties } from 'react';

type GroupCardProps = {
  id: string;
  label: string;
  childrenApps: DesktopAppShortcut[];
  onOpenGroup?: () => void;
  dropHint?: boolean;
};

export default function GroupCard({
  id,
  label,
  childrenApps,
  onOpenGroup,
  dropHint,
}: GroupCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none' as const,
  };

  const renderPreviewIcon = (icon: DesktopAppShortcut['icon']) => {
    if (typeof icon === 'string') {
      return (
        <span className="inline-flex h-full w-full items-center justify-center text-[11px] leading-none">
          {icon}
        </span>
      );
    }
    if (isValidElement(icon)) {
      const props = icon.props as { className?: string; style?: CSSProperties };
      const nextStyle: CSSProperties = {
        ...(props.style ?? {}),
        fontSize: '11px',
        lineHeight: '1',
        width: '1rem',
        height: '1rem',
      };
      return cloneElement(icon, {
        className: cn(
          'inline-flex h-full w-full items-center justify-center leading-none',
          props.className,
        ),
        style: nextStyle,
      });
    }
    return (
      <span className="inline-flex h-full w-full items-center justify-center text-[11px] leading-none">
        {icon}
      </span>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'group relative flex flex-col items-center rounded-xl border p-1 text-center text-xs transition-all select-none',
        'cursor-pointer',
        dropHint
          ? 'border-primary/60 bg-primary/5 ring-primary/50 ring-2'
          : 'border-transparent',
        isDragging && 'opacity-90',
      )}
      aria-label={label}
      onDoubleClick={() => onOpenGroup?.()}
      onClick={() => onOpenGroup?.()}
    >
      <div
        className={cn(
          'bg-background/60 mb-2 grid size-12 grid-cols-2 grid-rows-2 overflow-hidden rounded-lg p-1 shadow ring-1 ring-white/10 transition-transform',
          dropHint ? '' : 'group-hover:scale-105',
        )}
        aria-hidden
      >
        {childrenApps.slice(0, 4).map((c) => (
          <div
            key={c.id}
            className="relative flex items-center justify-center"
            title={c.label}
          >
            <div
              className={cn(
                'flex h-4 w-4 items-center justify-center overflow-hidden rounded',
              )}
            >
              {renderPreviewIcon(c.icon)}
            </div>
          </div>
        ))}
        {childrenApps.length === 0 && (
          <div className="col-span-2 row-span-2 flex items-center justify-center text-lg opacity-60">
            📂
          </div>
        )}
      </div>
      <span className="text-muted-foreground group-hover:bg-background w-full max-w-[50px] truncate p-1 text-[11px]">
        {label}
      </span>
      {dropHint && (
        <div className="ring-primary/60 pointer-events-none absolute inset-0 rounded-xl ring-2">
          <div className="bg-primary/80 absolute top-1 right-1 rounded px-1 py-0.5 text-[10px] leading-none text-white">
            Add
          </div>
        </div>
      )}
    </div>
  );
}
