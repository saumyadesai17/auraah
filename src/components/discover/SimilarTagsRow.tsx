import { Tag } from '@/lib/data';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface SimilarTagsRowProps {
  tags: Tag[];
  currentTagId?: string;
  highlightedType?: string;
}

export default function SimilarTagsRow({ tags }: SimilarTagsRowProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="p-6 text-center bg-card/30 border border-border/50 rounded-lg">
        <p className="text-muted-foreground">No similar auras found.</p>
      </div>
    );
  }

  return (
    <div className="relative pt-8">
      <h3 className="text-xl font-semibold text-center text-foreground mb-6">
        Continue Exploring Auras
      </h3>
      
      <div className="flex flex-wrap justify-center gap-3 pb-4">
        {tags.map((tag, index) => (
          <motion.div 
            key={tag.id} 
            className="flex-shrink-0"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link href={`/discover/${encodeURIComponent(tag.id)}`}
              className="inline-flex items-center px-4 py-2 rounded-full 
                      bg-primary/10 hover:bg-primary/20 text-primary 
                      transition-colors">
              <User size={16} className="mr-2 text-primary/70" />
              {tag.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}