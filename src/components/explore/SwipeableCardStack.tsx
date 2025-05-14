'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { mockAuras } from '@/lib/data';
import AuraCard from '@/components/explore/AuraCard';
import { RefreshCw } from 'lucide-react';
import { getAuraColor } from '@/lib/aura';
// Import the mock aura responses
import auraResponses from '@/lib/auraResponses.json';

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Define a type for the enriched aura data to avoid 'any'
interface EnrichedAuraData {
  name?: string;
  type?: 'person' | 'fictional character' | 'place' | 'brand' | 'thing';
  description?: string;
  claimToFame?: string;
  auraMeter?: number;
  auraReason?: string;
  imageUrl?: string;
}

const normalizeType = (type?: string): 'person' | 'fictional character' | 'place' | 'brand' | 'thing' => {
  if (!type) return 'thing';

  const normalizedType = type.toLowerCase();

  if (normalizedType === 'person' ||
    normalizedType === 'fictional character' ||
    normalizedType === 'place' ||
    normalizedType === 'brand' ||
    normalizedType === 'thing') {
    return normalizedType as 'person' | 'fictional character' | 'place' | 'brand' | 'thing';
  }

  // Handle common variations
  if (normalizedType.includes('person') || normalizedType.includes('human')) {
    return 'person';
  }
  if (normalizedType.includes('fiction') || normalizedType.includes('character')) {
    return 'fictional character';
  }
  if (normalizedType.includes('place') || normalizedType.includes('location')) {
    return 'place';
  }
  if (normalizedType.includes('brand') || normalizedType.includes('company')) {
    return 'brand';
  }

  // Default fallback
  return 'thing';
};

export default function SwipeableCardStack() {
  const cardRef = useRef(null);
  const [cards, setCards] = useState(() => shuffleArray(mockAuras));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const startY = useRef<number | null>(null);

  // For enriched aura data - fixed type
  const [enrichedAuras, setEnrichedAuras] = useState<Record<string, EnrichedAuraData>>({});
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchStart, setBatchStart] = useState(0);
  const BATCH_SIZE = 5;

  // Track when we need to reset after all cards are seen
  const [needsReset, setNeedsReset] = useState(false);

  // Simple motion values for card position and rotation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-5, 0, 5]);

  // Show indicators with less movement required
  const likeOpacity = useTransform(x, [20, 80], [0, 1]);  // Start showing at just 20px
  const dislikeOpacity = useTransform(x, [-80, -20], [1, 0]);  // Start showing at just -20px

  // Animation controls
  const controls = useAnimation();

  // Process aura data in batches from the mock responses
  useEffect(() => {
    const processAuraBatch = () => {
      if (batchProcessing || batchStart >= cards.length) return;

      try {
        setBatchProcessing(true);
        const endIndex = Math.min(batchStart + BATCH_SIZE, cards.length);
        const batch = cards.slice(batchStart, endIndex);

        // Process batch using the mock responses
        const newEnrichedAuras = { ...enrichedAuras };

        batch.forEach(aura => {
          // Find matching response in the mock data by name
          const matchingResponse = auraResponses.find(
            response => response.name?.toLowerCase() === aura.name?.toLowerCase()
          );

          if (matchingResponse) {
            // Normalize the type before assigning
            newEnrichedAuras[aura.id] = {
              ...matchingResponse,
              type: normalizeType(matchingResponse.type)
            };
          } else {
            // If no match found, create a basic response
            newEnrichedAuras[aura.id] = {
              name: aura.name,
              type: normalizeType(aura.type),
              description: aura.info || `Information about ${aura.name}`,
              claimToFame: `${aura.name} is known for its unique qualities and characteristics.`,
              auraMeter: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
              auraReason: `${aura.name} has a significant impact on its domain.`,
              imageUrl: aura.imageUrl
            };
          }
        });

        setEnrichedAuras(newEnrichedAuras);
        setBatchStart(endIndex);
      } catch (error) {
        console.error('Error processing aura batch:', error);
      } finally {
        setBatchProcessing(false);
      }
    };

    processAuraBatch();
  }, [cards, batchStart, batchProcessing, enrichedAuras]);

  // Process next batch when approaching the end of current batch
  useEffect(() => {
    // When we're 2 cards away from the end of the current batch, process the next batch
    if (currentIndex >= batchStart - 2 && batchStart < cards.length && !batchProcessing) {
      setBatchStart(prevBatchStart => prevBatchStart);
    }
  }, [currentIndex, batchStart, cards.length, batchProcessing]);

  // Reset animation controls when currentIndex changes
  useEffect(() => {
    if (!exiting) {
      controls.set({ x: 0, y: 0, opacity: 1 });
    }
  }, [currentIndex, exiting, controls]);

  // Check if we're at the end of cards
  useEffect(() => {
    if (currentIndex >= cards.length) {
      setNeedsReset(true);
    }
  }, [currentIndex, cards.length]);

  // Reset the deck when all cards have been seen
  const handleReset = () => {
    setCards(shuffleArray(mockAuras));
    setCurrentIndex(0);
    setNeedsReset(false);
    setBatchStart(0);
    setEnrichedAuras({});
    x.set(0);
    y.set(0);
    controls.set({ x: 0, y: 0, opacity: 1 });
  };

  // Add drag start handler to detect vertical scrolling vs horizontal swiping
  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    setExiting(false);

    // Track start position for vertical detection
    if ('touches' in event) {
      startY.current = event.touches[0].clientY;
    } else if ('clientY' in event) {
      startY.current = event.clientY;
    }

    setIsSwiping(false);
  };

  // SIMPLIFIED SWIPING LOGIC
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    // Don't process if already exiting
    if (exiting) return;

    // Get absolute distance and velocity
    const distance = Math.abs(info.offset.x);
    const velocity = Math.abs(info.velocity.x);

    // Swipe threshold (based on screen size for responsiveness)
    const THRESHOLD = window.innerWidth * 0.40; // 40% of screen width

    // Check if swipe should succeed:
    // - Either distance is significant
    // - Or velocity is high enough (even with less distance)
    const shouldSwipe =
      distance > THRESHOLD ||
      (distance > THRESHOLD / 2 && velocity > 0.7);

    if (shouldSwipe) {
      // Determine direction and trigger animation
      const direction = info.offset.x > 0 ? 'right' : 'left';

      // Set exiting flag
      setExiting(true);

      // Animate card exit
      controls.start({
        x: direction === 'left' ? -window.innerWidth : window.innerWidth,
        y: 30,
        rotate: direction === 'left' ? -20 : 20,
        opacity: 0,
        transition: {
          duration: 0.5,
          ease: [0.2, 0.1, 0.3, 1]
        }
      }).then(() => {
        // After animation completes
        setCurrentIndex(i => i + 1);
        setExiting(false);

        // Reset position
        x.set(0);
        y.set(0);
        controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
      });
    } else {
      // Return to center with spring animation
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: {
          type: 'spring',
          stiffness: 200,
          damping: 25,
          duration: 0.4,
        }
      });
    }
  };

  // Handle button swipes
  const handleSwipe = (direction: 'left' | 'right') => {
    if (exiting) return;

    setExiting(true);

    controls.start({
      x: direction === 'left' ? -window.innerWidth : window.innerWidth,
      y: 30,
      rotate: direction === 'left' ? -20 : 20,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.1, 0.3, 1]
      }
    }).then(() => {
      setCurrentIndex(i => i + 1);
      setExiting(false);
      x.set(0);
      y.set(0);
      controls.set({ x: 0, y: 0, rotate: 0, opacity: 1 });
    });
  };

  // Prevent drag when clicking buttons
  const checkDragTarget = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      e.stopPropagation();
    }
  };

  // Reset UI
  if (needsReset) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[70vh] text-center">
        <p className="text-xl text-muted-foreground mb-6">You&apos;ve seen all available auras</p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 py-3 bg-secondary text-secondary-foreground rounded-full
                   hover:bg-custom-purple-light transition-colors duration-300 shadow-[var(--shadow-primary)]"
        >
          <RefreshCw size={22} />
          <span>Discover More Auras</span>
        </button>
      </div>
    );
  }

  // Current card to show
  const currentCard = cards[currentIndex];

  // Error state
  if (!currentCard) {
    return <p className="text-custom-text-secondary">No auras to display.</p>;
  }

  // Get enriched data for current card
  const enrichedData = enrichedAuras[currentCard.id];

  // Main UI
  return (
    <div className="w-full h-full mx-auto flex flex-col">
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          key={currentIndex}
          ref={cardRef}
          className="absolute inset-0 touch-manipulation"
          style={{ x, y, rotate }}
          animate={controls}
          initial={{ x: 0, y: 0, opacity: 1 }}
          drag={!exiting}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.6}
          onDragStart={handleDragStart}
          onDrag={(event, info) => {
            // If we detect significant horizontal movement (and minimal vertical movement),
            // set isSwiping to true - using a lower threshold for better responsiveness
            if (!isSwiping && Math.abs(info.offset.x) > 30) {
              if (startY.current !== null) {
                const verticalMovement = ('touches' in event)
                  ? Math.abs(event.touches[0].clientY - startY.current)
                  : ('clientY' in event)
                    ? Math.abs(event.clientY - startY.current)
                    : 0;

                // More lenient check for horizontal swiping
                if (Math.abs(info.offset.x) > verticalMovement * 1.5) {
                  setIsSwiping(true);
                }
              }
            }

            // Only update position if we're swiping, otherwise reset
            if (!isSwiping && Math.abs(info.offset.x) > 5) {
              controls.set({ x: 0 });
            }
          }}
          onDragEnd={handleDragEnd}
          onPointerDown={checkDragTarget}
          whileTap={{ cursor: "grabbing" }}
          dragMomentum={true}
        >
          {/* Enhanced Like indicator - more visible and responsive */}
          <motion.div
            className="absolute top-10 left-6 z-30"
            style={{
              opacity: likeOpacity,
              scale: useTransform(x, [40, 100], [0.9, 1.2])
            }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 border-2 border-green-400 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill="#22C55E" />
              </svg>
            </div>
          </motion.div>

          {/* Dislike indicator - positioned on the RIGHT side */}
          <motion.div
            className="absolute top-10 right-6 z-30"
            style={{
              opacity: dislikeOpacity,
              scale: useTransform(x, [-100, -40], [1.2, 0.9])
            }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 border-2 border-red-400 shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </motion.div>

          {/* Card content */}
          <div className="h-full w-full rounded-2xl overflow-hidden">
            {!enrichedData ? (
              <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-2xl">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading aura information...</p>
              </div>
            ) : (
              <AuraCard
                aura={{
                  ...currentCard,
                  type: enrichedData.type || normalizeType(currentCard.type),
                  auraColor: getAuraColor(enrichedData.type || normalizeType(currentCard.type)),
                  info: enrichedData.description || currentCard.info,
                  claimToFame: enrichedData.claimToFame,
                  imageUrl: enrichedData.imageUrl || currentCard.imageUrl
                }}
                auraScore={enrichedData.auraMeter}
                auraReason={enrichedData.auraReason}
                cardCounter={`${currentIndex + 1}/${cards.length}`}
                onSwipe={handleSwipe}
                onReset={handleReset}
                isExiting={exiting}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}