import * as React from 'react';

export type WidgetType = 'clock' | 'site-builder' | 'note';

export type WidgetModel = {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w?: number;
  h?: number;
  settings?: Record<string, any>;
};

type WidgetsContextType = {
  widgets: WidgetModel[];
  addWidget: (type: WidgetType, init?: Partial<WidgetModel>) => void;
  removeWidget: (id: string) => void;
  clearWidgets: () => void;
  updateWidget: (id: string, patch: Partial<WidgetModel>) => void;
  setWidgetPosition: (id: string, x: number, y: number) => void;
};

const WidgetsContext = React.createContext<WidgetsContextType | null>(null);

const STORAGE_KEY = 'os.widgets.v1';

function load(): WidgetModel[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((w) => w && typeof w.id === 'string');
  } catch {
    return [];
  }
}

function save(widgets: WidgetModel[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
  } catch {
    // ignore
  }
}

export function WidgetsProvider({ children }: { children: React.ReactNode }) {
  const [widgets, setWidgets] = React.useState<WidgetModel[]>(() => load());

  React.useEffect(() => {
    save(widgets);
  }, [widgets]);

  function findNonOverlappingPosition(
    existing: WidgetModel[],
    desiredX: number,
    desiredY: number,
    width: number,
    height: number,
  ): { x: number; y: number } {
    const GAP = 12;
    const NAVBAR_HEIGHT = 56;
    const margin = 16;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

    const rects = existing.map((w) => ({
      x: w.x,
      y: w.y,
      w: w.w && Number.isFinite(w.w) ? Number(w.w) : 260,
      h: w.h && Number.isFinite(w.h) ? Number(w.h) : 180,
    }));

    const columns: number[] = [];
    // Build columns from right edge inward
    let cx = Math.max(margin, vw - width - margin);
    while (cx >= margin) {
      columns.push(cx);
      cx -= width + GAP;
    }

    const rows: number[] = [];
    // Start rows below navbar
    let ry = NAVBAR_HEIGHT + margin;
    while (ry <= vh - height - margin) {
      rows.push(ry);
      ry += height + GAP;
    }

    const overlaps = (x: number, y: number) =>
      rects.some(
        (r) =>
          !(
            x + width <= r.x - GAP ||
            x >= r.x + r.w + GAP ||
            y + height <= r.y - GAP ||
            y >= r.y + r.h + GAP
          ),
      );

    // Prefer desired slot; if occupied, scan grid
    if (!overlaps(desiredX, desiredY)) return { x: desiredX, y: desiredY };

    for (const x of columns) {
      for (const y of rows) {
        if (!overlaps(x, y)) return { x, y };
      }
    }

    // Fallback: stack below last widget with gap
    const last = rects[rects.length - 1];
    const fx = Math.max(margin, vw - width - margin);
    const fy = last
      ? Math.min(vh - height - margin, last.y + last.h + GAP)
      : NAVBAR_HEIGHT + margin;
    return { x: fx, y: fy };
  }

  const addWidget = React.useCallback(
    (type: WidgetType, init?: Partial<WidgetModel>) => {
      const id = `w-${type}-${Math.random().toString(36).slice(2, 9)}`;

      const NAVBAR_HEIGHT = 56; // approx top bar height
      const MARGIN = 16;
      const DEFAULT_W =
        init?.w && Number.isFinite(init.w) ? Number(init.w) : 260;
      const DEFAULT_H =
        init?.h && Number.isFinite(init.h) ? Number(init.h) : 180;

      let desiredX = 24;
      const desiredY = NAVBAR_HEIGHT + MARGIN;
      if (typeof window !== 'undefined') {
        const vw = window.innerWidth || 0;
        desiredX = Math.max(MARGIN, vw - DEFAULT_W - MARGIN);
      }

      setWidgets((prev) => {
        const { x, y } = findNonOverlappingPosition(
          prev,
          desiredX,
          desiredY,
          DEFAULT_W,
          DEFAULT_H,
        );
        return [
          ...prev,
          {
            id,
            type,
            x: init?.x ?? x,
            y: init?.y ?? y,
            w: init?.w,
            h: init?.h,
            settings:
              init?.settings ?? (type === 'note' ? { text: 'New Note' } : {}),
          },
        ];
      });
    },
    [],
  );

  const removeWidget = React.useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const clearWidgets = React.useCallback(() => {
    setWidgets([]);
  }, []);

  const updateWidget = React.useCallback(
    (id: string, patch: Partial<WidgetModel>) => {
      setWidgets((prev) =>
        prev.map((w) => (w.id === id ? { ...w, ...patch } : w)),
      );
    },
    [],
  );

  const setWidgetPosition = React.useCallback(
    (id: string, x: number, y: number) => {
      setWidgets((prev) => {
        const GRID = 12; // snap grid
        const SNAP = 10; // magnet range
        const GAP = 12; // desired spacing
        const MARGIN = 16;
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

        const current = prev.find((w) => w.id === id);
        if (!current) return prev;
        const cw =
          current.w && Number.isFinite(current.w) ? Number(current.w) : 260;
        const ch =
          current.h && Number.isFinite(current.h) ? Number(current.h) : 180;

        // grid snap
        let nx = Math.round(x / GRID) * GRID;
        let ny = Math.round(y / GRID) * GRID;

        // magnetic align to neighbors' edges with gap
        const others = prev
          .filter((w) => w.id !== id)
          .map((w) => ({
            x: w.x,
            y: w.y,
            w: w.w && Number.isFinite(w.w) ? Number(w.w) : 260,
            h: w.h && Number.isFinite(w.h) ? Number(w.h) : 180,
          }));

        const candidatesX: number[] = [nx];
        const candidatesY: number[] = [ny];
        for (const r of others) {
          // snap left edge to their left/right edges (+ gap)
          candidatesX.push(r.x); // align left-left
          candidatesX.push(r.x + r.w + GAP); // to right with gap
          // snap right edge to their left/right edges (- gap)
          candidatesX.push(r.x - cw - GAP); // to left with gap

          // vertical
          candidatesY.push(r.y); // align top-top
          candidatesY.push(r.y + r.h + GAP); // below with gap
          candidatesY.push(r.y - ch - GAP); // above with gap
        }

        const snapCoord = (val: number, list: number[]) => {
          let best = val;
          let bestDist = SNAP + 1;
          for (const t of list) {
            const d = Math.abs(val - t);
            if (d < bestDist && d <= SNAP) {
              best = t;
              bestDist = d;
            }
          }
          return best;
        };

        nx = snapCoord(nx, candidatesX);
        ny = snapCoord(ny, candidatesY);

        // clamp to viewport
        nx = Math.max(MARGIN, Math.min(nx, vw - cw - MARGIN));
        ny = Math.max(MARGIN, Math.min(ny, vh - ch - MARGIN));

        return prev.map((w) => (w.id === id ? { ...w, x: nx, y: ny } : w));
      });
    },
    [],
  );

  const value: WidgetsContextType = React.useMemo(
    () => ({
      widgets,
      addWidget,
      removeWidget,
      clearWidgets,
      updateWidget,
      setWidgetPosition,
    }),
    [
      widgets,
      addWidget,
      removeWidget,
      clearWidgets,
      updateWidget,
      setWidgetPosition,
    ],
  );

  return (
    <WidgetsContext.Provider value={value}>{children}</WidgetsContext.Provider>
  );
}

export function useWidgets() {
  const ctx = React.useContext(WidgetsContext);
  if (!ctx) throw new Error('useWidgets must be used within WidgetsProvider');
  return ctx;
}
