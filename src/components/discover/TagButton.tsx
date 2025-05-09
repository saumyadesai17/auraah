import Link from 'next/link';
import { Tag } from '@/lib/data';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TagButtonProps {
  tag: Tag;
  isActive?: boolean;
  highlight?: boolean;
}

export default function TagButton({ tag, isActive = false, highlight = false }: TagButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  
  // Handle mounting to avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  // Base classes
  const baseClasses = "px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium flex items-center justify-center";
  
  // Dynamic styling based on theme, active state and highlight
  let styleClasses = '';
  
  if (isActive) {
    styleClasses = "bg-primary text-primary-foreground border border-primary shadow-md";
  } else if (highlight) {
    styleClasses = resolvedTheme === 'dark' 
      ? "bg-secondary/20 text-secondary border border-secondary/40 hover:bg-secondary/30 hover:border-secondary hover:scale-105 hover:shadow-lg" 
      : "bg-secondary/10 text-secondary border border-secondary/30 hover:bg-secondary/20 hover:border-secondary hover:scale-105 hover:shadow-lg";
  } else {
    styleClasses = resolvedTheme === 'dark'
      ? "bg-background/80 backdrop-blur-sm text-foreground border border-border/50 hover:bg-primary/20 hover:text-primary hover:border-primary/40 hover:scale-105 hover:shadow-md"
      : "bg-background/80 backdrop-blur-sm text-foreground border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/40 hover:scale-105 hover:shadow-md";
  }
  
  return (
    <Link
      href={`/discover/${encodeURIComponent(tag.id)}`}
      className={`${baseClasses} ${styleClasses} ${isActive ? 'cursor-default' : ''}`}
    >
      {tag.name}
      {tag.type && (
        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
          isActive ? 'bg-white/20' : 'bg-foreground/10'
        }`}>
          {tag.type.charAt(0).toUpperCase()}
        </span>
      )}
    </Link>
  );
}