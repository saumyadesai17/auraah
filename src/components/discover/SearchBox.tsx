import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { satoshi } from '@/fonts/satoshi';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discover/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <form onSubmit={handleSearch}>
        {/* Gradient border container */}
        <div 
          className="p-[1.5px] rounded-full 
                     bg-gradient-to-r from-emerald-200 via-sky-200 via-violet-300 to-pink-300
                     focus-within:ring-2 focus-within:ring-sky-300 focus-within:ring-offset-1"
        >
          {/* Inner container for input and button, with white background */}
          <div className="relative flex items-center w-full bg-white rounded-full">
            <input
              type="text"
              placeholder="search for auras..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full px-5 py-3 pr-12 rounded-full 
                       bg-transparent 
                       text-gray-700
                       placeholder:text-gray-400
                       focus:outline-none ${satoshi.className}`}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2
                       p-2 rounded-full text-gray-500
                       hover:text-gray-700 transition-colors"
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