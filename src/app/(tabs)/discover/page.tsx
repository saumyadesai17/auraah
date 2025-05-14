'use client';

import TagGroup from '@/components/discover/TagGroup';
import SearchBox from '@/components/discover/SearchBox';
import { getTagsByType, Tag } from '@/lib/data'; // Ensure Tag is imported if used directly
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, User, MapPin, Heart } from 'lucide-react';
import { satoshi } from '@/fonts/satoshi';

export default function DiscoverPage() {
  const peopleTags = getTagsByType('person');
  const placesTags = getTagsByType('place');
  const brandsTags = getTagsByType('brand');

  // For "Suggested For You", you might want to combine or select specific tags.
  // Here, we'll combine places and brands for demonstration.
  const suggestedTags: Tag[] = [...placesTags.slice(0, 3), ...brandsTags.slice(0, 2)]; // Example: mix of 3 places and 2 brands
  const allTags = [...peopleTags, ...placesTags, ...brandsTags];
  const trendingTags: Tag[] = [...allTags].sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <div className="page-container bg-white min-h-screen overflow-y-auto pb-4 pt-24">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-15 pb-6 flex flex-col items-center justify-center gap-1"
      >
        <h1 className={`${satoshi.className} text-2xl md:text-4xl font-bold text-gray-800`}>
          Discover people, places,
        </h1>
        <h1 className={`${satoshi.className} text-2xl md:text-4xl font-bold text-gray-800`}>
          brands, food
        </h1>
        <h1 className={`${satoshi.className} text-md md:text-4xl text-[#9C9A96]`}>
          literally anything that excites you
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className='py-6'
      >
        <SearchBox />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={`space-y-8 mt-12 ${satoshi.className}`}
      >
        <TagGroup
          title="Trending Now"
          tags={trendingTags} // Use the trending tags
          icon={<TrendingUp size={20} />}
        />

        <TagGroup
          title="Suggested For You"
          tags={suggestedTags} // Use the combined/selected list
          icon={<Sparkles size={20} />}
        />

        <TagGroup
          title="Popular People"
          tags={peopleTags.slice(0, 8)}
          icon={<User size={20} />} // Example if you want a dedicated people section
        />

        <TagGroup
          title="Popular Places"
          tags={placesTags.slice(0, 8)}
          icon={<MapPin size={20} />} // Example if you want a dedicated places section
        />

        <TagGroup
          title="Popular Brands"
          tags={brandsTags.slice(0, 8)}
          icon={<Heart size={20} />} // Example if you want a dedicated brands section
        />
      </motion.div>
    </div>
  );
}