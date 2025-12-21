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
import { Layout, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { SortableColumn } from './components/SortableColumn';
import { ColumnOverlay } from './components/lead-column';
import { LeadCardOverlay } from './components/lead-card';
import { LeadModal } from './components/LeadModal';
import { PipelineModal } from './components/PipelineModal';
import { TemplateModal } from './components/TemplateModal';
import { LeadPipelineHeader } from './components/LeadPipelineHeader';
import { useLeadManagement } from './hooks/useLeadManagement';
import { PIPELINE_TEMPLATES, COLUMN_COLORS } from './constants';
import { useState } from 'react';

export default function LeadManagementApp() {
  const state = useLeadManagement();
  const [optimisticBoard, setOptimisticBoard] = useState<typeof state.board | null>(null);

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
    const currentBoard = optimisticBoard || state.board;
    const fromCol = state.findContainer(activeId);
    const toCol = state.findContainer(overId);

    if (!fromCol || !toCol || fromCol === toCol) return;

    // Optimistic update for smooth drag
    const fromItems = currentBoard[fromCol] || [];
    const toItems = currentBoard[toCol] || [];
    const moving = fromItems.find((l) => l.id === activeId);
    if (!moving) return;

    const newFrom = fromItems.filter((l) => l.id !== activeId);
    const overIndex = toItems.findIndex((l) => l.id === overId);
    const insertAt = overIndex >= 0 ? overIndex : toItems.length;

    setOptimisticBoard({
      ...currentBoard,
      [fromCol]: newFrom,
      [toCol]: [...toItems.slice(0, insertAt), moving, ...toItems.slice(insertAt)],
    });
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    state.setActiveLead(null);
    state.setActiveColumn(null);
    setOptimisticBoard(null);
    
    if (!over) return;

    // Handle column reordering
    if (active.data.current?.type === 'column') {
      const oldIndex = state.columns.findIndex((c) => c.id === active.id);
      const newIndex = state.columns.findIndex((c) => c.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const reordered = [...state.columns];
        const [moved] = reordered.splice(oldIndex, 1);
        if (moved) {
          reordered.splice(newIndex, 0, moved);
          const columnPositions = reordered.map((col, idx) => ({ id: col.id as any, position: idx }));
          state.handleReorderColumns(columnPositions);
        }
      }
      return;
    }

    // Handle lead movement
    const activeId = String(active.id);
    const overId = String(over.id);
    const fromCol = state.findContainer(activeId);
    const toCol = state.findContainer(overId);

    if (!fromCol || !toCol) return;

    const currentBoard = state.board;
    const toItems = currentBoard[toCol] || [];
    const targetPosition = toItems.findIndex((l) => l.id === overId);
    const finalPosition = targetPosition >= 0 ? targetPosition : toItems.length;

    // Call Convex mutation
    state.handleMoveLead(activeId as any, toCol as any, finalPosition);
  }

  // Define helper functions before early returns
  const addColumn = () => {
    const colorIndex = state.columns.length % COLUMN_COLORS.length;
    const colorConfig = COLUMN_COLORS[colorIndex];
    if (colorConfig) {
      state.handleCreateColumn(
        'New Stage',
        colorConfig.color,
        colorConfig.dotColor
      );
    }
  };

  const updateColumn = (id: string, updates: Partial<{ title: string; color: string; dotColor: string }>) => {
    state.handleUpdateColumn(id as any, updates);
  };

  const deleteColumn = (id: string) => {
    state.handleDeleteColumn(id as any);
  };

  const saveLead = (data: Partial<any>) => {
    if (!state.detailLead) return;

    if (state.editingColumnId && !state.detailLead.id) {
      // Create new lead
      state.handleCreateLead(state.editingColumnId as any, {
        name: data.name || 'New Lead',
        company: data.company,
        value: data.value,
        email: data.email,
        phone: data.phone,
        owner: data.owner,
        source: data.source || 'Manual',
        notes: data.notes,
      });
    } else if (state.detailLead.id) {
      // Update existing lead
      state.handleUpdateLead(state.detailLead.id as any, data);
    }
  };

  const deleteLead = (leadId: string) => {
    state.handleDeleteLead(leadId as any);
  };

  const displayBoard = optimisticBoard || state.board;
  const totalLeads = Object.values(displayBoard).flat().length;

  // Show loading state while fetching pipelines
  if (state.pipelines === undefined) {
    return (
      <div className="text-foreground relative flex h-full flex-col items-center justify-center overflow-hidden">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
          <p className="text-muted-foreground">Loading pipelines...</p>
        </div>
      </div>
    );
  }

  // Show loading state while fetching pipeline data
  if (state.selectedPipelineId && state.pipeline === undefined) {
    return (
      <div className="text-foreground relative flex h-full flex-col overflow-hidden">
        <LeadPipelineHeader
          pipeline={null}
          pipelines={state.pipelines}
          selectedPipelineId={state.selectedPipelineId}
          totalLeads={0}
          isCreatingPipeline={state.isCreatingPipeline}
          isCreatingColumn={state.isCreatingColumn}
          onAddColumn={addColumn}
          onSelectPipeline={(id) => state.setSelectedPipelineId(id as any)}
          onOpenTemplateModal={() => state.setIsTemplateModalOpen(true)}
          onOpenPipelineModal={() => state.setIsPipelineModalOpen(true)}
          onDeletePipeline={(id) => state.handleDeletePipeline(id as any)}
          onUpdatePipeline={(id, name) => state.handleUpdatePipeline(id as any, name)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-muted-foreground">Loading pipeline data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no pipeline selected
  if (!state.selectedPipelineId) {
    return (
      <div className="text-foreground relative flex h-full flex-col items-center justify-center overflow-hidden">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Pipeline Selected</h2>
          <p className="text-muted-foreground mb-4">Create a pipeline or select a template to get started</p>
          <Button onClick={() => state.setIsTemplateModalOpen(true)}>
            <Layout className="mr-2 h-4 w-4" />
            Choose Template
          </Button>
        </div>
        
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

  return (
    <div className="text-foreground relative flex h-full flex-col overflow-hidden">
      {/* Header */}
      <LeadPipelineHeader
        pipeline={state.pipeline}
        pipelines={state.pipelines}
        selectedPipelineId={state.selectedPipelineId}
        totalLeads={totalLeads}
        isCreatingPipeline={state.isCreatingPipeline}
        isCreatingColumn={state.isCreatingColumn}
        onAddColumn={addColumn}
        onSelectPipeline={(id) => state.setSelectedPipelineId(id as any)}
        onOpenTemplateModal={() => state.setIsTemplateModalOpen(true)}
        onOpenPipelineModal={() => state.setIsPipelineModalOpen(true)}
        onDeletePipeline={(id) => state.handleDeletePipeline(id as any)}
        onUpdatePipeline={(id, name) => state.handleUpdatePipeline(id as any, name)}
      />

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
                  leads={displayBoard[col.id] || []}
                  onAddLead={() => state.openCreateLead(col.id)}
                  onEditLead={state.openEditLead}
                  onUpdateColumn={updateColumn}
                  onDeleteColumn={deleteColumn}
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
          onSave={saveLead}
          onDelete={deleteLead}
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
          onUpdateColumn={updateColumn}
          onDeleteColumn={deleteColumn}
          onAddColumn={addColumn}
          onReorderColumns={(cols) => {
            const columnPositions = cols.map((col, idx) => ({ id: col.id as any, position: idx }));
            state.handleReorderColumns(columnPositions);
          }}
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
