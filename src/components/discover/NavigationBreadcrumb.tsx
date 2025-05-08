import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Tag } from '@/lib/data';

interface NavigationBreadcrumbProps {
  currentTag?: Tag;
  recentTags?: Tag[];
}

export default function NavigationBreadcrumb({ currentTag, recentTags = [] }: NavigationBreadcrumbProps) {
  return (
    <nav className="mt-2 flex items-center space-x-1 overflow-x-auto scrollbar-hide py-2">
      <Link 
        href="/discover" 
        className="text-sm font-medium text-tropical-indigo hover:text-amethyst transition-colors flex-shrink-0"
      >
        Discover
      </Link>

      {recentTags.slice(0, 2).map((tag, index) => (
        <div key={tag.id} className="flex items-center flex-shrink-0">
          <ChevronRight size={14} className="text-tropical-indigo/40 mx-1" />
          <Link 
            href={`/discover/${encodeURIComponent(tag.id)}`}
            className="text-sm font-medium text-tropical-indigo/60 hover:text-amethyst transition-colors"
          >
            {tag.name}
          </Link>
        </div>
      ))}

      {currentTag && (
        <div className="flex items-center flex-shrink-0">
          <ChevronRight size={14} className="text-tropical-indigo/40 mx-1" />
          <span className="text-sm font-semibold text-amethyst">
            {currentTag.name}
          </span>
        </div>
      )}
    </nav>
  );
}