// app/(anything)/LeadBoard.tsx
'use client';

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  restrictToParentElement,
  restrictToWindowEdges,
} from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoveRight, Plus, X } from 'lucide-react';
import * as React from 'react';

type ColumnId = 'new' | 'qualified' | 'proposal' | 'won' | 'lost';

type Lead = {
  id: string;
  name: string;
  company?: string;
  value?: number;
  notes?: string;
  email?: string;
  phone?: string;
  owner?: string;
  source?: string; // e.g. Ads, Referral
};

type BoardState = Record<ColumnId, Lead[]>;

const COLS: { id: ColumnId; title: string }[] = [
  { id: 'new', title: 'New' },
  { id: 'qualified', title: 'Qualified' },
  { id: 'proposal', title: 'Proposal' },
  { id: 'won', title: 'Won' },
  { id: 'lost', title: 'Lost' },
];

const initialData: BoardState = {
  new: [
    {
      id: 'l-101',
      name: 'Rafi – Landing Revamp',
      company: 'Kopi Kuning',
      source: 'Website',
    },
    {
      id: 'l-102',
      name: 'Ani – Branding Kit',
      company: 'Sweet & Co',
      source: 'Referral',
    },
  ],
  qualified: [
    {
      id: 'l-201',
      name: 'Dina – Web App',
      company: 'DigiMart',
      value: 25_000_000,
      email: 'dina@digimart.id',
    },
  ],
  proposal: [
    {
      id: 'l-301',
      name: 'Budi – SEO Retainer',
      company: 'Rumah Baja',
      value: 8_000_000,
      owner: 'Arham',
    },
  ],
  won: [
    {
      id: 'l-401',
      name: 'Tel-U – Microsite',
      value: 15_000_000,
      source: 'Ads',
    },
  ],
  lost: [{ id: 'l-501', name: 'Andi – Rebrand', notes: 'Budget mismatch' }],
};

export default function LeadBoard() {
  const [board, setBoard] = React.useState<BoardState>(initialData);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [detailLead, setDetailLead] = React.useState<Lead | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 80, tolerance: 5 },
    }),
  );

  const allIds = React.useMemo(
    () =>
      Object.values(board)
        .flat()
        .map((l) => l.id),
    [board],
  );

  function findContainer(id: string | null): ColumnId | null {
    if (!id) return null;
    if (COLS.some((c) => c.id === (id as ColumnId))) return id as ColumnId;
    const entry = (Object.keys(board) as ColumnId[]).find((col) =>
      board[col].some((l) => l.id === id),
    );
    return entry ?? null;
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromCol = findContainer(activeId);
    const toCol = findContainer(overId);
    if (!fromCol || !toCol || fromCol === toCol) return;

    // live move cross-column (preview-style)
    setBoard((prev) => {
      const fromItems = prev[fromCol];
      const toItems = prev[toCol];
      const moving = fromItems.find((l) => l.id === activeId);
      if (!moving) return prev;

      const newFrom = fromItems.filter((l) => l.id !== activeId);

      const overIndex =
        toItems.findIndex((l) => l.id === overId) >= 0
          ? toItems.findIndex((l) => l.id === overId)
          : toItems.length;

      const newTo = [
        ...toItems.slice(0, overIndex),
        moving,
        ...toItems.slice(overIndex),
      ];

      return { ...prev, [fromCol]: newFrom, [toCol]: newTo };
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const fromCol = findContainer(activeId);
    const toCol = findContainer(overId);
    if (!fromCol || !toCol) return;

    if (fromCol === toCol) {
      const colItems = board[fromCol];
      const oldIndex = colItems.findIndex((l) => l.id === activeId);
      const newIndex =
        colItems.findIndex((l) => l.id === overId) >= 0
          ? colItems.findIndex((l) => l.id === overId)
          : colItems.length - 1;

      if (oldIndex !== newIndex) {
        setBoard((prev) => ({
          ...prev,
          [fromCol]: arrayMove(prev[fromCol], oldIndex, newIndex),
        }));
      }
    }
    // Cross-column already applied in onDragOver
    // ↓ place to sync with API if needed
    // fetch("/api/leads/reorder", { method: "PATCH", body: JSON.stringify(...) })
  }

  function addLead(col: ColumnId) {
    const id = `l-${Math.random().toString(36).slice(2, 8)}`;
    setBoard((prev) => ({
      ...prev,
      [col]: [
        { id, name: 'New Lead', notes: 'Tap to edit', source: 'Manual' },
        ...prev[col],
      ],
    }));
  }

  const activeLead: Lead | undefined =
    activeId && allIds.includes(activeId)
      ? (Object.values(board)
          .flat()
          .find((l) => l.id === activeId) as Lead)
      : undefined;

  return (
    <div className="h-[calc(100vh-120px)] w-full overflow-hidden">
      <div
        className="flex h-full gap-4 overflow-x-auto p-4 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full"
        id="lead-stage"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          modifiers={[restrictToWindowEdges, restrictToParentElement]}
        >
          {COLS.map((c) => (
            <Column
              key={c.id}
              id={c.id}
              title={c.title}
              items={board[c.id]}
              onAdd={() => addLead(c.id)}
              onOpenDetail={(lead) => setDetailLead(lead)}
            />
          ))}

          <DragOverlay dropAnimation={{ duration: 150, easing: 'ease-out' }}>
            {activeLead ? <LeadCard lead={activeLead} ghost /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <LeadDetailsDrawer
        open={!!detailLead}
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        onSave={(patch) => {
          if (!detailLead) return;
          setBoard((prev) => {
            const col = (Object.keys(prev) as ColumnId[]).find((k) =>
              prev[k].some((l) => l.id === detailLead.id),
            );
            if (!col) return prev;
            return {
              ...prev,
              [col]: prev[col].map((l) =>
                l.id === detailLead.id ? { ...l, ...patch } : l,
              ),
            };
          });
          // Optionally call API here
          setDetailLead((d) => (d ? { ...d, ...patch } : d));
        }}
      />
    </div>
  );
}

function Column({
  id,
  title,
  items,
  onAdd,
  onOpenDetail,
}: {
  id: ColumnId;
  title: string;
  items: Lead[];
  onAdd: () => void;
  onOpenDetail: (lead: Lead) => void;
}) {
  // make the WHOLE column a droppable area
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="bg-background/60 flex w-72 min-w-72 flex-col rounded-2xl border backdrop-blur">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm font-semibold">
          {title}{' '}
          <span className="text-muted-foreground ml-1">({items.length})</span>
        </div>
        <button
          onClick={onAdd}
          className="hover:bg-muted inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={[
          'flex-1 space-y-2 overflow-y-auto p-3 transition-colors',
          isOver ? 'bg-muted/40' : '',
        ].join(' ')}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((lead) => (
            <SortableLeadCard
              key={lead.id}
              lead={lead}
              onOpenDetail={onOpenDetail}
            />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-center text-xs">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}

function SortableLeadCard({
  lead,
  onOpenDetail,
}: {
  lead: Lead;
  onOpenDetail: (lead: Lead) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lead.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  // prevent click firing while dragging
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDragging) return;
    onOpenDetail(lead);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
    >
      <LeadCard lead={lead} />
    </div>
  );
}

function LeadCard({ lead, ghost }: { lead: Lead; ghost?: boolean }) {
  return (
    <div
      className={[
        'bg-card rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md',
        ghost ? 'ring-primary/40 opacity-90 ring-1' : '',
      ].join(' ')}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">{lead.name}</div>
          {lead.company ? (
            <div className="text-muted-foreground text-xs">{lead.company}</div>
          ) : null}
        </div>
        <MoveRight className="text-muted-foreground h-4 w-4 shrink-0" />
      </div>
      <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
        {lead.value ? (
          <span>≈ Rp{lead.value.toLocaleString('id-ID')}</span>
        ) : (
          <span>—</span>
        )}
        {lead.source ? (
          <span className="max-w-[140px] truncate">{lead.source}</span>
        ) : null}
      </div>
    </div>
  );
}

/* ——— Right-side detail drawer (headless, no deps) ——— */
function LeadDetailsDrawer({
  open,
  lead,
  onClose,
  onSave,
}: {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSave: (patch: Partial<Lead>) => void;
}) {
  const [form, setForm] = React.useState<Partial<Lead>>({});

  React.useEffect(() => {
    setForm(lead ?? {});
  }, [lead]);

  if (!open || !lead) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* panel */}
      <aside
        className="bg-background absolute top-0 right-0 h-full w-[380px] max-w-[85vw] overflow-y-auto border-l p-4 shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Lead Details</h3>
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-lg border p-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Name">
            <input
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
              value={form.name ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Company">
            <input
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
              value={form.company ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email">
              <input
                className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
                value={form.email ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </Field>
            <Field label="Phone">
              <input
                className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
                value={form.phone ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner">
              <input
                className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
                value={form.owner ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, owner: e.target.value }))
                }
              />
            </Field>
            <Field label="Source">
              <input
                className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
                value={form.source ?? ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, source: e.target.value }))
                }
              />
            </Field>
          </div>
          <Field label="Value (IDR)">
            <input
              type="number"
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
              value={form.value ?? 0}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: Number(e.target.value || 0) }))
              }
            />
          </Field>
          <Field label="Notes">
            <textarea
              className="bg-background w-full rounded-lg border px-3 py-2 text-sm"
              rows={5}
              value={form.notes ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </Field>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="hover:bg-muted rounded-lg border px-3 py-1.5 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="bg-foreground text-background rounded-lg px-3 py-1.5 text-sm hover:opacity-90"
          >
            Save
          </button>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-muted-foreground mb-1 text-xs">{label}</div>
      {children}
    </label>
  );
}
