'use client';

import TagGroup from '@/components/discover/TagGroup';
import { getTagsByType } from '@/lib/data';
import { motion } from 'framer-motion';

export default function DiscoverPage() {
  const peopleTags = getTagsByType('person');
  const placesTags = getTagsByType('place');
  const brandsTags = getTagsByType('brand');

  return (
    <div className="page-container relative z-0 overflow-hidden">
      {/* Full-screen background decoration elements */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vh] bg-secondary/5 dark:bg-secondary/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[40vw] h-[40vh] bg-accent/5 dark:bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="space-y-8 py-6 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10"
        >
            <h1 className="h1-title text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Discover Auras
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
              Explore auras by people, places, and brands to find connections and discover new perspectives.
            </h2>
        </motion.div>
        
        <div className="grid gap-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <TagGroup title="People" tags={peopleTags} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <TagGroup title="Places" tags={placesTags} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <TagGroup title="Brands" tags={brandsTags} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}