import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { type ComponentProps, useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

interface ChatMessageAreaScrollButtonProps {
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export function ChatMessageAreaScrollButton({
  alignment = 'center',
  className,
}: ChatMessageAreaScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) {
    return null;
  }

  const alignmentClasses = {
    left: 'left-4',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-4',
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      className={cn(
        'hover:bg-secondary absolute bottom-4 rounded-full shadow-lg',
        alignmentClasses[alignment],
        className,
      )}
      onClick={handleScrollToBottom}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}

type ChatMessageAreaProps = ComponentProps<typeof StickToBottom>;

export function ChatMessageArea({ className, ...props }: ChatMessageAreaProps) {
  return (
    <StickToBottom
      className={cn('relative h-full flex-1 overflow-y-auto', className)}
      resize="smooth"
      initial="smooth"
      {...props}
    />
  );
}

type ChatMessageAreaContentProps = ComponentProps<typeof StickToBottom.Content>;

export function ChatMessageAreaContent({
  className,
  ...props
}: ChatMessageAreaContentProps) {
  return (
    <StickToBottom.Content
      className={cn('mx-auto h-full w-full max-w-2xl py-2', className)}
      {...props}
    />
  );
}
