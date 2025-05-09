'use client';

import { use, useState, useEffect } from 'react';
import { getAuraById, getTagById, getSimilarTags, Aura, Tag } from '@/lib/data';
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

export default function DiscoverTagPage({ params }: DiscoverTagPageProps) {
  const { tag } = use(params); // unwraps the Promise using React.use
  const tagId = decodeURIComponent(tag);

  const currentTag: Tag | undefined = getTagById(tagId);
  const aura: Aura | undefined = currentTag ? getAuraById(currentTag.auraId) : undefined;
  const similarTags: Tag[] = currentTag ? getSimilarTags(currentTag.id, currentTag.type) : [];

  const [recentTags, setRecentTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (currentTag) {
      setRecentTags(prev => {
        const filtered = prev.filter(t => t.id !== currentTag.id);
        return [currentTag, ...filtered].slice(0, 5);
      });
    }
  }, [currentTag]);

  if (!currentTag || !aura) {
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
        <AuraDisplay aura={aura} />
        <div className="mt-8">
          <SimilarTagsRow
            tags={similarTags}
            currentTagId={currentTag.id}
            highlightedType={currentTag.type}
          />
        </div>
      </div>
    </div>
  );
}