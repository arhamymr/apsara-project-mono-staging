'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

type Props = {
  showSeconds?: boolean;
  simple?: boolean; // ➕ new: simple text mode
  className?: string;
  blinkColon?: boolean;
  twentyFourHour?: boolean;
  colorOn?: string;
  colorOff?: string;
};

export default function ClockDisplay({
  showSeconds = true,
  simple = false,
  className,
  blinkColon = true,
  twentyFourHour = true,
  colorOn = 'fill-emerald-400',
  colorOff = 'fill-emerald-900/20 dark:fill-emerald-200/10',
}: Props) {
  const [now, setNow] = React.useState(() => new Date());
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  const hhmmss = getParts(now, { showSeconds, twentyFourHour });
  const colonOn = !blinkColon || now.getSeconds() % 2 === 0;

  /* ---------- SIMPLE TEXT MODE ---------- */
  if (simple) {
    return (
      <div
        className={cn(
          'px-2 py-1 text-center font-mono text-base',
          'text-muted-foreground select-none',
          className,
        )}
      >
        {hhmmss.h1}
        {hhmmss.h2}
        <span className={colonOn ? 'opacity-100' : 'opacity-30'}>:</span>
        {hhmmss.m1}
        {hhmmss.m2}
      </div>
    );
  }

  /* ---------- SEVEN-SEGMENT MODE ---------- */
  return (
    <div
      className={cn(
        'relative p-2',
        'backdrop-blur-md',
        'flex flex-col items-center justify-center select-none',
        className,
      )}
      aria-label={`Digital clock ${hhmmss.announce}`}
      role="img"
    >
      {/* subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-[1] grid place-items-center">
        <div className="h-20 w-20 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15),transparent_70%)] blur-xl" />
      </div>

      <div className="flex items-end justify-center gap-[2px]">
        <Digit char={hhmmss.h1} onClass={colorOn} offClass={colorOff} small />
        <Digit char={hhmmss.h2} onClass={colorOn} offClass={colorOff} small />
        <Colon on={colonOn} onClass={colorOn} offClass={colorOff} small />
        <Digit char={hhmmss.m1} onClass={colorOn} offClass={colorOff} small />
        <Digit char={hhmmss.m2} onClass={colorOn} offClass={colorOff} small />
        {showSeconds && (
          <>
            <Colon on={colonOn} onClass={colorOn} offClass={colorOff} small />
            <Digit
              char={hhmmss.s1}
              onClass={colorOn}
              offClass={colorOff}
              small
            />
            <Digit
              char={hhmmss.s2}
              onClass={colorOn}
              offClass={colorOff}
              small
            />
          </>
        )}
      </div>

      <div className="mt-1 text-[9px] font-medium text-zinc-600 dark:text-zinc-400">
        {now.toLocaleDateString(undefined, {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        })}
      </div>
    </div>
  );
}

/* ---------------- Seven-segment Digit ---------------- */

type DigitProps = {
  char: string;
  onClass: string;
  offClass: string;
  small?: boolean;
};

function Digit({ char, onClass, offClass, small }: DigitProps) {
  const mask = DIGIT_TO_SEGMENTS[char] ?? [0, 0, 0, 0, 0, 0, 0];
  const size = small
    ? 'h-10 w-6 sm:h-12 sm:w-7 md:h-14 md:w-8'
    : 'h-16 w-10 sm:h-20 sm:w-12 md:h-24 md:w-14';

  return (
    <svg
      viewBox="0 0 120 200"
      className={cn(size, 'mx-[1px]')}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* 7 segments */}
      <rect
        x="14"
        y="6"
        width="92"
        height="18"
        rx="9"
        className={seg(mask[0], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="96"
        y="24"
        width="18"
        height="72"
        rx="9"
        className={seg(mask[1], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="96"
        y="110"
        width="18"
        height="72"
        rx="9"
        className={seg(mask[2], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="14"
        y="176"
        width="92"
        height="18"
        rx="9"
        className={seg(mask[3], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="6"
        y="110"
        width="18"
        height="72"
        rx="9"
        className={seg(mask[4], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="6"
        y="24"
        width="18"
        height="72"
        rx="9"
        className={seg(mask[5], onClass, offClass)}
        filter="url(#glow)"
      />
      <rect
        x="14"
        y="96"
        width="92"
        height="18"
        rx="9"
        className={seg(mask[6], onClass, offClass)}
        filter="url(#glow)"
      />
    </svg>
  );
}

/* ---------------- Colon ---------------- */

function Colon({
  on,
  onClass,
  offClass,
  small,
}: {
  on: boolean;
  onClass: string;
  offClass: string;
  small?: boolean;
}) {
  const size = small
    ? 'h-10 w-3 sm:h-12 sm:w-3 md:h-14 md:w-4'
    : 'h-16 w-3 sm:h-20 sm:w-4 md:h-24 md:w-5';
  return (
    <svg
      viewBox="0 0 40 200"
      className={cn(size, 'mx-[1px]')}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id="cglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="20"
        cy="75"
        r="7"
        className={on ? onClass : offClass}
        filter="url(#cglow)"
      />
      <circle
        cx="20"
        cy="135"
        r="7"
        className={on ? onClass : offClass}
        filter="url(#cglow)"
      />
    </svg>
  );
}

/* ---------------- Helpers ---------------- */

function seg(isOn: number, onClass: string, offClass: string) {
  return cn(
    isOn ? onClass : offClass,
    'transition-[fill,opacity] duration-150 ease-out',
  );
}

const DIGIT_TO_SEGMENTS: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
  ' ': [0, 0, 0, 0, 0, 0, 0],
};

function getParts(
  d: Date,
  opts: { showSeconds: boolean; twentyFourHour: boolean },
) {
  let h = d.getHours();
  if (!opts.twentyFourHour) h = h % 12 || 12;
  const m = d.getMinutes();
  const s = d.getSeconds();

  const [h1, h2] = to2(h);
  const [m1, m2] = to2(m);
  const [s1, s2] = to2(s);

  return {
    h1,
    h2,
    m1,
    m2,
    s1: opts.showSeconds ? s1 : ' ',
    s2: opts.showSeconds ? s2 : ' ',
    announce: `${h1}${h2}:${m1}${m2}${opts.showSeconds ? `:${s1}${s2}` : ''}`,
  };
}

function to2(n: number): [string, string] {
  const s = n.toString().padStart(2, '0');
  return [s[0], s[1]];
}
