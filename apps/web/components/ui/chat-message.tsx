import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MarkdownContent } from '@/components/ui/markdown-content';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ChevronRight, SparklesIcon, UserIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

function ChatMessage({ className, ...props }: ComponentProps<'div'>) {
  return (
    <TooltipProvider>
      <div
        className={cn(
          'group/chat-message hover:bg-muted/50 relative flex w-full gap-2.5 rounded-md px-3 py-2',
          className,
        )}
        {...props}
      />
    </TooltipProvider>
  );
}

function ChatMessageContainer({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full flex-col items-start gap-1', className)}
      {...props}
    />
  );
}

function ChatMessageHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-2 px-2 text-xs', className)}
      {...props}
    />
  );
}

function ChatMessageAuthor({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('text-foreground text-xs font-medium', className)}
      {...props}
    />
  );
}

interface ChatMessageTimestampProps extends ComponentProps<'span'> {
  createdAt: number | Date | string;
  format?: Intl.DateTimeFormatOptions;
}

function ChatMessageTimestamp({
  className,
  createdAt,
  format = { hour: 'numeric', minute: 'numeric' },
  ...props
}: ChatMessageTimestampProps) {
  const date = createdAt instanceof Date ? createdAt : new Date(createdAt);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'text-muted-foreground cursor-default text-[10px]',
            className,
          )}
          {...props}
        >
          {date.toLocaleTimeString('en-US', format)}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">{date.toLocaleString()}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ChatMessageContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full flex-col gap-2 p-2 text-xs', className)}
      {...props}
    />
  );
}

interface ChatMessageMarkdownProps {
  content: string;
  className?: string;
}

function ChatMessageMarkdown({ content, className }: ChatMessageMarkdownProps) {
  return <MarkdownContent content={content || ''} className={className} />;
}

function ChatMessageFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'text-muted-foreground mt-1 flex items-center gap-2 px-2 text-[10px]',
        className,
      )}
      {...props}
    />
  );
}

function ChatMessageActions({
  className,
  children,
  ...props
}: ComponentProps<typeof Card>) {
  return (
    <Card
      className={cn(
        'absolute -top-5 right-5 z-20 flex flex-row gap-1 p-1 opacity-0 transition-opacity group-hover/chat-message:opacity-100',
        className,
      )}
      {...props}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </Card>
  );
}

interface ChatMessageActionProps {
  className?: string;
  children?: ReactNode;
  label: string;
}

function ChatMessageAction({
  className,
  children,
  label,
  ...props
}: ChatMessageActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-7 w-7', className)}
          {...props}
        >
          {children}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ChatMessageAvatar(props: ComponentProps<typeof Avatar>) {
  return (
    <Avatar
      className="[&:has(svg)]:border-border [&_svg]:size-4 [&:has(svg)]:items-center [&:has(svg)]:justify-center [&:has(svg)]:border"
      {...props}
    />
  );
}

function ChatMessageAvatarFallback(
  props: ComponentProps<typeof AvatarFallback>,
) {
  return <AvatarFallback {...props} />;
}

function ChatMessageAvatarImage(props: ComponentProps<typeof AvatarImage>) {
  return <AvatarImage {...props} />;
}

function ChatMessageAvatarUserIcon(props: ComponentProps<typeof UserIcon>) {
  return <UserIcon {...props} />;
}

function ChatMessageAvatarAssistantIcon(
  props: ComponentProps<typeof SparklesIcon>,
) {
  return <SparklesIcon {...props} />;
}

function ChatMessageThread({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'group/button flex h-auto w-full items-center justify-start gap-2 border border-none px-2 py-1.5 transition-all',
        'hover:border-input hover:bg-background hover:shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

function ChatMessageThreadReplyCount(props: ComponentProps<'span'>) {
  return <span className="text-xs font-medium" {...props} />;
}

interface ChatMessageThreadTimestampProps extends ComponentProps<'span'> {
  date: Date | number | string;
}
function ChatMessageThreadTimestamp({
  date: dateProp,
  ...props
}: ChatMessageThreadTimestampProps) {
  const date = new Date(dateProp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <span
      className="text-muted-foreground block text-xs group-hover/button:hidden"
      {...props}
    >
      Last reply at {date}
    </span>
  );
}

function ChatMessageThreadAction(props: ComponentProps<'span'>) {
  return (
    <span
      className="text-muted-foreground hidden w-full items-center gap-1 text-xs group-hover/button:flex"
      {...props}
    >
      View thread
      <ChevronRight className="ml-auto h-3 w-3" />
    </span>
  );
}

export {
  ChatMessage,
  ChatMessageAction,
  ChatMessageActions,
  ChatMessageAuthor,
  ChatMessageAvatar,
  ChatMessageAvatarAssistantIcon,
  ChatMessageAvatarFallback,
  ChatMessageAvatarImage,
  ChatMessageAvatarUserIcon,
  ChatMessageContainer,
  ChatMessageContent,
  ChatMessageFooter,
  ChatMessageHeader,
  ChatMessageMarkdown,
  ChatMessageThread,
  ChatMessageThreadAction,
  ChatMessageThreadReplyCount,
  ChatMessageThreadTimestamp,
  ChatMessageTimestamp,
};
