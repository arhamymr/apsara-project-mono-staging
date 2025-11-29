import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import type { StorageEntry } from './queries';

export type FinderState = {
  prefix: string;
  view: 'grid' | 'list';
  sort: 'name' | 'size' | 'updated';
  q: string;
  selection: Set<string>;
  loading: boolean;
  folders: StorageEntry[];
  files: StorageEntry[];
};

export function useFinder(initialPrefix = '') {
  const [state, setState] = useState<FinderState>({
    prefix: initialPrefix,
    view: 'grid',
    sort: 'name',
    q: '',
    selection: new Set(),
    loading: false,
    folders: [],
    files: [],
  });

  const qc = useQueryClient();
  const refresh = async () => {
    await qc.invalidateQueries({ queryKey: ['storage-list', state.prefix] });
  };

  useEffect(() => {
    setState((s) => ({ ...s, loading: false }));
  }, [state.prefix]);

  const breadcrumbs = useMemo(() => {
    const parts = state.prefix.replace(/\/$/, '').split('/').filter(Boolean);
    const crumbs: { name: string; prefix: string }[] = [];
    let accum = '';
    for (const p of parts) {
      accum += p + '/';
      crumbs.push({ name: p, prefix: accum });
    }
    return crumbs;
  }, [state.prefix]);

  const setPrefix = (p: string) => setState((s) => ({ ...s, prefix: p }));
  const setView = (v: FinderState['view']) =>
    setState((s) => ({ ...s, view: v }));
  const setSort = (sort: FinderState['sort']) =>
    setState((s) => ({ ...s, sort }));
  const setQuery = (q: string) => setState((s) => ({ ...s, q }));

  return {
    state,
    setPrefix,
    setView,
    setSort,
    setQuery,
    refresh,
    breadcrumbs,
  };
}
