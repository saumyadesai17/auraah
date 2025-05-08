'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/discover', label: 'Discover', icon: Search },
  { href: '/interests', label: 'Interests', icon: Sparkles },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md 
                   bg-raisin-black border border-custom-border 
                   rounded-xl shadow-primary z-50">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/discover' && pathname.startsWith('/discover/'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 w-1/3 h-full
                transition-colors duration-200
                ${isActive ? 'text-amethyst' : 'text-ash-gray hover:text-eggshell'}`}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-amethyst/10' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`mt-1 text-xs font-medium
                ${isActive ? 'text-amethyst font-semibold' : 'text-ash-gray'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}