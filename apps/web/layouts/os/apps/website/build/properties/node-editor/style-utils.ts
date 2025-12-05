// Style utilities for NodeEditor

export function setScaleBase(
  style: Record<string, unknown>,
  value: number,
): Record<string, unknown> {
  const next = { ...style };
  const existing =
    typeof next.transform === 'string' ? next.transform : undefined;
  const filtered = existing
    ? existing
        .split(/\s+/)
        .filter((token) => token && !token.startsWith('scale('))
        .join(' ')
    : '';
  if (Math.abs(value - 1) < 0.01) {
    if (filtered) {
      next.transform = filtered;
    } else {
      delete next.transform;
    }
  } else {
    const scaleToken = `scale(${Number(value.toFixed(2))})`;
    next.transform = filtered ? `${scaleToken} ${filtered}` : scaleToken;
  }
  return next;
}

export function setPaddingBase(
  style: Record<string, unknown>,
  value: number,
): Record<string, unknown> {
  const next = { ...style };
  if (value <= 0) {
    delete next.padding;
  } else {
    next.padding = `${Math.round(value)}px`;
  }
  return next;
}

export function extractScale(style: unknown): number {
  if (!style || typeof style !== 'object') return 1;
  const transform = (style as Record<string, unknown>).transform;
  if (typeof transform !== 'string') return 1;
  const match = transform.match(/scale\(([^)]+)\)/);
  if (!match) return 1;
  const parsed = parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : 1;
}

export function extractPadding(style: unknown): number {
  if (!style || typeof style !== 'object') return 0;
  const padding = (style as Record<string, unknown>).padding;
  if (typeof padding === 'number') return padding;
  if (typeof padding === 'string') {
    const parsed = parseFloat(padding);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}
