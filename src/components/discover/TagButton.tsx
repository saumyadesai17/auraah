import Link from 'next/link';
import { Tag } from '@/lib/data';

interface TagButtonProps {
  tag: Tag;
  isActive?: boolean;
  highlight?: boolean;
}

export default function TagButton({ tag, isActive = false, highlight = false }: TagButtonProps) {
  let baseClasses = "px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium flex items-center justify-center";
  
  let styleClasses = isActive
    ? "bg-tropical-indigo text-raisin-black border border-tropical-indigo"
    : highlight
    ? "bg-gray-700/90 text-tropical-indigo border border-tropical-indigo/40 hover:bg-tropical-indigo/20 hover:border-tropical-indigo"
    : "bg-gray-700/80 text-tropical-indigo border border-transparent hover:bg-tropical-indigo hover:text-raisin-black";
  
  return (
    <Link
      href={`/discover/${encodeURIComponent(tag.id)}`}
      className={`${baseClasses} ${styleClasses} ${isActive ? 'cursor-default' : ''}`}
    >
      {tag.name}
      {tag.type && (
        <span className="ml-1 text-xs opacity-70">
          ({tag.type.slice(0,1)})
        </span>
      )}
    </Link>
  );
}