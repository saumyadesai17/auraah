//src/components/explore/AuraCard.tsx

import { Aura } from '@/lib/data';
import Image from 'next/image';
import { useState, useEffect, JSX, useRef } from 'react';
import {
  User,
  BookOpen,
  MapPin,
  BadgeCent,
  Package,
  Heart,
  X,
  RefreshCw
} from 'lucide-react';
import { BsStars } from 'react-icons/bs';
import { satoshi } from '@/fonts/satoshi';

interface ExtendedAura extends Aura {
  claimToFame?: string;
}

interface AuraDisplayProps {
  aura: ExtendedAura | undefined;
  auraScore?: number;
  auraReason?: string;
  cardCounter?: string;
  onSwipe?: (direction: 'left' | 'right') => void;
  onReset?: () => void;
  isExiting?: boolean;
}

const typeIconMap: Record<string, JSX.Element> = {
  person: <User size={18} className="mr-1.5 text-[#A193F2]" />,
  'fictional character': <BookOpen size={18} className="mr-1.5 text-[#A193F2]" />,
  place: <MapPin size={18} className="mr-1.5 text-[#A193F2]" />,
  brand: <BadgeCent size={18} className="mr-1.5 text-[#A193F2]" />,
  thing: <Package size={18} className="mr-1.5 text-[#A193F2]" />,
};

const getTypeIcon = (type: string) => typeIconMap[type] ?? <Package size={20} className="mr-1.5" />;

export default function AuraCard({
  aura,
  auraScore: providedScore,
  auraReason,
  cardCounter,
  onSwipe,
  onReset,
  isExiting
}: AuraDisplayProps) {
  const [auraScore, setAuraScore] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Effect for score initialization
  useEffect(() => {
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }
  }, [providedScore]);

  // Effect to track scrolling with requestAnimationFrame for better performance
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    const scrollThreshold = 80;
    let ticking = false;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;

      if (scrollTop > scrollThreshold && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop <= scrollThreshold && isScrolled) {
        setIsScrolled(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    scrollContainer.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', onScroll);
  }, [isScrolled]);

  // Rest of your handlers remain the same
  const handleDislike = () => {
    if (isExiting || !onSwipe) return;
    onSwipe('left');
  };

  const handleShuffle = () => {
    if (isExiting || !onReset) return;
    onReset();
  };

  const handleLike = () => {
    if (isExiting || !onSwipe) return;
    onSwipe('right');
  };

  // Display the type label with proper capitalization
  const getTypeDisplay = (type: string) => {
    if (!type) return 'Thing';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (!aura) {
    return <p className="text-center text-red-600 p-4">Aura not found.</p>;
  }

  return (
    <div className={`${satoshi.className} flex flex-col h-full bg-white rounded-2xl relative`}
      style={{
        boxShadow: `-2px -2px 8px 0px #95EE932B, 0px 2px 8px 0px #E99DF726, 0px 8px 10px 0px #89D6E81A`
      }}>
      {/* Single scrollable container with sticky header and footer */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto overscroll-contain scrollbar-hide relative"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          touchAction: "pan-y"
        }}
      >
        {/* Sticky header that transforms on scroll */}
        <div
          className="sticky top-0 left-0 right-0 z-10 px-6 pt-4 pb-2 bg-white"
          style={{
            transition: 'box-shadow 300ms ease-in-out',
            boxShadow: isScrolled ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          <div className="flex items-center justify-between relative h-12 overflow-visible">
            {/* Image and name container */}
            <div className="flex items-center justify-center">
              {/* Image with smooth fade in/out */}
              <div
                className="rounded-full overflow-hidden w-10 h-10"
                style={{
                  opacity: isScrolled ? 1 : 0,
                  transform: isScrolled ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.8)',
                  transition: 'opacity 300ms ease, transform 300ms ease',
                  pointerEvents: isScrolled ? 'auto' : 'none'
                }}
              >
                {aura?.imageUrl && !imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gray-100"></div>

                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(aura.imageUrl)}&width=200&quality=95`}
                      alt={aura.name}
                      fill
                      sizes="40px"
                      className="object-cover rounded z-10 transition-opacity duration-500"
                      style={{ opacity: 0 }}
                      onLoad={(event) => {
                        const img = event.currentTarget;
                        setTimeout(() => {
                          img.style.opacity = '1';
                        }, 50);
                      }}
                      onError={() => setImageError(true)}
                      loading="eager"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="font-semibold text-gray-400 text-xs">
                      {aura?.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name with smooth fade in/out */}
              <div
                className="ml-2"
                style={{
                  opacity: isScrolled ? 1 : 0,
                  transform: isScrolled ? 'translateX(0)' : 'translateX(-4px)',
                  transition: 'opacity 300ms ease, transform 300ms ease',
                  pointerEvents: isScrolled ? 'auto' : 'none'
                }}
              >
                <span className="font-medium text-gray-800 text-sm truncate max-w-[120px] inline-block">
                  {aura?.name}
                </span>
              </div>
            </div>

            {/* Type indicator with left-to-right move */}
            <div
              style={{
                position: 'absolute',
                left: isScrolled ? 'auto' : '0',
                right: isScrolled ? '0' : 'auto',
                transition: 'left 300ms ease, right 300ms ease',
              }}
            >
              <span
                className="inline-flex items-center rounded-full text-gray-700 text-sm font-medium border border-[#A193F2] bg-white"
                style={{
                  padding: isScrolled ? '0.375rem 0.5rem' : '0.5rem 0.5rem',
                  transition: 'padding 300ms ease',
                }}
              >
                {isScrolled ? (
                  <div className="flex items-center justify-center">
                    {/* Icon without margin */}
                    {aura.type === 'person' && <User size={18} className="text-[#A193F2]" />}
                    {aura.type === 'fictional character' && <BookOpen size={18} className="text-[#A193F2]" />}
                    {aura.type === 'place' && <MapPin size={18} className="text-[#A193F2]" />}
                    {aura.type === 'brand' && <BadgeCent size={18} className="text-[#A193F2]" />}
                    {aura.type === 'thing' && <Package size={18} className="text-[#A193F2]" />}
                  </div>
                ) : (
                  <>
                    {/* Icon with text */}
                    {getTypeIcon(aura.type)}
                    <span style={{
                      transition: 'opacity 300ms ease',
                      opacity: isScrolled ? 0 : 1
                    }}>
                      {getTypeDisplay(aura.type)}
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* Counter with fade out */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                opacity: isScrolled ? 0 : 1,
                transition: 'opacity 300ms ease',
                pointerEvents: isScrolled ? 'none' : 'auto'
              }}
            >
              <span className="text-zinc-400 text-sm">{cardCounter}</span>
            </div>
          </div>
        </div>

        {/* Content wrapper - CRITICAL PART THAT PRESERVES READING FLOW */}
        <div className="px-6 min-h-full flex flex-col">
          {/* Use CSS Grid to maintain scroll position while elements collapse */}
          <div className="grid grid-cols-1" style={{ gridTemplateRows: 'auto auto 1fr' }}>
            {/* 1. Image section - collapsible without affecting scroll position */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxHeight: isScrolled ? '0' : '220px',
                marginBottom: isScrolled ? '0' : '1.5rem',
                opacity: isScrolled ? 0 : 1,
                overflow: 'hidden',
                transition: 'max-height 400ms ease, opacity 400ms ease, margin 400ms ease',
                willChange: 'max-height, opacity',
                pointerEvents: isScrolled ? 'none' : 'auto',
              }}
            >
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden relative flex-shrink-0">
                {aura?.imageUrl && !imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Static background placeholder */}
                    <div className="absolute inset-0 bg-gray-100"></div>

                    {/* Initial image load - immediately request high quality */}
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(aura.imageUrl)}&width=400&quality=95`}
                      alt={aura.name}
                      fill
                      sizes="(max-width: 768px) 160px, 208px"
                      className="object-cover rounded z-10 transition-opacity duration-700"
                      style={{ opacity: 0 }}
                      onLoad={(event) => {
                        const img = event.currentTarget;
                        // When the image loads completely, fade it in smoothly
                        setTimeout(() => {
                          img.style.opacity = '1';
                        }, 50);
                      }}
                      onError={() => setImageError(true)}
                      priority
                      loading="eager"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="font-semibold text-gray-400 text-2xl md:text-3xl">
                      {aura?.name?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Title section - collapsible without affecting scroll position */}
            <div
              style={{
                maxHeight: isScrolled ? '0' : '120px',
                opacity: isScrolled ? 0 : 1,
                overflow: 'hidden',
                marginBottom: isScrolled ? 0 : '1.5rem',
                transition: 'max-height 400ms ease, opacity 400ms ease, margin 400ms ease',
                willChange: 'max-height, opacity',
                pointerEvents: isScrolled ? 'none' : 'auto',
              }}
            >
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-3">{aura?.name}</h2>
                <div className="w-40 h-1 mx-auto rounded-full" style={{
                  background: 'linear-gradient(270deg, #8CDCE9 0%, #AD9FFC 100%)'
                }}></div>
              </div>
            </div>

            {/* 3. Content - ALWAYS VISIBLE - NO TRANSFORMS THAT AFFECT POSITION */}
            <div
              style={{
                paddingTop: isScrolled ? '8rem' : '0rem',
                transition: 'padding-top 400ms ease-out', // Match other transitions
              }}
            >
              {/* Description text */}
              <div className="mb-6">
                {/* Title shown when scrolled for better continuity */}
                <h3
                  className="text-sm font-medium text-zinc-400 mb-2"
                  style={{
                    opacity: isScrolled ? 1 : 0,
                    maxHeight: isScrolled ? '24px' : '0',
                    overflow: 'hidden',
                    transition: 'opacity 400ms ease, max-height 400ms ease',
                  }}
                >
                  About {aura?.name}
                </h3>

                <p className="text-zinc-700 text-sm md:text-base">
                  {aura?.info}
                </p>
              </div>

              {/* Claim to fame section */}
              {aura?.claimToFame && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">Claim to fame</h3>
                  <p className="text-zinc-700 text-sm md:text-base">
                    {aura.claimToFame}
                  </p>
                </div>
              )}

              {/* Aura Score section */}
              {auraScore !== null && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-zinc-400 mb-2">Aura Score:</h3>

                  <div className="bg-[#F8FEF8] rounded-lg p-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-[2px]"
                      style={{
                        background: 'linear-gradient(180deg, #9AEB9B 0%, #71D8E9 32.13%, #A6AEFF 64.26%, #FE9399 97.37%)'
                      }}>
                    </div>

                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <BsStars className="mr-2 text-gray-800 text-xl" />
                        <span className="font-bold text-gray-800 text-3xl">{auraScore}</span>
                      </div>

                      {auraReason && (
                        <p className="text-gray-600 text-sm leading-relaxed flex-1 text-left">
                          {auraReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Flex spacer to push buttons to bottom when content is short */}
              <div className="flex-grow min-h-[20px]"></div>
            </div>
          </div>
        </div>

        {/* Sticky action buttons */}
        <div className="sticky bottom-0 left-0 right-0 flex justify-center items-center gap-4 py-2 bg-white border-t border-gray-100 rounded-b-2xl z-10">
          <button
            onClick={handleDislike}
            className="p-3 md:p-4 bg-white rounded-full text-red-400 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 active:bg-red-100 active:scale-90 active:text-red-600 transition-all duration-150 shadow-sm"
            aria-label="Dislike"
            disabled={isExiting}
          >
            <X size={24} className="md:w-7 md:h-7" />
          </button>

          <button
            onClick={handleShuffle}
            className="p-2.5 md:p-3 bg-white rounded-full text-gray-500 hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 active:bg-gray-100 active:scale-90 active:text-gray-800 transition-all duration-150 shadow-sm"
            aria-label="Shuffle cards"
            disabled={isExiting}
          >
            <RefreshCw size={20} className="md:w-5 md:h-5" />
          </button>

          <button
            onClick={handleLike}
            className="p-3 md:p-4 bg-white rounded-full text-green-500 hover:bg-green-50 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 active:bg-green-100 active:scale-90 active:text-green-700 transition-all duration-150 shadow-sm"
            aria-label="Like"
            disabled={isExiting}
          >
            <Heart size={24} className="md:w-7 md:h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}