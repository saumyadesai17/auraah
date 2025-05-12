import { Tag } from '@/lib/data';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface SimilarTagsRowProps {
  tags: Tag[];
  currentTagId?: string;
}

export default function SimilarTagsRow({ tags, currentTagId }: SimilarTagsRowProps) {
  if (!tags || tags.length === 0) {
    return (
      <div className="p-6 text-center bg-white rounded-lg mt-8">
        <p className="text-gray-500">No similar auras found.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col items-start mb-4">
        <h3 className="text-base font-semibold text-gray-600 mb-1">Similar Auras</h3>
        <div className="w-14 h-1 bg-gradient-to-r from-green-300 via-purple-400 to-orange-300 rounded-full" />
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const isAiTag = tag.id.startsWith('ai-tag');
          const href = isAiTag
            ? `/discover/search?q=${encodeURIComponent(tag.name)}`
            : `/discover/tag?id=${encodeURIComponent(tag.id)}`;

          return (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <div
                className="inline-block rounded-full p-[1px]"
                style={{
                  background: 'linear-gradient(180deg, #CAA0FF 0%, #AE8CD9 100%)',
                }}
              >
                <Link
                  href={href}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full bg-white text-gray-700 transition-colors duration-200 text-md ${currentTagId === tag.id ? 'bg-purple-50' : ''}`}
                >
                  <User size={20} className="mr-1.5 opacity-70 text-purple-700" />
                  {tag.name}
                </Link>
              </div>
            </motion.div>

          );
        })}
      </div>
    </div>
  );
}