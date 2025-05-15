//src/app/(tabs)/discover/tag/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTagById, Tag } from '@/lib/data';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
import SearchBox from '@/components/discover/SearchBox';
import { motion } from "framer-motion";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { satoshi } from '@/fonts/satoshi';
import { getAuraColor } from '@/lib/aura';
import { Aura } from '@/lib/data';

// Create a client component that uses useSearchParams
function TagContent() {
  const searchParams = useSearchParams();
  const tagId = searchParams.get('id');

  const currentTag: Tag | undefined = tagId ? getTagById(decodeURIComponent(tagId)) : undefined;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<Aura | null>(null);
  const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (currentTag) {
      // Create a new constant from the narrowed type of currentTag
      const definedCurrentTag = currentTag;

      // Fetch AI data for the tag
      async function fetchAuraData() {
        try {
          setLoading(true);
          const response = await fetch('/api/generate-aura', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // Use the new constant here
            body: JSON.stringify({ name: definedCurrentTag.name })
          });

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
          }

          const data = await response.json();
          setAiData(data);
          // Process the recommendedHashtags
          if (data.recommendedHashtags) {
            const hashtags = data.recommendedHashtags
              .split(',')
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag.length > 0)
              .map((tag: string) => tag.startsWith('#') ? tag.substring(1) : tag);

            // Create Tag objects from the hashtags
            // Use the new constant here
            const tagObjects = hashtags.map((tagName: string, index: number) => ({
              id: `ai-tag-${definedCurrentTag.id}-${index}`,
              name: tagName,
              type: definedCurrentTag.type,
              auraId: `ai-aura-${definedCurrentTag.id}-${index}`
            }));

            setRecommendedTags(tagObjects);
          }
        } catch (err) {
          console.error('Error fetching aura data:', err);
          setError('Failed to generate aura. Please try again later.');
        } finally {
          setLoading(false);
        }
      }

      fetchAuraData();
    }
  }, [currentTag]);

  if (!tagId || !currentTag) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="w-full max-w-3xl mx-auto">
          <SearchBox />
          <div className="mt-12 text-center">
            <h1 className="text-2xl mb-4 text-gray-700">Aura not found</h1>
            <Link href="/discover" className="text-purple-600 hover:text-purple-800 flex items-center justify-center transition-colors">
              <ArrowLeft size={20} className="mr-1" />
              Back to Discover
            </Link>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={`${satoshi.className} bg-gray-50 p-4 md:p-6`}>
      {/* Fixed SearchBox at the top */}
      <div className="fixed top-14 left-0 w-full z-30 bg-[#F9FAFB]">
        <div className="w-full max-w-3xl mx-auto">
          <SearchBox />
        </div>
      </div>

      {/* Add padding top to offset the fixed SearchBox */}
      <div className="animate-[var(--animate-fade-in)] max-w-3xl mx-auto pt-28">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="flex space-x-2 mb-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    backgroundColor: [
                      "var(--primary)",
                      "var(--secondary)",
                      "var(--accent)"
                    ]
                  }}
                  transition={{
                    scale: {
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.3,
                    },
                    backgroundColor: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
              ))}
            </motion.div>
            <p className="text-gray-600">Generating aura for &quot;{currentTag.name}&quot;...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4 bg-white rounded-lg shadow">
            <p className="text-red-600 mb-2 text-lg">{error}</p>
          </div>
        ) : aiData ? (
          <>
            <AuraDisplay
              aura={{
                id: currentTag.auraId,
                name: currentTag.name,
                type: aiData.type || currentTag.type,
                auraColor: getAuraColor(aiData.type || currentTag.type),
                info: aiData.description || '',
                claimToFame: aiData.claimToFame,
                imageUrl: aiData.imageUrl
              }}
              auraScore={aiData.auraMeter}
              auraReason={aiData.auraReason}
            />

            <div className="mt-10">
              <SimilarTagsRow
                tags={recommendedTags}
                currentTagId={currentTag.id}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// Loading fallback component
function TagPageLoading() {
  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-3xl mx-auto mb-8">
        <SearchBox />
      </div>
      <div className="flex flex-col items-center justify-center min-h-[40vh] mt-8">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading tag details...</p>
      </div>
    </div>
  );
}

// Main page component that wraps the content with Suspense
export default function DiscoverTagPage() {
  return (
    <Suspense fallback={<TagPageLoading />}>
      <TagContent />
    </Suspense>
  );
}