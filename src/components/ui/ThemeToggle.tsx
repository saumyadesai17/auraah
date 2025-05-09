'use client';

import { useTheme } from '@/components/ui/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full bg-card border border-border hover:bg-card/80 transition-colors ${className}`}
      aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === 'dark' ? (
        <Moon size={20} className="text-secondary" />
      ) : (
        <Sun size={20} className="text-accent" />
      )}
    </button>
  );
}