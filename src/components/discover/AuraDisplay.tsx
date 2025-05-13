import { Aura } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, JSX } from 'react';
import {
  User,
  BookOpen,
  MapPin,
  BadgeCent,
  Package
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

  useEffect(() => {
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }
  }, [aura?.name, providedScore]);

  // Display the type label with proper capitalization
  const getTypeDisplay = (type: string) => {
    if (!type) return 'Thing';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  if (!aura) {
    return <p className="text-center text-red-600 p-4">Aura not found.</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${satoshi.className} flex flex-col p-6 rounded-lg bg-white`}
      style={{
        boxShadow:
          '-2px -2px 16px 0px #95EE933D, 0px 2px 12px 0px #E99DF766, 0px 8px 16px 0px #89D6E83D'
      }}
    >
      {/* Type indicator */}
      <div className="self-start mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-gray-700 text-sm font-bold border border-[#A193F2]">
          {getTypeIcon(aura.type)}
          {getTypeDisplay(aura.type)}
        </span>
      </div>

      {/* Aura circle */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="flex justify-center"
      >
        <div className="w-60 h-60 rounded-full border-2 border-blue-100 bg-white flex items-center justify-center relative overflow-hidden shadow-inner">
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

      {/* Name and details - exact match to reference image */}
      <div className="text-center mt-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{aura?.name}</h2>
        <div className="w-60 h-1 bg-purple-300 mx-auto rounded-full mb-6"></div>

        {/* General description from API */}
        <p className="text-gray-600 text-base mb-6 text-left">
          {aura?.info}
        </p>

        {/* Claim to fame section - styled exactly as in reference */}
        {aura?.claimToFame && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 text-left">Claim to fame</h3>
            <p className="text-gray-700 mt-2 text-left">
              {aura.claimToFame}
            </p>
          </div>
        )}

        {/* Aura Score - styled to match reference image */}
        {auraScore !== null && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-500 mb-2 text-left">Aura Score:</h3>

            {/* Score with reason in green background box */}
            <div className="bg-[#F2FEF3] rounded-lg p-4 relative overflow-hidden">
              {/* Left border gradient */}
              <div className="absolute left-0 top-0 h-full w-[2px]"
                style={{
                  background: 'linear-gradient(180deg, #9AEB9B 0%, #71D8E9 32.13%, #A6AEFF 64.26%, #FE9399 97.37%)'
                }}>
              </div>

              {/* Score display and reason in flex layout */}
              <div className="flex items-center">
                {/* Score section */}
                <div className="flex items-center mr-4">
                  <BsStars className="mr-2 text-gray-800 text-xl" />
                  <span className="font-bold text-gray-800 text-3xl">{auraScore}</span>
                </div>

                {/* Aura reason */}
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