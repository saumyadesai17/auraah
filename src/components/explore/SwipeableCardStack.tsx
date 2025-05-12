'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { mockAuras } from '@/lib/data';
import AuraDisplay from '@/components/discover/AuraDisplay';
import { Heart, X, RefreshCw } from 'lucide-react';
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

  // For enriched aura data - fixed type
  const [enrichedAuras, setEnrichedAuras] = useState<Record<string, EnrichedAuraData>>({});
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchStart, setBatchStart] = useState(0);
  const BATCH_SIZE = 5;

  // Track when we need to reset after all cards are seen
  const [needsReset, setNeedsReset] = useState(false);

  // Track swipe direction for animation
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Rotate card slightly as it moves
  const rotate = useTransform(x, [-300, 0, 300], [-30, 0, 30]);

  // Calculate opacity of like/dislike indicators
  const likeOpacity = useTransform(x, [0, 125], [0, 1]);
  const dislikeOpacity = useTransform(x, [-125, 0], [1, 0]);

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

  // Handle the start of a drag
  const handleDragStart = () => {
    // No need to track drag start position
  };

  // Handle the end of a drag/swipe
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (exiting) return;

    // Check if it was primarily a vertical drag (for scrolling)
    const isVerticalDrag = Math.abs(info.offset.y) > Math.abs(info.offset.x * 2);

    if (isVerticalDrag) {
      // If vertical drag, don't trigger swipe, just return to center
      controls.start({
        x: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 }
      });
      return;
    }

    const threshold = 100; // minimum distance required for a swipe

    if (info.offset.x > threshold) {
      // Swipe right (like)
      handleSwipeAnimation('right');
    } else if (info.offset.x < -threshold) {
      // Swipe left (dislike)
      handleSwipeAnimation('left');
    } else {
      // Return to center if not swiped far enough
      controls.start({
        x: 0,
        y: 0,
        transition: { type: 'spring', stiffness: 500, damping: 30 }
      });
    }
  };

  // Common animation logic for swiping
  const handleSwipeAnimation = (dir: 'left' | 'right') => {
    if (exiting) return;

    setExiting(true);

    controls.start({
      x: dir === 'left' ? -500 : 500,
      opacity: 0,
      transition: { duration: 0.3 }
    }).then(() => {
      // After animation completes
      setCurrentIndex(prevIndex => prevIndex + 1);
      setExiting(false);

      // Reset position for next card
      x.set(0);
      y.set(0);
      controls.set({ x: 0, y: 0, opacity: 1 });
    });
  };

  // Trigger swipe in a given direction programmatically (from buttons)
  const handleSwipe = (dir: 'left' | 'right') => {
    handleSwipeAnimation(dir);
  };

  // Reset UI
  if (needsReset) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[70vh] text-center">
        <p className="text-xl text-muted-foreground mb-6">You&apos;ve seen all available auras</p>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-full
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
    <div className="w-full max-w-xs sm:max-w-sm mx-auto flex flex-col">
      {/* Card counter */}
      <p className="text-center mb-4 text-sm text-muted-foreground">
        {currentIndex + 1} of {cards.length}
      </p>

      {/* Card container - Make it auto height so content fits */}
      <div className="relative w-full h-[60vh] overflow-hidden mb-5">
        {/* Swipeable card using framer-motion */}
        <motion.div
          key={currentIndex}
          ref={cardRef}
          className="absolute inset-0 touch-manipulation"
          style={{ x, y, rotate }}
          animate={controls}
          initial={{ x: 0, y: 0, opacity: 1 }}
          drag={!exiting}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.8}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          // Allow vertical scrolling by adding these classes
          whileTap={{ cursor: "grabbing" }}
        >
          {/* Like indicator */}
          <motion.div
            className="absolute top-10 right-10 z-20 rotate-12 border-4 border-primary rounded-lg px-2 py-1"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-primary font-bold text-xl">LIKE</span>
          </motion.div>

          {/* Dislike indicator */}
          <motion.div
            className="absolute top-10 left-10 z-20 -rotate-12 border-4 border-destructive rounded-lg px-2 py-1"
            style={{ opacity: dislikeOpacity }}
          >
            <span className="text-destructive font-bold text-xl">NOPE</span>
          </motion.div>

          {/* Card content - Use overflow auto for scrolling */}
          <div className="h-full overflow-y-auto px-1 pb-4"
            style={{ touchAction: "pan-y" }}>
            {!enrichedData ? (
              <div className="h-full flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading aura information...</p>
              </div>
            ) : (
              <div className="h-full bg-white rounded-lg">
                <AuraDisplay
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
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Action buttons - fixed position below the card */}
      <div className="flex justify-center items-center gap-5">
        <button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-card/90 rounded-full text-destructive hover:bg-destructive hover:text-card
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Dislike"
          disabled={exiting || !enrichedData}
        >
          <X size={28} />
        </button>
        <button
          onClick={handleReset}
          className="p-3 bg-card/90 rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Shuffle cards"
          disabled={exiting || !enrichedData}
        >
          <RefreshCw size={22} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="p-4 bg-card/90 rounded-full text-primary hover:bg-primary hover:text-primary-foreground
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Like"
          disabled={exiting || !enrichedData}
        >
          <Heart size={28} />
        </button>
      </div>
    </div>
  );
}