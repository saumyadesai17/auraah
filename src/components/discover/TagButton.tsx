import Link from 'next/link';
import { Tag } from '@/lib/data';
import { User, MapPin, Heart } from 'lucide-react';
import { useEffect, useState } from 'react'; // Import useEffect and useState

interface TagButtonProps {
  tag: Tag;
}

export default function TagButton({ tag }: TagButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (type: Tag['type']) => {
    const iconProps = { size: 16, className: "mr-2" };
    switch(type) {
      case 'person':
        return <User {...iconProps} className={`${iconProps.className} text-purple-500`} />;
      case 'place':
        return <MapPin {...iconProps} className={`${iconProps.className} text-sky-500`} />;
      case 'brand': // Assuming 'brand' uses a Heart icon as per general category styling
        return <Heart {...iconProps} className={`${iconProps.className} text-red-500`} />;
      default:
        return <User {...iconProps} className={`${iconProps.className} text-gray-500`} />;
    }
  };
  
  if (!mounted) {
    // Return null or a placeholder to prevent rendering on the server or before client-side mount
    // This can help avoid hydration mismatches.
    // For a button, returning null is often acceptable if it's not critical for SSR.
    return null; 
  }

  // Ensure tag and tag.id are valid before using them
  if (!tag || typeof tag.id === 'undefined') {
    // Handle the case where tag or tag.id is not available
    // You might want to log an error or return a fallback UI
    console.error("Tag or tag.id is undefined in TagButton");
    return null; 
  }
  
  return (
    <Link
      href={`/discover/tag?id=${encodeURIComponent(tag.id)}`}
      className="flex items-center px-4 py-2 rounded-full 
                 bg-gray-100 hover:bg-gray-200 
                 text-gray-700 hover:text-gray-900
                 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
    >
      {getIcon(tag.type)}
      {tag.name}
    </Link>
  );
}