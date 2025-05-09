import { Tag } from '@/lib/data';
import TagButton from '@/components/discover/TagButton';
import { motion } from 'framer-motion';

interface TagGroupProps {
  title: string;
  tags: Tag[];
}

export default function TagGroup({ title, tags }: TagGroupProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground group-hover:text-secondary transition-colors">
          {title}
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary mt-1 rounded-full"></div>
        </h2>
        <span className="text-xs bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-full">
          {tags.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-3 backdrop-blur-sm bg-background/50 dark:bg-background/30 p-4 rounded-lg border border-border/50 hover:border-border transition-all shadow-sm hover:shadow-md">
        {tags.map((tag, index) => (
          <motion.div 
            key={tag.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <TagButton tag={tag} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}