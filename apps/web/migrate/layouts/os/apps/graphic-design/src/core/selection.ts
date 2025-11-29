export type SelectionState = {
  ids: string[];
};

export function isSelected(selection: SelectionState, id: string): boolean {
  return selection.ids.includes(id);
}

export function toggleSelection(
  selection: SelectionState,
  id: string,
  multi: boolean,
): SelectionState {
  if (!multi) {
    return { ids: [id] };
  }

  if (selection.ids.includes(id)) {
    return { ids: selection.ids.filter((existing) => existing !== id) };
  }

  return { ids: [...selection.ids, id] };
}

export function clearSelection(): SelectionState {
  return { ids: [] };
}
