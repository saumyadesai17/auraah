import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    // Navigate to search results page with the query
    router.push(`/discover/search?q=${encodeURIComponent(query.trim())}`);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-xl mx-auto"
    >
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for any person, place, or brand - try 'Elon Musk' or 'Tokyo'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-3 pr-12 rounded-full 
                   bg-card/50 backdrop-blur-sm 
                   border border-border/50 
                   focus:ring-2 focus:ring-primary/30 focus:outline-none
                   placeholder:text-muted-foreground text-foreground"
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2
                   p-2 rounded-full 
                   ${query.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground'}
                   transition-colors`}
          aria-label="Search"
        >
          {isSearching ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Search size={18} />
          )}
        </button>
      </form>
      
      <div className="mt-2 px-2 text-muted-foreground text-sm">
        <p>
          Search beyond our catalog! Try any name or place - AI will generate a unique aura profile.
        </p>
      </div>
    </motion.div>
  );
}