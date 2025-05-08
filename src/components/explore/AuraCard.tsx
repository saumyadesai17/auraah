// Update the AuraCard component to include action buttons

import { Aura } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';

interface AuraCardProps {
  aura: Aura;
  onLike?: () => void;
  onDislike?: () => void;
  disableActions?: boolean;
}

export default function AuraCard({ aura, onLike, onDislike, disableActions = false }: AuraCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-custom-border relative">
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
          <div className="animate-pulse w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-gray-700" />
          <div className="animate-pulse h-6 bg-gray-700 rounded w-40 mt-5" />
          <div className="animate-pulse h-4 bg-gray-700 rounded w-3/4 mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-custom-border relative">
      <div className={`absolute inset-0 ${aura.auraColor} opacity-30`} />
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      
      <div className="relative h-full flex flex-col items-center justify-between p-6 z-10">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <div className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full ${aura.auraColor} 
                         flex items-center justify-center mb-5 shadow-2xl relative overflow-hidden
                         border-4 border-custom-border/30`}>
            {aura.imageUrl ? (
              <img 
                src={aura.imageUrl} 
                alt={aura.name} 
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <span className="text-2xl font-bold text-white mix-blend-overlay p-2 text-center">{aura.name}</span>
            )}
          </div>
          
          <h3 className="text-2xl font-bold text-amethyst mb-2">{aura.name}</h3>
          <p className="text-base text-eggshell text-center max-w-[85%]">{aura.info}</p>
        </div>
        
        {/* Action buttons inside card footer */}
        <div className="w-full pt-5 mt-2 border-t border-custom-border/30">
          <div className="flex justify-center gap-8 mt-2">
            {onDislike && (
              <button
                onClick={onDislike}
                disabled={disableActions}
                className="p-3 bg-gray-700/70 rounded-full text-red-400 hover:bg-red-500 hover:text-white
                         transition-colors duration-300"
                aria-label="Dislike"
              >
                <X size={24} />
              </button>
            )}
            {onLike && (
              <button
                onClick={onLike}
                disabled={disableActions}
                className="p-3 bg-gray-700/70 rounded-full text-green-400 hover:bg-green-500 hover:text-white
                         transition-colors duration-300"
                aria-label="Like"
              >
                <Heart size={24} />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-custom-border/30 text-xs font-medium text-tropical-indigo capitalize">
              {aura.type}
            </span>
            <span className="text-xs text-ash-gray">
              Swipe to explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 