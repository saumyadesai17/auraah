"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function InterestsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="page-container flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center px-4 max-w-md"
      >
        {/* Animated illustration */}
        <motion.div 
          className="relative w-64 h-64 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Galaxy/Interest Orbit Animation */}
          <motion.div className="absolute inset-0 flex items-center justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-secondary opacity-30"
                style={{
                  width: `${(i + 3) * 30}px`,
                  height: `${(i + 3) * 30}px`,
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { duration: 10 + i * 4, ease: "linear", repeat: Infinity },
                  scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                }}
              />
            ))}
            
            {/* Floating interest bubbles */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full shadow-lg flex items-center justify-center"
                style={{
                  width: `${Math.random() * 20 + 20}px`,
                  height: `${Math.random() * 20 + 20}px`,
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                }}
                animate={{
                  x: Math.sin(i * 1.5) * 60,
                  y: Math.cos(i * 1.5) * 60,
                  scale: 1,
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.5,
                }}
              >
                <motion.div 
                  className={`w-full h-full rounded-full ${i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-secondary' : 'bg-accent'}`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
            
            {/* Central element */}
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-secondary to-accent shadow-lg flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 10px rgba(161, 124, 255, 0.4)",
                  "0 0 20px rgba(255, 126, 179, 0.6)",
                  "0 0 10px rgba(161, 124, 255, 0.4)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 1 1-4-4" />
                <path d="M18 2a10 10 0 1 0 10 10 4 4 0 1 1-4-4" />
              </motion.svg>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title with animated underline */}
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-accent mb-4">
          Interests
        </h1>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 1.5 }}
          className="h-1 bg-gradient-to-r from-secondary to-accent rounded-full mb-6"
        />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl font-medium text-foreground mb-2"
        >
          Coming Soon
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-md text-muted-foreground"
        >
          We&apos;re crafting a personalized interest discovery experience just for you. 
          Soon you&apos;ll explore topics tailored to your unique preferences and connect 
          with others who share your passions.
        </motion.p>

        {/* Animated dots */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
          className="mt-8 flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                backgroundColor: [
                  "var(--primary)",
                  "var(--secondary)",
                  "var(--accent)"
                ]
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.3,
                },
                backgroundColor: {
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }
              }}
              className="w-3 h-3 rounded-full bg-primary"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}