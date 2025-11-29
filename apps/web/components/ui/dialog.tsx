'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Re-export base components from shared package
export {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';

// Extended DialogContent with portalContainer and overlayClassName support
// This is app-specific functionality not available in the shared package
type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  portalContainer?: HTMLElement | null;
  overlayClassName?: string;
  showCloseButton?: boolean;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    { className, children, portalContainer, overlayClassName, showCloseButton = true, ...props },
    ref,
  ) => {
    const container = portalContainer ?? undefined;
    const isInline = Boolean(container);

    return (
      <DialogPrimitive.Portal container={container}>
        <DialogPrimitive.Overlay
          className={cn(
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 bg-black/80',
            isInline
              ? 'absolute inset-0 z-[999999]'
              : 'fixed inset-0 z-[999999]',
            overlayClassName,
          )}
        />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 grid w-full max-w-lg gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
            isInline
              ? 'absolute top-1/2 left-1/2 z-[999999] translate-x-[-50%] translate-y-[-50%]'
              : 'fixed top-[50%] left-[50%] z-[999999] translate-x-[-50%] translate-y-[-50%]',
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

export { DialogContent };
