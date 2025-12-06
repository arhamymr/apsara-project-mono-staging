import * as React from 'react';

import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { GRADIENT_VARIANTS } from '@/layouts/os/gradients';
import {
  getWallpaper,
  setWallpaper,
  type Wallpaper,
} from '@/layouts/os/wallpaper';

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
  'hero-bg.png',
  'https://images.unsplash.com/photo-1760640251792-41e924883ad0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1440',
  'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1474',
  'https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374',
];

export default function DesktopSettingsApp() {
  const [wallpaper, setLocal] = React.useState<Wallpaper>(() => getWallpaper());
  const [url, setUrl] = React.useState('');

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
    <div className="flex h-full flex-col pb-6">
      <ScrollArea className="h-[calc(100%-60px)] p-4">
        <section className="mb-5">
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            Gradients
          </h3>
          <div className="flex flex-wrap gap-2">
            {GRADIENT_VARIANTS.map((v) => {
              const isActive =
                wallpaper.kind === 'gradient' && wallpaper.value === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => apply({ kind: 'gradient', value: v.id })}
                  className={`h-16 w-24 rounded-md border transition-all ${
                    isActive
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
          <div className="flex flex-wrap gap-2">
            {SWATCHES.map((c) => {
              const isActive =
                wallpaper.kind === 'solid' && wallpaper.value === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => apply({ kind: 'solid', value: c })}
                  className={`h-16 w-16 rounded-md border transition-all ${
                    isActive
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
          <div className="grid grid-cols-3 gap-2">
            {IMAGE_PRESETS.map((src) => {
              const isActive =
                wallpaper.kind === 'image' && wallpaper.value === src;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => apply({ kind: 'image', value: src })}
                  className={`h-20 w-full overflow-hidden rounded-md border transition-all ${
                    isActive
                      ? 'ring-primary ring-offset-background ring-2 ring-offset-2'
                      : 'hover:ring-muted-foreground/20 hover:ring-1'
                  }`}
                  title="Set as wallpaper"
                >
                  <img
                    src={src}
                    alt="Wallpaper preset"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
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
                className={`${
                  wallpaper.kind === 'image' && 
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
