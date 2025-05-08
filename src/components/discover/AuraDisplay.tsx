import { Aura } from '@/lib/data';
import { motion } from 'framer-motion';

interface AuraDisplayProps {
  aura: Aura | undefined;
}

export default function AuraDisplay({ aura }: AuraDisplayProps) {
  if (!aura) {
    return <p className="text-center text-red-400">Aura not found.</p>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center p-6 rounded-lg shadow-primary bg-gray-800/80 border border-custom-border"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full ${aura.auraColor} 
                  flex items-center justify-center mb-5 shadow-primary relative overflow-hidden`}
      >
        {aura.imageUrl ? (
          <img src={aura.imageUrl} alt={aura.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-white mix-blend-overlay p-2 text-center">{aura.name}</span>
        )}
      </motion.div>
      <h2 className="text-2xl font-bold mb-2 text-amethyst">{aura.name}</h2>
      <p className="text-custom-text-secondary text-center max-w-md">{aura.info}</p>
    </motion.div>
  );
}