// Helpers for macOS-like window positioning

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function getViewportBounds(w: number, h: number) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 720;
  const menu = 28; // top bar height
  const dock = 96; // reserved bottom space
  return {
    minX: 8,
    maxX: Math.max(8, vw - w - 8),
    minY: menu + 8,
    maxY: Math.max(menu + 8, vh - h - dock),
  } as const;
}
