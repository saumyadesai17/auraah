'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { mockAuras } from '@/lib/data';
import AuraCard from '@/components/explore/AuraCard';
import { Heart, X, RefreshCw } from 'lucide-react';

// Function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function SwipeableCardStack() {
  const cardRef = useRef(null);
  const [cards, setCards] = useState(() => shuffleArray(mockAuras));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

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
    x.set(0);
    y.set(0);
    controls.set({ x: 0, y: 0, opacity: 1 });
  };

  // Handle the end of a drag/swipe
  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (exiting) return;

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

    // setDirection(dir);
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

  // Main UI
  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto">
      {/* Card counter */}
      <p className="text-center mb-4 text-sm text-muted-foreground">
        {currentIndex + 1} of {cards.length}
      </p>

      {/* Card container with relative positioning */}
      <div className="relative w-full h-[450px] sm:h-[500px] mb-8">
        {/* Swipeable card using framer-motion */}
        <motion.div
          key={currentIndex}
          ref={cardRef}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-manipulation"
          style={{ x, y, rotate }}
          animate={controls}
          initial={{ x: 0, y: 0, opacity: 1 }}
          drag={!exiting}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.8}
          onDragEnd={handleDragEnd}
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

          {/* The actual card */}
          <AuraCard aura={currentCard} />
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-center items-center gap-5 mt-4">
        <button
          onClick={() => handleSwipe('left')}
          className="p-4 bg-card/90 rounded-full text-destructive hover:bg-destructive hover:text-card
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Dislike"
          disabled={exiting}
        >
          <X size={28} />
        </button>
        <button
          onClick={handleReset}
          className="p-3 bg-card/90 rounded-full text-muted-foreground hover:bg-secondary hover:text-secondary-foreground
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Shuffle cards"
          disabled={exiting}
        >
          <RefreshCw size={22} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="p-4 bg-card/90 rounded-full text-primary hover:bg-primary hover:text-primary-foreground
                 transition-colors duration-300 shadow-[var(--shadow-primary)]"
          aria-label="Like"
          disabled={exiting}
        >
          <Heart size={28} />
        </button>
      </div>
    </div>
  );
}