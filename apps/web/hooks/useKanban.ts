'use client';
import { fetcher } from '@/lib/fetcher';
import {
  Board,
  Card,
  Column,
  MoveCardPayload,
  ReorderColumnsPayload,
} from '@/types/kanban';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Board hooks
export const useBoards = () => {
  return useQuery({
    queryKey: ['kanban', 'boards'],
    queryFn: () => fetcher<{ data: Board[] }>('/api/kanban/boards'),
    staleTime: 30000,
    select: (response) => response.data,
  });
};

export const useBoard = (boardId: number | null) => {
  return useQuery({
    queryKey: ['kanban', 'board', boardId],
    queryFn: () => fetcher<{ data: Board }>(`/api/kanban/boards/${boardId}`),
    enabled: boardId !== null,
    staleTime: 30000,
    select: (response) => response.data,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) =>
      fetcher<{ data: Board }>('/api/kanban/boards', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban', 'boards'] });
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string } }) =>
      fetcher<{ data: Board }>(`/api/kanban/boards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['kanban', 'boards'] });
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.id],
      });
    },
  });
};


export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      fetcher<void>(`/api/kanban/boards/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kanban', 'boards'] });
    },
  });
};

// Column hooks
export const useCreateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { board_id: number; name: string }) =>
      fetcher<{ data: Column }>('/api/kanban/columns', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });
    },
  });
};

export const useUpdateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; board_id: number };
    }) =>
      fetcher<{ data: Column }>(`/api/kanban/columns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.data.board_id],
      });
    },
  });
};

export const useDeleteColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; boardId: number }) =>
      fetcher<void>(`/api/kanban/columns/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.boardId],
      });
    },
  });
};

export const useReorderColumns = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderColumnsPayload & { board_id: number }) =>
      fetcher<{ data: Column[] }>('/api/kanban/columns/reorder', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });

      const previousBoard = queryClient.getQueryData<{ data: Board }>([
        'kanban',
        'board',
        variables.board_id,
      ]);

      if (previousBoard?.data) {
        const updatedColumns = previousBoard.data.columns?.map((col) => {
          const newPosition = variables.column_positions.find(
            (cp) => cp.id === col.id,
          );
          return newPosition ? { ...col, position: newPosition.position } : col;
        });

        queryClient.setQueryData(['kanban', 'board', variables.board_id], {
          data: {
            ...previousBoard.data,
            columns: updatedColumns?.sort((a, b) => a.position - b.position),
          },
        });
      }

      return { previousBoard };
    },
    onError: (err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          ['kanban', 'board', variables.board_id],
          context.previousBoard,
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });
    },
  });
};

// Card hooks
export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      column_id: number;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      assignee_id?: number | null;
      board_id: number;
    }) =>
      fetcher<{ data: Card }>('/api/kanban/cards', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });
    },
  });
};

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        title?: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high';
        assignee_id?: number | null;
        board_id: number;
      };
    }) =>
      fetcher<{ data: Card }>(`/api/kanban/cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.data.board_id],
      });
    },
  });
};

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; boardId: number }) =>
      fetcher<void>(`/api/kanban/cards/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.boardId],
      });
    },
  });
};

export const useMoveCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MoveCardPayload & { board_id: number }) =>
      fetcher<{ data: Card }>(`/api/kanban/cards/${data.card_id}/move`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });

      const previousBoard = queryClient.getQueryData<{ data: Board }>([
        'kanban',
        'board',
        variables.board_id,
      ]);

      if (previousBoard?.data?.columns) {
        const updatedColumns = previousBoard.data.columns.map((col) => {
          const cards = col.cards?.filter(
            (card) => card.id !== variables.card_id,
          );

          if (col.id === variables.target_column_id) {
            const movedCard = previousBoard.data.columns
              ?.flatMap((c) => c.cards || [])
              .find((card) => card.id === variables.card_id);

            if (movedCard) {
              const updatedCard = {
                ...movedCard,
                column_id: variables.target_column_id,
                position: variables.target_position,
              };

              const newCards = [...(cards || [])];
              newCards.splice(variables.target_position, 0, updatedCard);

              return {
                ...col,
                cards: newCards.map((card, idx) => ({
                  ...card,
                  position: idx,
                })),
              };
            }
          }

          return { ...col, cards };
        });

        queryClient.setQueryData(['kanban', 'board', variables.board_id], {
          data: {
            ...previousBoard.data,
            columns: updatedColumns,
          },
        });
      }

      return { previousBoard };
    },
    onError: (err, variables, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(
          ['kanban', 'board', variables.board_id],
          context.previousBoard,
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['kanban', 'board', variables.board_id],
      });
    },
  });
};
