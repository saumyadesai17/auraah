import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search for any person, place, or brand..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-5 py-3 pr-12 rounded-full 
                   bg-card/50 backdrop-blur-sm 
                   border border-border/50 
                   focus:ring-2 focus:ring-primary/30 focus:outline-none
                   placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2
                   p-2 rounded-full bg-primary text-primary-foreground
                   hover:bg-primary/90 transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
}