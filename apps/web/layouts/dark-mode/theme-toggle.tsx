'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@workspace/ui/components/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // resolvedTheme handles 'system' -> actual dark/light
  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Moon className="h-4 w-4 text-indigo-500" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-500" />
      )}
    </Button>
  );
}
