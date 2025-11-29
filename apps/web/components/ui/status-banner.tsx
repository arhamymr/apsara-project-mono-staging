import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const statusBannerVariants = cva(
  'flex items-center gap-2 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm border',
  {
    variants: {
      variant: {
        warning: 'bg-yellow-500/90 text-yellow-950 border-yellow-600/20',
        info: 'bg-blue-500/90 text-blue-950 border-blue-600/20',
        success: 'bg-green-500/90 text-green-950 border-green-600/20',
        error: 'bg-red-500/90 text-red-950 border-red-600/20',
      },
      position: {
        'top-right': 'fixed top-4 right-4 z-50',
        'top-left': 'fixed top-4 left-4 z-50',
        'top-center': 'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        'bottom-left': 'fixed bottom-4 left-4 z-50',
        inline: 'relative',
      },
    },
    defaultVariants: {
      variant: 'info',
      position: 'top-right',
    },
  },
);

const icons = {
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
  error: AlertCircle,
};

export interface StatusBannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBannerVariants> {
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  animate?: boolean;
}

function StatusBanner({
  className,
  variant = 'info',
  position = 'top-right',
  message,
  dismissible = false,
  onDismiss,
  icon,
  animate = true,
  ...props
}: StatusBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const Icon = variant ? icons[variant] : Info;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        statusBannerVariants({ variant, position }),
        animate && 'animate-in fade-in slide-in-from-top-2 duration-500',
        className,
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {icon || <Icon className="h-2 w-2 animate-pulse" />}
      <span className="text-xs font-semibold">{message}</span>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="ml-2 rounded-full p-1 transition-colors hover:bg-black/10"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export { StatusBanner, statusBannerVariants };
