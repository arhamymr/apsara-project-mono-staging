export type WallpaperKind = 'gradient' | 'solid' | 'image';
export type Wallpaper = {
  kind: WallpaperKind;
  value?: string; // hex for solid, URL for image
};

const STORAGE_KEY = 'apsara.os.wallpaper';
const EVENT_NAME = 'apsara:wallpaper-changed';

export function getWallpaper(): Wallpaper {
  if (typeof window === 'undefined') {
    return { kind: 'gradient', value: 'aurora' };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { kind: 'gradient', value: 'aurora' };
    const parsed = JSON.parse(raw) as Wallpaper;
    if (!parsed || typeof parsed !== 'object')
      return { kind: 'gradient', value: 'aurora' };
    if (parsed.kind === 'solid' && typeof parsed.value === 'string') {
      return { kind: 'solid', value: parsed.value };
    }
    if (parsed.kind === 'gradient' && typeof parsed.value === 'string') {
      return { kind: 'gradient', value: parsed.value };
    }
    if (parsed.kind === 'image' && typeof parsed.value === 'string') {
      return { kind: 'image', value: parsed.value };
    }
    return { kind: 'gradient', value: 'aurora' };
  } catch {
    return { kind: 'gradient', value: 'aurora' };
  }
}

export function setWallpaper(wallpaper: Wallpaper) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wallpaper));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: wallpaper }));
    }
  } catch {
    // no-op
  }
}

export function listenWallpaperChange(cb: (w: Wallpaper) => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<Wallpaper>;
    if (custom?.detail) {
      cb(custom.detail);
      return;
    }
    cb(getWallpaper());
  };
  window.addEventListener(EVENT_NAME, handler as EventListener);
  window.addEventListener('storage', handler as EventListener);
  return () => {
    window.removeEventListener(EVENT_NAME, handler as EventListener);
    window.removeEventListener('storage', handler as EventListener);
  };
}
