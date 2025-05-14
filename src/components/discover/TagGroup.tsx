import { Tag } from '@/lib/data';
import TagButton from '@/components/discover/TagButton';
import { motion } from 'framer-motion';
import React from 'react'; // Import React for JSX.Element type

interface TagGroupProps {
  title: string;
  tags: Tag[];
  icon?: React.ReactNode; // Accept an optional icon node
}

export default function TagGroup({ title, tags, icon }: TagGroupProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="my-8">
      <div className="flex items-center mb-4">
        {icon && <span className="mr-2 text-[#9C9A96]">{icon}</span>}
        <h2 className="text-md font-medium text-[#9C9A96]">
          {title}
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <motion.div 
            key={tag.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
          >
            <TagButton tag={tag} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}