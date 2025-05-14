//src/components/explore/AuraCard.tsx

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

export default function AuraCard({ aura, auraScore: providedScore, auraReason }: AuraDisplayProps) {
  const [auraScore, setAuraScore] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }
  }, [providedScore]);

  // Display the type label with proper capitalization
  const getTypeDisplay = (type: string) => {
    if (!type) return 'Thing';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (!aura) {
    return <p className="text-center text-red-600 p-4">Aura not found.</p>;
  }

  return (
    <div className={`${satoshi.className} flex flex-col p-4 h-full`}>
      {/* Card counter at the top */}
      <div className="flex justify-between mb-6">
        {/* Type indicator in a pill */}
        <div className="self-start">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-[#A193F2] text-sm font-medium border border-[#A193F2] bg-white">
            {getTypeIcon(aura.type)}
            {getTypeDisplay(aura.type)}
          </span>
        </div>
        
        {/* Card counter - moved from parent component */}
        <span className="text-zinc-400 text-sm">1/30</span>
      </div>

      {/* Image section - centered circular image */}
      <div className="flex justify-center mb-8">
        <div className="w-60 h-60 rounded-full overflow-hidden relative bg-gray-100">
          {aura?.imageUrl && !imageError ? (
            <Image
              src={aura.imageUrl}
              alt={aura.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
              sizes="240px"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-semibold text-gray-400">
                {aura?.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Title and gradient line */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-zinc-800 mb-3">{aura?.name}</h2>
        <div className="w-full h-1 bg-gradient-to-r from-purple-400 to-blue-300 mx-auto rounded-full"></div>
      </div>

      {/* Description text */}
      <div className="mb-8">
        <p className="text-zinc-700 text-base">
          {aura?.info}
        </p>
      </div>

      {/* Claim to fame section */}
      {aura?.claimToFame && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Claim to fame</h3>
          <p className="text-zinc-700">
            {aura.claimToFame}
          </p>
        </div>
      )}

      {/* Aura Score section */}
      {auraScore !== null && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Aura Score:</h3>

          <div className="bg-[#F8FEF8] rounded-lg p-4 relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 h-full w-1"
              style={{
                background: 'linear-gradient(180deg, #9AEB9B 0%, #71D8E9 32.13%, #A6AEFF 64.26%, #FE9399 97.37%)'
              }}>
            </div>

            <div className="flex items-start">
              <div className="flex items-center mr-4">
                <BsStars className="mr-2 text-zinc-800 text-2xl" />
                <span className="font-bold text-zinc-800 text-3xl">{auraScore}</span>
              </div>

              {auraReason && (
                <p className="text-zinc-600 text-sm leading-relaxed flex-1">
                  {auraReason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action buttons - moved to parent component */}
      <div className="flex-grow"></div> {/* Spacer to push content up */}
    </div>
  );
}