'use client';

import { createContext, ReactNode, RefObject, useContext } from 'react';

type PortalContextValue = RefObject<HTMLElement> | null;

const WindowPortalContext = createContext<PortalContextValue>(null);

type ProviderProps = {
  value: PortalContextValue;
  children: ReactNode;
};

export function WindowPortalProvider({ value, children }: ProviderProps) {
  return (
    <WindowPortalContext.Provider value={value}>
      {children}
    </WindowPortalContext.Provider>
  );
}

export function useWindowPortalContainer() {
  return useContext(WindowPortalContext);
}
