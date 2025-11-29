/* eslint-disable @typescript-eslint/no-explicit-any */
import Konva from 'konva';
import { useEffect, useMemo, useRef } from 'react';
import { AnyNode, ImageNode, RectNode, TextNode, isTextNode } from './types';
import { clamp, rafDraw } from './utils';

type Props = {
  nodes: AnyNode[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChangeNodes: (updater: (prev: AnyNode[]) => AnyNode[]) => void;
  onAssistRequest?: (text: string) => void;
};

export default function Canvas({
  nodes,
  selectedId,
  onSelect,
  onChangeNodes,
  onAssistRequest,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const gridLayerRef = useRef<Konva.Layer | null>(null);
  const layerRef = useRef<Konva.Layer | null>(null);
  const handlesLayerRef = useRef<Konva.Layer | null>(null);
  const viewportRef = useRef<Konva.Group | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);
  const shapesRef = useRef<Record<string, Konva.Group>>({});

  const selected = useMemo(
    () => nodes.find((n) => n.id === selectedId) as AnyNode | undefined,
    [nodes, selectedId],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver(() => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.size({ width: el.clientWidth, height: el.clientHeight });
      rafDraw(stage);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const stage = new Konva.Stage({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    });
    stageRef.current = stage;
    const gridLayer = new Konva.Layer({ listening: false });
    gridLayerRef.current = gridLayer;
    stage.add(gridLayer);
    gridLayer.hitGraphEnabled(false);
    const layer = new Konva.Layer({ imageSmoothingEnabled: true });
    layerRef.current = layer;
    stage.add(layer);
    const handlesLayer = new Konva.Layer({ listening: true });
    handlesLayerRef.current = handlesLayer;
    stage.add(handlesLayer);
    const viewport = new Konva.Group({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
    viewportRef.current = viewport;
    layer.add(viewport);
    const tr = new Konva.Transformer({
      rotateEnabled: true,
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      anchorSize: 8,
      borderStroke: '#60A5FA',
      anchorStroke: '#60A5FA',
    });
    trRef.current = tr;
    layer.add(tr);
    drawGrid();
    const isPanning = { current: false } as { current: boolean };
    const setCursor = (c: string) => (stage.container().style.cursor = c);
    stage.on('contextmenu', (e) => e.evt.preventDefault());
    const down = (e: Konva.KonvaEventObject<MouseEvent>) => {
      const isRight = e.evt.button === 2;
      const isMiddle = e.evt.button === 1;
      const isSpace = (e.evt as any).spaceKey || (window as any).__spaceHold;
      if (isRight || isMiddle || isSpace) {
        isPanning.current = true;
        viewport.draggable(true);
        viewport.startDrag();
        setCursor('grabbing');
        onSelect(selectedId);
      }
    };
    const up = () => {
      if (isPanning.current) {
        isPanning.current = false;
        viewport.stopDrag();
        viewport.draggable(false);
        setCursor('default');
      }
    };
    stage.on('mousedown touchstart', down as any);
    stage.on('mouseup touchend', up);
    const keydown = (ev: KeyboardEvent) => {
      if (ev.code === 'Space') {
        (window as any).__spaceHold = true;
        setCursor('grab');
      }
      if (ev.key === 'Shift') {
        (window as any).__shiftHold = true;
      }
    };
    const keyup = (ev: KeyboardEvent) => {
      if (ev.code === 'Space') {
        (window as any).__spaceHold = false;
        if (!isPanning.current) setCursor('default');
      }
      if (ev.key === 'Shift') {
        (window as any).__shiftHold = false;
      }
    };
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    stage.on('wheel', (e) => {
      e.evt.preventDefault();
      const scaleBy = 1.05;
      const oldScale = viewport.scaleX();
      const pointer = stage.getPointerPosition();
      if (!pointer) return;
      const mousePointTo = {
        x: (pointer.x - viewport.x()) / oldScale,
        y: (pointer.y - viewport.y()) / oldScale,
      };
      const direction = e.evt.deltaY > 0 ? -1 : 1;
      const newScale = clamp(
        oldScale * (direction > 0 ? scaleBy : 1 / scaleBy),
        0.1,
        8,
      );
      viewport.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      viewport.position(newPos);
      drawGrid();
      rafDraw(stage);
    });
    stage.on('mousedown', (e) => {
      if (e.target === stage && !isPanning.current) {
        onSelect(null);
        tr.nodes([]);
        rafDraw(stage);
      }
    });
    return () => {
      stage.destroy();
      stageRef.current = null;
      layerRef.current = null;
      gridLayerRef.current = null;
      trRef.current = null;
      viewportRef.current = null;
      handlesLayerRef.current = null;
      shapesRef.current = {};
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawGrid() {
    const stage = stageRef.current;
    const gridLayer = gridLayerRef.current;
    const viewport = viewportRef.current;
    if (!stage || !gridLayer || !viewport) return;
    gridLayer.destroyChildren();
    const { width, height } = stage.size();
    const scale = viewport.scaleX();
    const step = 64 * scale;
    const faint = new Konva.Group({ listening: false, opacity: 0.25 });
    for (let x = -width; x < width * 2; x += step)
      faint.add(
        new Konva.Line({
          points: [x, -height, x, height * 2],
          stroke: '#1f2937',
          strokeWidth: 1,
        }),
      );
    for (let y = -height; y < height * 2; y += step)
      faint.add(
        new Konva.Line({
          points: [-width, y, width * 2, y],
          stroke: '#1f2937',
          strokeWidth: 1,
        }),
      );
    gridLayer.add(faint);
    rafDraw(gridLayer);
  }

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const layer = layerRef.current;
    if (!stage || !viewport || !layer) return;
    const seen: Record<string, true> = {};
    nodes.forEach((n) => {
      seen[n.id] = true;
      let g = shapesRef.current[n.id];
      if (!g) {
        g = new Konva.Group({ id: n.id, draggable: !n.locked });
        g.on('click mousedown', (evt) => {
          if (viewport.draggable()) return;
          onSelect(n.id);
          evt.cancelBubble = true;
        });
        g.on('dragstart', () => onSelect(n.id));
        g.on('dragend', (evt) => {
          const { x, y } = evt.target.position();
          onChangeNodes((prev) =>
            prev.map((p) => (p.id === n.id ? { ...p, x, y } : p)),
          );
        });
        g.on('transformend', (evt) => {
          const group = evt.target as Konva.Group;
          const scaleX = group.scaleX();
          const scaleY = group.scaleY();
          const width = clamp(group.width() * scaleX, 8, 10000);
          const height = clamp(group.height() * scaleY, 8, 10000);
          group.scale({ x: 1, y: 1 });
          onChangeNodes((prev) =>
            prev.map((p) =>
              p.id === n.id
                ? {
                    ...p,
                    x: group.x(),
                    y: group.y(),
                    width,
                    height,
                    rotation: group.rotation(),
                  }
                : p,
            ),
          );
        });
        shapesRef.current[n.id] = g;
        viewport.add(g);
      }
      g.visible(n.visible !== false);
      g.draggable(!n.locked);
      g.position({ x: n.x, y: n.y });
      g.rotation(n.rotation || 0);
      g.destroyChildren();
      if (n.type === 'rect') {
        const rect = new Konva.Rect({
          width: n.width,
          height: n.height,
          cornerRadius: (n as RectNode).cornerRadius || 0,
          fill: (n as RectNode).fill,
          opacity: n.id === 'bg' ? 1 : 0.98,
          shadowBlur: selectedId === n.id ? 8 : 0,
        });
        g.add(rect);
      } else if (n.type === 'text') {
        const t = n as TextNode;
        const text = new Konva.Text({
          text: t.text,
          width: n.width,
          height: n.height,
          fontSize: t.fontSize,
          fontFamily: t.fontFamily,
          fill: t.fill,
          align: t.align || 'left',
          padding: 4,
        });
        g.add(text);
      } else if (n.type === 'image') {
        const imgNode = n as ImageNode;
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.src = imgNode.src;
        image.onload = () => {
          const kimg = new Konva.Image({
            image,
            width: n.width,
            height: n.height,
          });
          if (imgNode.bgRemoved) {
            kimg.filters([Konva.Filters.Brighten]);
            (kimg as any).brightness(0.05);
          }
          g.add(kimg);
          rafDraw(layer);
        };
      }
    });
    Object.keys(shapesRef.current).forEach((id) => {
      if (!seen[id]) {
        shapesRef.current[id]?.destroy();
        delete shapesRef.current[id];
      }
    });
    const tr = trRef.current!;
    if (selectedId && shapesRef.current[selectedId])
      tr.nodes([shapesRef.current[selectedId]]);
    else tr.nodes([]);
    buildCustomHandles();
    rafDraw(layer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, selectedId]);

  function buildCustomHandles() {
    const stage = stageRef.current,
      layer = layerRef.current,
      viewport = viewportRef.current,
      handlesLayer = handlesLayerRef.current;
    if (!stage || !layer || !viewport || !handlesLayer) return;
    handlesLayer.destroyChildren();
    if (!selectedId) {
      rafDraw(handlesLayer);
      return;
    }
    const nodeData = nodes.find((n) => n.id === selectedId);
    if (!nodeData || nodeData.type !== 'rect') {
      rafDraw(handlesLayer);
      return;
    }
    const g = shapesRef.current[selectedId];
    if (!g) {
      rafDraw(handlesLayer);
      return;
    }
    const width = nodeData.width;
    const height = nodeData.height;
    const handles = [
      { name: 'tl', x: 0, y: 0 },
      { name: 'tr', x: width, y: 0 },
      { name: 'bl', x: 0, y: height },
      { name: 'br', x: width, y: height },
    ] as const;
    const handleSize = 10;
    handles.forEach((h) => {
      const p = g.getAbsoluteTransform().point({ x: h.x, y: h.y });
      const rect = new Konva.Rect({
        x: p.x - handleSize / 2,
        y: p.y - handleSize / 2,
        width: handleSize,
        height: handleSize,
        fill: '#60A5FA',
        stroke: '#0ea5e9',
        strokeWidth: 1,
        draggable: true,
        name: `handle-${h.name}`,
      });
      rect.on('dragmove', (evt) => {
        const pos = evt.target.position();
        const local = g
          .getAbsoluteTransform()
          .copy()
          .invert()
          .point({ x: pos.x + handleSize / 2, y: pos.y + handleSize / 2 });
        const isShift = (window as any).__shiftHold;
        let nx = nodeData.x;
        let ny = nodeData.y;
        let nw = width;
        let nh = height;
        if (h.name === 'tl') {
          nw = width + (0 - local.x);
          nh = height + (0 - local.y);
          nx = nodeData.x + local.x;
          ny = nodeData.y + local.y;
        }
        if (h.name === 'tr') {
          nw = local.x;
          nh = height + (0 - local.y);
          ny = nodeData.y + local.y;
        }
        if (h.name === 'bl') {
          nw = width + (0 - local.x);
          nx = nodeData.x + local.x;
          nh = local.y;
        }
        if (h.name === 'br') {
          nw = local.x;
          nh = local.y;
        }
        nw = Math.max(8, nw);
        nh = Math.max(8, nh);
        if (isShift) {
          const side = Math.max(nw, nh);
          nw = side;
          nh = side;
          if (h.name === 'tl') {
            nx = nodeData.x + (width - side);
            ny = nodeData.y + (height - side);
          }
          if (h.name === 'tr') {
            ny = nodeData.y + (height - side);
          }
          if (h.name === 'bl') {
            nx = nodeData.x + (width - side);
          }
        }
        g.position({ x: nx, y: ny });
        g.destroyChildren();
        const rectK = new Konva.Rect({
          width: nw,
          height: nh,
          cornerRadius: (nodeData as RectNode).cornerRadius || 0,
          fill: (nodeData as RectNode).fill,
          opacity: nodeData.id === 'bg' ? 1 : 0.98,
          shadowBlur: selectedId === nodeData.id ? 8 : 0,
        });
        g.add(rectK);
        rafDraw(layer);
      });
      rect.on('dragend', () => {
        const krect = g.findOne('Rect') as Konva.Rect;
        const nw = krect.width();
        const nh = krect.height();
        const { x: nx, y: ny } = g.position();
        onChangeNodes((prev) =>
          prev.map((p) =>
            p.id === selectedId
              ? { ...(p as RectNode), x: nx, y: ny, width: nw, height: nh }
              : p,
          ),
        );
        buildCustomHandles();
      });
      handlesLayer.add(rect);
    });
    rafDraw(handlesLayer);
  }

  // Inline editable overlay for text nodes and Assist HUD button
  const overlayRef = useRef<HTMLTextAreaElement | null>(null);
  const editingRef = useRef<{
    id: string;
    rect: { left: number; top: number; width: number; height: number };
  } | null>(null);
  const hudPosRef = useRef<{ left: number; top: number }>({ left: 0, top: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !selectedId) {
      editingRef.current = null;
      return;
    }
    const node = stage.findOne(`#${selectedId}`) as Konva.Group | null;
    if (!node) {
      editingRef.current = null;
      return;
    }
    if (!isTextNode(nodes.find((n) => n.id === selectedId))) {
      editingRef.current = null;
      return;
    }
    const dbl = () => {
      const r = node.getClientRect({ skipStroke: false });
      const c = stage.container().getBoundingClientRect();
      editingRef.current = {
        id: selectedId!,
        rect: {
          left: c.left + r.x,
          top: c.top + r.y,
          width: r.width,
          height: r.height,
        },
      };
      setTimeout(() => overlayRef.current?.focus(), 0);
    };
    node.on('dblclick', dbl);
    return () => {
      node.off('dblclick', dbl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, nodes]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !selectedId) return;
    const node = stage.findOne(`#${selectedId}`) as Konva.Group | null;
    if (!node) return;
    const rect = node.getClientRect({ skipStroke: false });
    const containerRect = stage.container().getBoundingClientRect();
    hudPosRef.current = {
      left: containerRect.left + rect.x + rect.width - 12,
      top: containerRect.top + rect.y - 12,
    };
  }, [selectedId, nodes]);

  return (
    <div className="relative flex-1 p-0">
      <div ref={containerRef} className="absolute inset-0" />
      {isTextNode(selected) && (
        <div
          style={{ left: hudPosRef.current.left, top: hudPosRef.current.top }}
          className="pointer-events-auto fixed z-[300] -translate-x-full -translate-y-full"
        >
          <button
            className="bg-background/90 hover:bg-muted rounded-full border border-[var(--border)] px-3 py-1 text-xs shadow backdrop-blur"
            onClick={() => onAssistRequest?.((selected as TextNode).text)}
            title="Assist"
          >
            ✨ Assist
          </button>
        </div>
      )}
      {editingRef.current && isTextNode(selected) && (
        <textarea
          ref={overlayRef}
          defaultValue={(selected as TextNode).text}
          onChange={(e) => {
            const v = e.target.value;
            onChangeNodes((prev) =>
              prev.map((n) =>
                n.id === selected.id ? { ...(n as TextNode), text: v } : n,
              ),
            );
          }}
          onBlur={() => (editingRef.current = null)}
          style={{
            position: 'fixed',
            left: editingRef.current.rect.left,
            top: editingRef.current.rect.top,
            width: editingRef.current.rect.width,
            height: editingRef.current.rect.height,
            background: 'rgba(17,24,39,0.8)',
            color: 'white',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: 8,
            zIndex: 350,
          }}
        />
      )}
    </div>
  );
}
