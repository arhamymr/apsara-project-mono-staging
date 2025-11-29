import { Link } from 'lucide-react';
import React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useToolbar } from './toolbar-provider';

const LinkToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }, ref) => {
    const { editor } = useToolbar();

    const setLink = () => {
      const url = window.prompt('Enter URL');
      if (url) {
        editor?.chain().focus().setLink({ href: url }).run();
      }
    };

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            className={cn(
              'h-8 w-8',
              editor?.isActive('link') && 'bg-accent',
              className,
            )}
            onClick={(e) => {
              setLink();
              onClick?.(e);
            }}
            ref={ref}
            {...props}
          >
            {children || <Link className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>Add link</span>
        </TooltipContent>
      </Tooltip>
    );
  },
);

LinkToolbar.displayName = 'LinkToolbar';

export { LinkToolbar };
