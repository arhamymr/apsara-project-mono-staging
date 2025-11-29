// editable-context.tsx
import * as React from 'react';

export type EditableCtx = {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
};

const Ctx = React.createContext<EditableCtx | null>(null);

export function EditableProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const value = React.useMemo(
    () => ({ activeId, setActiveId, hoveredId, setHoveredId }),
    [activeId, hoveredId],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditableCtx(): EditableCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error('Must be used inside <EditableProvider>');
  return ctx;
}
