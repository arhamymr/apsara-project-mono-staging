'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';
// @ts-ignore - Convex API will be generated
import { api } from '@/convex/_generated/api';
import type { Lead, PipelineColumn } from '../types';
// @ts-ignore - Convex types will be generated
import type { Id } from '@/convex/_generated/dataModel';
import { PIPELINE_TEMPLATES } from '../constants';

type PipelineId = any; // Will be Id<"leadPipelines"> after codegen
type ColumnId = any; // Will be Id<"leadColumns"> after codegen
type LeadId = any; // Will be Id<"leads"> after codegen

const STORAGE_KEY = 'lead-management-selected-pipeline';

export function useLeadManagement() {
  const pipelines = useQuery(api.leadManagement.listPipelines, {});
  const [selectedPipelineId, setSelectedPipelineIdState] = useState<PipelineId | null>(null);
  const pipeline = useQuery(
    api.leadManagement.getPipeline,
    selectedPipelineId ? { id: selectedPipelineId } : 'skip'
  );

  // Wrapper to persist selection to localStorage
  const setSelectedPipelineId = useCallback((id: PipelineId | null) => {
    setSelectedPipelineIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Restore from localStorage or auto-select first pipeline
  useEffect(() => {
    if (pipelines && pipelines.length > 0 && !selectedPipelineId) {
      const savedId = localStorage.getItem(STORAGE_KEY) as PipelineId | null;
      const savedPipelineExists = savedId && pipelines.some((p: any) => p._id === savedId);

      if (savedPipelineExists) {
        setSelectedPipelineIdState(savedId);
      } else {
        const firstPipeline = pipelines[0];
        if (firstPipeline) {
          setSelectedPipelineId(firstPipeline._id as PipelineId);
        }
      }
    }
  }, [pipelines, selectedPipelineId, setSelectedPipelineId]);

  // Mutations
  const createPipelineMutation = useMutation(api.leadManagement?.createPipeline);
  const updatePipelineMutation = useMutation(api.leadManagement?.updatePipeline);
  const deletePipelineMutation = useMutation(api.leadManagement?.deletePipeline);
  const createColumnMutation = useMutation(api.leadManagement?.createColumn);
  const updateColumnMutation = useMutation(api.leadManagement?.updateColumn);
  const deleteColumnMutation = useMutation(api.leadManagement?.deleteColumn);
  const reorderColumnsMutation = useMutation(api.leadManagement?.reorderColumns);
  const createLeadMutation = useMutation(api.leadManagement?.createLead);
  const updateLeadMutation = useMutation(api.leadManagement?.updateLead);
  const deleteLeadMutation = useMutation(api.leadManagement?.deleteLead);
  const moveLeadMutation = useMutation(api.leadManagement?.moveLead);

  // UI State
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [activeColumn, setActiveColumn] = useState<PipelineColumn | null>(null);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Loading states
  const [isCreatingPipeline, setIsCreatingPipeline] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isCreatingLead, setIsCreatingLead] = useState(false);

  // Pipeline actions
  const handleCreatePipeline = useCallback(
    async (name: string, templateColumns?: Array<{ title: string; color: string; dotColor: string }>) => {
      if (isCreatingPipeline) return;
      setIsCreatingPipeline(true);
      try {
        const id = await createPipelineMutation({ name, templateColumns });
        setSelectedPipelineId(id);
        toast.success('Pipeline created');
      } catch {
        toast.error('Failed to create pipeline');
      } finally {
        setIsCreatingPipeline(false);
      }
    },
    [createPipelineMutation, isCreatingPipeline, setSelectedPipelineId]
  );

  const handleUpdatePipeline = useCallback(
    async (id: PipelineId, name: string) => {
      try {
        await updatePipelineMutation({ id, name });
        toast.success('Pipeline updated');
      } catch {
        toast.error('Failed to update pipeline');
      }
    },
    [updatePipelineMutation]
  );

  const handleDeletePipeline = useCallback(
    async (id: PipelineId) => {
      try {
        await deletePipelineMutation({ id });
        if (selectedPipelineId === id) setSelectedPipelineId(null);
        toast.success('Pipeline deleted');
      } catch {
        toast.error('Failed to delete pipeline');
      }
    },
    [deletePipelineMutation, selectedPipelineId, setSelectedPipelineId]
  );

  // Column actions
  const handleCreateColumn = useCallback(
    async (title: string, color: string, dotColor: string) => {
      if (!selectedPipelineId || isCreatingColumn) return;
      setIsCreatingColumn(true);
      try {
        await createColumnMutation({ pipelineId: selectedPipelineId, title, color, dotColor });
        toast.success('Column created');
      } catch {
        toast.error('Failed to create column');
      } finally {
        setIsCreatingColumn(false);
      }
    },
    [createColumnMutation, selectedPipelineId, isCreatingColumn]
  );

  const handleUpdateColumn = useCallback(
    async (id: ColumnId, updates: { title?: string; color?: string; dotColor?: string }) => {
      try {
        await updateColumnMutation({ id, ...updates });
        toast.success('Column updated');
      } catch {
        toast.error('Failed to update column');
      }
    },
    [updateColumnMutation]
  );

  const handleDeleteColumn = useCallback(
    async (id: ColumnId) => {
      try {
        await deleteColumnMutation({ id });
        toast.success('Column deleted');
      } catch {
        toast.error('Failed to delete column');
      }
    },
    [deleteColumnMutation]
  );

  const handleReorderColumns = useCallback(
    async (columnPositions: Array<{ id: ColumnId; position: number }>) => {
      if (!selectedPipelineId) return;
      try {
        await reorderColumnsMutation({ pipelineId: selectedPipelineId, columnPositions });
      } catch {
        toast.error('Failed to reorder columns');
      }
    },
    [reorderColumnsMutation, selectedPipelineId]
  );

  // Lead actions
  const handleCreateLead = useCallback(
    async (columnId: ColumnId, data: Omit<Lead, 'id'>) => {
      if (isCreatingLead) return;
      setIsCreatingLead(true);
      try {
        await createLeadMutation({ columnId, ...data });
        setIsLeadModalOpen(false);
        setDetailLead(null);
        setEditingColumnId(null);
        toast.success('Lead created');
      } catch {
        toast.error('Failed to create lead');
      } finally {
        setIsCreatingLead(false);
      }
    },
    [createLeadMutation, isCreatingLead]
  );

  const handleUpdateLead = useCallback(
    async (id: LeadId, data: Partial<Omit<Lead, 'id'>>) => {
      try {
        await updateLeadMutation({ id, ...data });
        setIsLeadModalOpen(false);
        setDetailLead(null);
        toast.success('Lead updated');
      } catch {
        toast.error('Failed to update lead');
      }
    },
    [updateLeadMutation]
  );

  const handleDeleteLead = useCallback(
    async (id: LeadId) => {
      try {
        await deleteLeadMutation({ id });
        setIsLeadModalOpen(false);
        setDetailLead(null);
        toast.success('Lead deleted');
      } catch {
        toast.error('Failed to delete lead');
      }
    },
    [deleteLeadMutation]
  );

  const handleMoveLead = useCallback(
    async (leadId: LeadId, targetColumnId: ColumnId, targetPosition: number) => {
      try {
        await moveLeadMutation({ leadId, targetColumnId, targetPosition });
      } catch {
        toast.error('Failed to move lead');
      }
    },
    [moveLeadMutation]
  );

  // Modal helpers
  const openCreateLead = (columnId: string) => {
    setEditingColumnId(columnId);
    setDetailLead({ id: '', name: '', source: 'Manual' });
    setIsLeadModalOpen(true);
  };

  const openEditLead = (lead: Lead) => {
    setEditingColumnId(null);
    setDetailLead(lead);
    setIsLeadModalOpen(true);
  };

  const applyTemplate = useCallback(
    async (template: typeof PIPELINE_TEMPLATES[0]) => {
      try {
        // Create new pipeline with template
        const id = await createPipelineMutation({
          name: template.name,
          templateColumns: template.columns,
        });
        setSelectedPipelineId(id);
        setIsTemplateModalOpen(false);
        toast.success('Template applied');
      } catch {
        toast.error('Failed to apply template');
      }
    },
    [createPipelineMutation, setSelectedPipelineId]
  );

  // Convert pipeline data to match local state format
  const columns: PipelineColumn[] = pipeline?.columns.map((col: any) => ({
    id: col._id,
    title: col.title,
    color: col.color,
    dotColor: col.dotColor,
  })) || [];

  const board: Record<string, Lead[]> = {};
  pipeline?.columns.forEach((col: any) => {
    board[col._id] = col.leads.map((lead: any) => ({
      id: lead._id,
      name: lead.name,
      company: lead.company,
      value: lead.value,
      email: lead.email,
      phone: lead.phone,
      owner: lead.owner,
      source: lead.source,
      notes: lead.notes,
    }));
  });

  const findContainer = (id: string | null): string | null => {
    if (!id) return null;
    if (columns.some((c) => c.id === id)) return id;
    return Object.keys(board).find((col) => board[col]?.some((l) => l.id === id)) ?? null;
  };

  return {
    // Data
    pipelines,
    pipeline,
    selectedPipelineId,
    columns,
    board,
    // UI State
    activeLead,
    activeColumn,
    detailLead,
    isLeadModalOpen,
    editingColumnId,
    isPipelineModalOpen,
    isTemplateModalOpen,
    // Loading states
    isCreatingPipeline,
    isCreatingColumn,
    isCreatingLead,
    // Setters
    setSelectedPipelineId,
    setActiveLead,
    setActiveColumn,
    setDetailLead,
    setIsLeadModalOpen,
    setEditingColumnId,
    setIsPipelineModalOpen,
    setIsTemplateModalOpen,
    // Actions
    handleCreatePipeline,
    handleUpdatePipeline,
    handleDeletePipeline,
    handleCreateColumn,
    handleUpdateColumn,
    handleDeleteColumn,
    handleReorderColumns,
    handleCreateLead,
    handleUpdateLead,
    handleDeleteLead,
    handleMoveLead,
    // Helpers
    findContainer,
    openCreateLead,
    openEditLead,
    applyTemplate,
  };
}
