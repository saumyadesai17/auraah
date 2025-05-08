import SwipeableCardStack from '@/components/explore/SwipeableCardStack';

export default function ExplorePage() {
  return (
    <div className="page-container flex flex-col items-center justify-start min-h-full pt-6 pb-20 px-4">
      <div className="text-center mb-8">
        <h1 className="h1-title text-3xl font-bold bg-gradient-to-r from-amethyst to-tropical-indigo bg-clip-text text-transparent">
          Discover Your Aura
        </h1>
        <p className="text-ash-gray text-sm mt-2 max-w-xs mx-auto">
          Swipe right if you feel a connection, left if you don't
        </p>
      </div>
      <SwipeableCardStack />
    </div>
  );
}