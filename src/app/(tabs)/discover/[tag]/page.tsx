'use client';

import { use, useState, useEffect } from 'react';
import { getTagById, Tag } from '@/lib/data';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
import NavigationBreadcrumb from '@/components/discover/NavigationBreadcrumb';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface DiscoverTagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

interface AiAuraResponse {
  name: string;
  description: string;
  claimToFame: string;
  recommendedHashtags: string;
  auraMeter: number;
  auraReason: string;
}

export default function DiscoverTagPage({ params }: DiscoverTagPageProps) {
  const { tag } = use(params); // unwraps the Promise using React.use
  const tagId = decodeURIComponent(tag);

  const currentTag: Tag | undefined = getTagById(tagId);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiData, setAiData] = useState<AiAuraResponse | null>(null);
  const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);
  const [recentTags, setRecentTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (currentTag) {
      // Create a new constant from the narrowed type of currentTag
      const definedCurrentTag = currentTag;

      setRecentTags(prev => {
        const filtered = prev.filter(t => t.id !== definedCurrentTag.id);
        return [definedCurrentTag, ...filtered].slice(0, 5);
      });
      
      // Fetch AI data for the tag
      async function fetchAuraData() {
        try {
          setLoading(true);
          const response = await fetch('/api/groq', {
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
          console.log('AI Data:', data);
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

  if (!currentTag) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-full">
        <h1 className="text-2xl mb-4 text-foreground">Aura not found</h1>
        <Link href="/discover" className="text-secondary hover:text-secondary/80 flex items-center transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          Back to Discover
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="sticky top-0 bg-background z-10 pt-4 pb-2">
        <Link href="/discover" 
          className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors">
          <ArrowLeft size={20} className="mr-1" />
          Back
        </Link>
        <NavigationBreadcrumb
          currentTag={currentTag}
          recentTags={recentTags.filter(t => t.id !== currentTag.id)}
        />
      </div>

      <div className="animate-[var(--animate-fade-in)]">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Generating aura for &quot;{currentTag.name}&quot;...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <p className="text-destructive mb-2">{error}</p>
          </div>
        ) : aiData ? (
          <>
            <AuraDisplay 
              aura={{
                id: currentTag.auraId,
                name: currentTag.name,
                type: currentTag.type,
                auraColor: getAuraColor(currentTag.type),
                info: aiData.claimToFame
              }}
              auraScore={aiData.auraMeter}
              auraReason={aiData.auraReason}
            />
            
            {aiData.auraReason && (
              <div className="mt-6 p-4 bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Aura Analysis</h3>
                <p className="text-muted-foreground">{aiData.auraReason}</p>
              </div>
            )}
            
            <div className="mt-8">
              <SimilarTagsRow
                tags={recommendedTags}
                currentTagId={currentTag.id}
                highlightedType={currentTag.type}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

// Helper function to get aura color based on type
function getAuraColor(type: 'person' | 'place' | 'brand'): string {
  switch (type) {
    case 'person':
      return 'bg-primary/80';
    case 'place':
      return 'bg-secondary/80';
    case 'brand':
      return 'bg-accent/80';
    default:
      return 'bg-primary/80';
  }
}