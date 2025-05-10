'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getTagById, Tag } from '@/lib/data';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
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
          const response = await fetch('/api/ai_aura', {
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
      <div className="page-container flex flex-col items-center justify-center min-h-full bg-gray-50 p-4">
        <h1 className="text-2xl mb-4 text-gray-700">Aura not found</h1>
        <Link href="/discover" className="text-purple-600 hover:text-purple-800 flex items-center transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className={`${satoshi.className} page-container bg-gray-50 min-h-screen p-4 md:p-6`}>
      <div className="my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-5">
          Showing results for &quot;{currentTag.name}&quot;
        </h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">Categories:</span>
            <select className="border border-gray-300 rounded-md py-1 px-3 bg-white text-gray-700">
              <option>All</option>
            </select>
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="animate-[var(--animate-fade-in)] max-w-3xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Generating aura for &quot;{currentTag.name}&quot;...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4 bg-white rounded-lg shadow">
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
    <div className="page-container flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">Loading tag details...</p>
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