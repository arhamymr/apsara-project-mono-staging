import * as React from 'react';

import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { useTheme } from '@/components/dark-mode/useTheme';
import { GRADIENT_VARIANTS } from '@/layouts/os/gradients';
import {
  getWallpaper,
  setWallpaper,
  type Wallpaper,
} from '@/layouts/os/wallpaper';
import { motion } from 'framer-motion';
import Image from 'next/image';

const SWATCHES = [
  '#111827',
  '#0f172a',
  '#1f2937',
  '#334155',
  '#0ea5e9',
  '#a78bfa',
  '#f472b6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
];

const IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1760640251792-41e924883ad0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1440',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1474',
  'https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374',
];

export default function DesktopSettingsApp() {
  const { theme } = useTheme();
  const [wallpaper, setLocal] = React.useState<Wallpaper>(() => getWallpaper());
  const [url, setUrl] = React.useState('');

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false);

  const apply = (w: Wallpaper) => {
    setLocal(w);
    setWallpaper(w);
  };

  React.useEffect(() => {
    if (wallpaper.kind === 'image' && wallpaper.value) {
      setUrl(wallpaper.value);
    }
  }, [wallpaper.kind, wallpaper.value]);

  return (
    <div className="flex h-full flex-col p-4">
      <ScrollArea className="h-full">
        <section className="mb-5">
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Animated
          </h3>
          <div className="flex flex-wrap gap-2 p-2">
            <button
              type="button"
              onClick={() => apply({ kind: 'spinner' })}
              className={`relative h-16 w-24 overflow-hidden rounded-md border transition-all ${wallpaper.kind === 'spinner'
                  ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                  : 'hover:ring-muted-foreground/20 hover:ring-1'
                } ${isDark ? 'bg-black' : 'bg-white'}`}
              title="Spinner Logo"
            >
              <motion.div
                className="pointer-events-none absolute -right-4 -bottom-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <Image
                  src="/logo.svg"
                  alt="Spinner preview"
                  width={64}
                  height={64}
                  className={isDark ? 'opacity-50' : 'opacity-30'}
                />
              </motion.div>
            </button>
          </div>
        </section>

        <section className="mb-5">
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Gradients
          </h3>
          <div className="flex flex-wrap gap-2 p-2">
            {GRADIENT_VARIANTS.map((v) => {
              const isActive =
                wallpaper.kind === 'gradient' && wallpaper.value === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => apply({ kind: 'gradient', value: v.id })}
                  className={`h-16 w-24 rounded-md border transition-all ${isActive
                      ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                      : 'hover:ring-muted-foreground/20 hover:ring-1'
                    }`}
                  title={v.name}
                >
                  <div className={`h-full w-full rounded-md ${v.baseDark}`} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Solid Colors
          </h3>
          <div className="flex flex-wrap gap-2 p-2">
            {SWATCHES.map((c) => {
              const isActive =
                wallpaper.kind === 'solid' && wallpaper.value === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => apply({ kind: 'solid', value: c })}
                  className={`h-16 w-16 rounded-md border transition-all ${isActive
                      ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                      : 'hover:ring-muted-foreground/20 hover:ring-1'
                    }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              );
            })}
          </div>
        </section>

        <section className="mb-5">
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Image Presets
          </h3>
          <div className="grid grid-cols-3 gap-2 p-2">
            {IMAGE_PRESETS.map((src) => {
              const isActive =
                wallpaper.kind === 'image' && wallpaper.value === src;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => apply({ kind: 'image', value: src })}
                  className={`relative h-20 w-full overflow-hidden rounded-md border transition-all ${isActive
                      ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                      : 'hover:ring-muted-foreground/20 hover:ring-1'
                    }`}
                  title="Set as wallpaper"
                >
                  <Image
                    src={src}
                    alt="Wallpaper preset"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 200px"
                  />
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Image URL
          </h3>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/wallpaper.jpg"
                aria-label="Wallpaper image URL"
                className={`${wallpaper.kind === 'image' &&
                    wallpaper.value &&
                    !IMAGE_PRESETS.includes(wallpaper.value)
                    ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                    : ''
                  }`}
              />
            </div>
            <button
              type="button"
              onClick={() => url && apply({ kind: 'image', value: url })}
              className="hover:bg-muted/40 rounded-md border px-3 text-sm"
            >
              Apply
            </button>
          </div>
        </section>
      </ScrollArea>
    </div>
  );
}
