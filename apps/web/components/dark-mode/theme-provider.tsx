'use client';
import * as React from 'react';

type Theme = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'ui.theme.v1';

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const html = document.documentElement;

  const resolvedDark =
    theme === 'system' ? getSystemPrefersDark() : theme === 'dark';

  // keep both for maximum compatibility with your setup
  html.classList.toggle('dark', resolvedDark);
  html.dataset.theme = resolvedDark ? 'dark' : 'light';
}

export const ThemeContext = React.createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({ children, defaultTheme = 'light' as Theme }: { children: React.ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    // Initialize from localStorage immediately if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme;
      return saved || defaultTheme;
    }
    return defaultTheme;
  });

  // Apply theme on mount and when theme changes
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // init from storage (fallback for SSR)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(STORAGE_KEY) as Theme;
    if (saved && saved !== theme) {
      setThemeState(saved);
    }
  }, []);

  // react to system changes when using "system"
  React.useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, t);
    }
    applyTheme(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
