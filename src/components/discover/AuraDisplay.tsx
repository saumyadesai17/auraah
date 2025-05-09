import { Aura } from '@/lib/data';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AuraDisplayProps {
  aura: Aura | undefined;
  auraScore?: number;
  auraReason?: string;
}

export default function AuraDisplay({ aura, auraScore: providedScore }: AuraDisplayProps) {
  const [auraScore, setAuraScore] = useState<number | null>(null);

  useEffect(() => {
    // If a score is provided, use it. Otherwise generate a random one
    if (providedScore !== undefined) {
      setAuraScore(providedScore);
    } else {
      // Generate random score only on the client side
      setAuraScore(Math.floor(Math.random() * 50) + 50);
    }
  }, [aura?.name, providedScore]); // Regenerate when aura changes

  if (!aura) {
    return <p className="text-center text-destructive">Aura not found.</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 p-6 rounded-xl 
                bg-card/60 backdrop-blur-sm border border-border/40"
    >
      {/* Type indicator */}
      <div className="self-start">
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted/80 text-muted-foreground text-sm font-medium">
          <span className="mr-2 h-2 w-2 rounded-full bg-primary"></span>
          {aura.type.charAt(0).toUpperCase() + aura.type.slice(1)}
        </span>
      </div>
      
      {/* Aura circle */}
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative"
      >
        <div className={`w-52 h-52 rounded-full ${aura.auraColor || 'bg-primary/30'} 
                      flex items-center justify-center overflow-hidden
                      border-4 border-background/40`}
        >
          {aura.imageUrl ? (
            <Image src={aura.imageUrl} alt={aura.name} fill className="object-cover" />
          ) : (
            <span className="text-3xl font-semibold text-primary-foreground opacity-90 text-center">
              {aura.name}
            </span>
          )}
        </div>
      </motion.div>
      
      {/* Name and details */}
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground">{aura.name}</h2>
        <p className="text-muted-foreground">{aura.info}</p>
        
        {/* Additional sections like in the image */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <h3 className="text-base font-medium text-foreground mb-3">Claim to fame</h3>
          <p className="text-muted-foreground text-sm">
            {aura.info}
          </p>
        </div>
        
        {/* Aura Score */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-foreground mb-2">Aura Score:</h3>
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-border">
            <span className="mr-2 text-xs">⚡</span>
            <span className="font-bold">{auraScore !== null ? auraScore : '—'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}