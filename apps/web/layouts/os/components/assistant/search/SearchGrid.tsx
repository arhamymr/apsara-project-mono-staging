/* eslint-disable @typescript-eslint/no-explicit-any */
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import type { AppDef } from '@/layouts/os/types';

type Props = {
  apps: AppDef[];
  onOpen: (app: AppDef) => void;
  onAfterOpen?: () => void;
};

export default function SearchGrid({ apps, onOpen, onAfterOpen }: Props) {
  if (apps.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-white/60">
        No apps found
      </div>
    );
  }
  return (
    <ScrollArea className="h-full w-full">
      <div className="grid max-h-[300px] grid-cols-4 gap-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              onOpen(app);
              onAfterOpen?.();
            }}
            className="group hover:bg-muted flex cursor-pointer flex-col items-center gap-2 rounded-lg p-3 transition-all active:scale-95"
          >
            <div className="transition-transform group-hover:scale-110">
              <span
                aria-hidden
                className="grid place-items-center text-3xl"
                title={app.icon as string}
              >
                {app.icon}
              </span>
            </div>
            <span className="text-muted-foreground max-w-[100px] truncate text-center text-xs">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
