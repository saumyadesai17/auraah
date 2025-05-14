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
  const [isEngaged, setIsEngaged] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Check if we're on the main discover page
  const isOnDiscoverMainPage = pathname === '/discover';

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
      setIsEngaged(false); // Search is executed, no longer engaged
    }
  };

  const handleClear = () => {
    setQuery('');
    setHasActiveSearch(false);
    // After clearing, keep focus on the input
    document.getElementById('search-input')?.focus();
  };

  // Determine the border style based on state
  const getBorderStyle = () => {
    // Show gradient on discover main page even when not engaged
    if (isEngaged || isOnDiscoverMainPage) {
      // Engaged state or on discover main page - colored gradient
      return 'border-transparent bg-gradient-to-r from-emerald-200 via-sky-200 via-violet-300 to-pink-300';
    } else if (query && hasActiveSearch) {
      // Has content but not engaged (4th image) - no gradient, just white
      return 'border-transparent bg-[#FCFCFC]';
    } else {
      // Default/idle state (1st image) - light gray
      return 'bg-transparent border-[#F3F2F2]';
    }
  };

  // Determine if we should show the search button based on state
  const shouldShowSearchButton = () => {
    // Always show search button on discover main page
    if (isOnDiscoverMainPage) return true;
    // Show when engaged or when no query
    return isEngaged || !query;
  };

  return (
    <div className="w-full max-w-xl mx-auto sticky top-16 z-30 py-3">
      <form onSubmit={handleSearch}>
        {/* Gradient border container - state-dependent styles */}
        <div
          className={`p-[1.5px] rounded-full ${getBorderStyle()}
           will-change-transform transition-colors duration-200`}
        >
          {/* Inner container for input and button, with white background */}
          <div className="relative flex items-center w-full bg-white rounded-full overflow-hidden shadow-sm">
            <input
              id="search-input"
              type="text"
              placeholder={isEngaged || !query || isOnDiscoverMainPage ? "Search for something..." : ""}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsEngaged(true)}
              onBlur={() => setIsEngaged(false)}
              className={`w-full px-5 py-3 ${query ? 'pr-16' : 'pr-12'} rounded-full 
             bg-transparent 
             text-gray-700
             placeholder:text-gray-400
             outline-none ring-0 focus:ring-0 focus:outline-none
             ${satoshi.className}`}
            />

            {/* Show clear button if there's content in the search field */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className={`absolute ${shouldShowSearchButton() ? 'right-12' : 'right-3'} top-1/2 transform -translate-y-1/2
                 p-2 rounded-full text-gray-500
                 hover:text-gray-700 transition-colors duration-200
                 ${!isEngaged && !isOnDiscoverMainPage && 'text-lg'}`}
                aria-label="Clear search"
              >
                <X size={shouldShowSearchButton() ? 20 : 22} />
              </button>
            )}

            {/* Search button with state-dependent styling */}
            {shouldShowSearchButton() && (
              <button
                type="submit"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2
               p-2 rounded-full 
               ${query
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700'} 
               transition-all duration-200`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            )}
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