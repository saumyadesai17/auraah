import { Aura } from '@/lib/data';
import { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import Image from 'next/image';

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

  // Loading state
if (!isMounted) {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-border relative">
      <div className="absolute inset-0 bg-background/80" />
      <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
        <div className="animate-pulse w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-muted" />
        <div className="animate-pulse h-6 bg-muted rounded w-40 mt-5" />
        <div className="animate-pulse h-4 bg-muted rounded w-3/4 mt-4" />
      </div>
    </div>
  );
}

// Main UI
return (
  <div className="w-full h-full rounded-xl overflow-hidden shadow-xl border border-border relative">
    <div className={`absolute inset-0 ${aura.auraColor} opacity-30`} />
    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
    
    <div className="relative h-full flex flex-col items-center justify-between p-6 z-10">
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <div className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full ${aura.auraColor} 
                       flex items-center justify-center mb-5 shadow-2xl relative overflow-hidden
                       border-4 border-border/30`}>
          {typeof aura.imageUrl === 'string' && aura.imageUrl.trim() !== '' ? (
            <Image 
              src={aura.imageUrl} 
              alt={aura.name} 
              layout="fill"
              objectFit="cover"
              className="rounded-full"
              priority
            />
          ) : (
            <span className="text-2xl font-bold text-foreground mix-blend-overlay p-2 text-center">{aura.name}</span>
          )}
        </div>
        
        <h3 className="text-2xl font-bold text-secondary mb-2">{aura.name}</h3>
        <p className="text-base text-foreground text-center max-w-[85%]">{aura.info}</p>
      </div>
      
      {/* Action buttons inside card footer */}
      <div className="w-full pt-5 mt-2 border-t border-border/30">
        <div className="flex justify-center gap-8 mt-2">
          {onDislike && (
            <button
              onClick={onDislike}
              disabled={disableActions}
              className="p-3 bg-card/70 rounded-full text-destructive hover:bg-destructive hover:text-card-foreground
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
              className="p-3 bg-card/70 rounded-full text-primary hover:bg-primary hover:text-primary-foreground
                       transition-colors duration-300"
              aria-label="Like"
            >
              <Heart size={24} />
            </button>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="inline-block px-3 py-1 rounded-full bg-border/30 text-xs font-medium text-ring capitalize">
            {aura.type}
          </span>
          <span className="text-xs text-muted-foreground">
            Swipe to explore
          </span>
        </div>
      </div>
    </div>
  </div>
);
}