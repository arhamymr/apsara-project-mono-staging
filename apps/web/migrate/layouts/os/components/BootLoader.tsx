'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useOSStrings } from '@/i18n/os';
import { cn } from '@/lib/utils';
import React from 'react';

const STORAGE_KEY = 'apsara.os.firstBootDone';

type BootLoaderProps = {
  className?: string;
  durationMs?: number; // total time to reach 100%
};

export default function BootLoader({
  className,
  durationMs = 1600,
}: BootLoaderProps) {
  const [show, setShow] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const s = useOSStrings();

  // Only show if not seen before
  React.useEffect(() => {
    try {
      const seen =
        typeof window !== 'undefined' &&
        localStorage.getItem(STORAGE_KEY) === '1';
      if (!seen) setShow(true);
    } catch {
      // ignore storage errors, default to visible
      setShow(true);
    }
  }, []);

  // Drive progress when visible
  React.useEffect(() => {
    if (!show) return;

    const stepMs = 40; // tick interval
    const steps = Math.ceil(durationMs / stepMs);
    let current = 0;

    const tick = () => {
      current += 1;
      const pct = Math.min(100, Math.round((current / steps) * 100));
      setProgress(pct);
      if (pct >= 100) {
        try {
          localStorage.setItem(STORAGE_KEY, '1');
        } catch {}
        // small delay before hide for smoother finish
        setTimeout(() => setShow(false), 200);
        return;
      }
      timer = window.setTimeout(tick, stepMs);
    };

    let timer = window.setTimeout(tick, stepMs);
    return () => window.clearTimeout(timer);
  }, [show, durationMs]);

  if (!show) return null;

  return (
    <div
      className={cn(
        'bg-background/80 fixed inset-0 z-[99999] grid place-items-center backdrop-blur-sm',
        className,
      )}
      aria-busy
      role="dialog"
      aria-label={s.bootloader.aria}
    >
      <Card className="w-[min(92vw,420px)] border-white/10 bg-white/5 p-5 shadow-xl">
        <div className="text-muted-foreground mb-2 text-xs font-medium tracking-wide">
          {s.bootloader.title}
        </div>
        <Progress value={progress} />
        <div className="text-muted-foreground mt-2 flex items-center justify-between text-[10px]">
          <span>{s.bootloader.caption}</span>
          <span>{progress}%</span>
        </div>
      </Card>
    </div>
  );
}
