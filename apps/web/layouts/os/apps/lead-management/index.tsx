'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Layout, Plus, Settings } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { SortableColumn } from './components/SortableColumn';
import { ColumnOverlay } from './components/LeadColumn';
import { LeadCardOverlay } from './components/LeadCard';
import { LeadModal } from './components/LeadModal';
import { PipelineModal } from './components/PipelineModal';
import { TemplateModal } from './components/TemplateModal';
import { usePipelineState } from './hooks/usePipelineState';
import { PIPELINE_TEMPLATES } from './constants';

export default function LeadManagementApp() {
  const state = usePipelineState();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragStart(e: DragStartEvent) {
    const { active } = e;
    const data = active.data.current;

    if (data?.type === 'column') {
      state.setActiveColumn(data.column);
    } else {
      const lead = Object.values(state.board).flat().find((l) => l.id === active.id);
      state.setActiveLead(lead ?? null);
    }
  }

  function onDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over || active.data.current?.type === 'column') return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const fromCol = state.findContainer(activeId);
    const toCol = state.findContainer(overId);

    if (!fromCol || !toCol || fromCol === toCol) return;

    state.setBoard((prev) => {
      const fromItems = prev[fromCol] || [];
      const toItems = prev[toCol] || [];
      const moving = fromItems.find((l) => l.id === activeId);
      if (!moving) return prev;

      const newFrom = fromItems.filter((l) => l.id !== activeId);
      const overIndex = toItems.findIndex((l) => l.id === overId);
      const insertAt = overIndex >= 0 ? overIndex : toItems.length;

      return {
        ...prev,
        [fromCol]: newFrom,
        [toCol]: [...toItems.slice(0, insertAt), moving, ...toItems.slice(insertAt)],
      };
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    state.setActiveLead(null);
    state.setActiveColumn(null);
    if (!over) return;

    // Handle column reordering
    if (active.data.current?.type === 'column') {
      const oldIndex = state.columns.findIndex((c) => c.id === active.id);
      const newIndex = state.columns.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        state.setColumns(arrayMove(state.columns, oldIndex, newIndex));
      }
      return;
    }

    // Handle lead reordering within same column
    const activeId = String(active.id);
    const overId = String(over.id);
    const fromCol = state.findContainer(activeId);
    const toCol = state.findContainer(overId);

    if (!fromCol || !toCol) return;

    if (fromCol === toCol) {
      const colItems = state.board[fromCol] || [];
      const oldIndex = colItems.findIndex((l) => l.id === activeId);
      const newIndex = colItems.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        state.setBoard((prev) => ({
          ...prev,
          [fromCol]: arrayMove(prev[fromCol] || [], oldIndex, newIndex),
        }));
      }
    }
  }

  const totalLeads = Object.values(state.board).flat().length;

  return (
    <div className="text-foreground relative flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Lead Pipeline</h1>
          <Badge variant="secondary" className="text-xs">
            {totalLeads} leads
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => state.setIsTemplateModalOpen(true)}>
            <Layout className="mr-1.5 h-4 w-4" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => state.setIsPipelineModalOpen(true)}>
            <Settings className="mr-1.5 h-4 w-4" />
            Customize
          </Button>
          <Button size="sm" onClick={state.addColumn}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Stage
          </Button>
        </div>
      </div>

      {/* Board */}
      <div className="scrollbar-thin scrollbar-thumb-muted flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={state.columns.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex h-full gap-4">
              {state.columns.map((col) => (
                <SortableColumn
                  key={col.id}
                  column={col}
                  leads={state.board[col.id] || []}
                  onAddLead={() => state.openCreateLead(col.id)}
                  onEditLead={state.openEditLead}
                  onUpdateColumn={state.updateColumn}
                  onDeleteColumn={state.deleteColumn}
                  canDelete={state.columns.length > 1}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {state.activeLead && <LeadCardOverlay lead={state.activeLead} />}
            {state.activeColumn && <ColumnOverlay column={state.activeColumn} />}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Lead Modal */}
      {state.isLeadModalOpen && (
        <LeadModal
          lead={state.detailLead}
          isNew={!!state.editingColumnId}
          onSave={state.saveLead}
          onDelete={state.deleteLead}
          onClose={() => {
            state.setIsLeadModalOpen(false);
            state.setDetailLead(null);
            state.setEditingColumnId(null);
          }}
        />
      )}

      {/* Pipeline Settings Modal */}
      {state.isPipelineModalOpen && (
        <PipelineModal
          columns={state.columns}
          onUpdateColumn={state.updateColumn}
          onDeleteColumn={state.deleteColumn}
          onAddColumn={state.addColumn}
          onReorderColumns={state.setColumns}
          onClose={() => state.setIsPipelineModalOpen(false)}
        />
      )}

      {/* Template Modal */}
      {state.isTemplateModalOpen && (
        <TemplateModal
          templates={PIPELINE_TEMPLATES}
          onApply={state.applyTemplate}
          onClose={() => state.setIsTemplateModalOpen(false)}
        />
      )}
    </div>
  );
}
