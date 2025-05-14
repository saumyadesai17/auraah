//src/components/discover/AuraDisplay.tsx

import { Aura } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, JSX } from 'react';
import {
  User,
  BookOpen,
  MapPin,
  BadgeCent,
  Package,
  X,
  Heart
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
}

const typeIconMap: Record<string, JSX.Element> = {
  person: <User size={20} className="mr-1.5 text-[#A193F2]" />,
  'fictional character': <BookOpen size={20} className="mr-1.5 text-[#A193F2]" />,
  place: <MapPin size={20} className="mr-1.5 text-[#A193F2]" />,
  brand: <BadgeCent size={20} className="mr-1.5 text-[#A193F2]" />,
  thing: <Package size={20} className="mr-1.5 text-[#A193F2]" />,
};

const getTypeIcon = (type: string) => typeIconMap[type] ?? <Package size={20} className="mr-1.5" />;

export default function AuraDisplay({ aura, auraScore: providedScore, auraReason }: AuraDisplayProps) {
  const [auraScore, setAuraScore] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }

    // Check localStorage for liked/disliked status
    if (aura?.name) {
      const likedAuras = JSON.parse(localStorage.getItem('likedAuras') || '[]');
      const dislikedAuras = JSON.parse(localStorage.getItem('dislikedAuras') || '[]');

      setIsLiked(likedAuras.includes(aura.name));
      setIsDisliked(dislikedAuras.includes(aura.name));
    }
  }, [aura?.name, providedScore]);

  // Display the type label with proper capitalization
  const getTypeDisplay = (type: string) => {
    if (!type) return 'Thing';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const handleLike = () => {
    if (!aura?.name) return;

    // Get current arrays from localStorage
    const likedAuras = JSON.parse(localStorage.getItem('likedAuras') || '[]');
    const dislikedAuras = JSON.parse(localStorage.getItem('dislikedAuras') || '[]');

    if (isLiked) {
      // Remove from likes if already liked
      const index = likedAuras.indexOf(aura.name);
      if (index > -1) {
        likedAuras.splice(index, 1);
      }
      setIsLiked(false);
    } else {
      // Add to likes
      likedAuras.push(aura.name);
      setIsLiked(true);

      // Remove from dislikes if present
      if (isDisliked) {
        const index = dislikedAuras.indexOf(aura.name);
        if (index > -1) {
          dislikedAuras.splice(index, 1);
        }
        setIsDisliked(false);
      }
    }

    // Save updated arrays
    localStorage.setItem('likedAuras', JSON.stringify(likedAuras));
    localStorage.setItem('dislikedAuras', JSON.stringify(dislikedAuras));
  };

  const handleDislike = () => {
    if (!aura?.name) return;

    // Get current arrays from localStorage
    const likedAuras = JSON.parse(localStorage.getItem('likedAuras') || '[]');
    const dislikedAuras = JSON.parse(localStorage.getItem('dislikedAuras') || '[]');

    if (isDisliked) {
      // Remove from dislikes if already disliked
      const index = dislikedAuras.indexOf(aura.name);
      if (index > -1) {
        dislikedAuras.splice(index, 1);
      }
      setIsDisliked(false);
    } else {
      // Add to dislikes
      dislikedAuras.push(aura.name);
      setIsDisliked(true);

      // Remove from likes if present
      if (isLiked) {
        const index = likedAuras.indexOf(aura.name);
        if (index > -1) {
          likedAuras.splice(index, 1);
        }
        setIsLiked(false);
      }
    }

    // Save updated arrays
    localStorage.setItem('likedAuras', JSON.stringify(likedAuras));
    localStorage.setItem('dislikedAuras', JSON.stringify(dislikedAuras));
  };

  if (!aura) {
    return <p className="text-center text-red-600 p-4">Aura not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${satoshi.className} flex flex-col`}
    >
      {/* Header section with type indicator and action buttons */}
      <div className="flex justify-between items-start">
        {/* Type indicator */}
        <div className="self-start">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-gray-700 text-sm font-bold border border-[#A193F2]">
            {getTypeIcon(aura.type)}
            {getTypeDisplay(aura.type)}
          </span>
        </div>

        {/* Like/dislike buttons */}
        <div className="flex flex-col gap-4 px-3">
          <button
            onClick={handleDislike}
            className={`rounded-full w-10 h-10 flex items-center justify-center
            transition-all duration-200
            ${isDisliked
              ? 'bg-red-100 ring-2 ring-red-400 transform scale-110'
              : 'bg-[#FAFAFA] hover:bg-gray-100'}`}
            style={{
              boxShadow: isDisliked 
                ? '0 0 0 2px rgba(248, 113, 113, 0.4), 0 0 8px rgba(248, 113, 113, 0.4)' 
                : '0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A'
            }}
            aria-label="Dislike"
          >
            <X
              size={20}
              className={isDisliked
                ? "text-red-500 font-bold"
                : "text-red-500"}
              strokeWidth={isDisliked ? 2.5 : 2}
            />
          </button>
          <button
            onClick={handleLike}
            className={`rounded-full w-10 h-10 flex items-center justify-center
            transition-all duration-200
            ${isLiked
              ? 'bg-green-100 ring-2 ring-green-400 transform scale-110'
              : 'bg-[#FAFAFA] hover:bg-gray-100'}`}
            style={{
              boxShadow: isLiked 
                ? '0 0 0 2px rgba(74, 222, 128, 0.4), 0 0 8px rgba(74, 222, 128, 0.4)' 
                : '0px 1px 3px 0px #0000001A, 0px 1px 2px -1px #0000001A'
            }}
            aria-label="Like"
          >
            <Heart
              size={20}
              className={isLiked
                ? "text-green-500 fill-green-500"
                : "text-green-500"}
              strokeWidth={isLiked ? 2.5 : 2}
            />
          </button>
        </div>
      </div>

      {/* Image section */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex justify-center mb-8"
      >
        <div className="w-60 h-60 rounded-full border-2 border-blue-100 bg-white flex items-center justify-center relative overflow-hidden">
          {aura?.imageUrl && !imageError ? (
            <div className="w-52 h-52 relative rounded-full overflow-hidden">
              <Image
                src={aura.imageUrl}
                alt={aura.name}
                fill
                className="object-contain"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, 240px"
                unoptimized
              />
            </div>
          ) : (
            <span className="text-3xl font-semibold text-blue-500 text-center px-2">
              {aura?.name}
            </span>
          )}
        </div>
      </motion.div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#363430] mb-3">{aura?.name}</h2>
        <div className="w-60 h-1 bg-purple-300 mx-auto rounded-full mb-6"></div>

        <p className="text-[#363430] text-base mb-6 text-left">
          {aura?.info}
        </p>

        {aura?.claimToFame && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#9C9A96] text-left">Claim to fame</h3>
            <p className="text-[#363430] mt-2 text-left">
              {aura.claimToFame}
            </p>
          </div>
        )}

        {auraScore !== null && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#9C9A96] mb-2 text-left">Aura Score:</h3>

            <div className="bg-[#F2FEF3] rounded-lg p-4 relative overflow-hidden">
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
      </div>
    </motion.div>
  );
}