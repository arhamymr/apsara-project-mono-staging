import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, type ReactNode } from 'react';

type DesktopIconProps = {
  id: string;
  icon: ReactNode;
  label: string;
  onOpen?: () => void;
};

const DesktopIcon = memo(function DesktopIcon({
  id,
  icon,
  label,
  onOpen,
}: DesktopIconProps) {
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

  const handleDoubleClick = () => {
    if (isDragging) return;
    onOpen?.();
  };

  return (
    <button
      type="button"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'group focus-visible:ring-ring focus-visible:ring-offset-background flex flex-col items-center justify-center rounded-xl border border-transparent p-1 text-center text-xs font-medium transition-all select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'cursor-pointer active:cursor-grabbing',
      )}
      data-dragging={isDragging ? '' : undefined}
      aria-label={label}
    >
      <div
        className={cn(
          'mb-2 flex size-12 items-center justify-center rounded-lg text-3xl transition-transform',
          isDragging ? 'scale-110' : 'group-hover:scale-110',
        )}
        aria-hidden
      >
        {icon}
      </div>
      <span
        className={cn(
          'text-muted-foreground group-hover:bg-background w-full max-w-[50px] truncate p-1 text-[11px] transition-colors',
        )}
      >
        {label}
      </span>
    </button>
  );
});

export default DesktopIcon;
