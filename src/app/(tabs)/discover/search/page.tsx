'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
import { Tag } from '@/lib/data';
import { motion } from 'framer-motion';

interface AiAuraResponse {
    name: string;
    description: string;
    claimToFame: string;
    recommendedHashtags: string;
    auraMeter: number;
    auraReason: string;
}

// This component contains the original logic and uses useSearchParams
function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aiData, setAiData] = useState<AiAuraResponse | null>(null);
    const [recommendedTags, setRecommendedTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (!query) {
            setLoading(false); // Ensure loading stops if there's no query
            return;
        }

        async function fetchAuraData() {
            try {
                setLoading(true);
                setError(null); // Reset error state
                const response = await fetch('/api/ai_aura', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: query })
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ detail: `API error: ${response.status}` }));
                    throw new Error(errorData.detail || `API error: ${response.status}`);
                }

                const data = await response.json();
                setAiData(data);

                if (data.recommendedHashtags) {
                    let type: 'person' | 'place' | 'brand' = 'brand';
                    const desc = data.description?.toLowerCase() || '';
                    if (desc.includes('person')) {
                        type = 'person';
                    } else if (desc.includes('place')) {
                        type = 'place';
                    }

                    const hashtags = data.recommendedHashtags
                        .split(',')
                        .map((tag: string) => tag.trim())
                        .filter((tag: string) => tag.length > 0)
                        .map((tag: string) => tag.startsWith('#') ? tag.substring(1) : tag);

                    const tagObjects = hashtags.map((tagName: string, index: number) => ({
                        id: `ai-tag-search-${query}-${index}`, // Make ID more unique
                        name: tagName,
                        type: type,
                        auraId: `ai-aura-search-${query}-${index}` // Make ID more unique
                    }));
                    setRecommendedTags(tagObjects);
                }
            } catch (err) {
                console.error('Error fetching aura data:', err);
                setError(err instanceof Error ? err.message : 'Failed to generate aura. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchAuraData();
    }, [query]);

    if (!query && !loading) { // Check loading state to avoid flash of "No query"
        return (
            <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"> {/* Adjusted min-height */}
                <h1 className="text-2xl mb-4 text-foreground">No search query provided</h1>
                <Link href="/discover" className="text-secondary hover:text-secondary/80 flex items-center transition-colors">
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Discover
                </Link>
            </div>
        );
    }

    const entityType = getEntityType(aiData?.description);

    return (
        <div className="page-container">
            <div className="sticky top-0 bg-background z-10 pt-4 pb-2">
                <Link href="/discover"
                    className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors">
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Discover
                </Link>
                {query && <h2 className="text-xl font-semibold mt-2">Results for &quot;{query}&quot;</h2>}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="animate-[var(--animate-fade-in)] py-4" // Added py-4
            >
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh]">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="mt-4 text-muted-foreground">Generating aura for &quot;{query}&quot;...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <p className="text-destructive mb-2">{error}</p>
                        <Link href="/discover" className="text-secondary hover:text-secondary/80 flex items-center transition-colors">
                            <ArrowLeft size={20} className="mr-1" />
                            Try another search
                        </Link>
                    </div>
                ) : aiData ? (
                    <div className="space-y-8">
                        <AuraDisplay
                            aura={{
                                id: `search-${aiData.name}-${Date.now()}`, // More unique ID
                                name: aiData.name,
                                type: entityType,
                                auraColor: getAuraColor(entityType),
                                info: aiData.claimToFame
                            }}
                            auraScore={aiData.auraMeter}
                            auraReason={aiData.auraReason}
                        />

                        {aiData.auraReason && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }} // Adjusted delay
                                className="mt-6 p-4 bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg"
                            >
                                <h3 className="text-lg font-medium mb-2">Aura Analysis</h3>
                                <p className="text-muted-foreground">{aiData.auraReason}</p>
                            </motion.div>
                        )}

                        {recommendedTags.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }} // Adjusted delay
                                className="mt-8"
                            >
                                <SimilarTagsRow
                                    tags={recommendedTags}
                                    highlightedType={entityType}
                                />
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                        <p className="text-muted-foreground mb-2">No aura data found for &quot;{query}&quot;.</p>
                         <Link href="/discover" className="text-secondary hover:text-secondary/80 flex items-center transition-colors">
                            <ArrowLeft size={20} className="mr-1" />
                            Try another search
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

// This is the default export for the page, wrapping the content in Suspense
export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"> {/* Adjusted min-height */}
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Loading search page...</p>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}

// Helper functions (can be kept here or moved if preferred)
const getEntityType = (description?: string): 'person' | 'place' | 'brand' => {
    // ...existing code...
    if (!description) return 'brand';
    const desc = description.toLowerCase();
    if (desc.includes('person')) {
        return 'person';
    }
    if (desc.includes('place')) {
        return 'place';
    }
    return 'brand';
};

function getAuraColor(type: 'person' | 'place' | 'brand'): string {
    // ...existing code...
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