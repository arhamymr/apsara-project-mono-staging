import { Moon, Sun } from 'lucide-react';
import { useTheme } from './useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // Calculate current effective theme (resolves 'system' to actual dark/light)
  const getEffectiveTheme = () => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return 'light';
    // system theme - check OS preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  };

  const effectiveTheme = getEffectiveTheme();
  const isDark = effectiveTheme === 'dark';

  const toggleTheme = () => {
    // Simple toggle: if currently dark (or system+dark), go light; otherwise go dark
    // This ignores 'system' and explicitly sets light/dark
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div
      className="cursor-pointer p-2"
      onClick={toggleTheme}
      role="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-indigo-500" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-500" />
      )}
    </div>
  );
}
