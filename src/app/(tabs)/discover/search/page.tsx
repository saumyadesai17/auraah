'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react'; // Import Suspense
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AuraDisplay from '@/components/discover/AuraDisplay';
import SimilarTagsRow from '@/components/discover/SimilarTagsRow';
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
                const response = await fetch('/api/groq', {
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
                console.log('AI Data:', data);
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

    return (
        <div className={`${satoshi.className} page-container bg-gray-50 min-h-screen p-4 md:p-6`}>
            <div className="my-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-5">
                    Showing results for &quot;{query}&quot;
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
                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4 bg-white rounded-lg shadow">
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
                                imageUrl: aiData.imageUrl // Add the imageUrl from API response
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
            <div className="page-container flex flex-col items-center justify-center min-h-[calc(100vh-120px)]"> {/* Adjusted min-height */}
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-muted-foreground">Loading search page...</p>
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}