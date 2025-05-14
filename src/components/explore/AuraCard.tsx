//src/components/explore/AuraCard.tsx

import { Aura } from '@/lib/data';
import Image from 'next/image';
import { useState, useEffect, JSX } from 'react';
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
  const [dislikeActive, setDislikeActive] = useState(false);
  const [shuffleActive, setShuffleActive] = useState(false);
  const [likeActive, setLikeActive] = useState(false);

  useEffect(() => {
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }
  }, [providedScore]);

  const handleDislike = () => {
    if (isExiting || !onSwipe) return;

    setDislikeActive(true);
    setTimeout(() => setDislikeActive(false), 300);
    onSwipe('left');
  };

  const handleShuffle = () => {
    if (isExiting || !onReset) return;

    setShuffleActive(true);
    setTimeout(() => setShuffleActive(false), 300);
    onReset();
  };

  const handleLike = () => {
    if (isExiting || !onSwipe) return;

    setLikeActive(true);
    setTimeout(() => setLikeActive(false), 300);
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
      {/* Single scrollable container with sticky footer */}
      <div className="h-full overflow-y-auto overscroll-contain scrollbar-hide"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none"
        }}>
        {/* Content wrapper */}
        <div className="px-6 pt-6 pb-1 min-h-full flex flex-col">
          {/* Card header with type indicator and counter */}
          <div className="flex justify-between items-center mb-5">
            {/* Type indicator in a pill */}
            <div className="self-start">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-gray-700 text-sm font-medium border border-[#A193F2] bg-white">
                {getTypeIcon(aura.type)}
                {getTypeDisplay(aura.type)}
              </span>
            </div>
            <span className="text-zinc-400 text-sm">{cardCounter}</span>
          </div>

          {/* Image section - Responsive circular image */}
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 md:w-60 md:h-60 rounded-full overflow-hidden relative bg-gray-100">
              {aura?.imageUrl && !imageError ? (
                <Image
                  src={aura.imageUrl}
                  alt={aura.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 768px) 192px, 240px"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl md:text-3xl font-semibold text-gray-400">
                    {aura?.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Title and gradient line */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 mb-3">{aura?.name}</h2>
            <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-blue-300 mx-auto rounded-full"></div>
          </div>

          {/* Description text */}
          <div className="mb-6">
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
          <div className="flex-grow"></div>
        </div>

        {/* Sticky action buttons - inside the scrollable area but sticky to bottom */}
        <div className="sticky bottom-0 left-0 right-0 flex justify-center items-center gap-4 py-4 bg-white border-t border-gray-100 rounded-b-2xl z-10">
          <button
            onClick={handleDislike}
            className={`p-3 md:p-4 bg-white rounded-full text-red-400 hover:bg-red-50 
      active:scale-90 ${dislikeActive ? 'bg-red-200 scale-90' : ''} 
      transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400`}
            aria-label="Dislike"
            disabled={isExiting}
          >
            <X size={24} className="md:w-7 md:h-7" />
          </button>

          <button
            onClick={handleShuffle}
            className={`p-2.5 md:p-3 bg-white rounded-full text-gray-500 hover:bg-gray-50 
      active:scale-90 ${shuffleActive ? 'bg-gray-200 scale-90' : ''} 
      transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400`}
            aria-label="Shuffle cards"
            disabled={isExiting}
          >
            <RefreshCw size={20} className="md:w-5 md:h-5" />
          </button>

          <button
            onClick={handleLike}
            className={`p-3 md:p-4 bg-white rounded-full text-green-500 hover:bg-green-50 
      active:scale-90 ${likeActive ? 'bg-green-200 scale-90' : ''} 
      transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400`}
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