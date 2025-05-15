import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'

// Preload Sharp with optimized settings for speed
sharp.cache(true);
sharp.concurrency(2); // Limit to 2 CPUs in production

// Use non-shared constant for cached state
const MEMORY_CACHE = new Map();
const MEMORY_CACHE_MAX_SIZE = 200; // Smaller to fit serverless memory constraints
const DISK_CACHE_ENABLED = process.env.NODE_ENV !== 'production'; // Disable disk cache in production

// Consider environment-appropriate cache directory
const CACHE_DIR = process.env.NODE_ENV === 'production'
    ? '/tmp/aura-image-cache' // Use /tmp in serverless environments
    : path.join(os.tmpdir(), 'aura-image-cache');

// Ensure cache directory exists
(async () => {
    if (DISK_CACHE_ENABLED) {
        try {
            await fs.mkdir(CACHE_DIR, { recursive: true });
        } catch (err) {
            console.error('Failed to create cache directory:', err);
        }
    }
})();

export async function GET(req: NextRequest) {
    try {
        const imageUrl = req.nextUrl.searchParams.get('url');
        const width = parseInt(req.nextUrl.searchParams.get('width') || '0') || undefined;
        const quality = parseInt(req.nextUrl.searchParams.get('quality') || '80');
        const isLowQuality = width && width <= 100; // Detect thumbnail requests

        if (!imageUrl) {
            return new NextResponse('Missing image URL', { status: 400 });
        }

        // Create cache keys
        const cacheKey = createHash('md5').update(`${imageUrl}-${width}-${quality}`).digest('hex');

        // Check memory cache first (sub-millisecond response)
        if (MEMORY_CACHE.has(cacheKey)) {
            return new NextResponse(MEMORY_CACHE.get(cacheKey), {
                headers: {
                    'Content-Type': 'image/webp',
                    'Cache-Control': 'public, max-age=432000, stale-while-revalidate=86400',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Cache': 'HIT-MEMORY',
                    'Access-Control-Allow-Origin': '*',
                    'Surrogate-Control': 'public, max-age=604800', // For CDN caching
                    'Vary': 'Accept'  // Important for CDNs to cache properly
                },
            });
        }

        let buffer;

        // Then check disk cache (low millisecond response)
        if (DISK_CACHE_ENABLED) {
            try {
                const cacheFilePath = path.join(CACHE_DIR, cacheKey);
                const cachedFile = await fs.readFile(cacheFilePath);

                // Add to memory cache for future requests
                if (MEMORY_CACHE.size >= MEMORY_CACHE_MAX_SIZE) {
                    const firstKey = MEMORY_CACHE.keys().next().value;
                    MEMORY_CACHE.delete(firstKey);
                }
                MEMORY_CACHE.set(cacheKey, cachedFile);

                return new NextResponse(cachedFile, {
                    headers: {
                        'Content-Type': 'image/webp',
                        'Cache-Control': 'public, max-age=432000, stale-while-revalidate=86400',
                        'X-Content-Type-Options': 'nosniff',
                        'X-Cache': 'HIT-DISK',
                        'Access-Control-Allow-Origin': '*',
                        'Surrogate-Control': 'public, max-age=604800', // For CDN caching
                        'Vary': 'Accept'  // Important for CDNs to cache properly
                    },
                });
            } catch {
                // Cache miss, continue to fetch
            }
        }

        // CRITICAL: For tiny thumbnails, we want ultra-fast responses
        if (isLowQuality) {
            // Ultra fast path for tiny thumbnails
            const fetchOpts = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/*',
                },
                cache: 'force-cache' as RequestCache, // Type assertion to fix TypeScript error
                next: { revalidate: 432000 }
            };

            const response = await fetch(imageUrl, fetchOpts);

            if (!response.ok) {
                return new NextResponse('Failed to fetch image', { status: 500 });
            }

            const arrayBuffer = await response.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);

            // Extremely minimal processing for thumbnails
            try {
                buffer = await sharp(buffer, {
                    failOn: 'none',
                    limitInputPixels: 50000000
                })
                    .resize({
                        width,
                        withoutEnlargement: true,
                        fit: 'cover',
                        kernel: 'lanczos3' // High-quality resize algorithm
                    })
                    .webp({
                        quality: Math.min(quality, 95),
                        effort: 4,  // Balanced effort for quality vs speed
                        smartSubsample: true, // Better color reproduction
                        force: true
                    })
                    .toBuffer();

                // Cache thumbnail
                if (DISK_CACHE_ENABLED) {
                    const cacheFilePath = path.join(CACHE_DIR, cacheKey);
                    await fs.writeFile(cacheFilePath, buffer).catch(() => { });
                }

                if (MEMORY_CACHE.size >= MEMORY_CACHE_MAX_SIZE) {
                    const firstKey = MEMORY_CACHE.keys().next().value;
                    MEMORY_CACHE.delete(firstKey);
                }
                MEMORY_CACHE.set(cacheKey, buffer);
            } catch (error) {
                console.error('Thumbnail processing error:', error);
            }
        } else {
            // Standard path for larger images
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            try {
                const response = await fetch(imageUrl, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                        'Accept': 'image/*',
                    },
                    signal: controller.signal,
                    cache: 'force-cache' as RequestCache, // Type assertion to fix TypeScript error
                    next: { revalidate: 432000 }
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    return new NextResponse('Failed to fetch image', { status: 500 });
                }

                const arrayBuffer = await response.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);

                // Only process if needed
                try {
                    const sharpInstance = sharp(buffer, {
                        failOn: 'none',
                        limitInputPixels: 50000000
                    });

                    if (width) {
                        sharpInstance.resize({
                            width,
                            withoutEnlargement: true,
                            fit: 'cover',
                            fastShrinkOnLoad: true,
                            kernel: 'lanczos3'
                        });
                    }

                    // Efficient WebP encoding
                    buffer = await sharpInstance
                        .webp({
                            quality: Math.min(quality, 90),
                            effort: process.env.NODE_ENV === 'production' ? 1 : 3, // Lower effort in production
                            mixed: true
                        })
                        .toBuffer();

                    // Save to disk cache
                    if (DISK_CACHE_ENABLED) {
                        const cacheFilePath = path.join(CACHE_DIR, cacheKey);
                        await fs.writeFile(cacheFilePath, buffer).catch(() => { });
                    }

                    // Save to memory cache
                    if (MEMORY_CACHE.size >= MEMORY_CACHE_MAX_SIZE) {
                        const firstKey = MEMORY_CACHE.keys().next().value;
                        MEMORY_CACHE.delete(firstKey);
                    }
                    MEMORY_CACHE.set(cacheKey, buffer);
                } catch (error) {
                    console.error('Image processing error:', error);
                }
            } catch (fetchError) {
                clearTimeout(timeoutId);
                console.error('Fetch error:', fetchError);
                return new NextResponse('Error fetching image', { status: 500 });
            }
        }

        // Return the processed image
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/webp',
                'Cache-Control': 'public, max-age=432000, stale-while-revalidate=86400',
                'X-Content-Type-Options': 'nosniff',
                'X-Cache': 'MISS',
                'Access-Control-Allow-Origin': '*',
                'Surrogate-Control': 'public, max-age=604800', // For CDN caching
                'Vary': 'Accept'  // Important for CDNs to cache properly
            },
        });
    } catch (error) {
        console.error('Image proxy general error:', error);
        return new NextResponse('Error processing image', { status: 500 });
    }
}