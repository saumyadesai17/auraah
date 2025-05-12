'use client';

import SwipeableCardStack from '@/components/explore/SwipeableCardStack';
import { satoshi } from '@/fonts/satoshi';
import { motion } from 'framer-motion';

export default function ExplorePage() {
  return (
    <div className={`${satoshi.className} page-container flex flex-col items-center justify-start min-h-[calc(100vh-80px)] max-h-screen pt-6 pb-16 px-4 overflow-hidden bg-white`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Discover Your Aura
        </h1>
        <p className="text-gray-600 text-sm mt-2 max-w-xs mx-auto">
          Swipe right if you feel a connection, left if you don&apos;t
        </p>
      </motion.div>
      
      {/* Card stack container with fixed height */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full flex-1 overflow-hidden flex flex-col"
      >
        <SwipeableCardStack />
      </motion.div>
    </div>
  );
}