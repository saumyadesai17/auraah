'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { satoshi } from '@/fonts/satoshi';
import { getTagById } from '@/lib/data';

interface SearchBoxProps {
  initialQuery?: string;
}

// Create a client component that uses useSearchParams
function SearchBoxContent({ initialQuery = '' }: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if we're on a search or tag page and extract the query
    if (pathname?.includes('/discover/search')) {
      const q = searchParams?.get('q');
      if (q) {
        setQuery(q);
        setHasActiveSearch(true);
      }
    } else if (pathname?.includes('/discover/tag')) {
      const id = searchParams?.get('id');
      if (id) {
        // Get the tag by ID and use its name instead of the ID
        const tag = getTagById(decodeURIComponent(id));
        if (tag) {
          setQuery(tag.name); // Use the tag name instead of ID
          setHasActiveSearch(true);
        } else {
          // Fallback to ID if tag not found
          setQuery(decodeURIComponent(id));
          setHasActiveSearch(true);
        }
      }
    } else {
      setHasActiveSearch(false);
      setQuery('');
    }
  }, [pathname, searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover/search?q=${encodeURIComponent(query.trim())}`);
      setHasActiveSearch(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    // Do not navigate or change the URL when clearing the input
    // Just update the local state to show the appropriate styling
    setHasActiveSearch(false);
    // We're not calling router.push() anymore, so the page content will remain unchanged
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6 sticky top-16 z-30 px-4 py-3">
      <form onSubmit={handleSearch}>
        {/* Gradient border container - conditionally apply styles */}
        <div
          className={`p-[1.5px] rounded-full 
                     ${hasActiveSearch
              ? 'bg-white'
              : 'bg-gradient-to-r from-emerald-200 via-sky-200 via-violet-300 to-pink-300'} 
                     focus-within:ring-2 focus-within:ring-sky-300 focus-within:ring-offset-1`}
        >
          {/* Inner container for input and button, with white background */}
          <div className="relative flex items-center w-full bg-white rounded-full">
            <input
              type="text"
              placeholder={hasActiveSearch ? '' : "Search for auras..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full px-5 py-3 ${hasActiveSearch ? 'pr-20' : 'pr-12'} rounded-full 
                       bg-transparent 
                       text-gray-700
                       placeholder:text-gray-400
                       focus:outline-none ${satoshi.className}`}
            />

            {/* Show clear button if there's an active search */}
            {hasActiveSearch && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-12 top-1/2 transform -translate-y-1/2
                         p-2 rounded-full text-gray-500
                         hover:text-gray-700 transition-colors"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}

            <button
              type="submit"
              className={`absolute right-3 top-1/2 transform -translate-y-1/2
                       p-2 rounded-full 
                       ${hasActiveSearch ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700'} 
                       transition-colors`}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Loading fallback component
function SearchBoxLoading() {
  return (
    <div className="w-full max-w-xl mx-auto mb-6 sticky top-16 z-30 px-4 py-3">
      <div className="p-[1.5px] rounded-full bg-gradient-to-r from-gray-200 to-gray-300">
        <div className="relative flex items-center w-full bg-white rounded-full">
          <div className="w-full px-5 py-3 rounded-full bg-gray-100 animate-pulse h-12"></div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-300 animate-pulse h-8 w-8"></div>
        </div>
      </div>
    </div>
  );
}

// Main export that wraps the content with Suspense
export default function SearchBox(props: SearchBoxProps) {
  return (
    <Suspense fallback={<SearchBoxLoading />}>
      <SearchBoxContent {...props} />
    </Suspense>
  );
}