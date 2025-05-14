'use client';

import SwipeableCardStack from '@/components/explore/SwipeableCardStack';
import { satoshi } from '@/fonts/satoshi';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ExplorePage() {
  // Use state to hold dynamic height calculation
  const [containerHeight, setContainerHeight] = useState("calc(100vh - 230px)");

  // Calculate height on component mount and window resize
  useEffect(() => {
    const calculateHeight = () => {
      // Get header height (57px from layout.tsx) + title area height + bottom tab (+ padding)
      const headerHeight = 57; 
      const titleAreaHeight = 90; // Title section with margin
      const bottomTabHeight = 56; // Base height of bottom tab
      const bottomSpacing = 40;   // Added spacing between card and tab bar
      
      // Calculate available height
      const availableHeight = window.innerHeight - (headerHeight + titleAreaHeight + bottomTabHeight + bottomSpacing);
      setContainerHeight(`${availableHeight}px`);
    };
    
    // Calculate initially and on resize
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    // Clean up event listener and restore body scrolling when unmounted
    return () => {
      window.removeEventListener('resize', calculateHeight);
      document.body.style.overflow = '';
    };
  }, []);

  // Fix page layout issues in parent elements
  useEffect(() => {
    // Find the main element and prevent scrolling
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.classList.add('overflow-hidden');
    }
    
    return () => {
      if (mainElement) {
        mainElement.classList.remove('overflow-hidden');
      }
    };
  }, []);

  return (
    <div className={`${satoshi.className} w-full h-full flex flex-col items-center bg-white px-5`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center my-6 w-full flex-shrink-0"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Explore Auras
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Swipe right or left to interact
        </p>
      </motion.div>
      
      {/* Card stack container - with proper spacing */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full rounded-2xl border border-gray-50 flex-shrink-0 mb-6"
        style={{
          boxShadow: `-2px -2px 8px 0px #95EE932B, 0px 2px 8px 0px #E99DF726, 0px 8px 10px 0px #89D6E81A`,
          height: containerHeight // Dynamically calculated height
        }}
      >
        <SwipeableCardStack />
      </motion.div>
    </div>
  );
}