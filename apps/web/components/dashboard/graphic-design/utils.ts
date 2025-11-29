/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from 'konva';
import { AnyNode, RectNode } from './types';

let _raf: number | null = null;
export function rafDraw(node: Konva.Stage | Konva.Layer) {
  if (_raf) return;
  _raf = requestAnimationFrame(() => {
    // @ts-ignore
    node.batchDraw?.();
    _raf = null;
  });
}
Konva.autoDrawEnabled = false;

export function buildInitialNodes(
  title: string,
  subtitle: string,
  cta: string,
): AnyNode[] {
  return [
    {
      id: 'bg',
      name: 'Background',
      type: 'rect',
      x: -2000,
      y: -2000,
      width: 4000,
      height: 4000,
      fill: '#0b0f17',
      cornerRadius: 0,
      locked: true,
    },
    {
      id: 'card',
      name: 'Card',
      type: 'rect',
      x: 40,
      y: 40,
      width: 1040,
      height: 560,
      fill: '#0b1220',
      cornerRadius: 24,
    },
    {
      id: 'title',
      name: 'Title',
      type: 'text',
      x: 96,
      y: 120,
      width: 640,
      height: 80,
      text: title,
      fontSize: 36,
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fill: '#E5E7EB',
      align: 'left',
    },
    {
      id: 'subtitle',
      name: 'Subtitle',
      type: 'text',
      x: 96,
      y: 240,
      width: 560,
      height: 60,
      text: subtitle,
      fontSize: 20,
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fill: '#9CA3AF',
      align: 'left',
    },
    {
      id: 'cta',
      name: 'CTA Button',
      type: 'rect',
      x: 96,
      y: 320,
      width: 200,
      height: 48,
      fill: '#3B82F6',
      cornerRadius: 12,
    },
    {
      id: 'ctaText',
      name: 'CTA Text',
      type: 'text',
      x: 120,
      y: 332,
      width: 200,
      height: 48,
      text: cta,
      fontSize: 18,
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      fill: '#ffffff',
      align: 'left',
    },
  ];
}

export function generateVariants(text: string): string[] {
  const base = (text ?? '').replace(/\s+/g, ' ').trim();
  if (!base) return [];
  const compact =
    base.length > 60
      ? base.slice(0, 60).replace(/[,.;:!\-\s]+$/, '') + '…'
      : base;
  const punchy = base
    .replace(/\b(we|our|the)\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const benefit = base
    .replace(/\bbuild\b|\bcreate\b/gi, 'ship')
    .replace(/beautiful(ly)?/gi, 'polished');
  return [base, compact, punchy, benefit, `Professional — ${base}`].filter(
    (v, i, arr) => v && arr.indexOf(v) === i,
  );
}

export function moveLayer(
  nodes: AnyNode[],
  id: string,
  dir: 'up' | 'down' | 'top' | 'bottom',
): AnyNode[] {
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx < 0) return nodes;
  const arr = nodes.slice();
  const [item] = arr.splice(idx, 1);
  if (!item) return nodes;
  if (dir === 'up') arr.splice(Math.min(idx + 1, arr.length), 0, item);
  else if (dir === 'down') arr.splice(Math.max(idx - 1, 0), 0, item);
  else if (dir === 'top') arr.push(item);
  else if (dir === 'bottom') arr.unshift(item);
  return arr;
}

export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

// Lightweight runtime checks for utils
(function runRuntimeTests() {
  try {
    const v1 = generateVariants(
      'Design smarter. Build faster. Launch beautifully.',
    );
    console.assert(
      Array.isArray(v1) && v1.length >= 3,
      '[TEST] variants length',
    );
    const v2 = generateVariants('');
    console.assert(Array.isArray(v2) && v2.length === 0, '[TEST] empty input');
    const v3 = generateVariants('Create and build value');
    console.assert(
      v3.some((s) => /ship/i.test(s)),
      '[TEST] benefit replacement',
    );
    const nodesArr: AnyNode[] = [
      {
        id: 'a',
        type: 'rect',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: '#000',
      } as RectNode,
      {
        id: 'b',
        type: 'rect',
        x: 0,
        y: 0,
        width: 10,
        height: 10,
        fill: '#111',
      } as RectNode,
    ];
    const up = moveLayer(nodesArr, 'a', 'up');
    console.assert(up[1]?.id === 'a', '[TEST] move up');
    const top = moveLayer(nodesArr, 'a', 'top');
    console.assert(top[top.length - 1]?.id === 'a', '[TEST] move top');
  } catch {}
})();
