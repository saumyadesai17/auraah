//src/app/(tabs)/discover/search/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
import SearchBox from '@/components/discover/SearchBox';
import { motion } from "framer-motion";
import { Tag } from '@/lib/data';
import { satoshi } from '@/fonts/satoshi';
import { Aura } from '@/lib/data';
import { getAuraColor, getEntityType } from '@/lib/aura';


// This component contains the original logic and uses useSearchParams
function SearchPageContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aiData, setAiData] = useState<Aura | null>(null);
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
                const response = await fetch('/api/generate-aura', {
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

    if (!query && !loading) {
        return (
            <div className="flex flex-col items-center p-4">
                <div className="w-full max-w-3xl mx-auto mb-8">
                    <SearchBox />
                </div>
                <div className="mt-12 text-center">
                    <h1 className="text-2xl mb-4 text-foreground">No search query provided</h1>
                    <Link href="/discover" className="text-secondary hover:text-secondary/80 flex items-center justify-center transition-colors">
                        <ArrowLeft size={20} className="mr-1" />
                        Back to Discover
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`${satoshi.className} bg-gray-50 p-4 md:p-6`}>
            {/* Fixed SearchBox at the top, styled exactly as before */}
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
                        <p className="text-gray-600">Generating aura for &quot;{query}&quot;...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4 bg-white rounded-lg shadow">
                        <p className="text-red-600 mb-2 text-lg">{error}</p>
                    </div>
                ) : aiData ? (
                    <>
                        <AuraDisplay
                            aura={{
                                id: `search-${aiData.name}-${Date.now()}`,
                                name: aiData.name,
                                type: aiData.type || getEntityType(aiData.description),
                                auraColor: getAuraColor(aiData.type || getEntityType(aiData.description)),
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
                            />
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

// This is the default export for the page, wrapping the content in Suspense
export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center p-4">
                <div className="w-full max-w-3xl mx-auto mb-8">
                    <SearchBox />
                </div>
                <div className="flex flex-col items-center justify-center min-h-[40vh] mt-8">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="mt-4 text-muted-foreground">Loading search page...</p>
                </div>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}