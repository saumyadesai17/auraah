'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { satoshi } from '@/fonts/satoshi';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Short delay to show the welcome screen before redirecting
    const redirectTimer = setTimeout(() => {
      router.push('/explore'); // Using push instead of replace
    }, 3000);
    
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]); // Only depend on router when needed
  
  return (
    <div className={`${satoshi.className} page-container bg-gradient-to-br from-white to-blue-50 min-h-screen flex flex-col items-center justify-center p-4`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Welcome to Auraah
        </h1>
        <p className="text-lg text-gray-600">
          Discover people, places, brands, and more
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-28 h-28 rounded-full border-2 border-purple-200 bg-white flex items-center justify-center relative overflow-hidden shadow-lg mb-10 p-3"
      >
        <Image 
          src="/logo.png" 
          alt="Auraah Logo" 
          width={80} 
          height={80}
          priority
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex items-center text-gray-600"
      >
        <p className="text-sm font-medium">Redirecting you</p>
        <motion.span 
          className="ml-2"
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <ArrowRight size={16} />
        </motion.span>
      </motion.div>
      
      <motion.div 
        initial={{ width: "0%" }}
        animate={{ width: "200px" }}
        transition={{ delay: 0.6, duration: 2.2 }}
        className="h-1.5 bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-500 rounded-full mt-6 shadow-sm"
      />
    </div>
  );
}