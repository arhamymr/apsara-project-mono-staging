'use client';

import * as React from 'react';
import { COLUMN_COLORS, DEFAULT_COLUMNS, initialLeads, PIPELINE_TEMPLATES } from '../constants';
import type { Lead, PipelineColumn, BoardState } from '../types';

export function usePipelineState() {
  const [columns, setColumns] = React.useState<PipelineColumn[]>(DEFAULT_COLUMNS);
  const [board, setBoard] = React.useState<BoardState>(initialLeads);
  const [activeLead, setActiveLead] = React.useState<Lead | null>(null);
  const [activeColumn, setActiveColumn] = React.useState<PipelineColumn | null>(null);
  const [detailLead, setDetailLead] = React.useState<Lead | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = React.useState(false);
  const [editingColumnId, setEditingColumnId] = React.useState<string | null>(null);
  const [isPipelineModalOpen, setIsPipelineModalOpen] = React.useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);

  function findContainer(id: string | null): string | null {
    if (!id) return null;
    if (columns.some((c) => c.id === id)) return id;
    return Object.keys(board).find((col) => board[col]?.some((l) => l.id === id)) ?? null;
  }

  function openCreateLead(columnId: string) {
    setEditingColumnId(columnId);
    setDetailLead({ id: '', name: '', source: 'Manual' });
    setIsLeadModalOpen(true);
  }

  function openEditLead(lead: Lead) {
    setEditingColumnId(null);
    setDetailLead(lead);
    setIsLeadModalOpen(true);
  }

  function saveLead(data: Partial<Lead>) {
    if (!detailLead) return;

    if (editingColumnId && !detailLead.id) {
      const newLead: Lead = {
        ...data,
        id: `l-${Math.random().toString(36).slice(2, 8)}`,
        name: data.name || 'New Lead',
      } as Lead;
      setBoard((prev) => ({
        ...prev,
        [editingColumnId]: [newLead, ...(prev[editingColumnId] || [])],
      }));
    } else {
      setBoard((prev) => {
        const col = Object.keys(prev).find((k) => prev[k]?.some((l) => l.id === detailLead.id));
        if (!col) return prev;
        const colLeads = prev[col];
        if (!colLeads) return prev;
        return {
          ...prev,
          [col]: colLeads.map((l) => (l.id === detailLead.id ? { ...l, ...data } : l)),
        };
      });
    }
    setIsLeadModalOpen(false);
    setDetailLead(null);
    setEditingColumnId(null);
  }

  function deleteLead(leadId: string) {
    setBoard((prev) => {
      const newBoard = { ...prev };
      for (const col of Object.keys(newBoard)) {
        if (newBoard[col]) {
          newBoard[col] = newBoard[col].filter((l) => l.id !== leadId);
        }
      }
      return newBoard;
    });
    setIsLeadModalOpen(false);
    setDetailLead(null);
  }

  function addColumn() {
    const newId = `col-${Math.random().toString(36).slice(2, 8)}`;
    const colorIndex = columns.length % COLUMN_COLORS.length;
    const colorConfig = COLUMN_COLORS[colorIndex];
    const newColumn: PipelineColumn = {
      id: newId,
      title: 'New Stage',
      color: colorConfig?.color ?? 'bg-blue-500/10',
      dotColor: colorConfig?.dotColor ?? 'bg-blue-500',
    };
    setColumns([...columns, newColumn]);
    setBoard((prev) => ({ ...prev, [newId]: [] }));
  }

  function updateColumn(id: string, updates: Partial<PipelineColumn>) {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function deleteColumn(id: string) {
    if (columns.length <= 1) return;
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setBoard((prev) => {
      const { [id]: _removed, ...rest } = prev;
      void _removed;
      return rest;
    });
  }

  function applyTemplate(template: typeof PIPELINE_TEMPLATES[0]) {
    const newColumns = template.columns.map((col) => ({
      ...col,
      id: `col-${Math.random().toString(36).slice(2, 8)}`,
    }));
    setColumns(newColumns);
    const newBoard: BoardState = {};
    newColumns.forEach((col) => {
      newBoard[col.id] = [];
    });
    setBoard(newBoard);
    setIsTemplateModalOpen(false);
  }

  return {
    // State
    columns,
    board,
    activeLead,
    activeColumn,
    detailLead,
    isLeadModalOpen,
    editingColumnId,
    isPipelineModalOpen,
    isTemplateModalOpen,
    // Setters
    setActiveLead,
    setActiveColumn,
    setDetailLead,
    setIsLeadModalOpen,
    setEditingColumnId,
    setIsPipelineModalOpen,
    setIsTemplateModalOpen,
    setColumns,
    setBoard,
    // Methods
    findContainer,
    openCreateLead,
    openEditLead,
    saveLead,
    deleteLead,
    addColumn,
    updateColumn,
    deleteColumn,
    applyTemplate,
  };
}
