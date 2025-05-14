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
    // The parent div in (tabs)/layout.tsx now handles bg-white and border-t
    <nav className="w-full"> {/* Removed fixed positioning, bg, border, shadow as it's handled by parent */}
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
                           (item.href === '/discover' && pathname.startsWith('/discover')) ||
                           (item.href === '/explore' && pathname.startsWith('/explore')) ||
                           (item.href === '/interests' && pathname.startsWith('/interests'));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1 w-1/3 h-full
                transition-colors duration-200
                ${isActive ? 'text-[#816FE9]' : 'text-[#9C9A96] hover:text-[#816FE9]'}`}
            >
              {/* Removed background div around icon for cleaner look */}
              <item.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span className={`mt-1 text-xs 
                ${isActive ? 'font-medium text-[#816FE9]' : 'font-normal text-[#9C9A96]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}