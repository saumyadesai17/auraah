'use client';

import { useState, useEffect } from 'react';
import TrendingTopicsSection from '@/components/recommended/TrendingTopicsSection';
import HorizontalCardList from '@/components/recommended/HorizontalCardList';
import GridCardSection from '@/components/recommended/GridCardSection';
import { MapPin, Heart, User, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import auraResponsesJson from '@/lib/auraResponses.json';
import { satoshi } from '@/fonts/satoshi';

// Define trending topics that match the UI in page3.jpg
const trendingTopicsData = [
  { id: 'trend-1', title: 'Innovations in Technology', count: '12k' },
  { id: 'trend-2', title: 'Trends in Eco-Friendly Living', count: '20k' },
  { id: 'trend-3', title: 'Choices for a Healthier Life', count: '11k' },
  { id: 'trend-4', title: 'Must-Visit Travel Spots for 2023', count: '15k' },
  { id: 'trend-5', title: 'Effective Workout Routines', count: '17k' },
  { id: 'trend-6', title: 'Practices for Mindfulness and Calm', count: '18k' },
  { id: 'trend-7', title: 'Fashion Styles to Keep an Eye On', count: '10k' },
  { id: 'trend-8', title: 'Movies Coming Soon', count: '13k' },
  { id: 'trend-9', title: 'Favorite Recipes to Try', count: '10k' },
  { id: 'trend-10', title: 'Winning Strategies for Gamers', count: '14k' }
];

type AuraItem = {
  id: string;
  name: string;
  type?: string;
  imageUrl: string;
};

// Cast auraResponsesJson to the appropriate type
const auraImages = auraResponsesJson as Array<{
  name?: string;
  type?: string;
  imageUrl: string;
}>;

const getJapanItems = () => {
  const japanCityNames = ['Kyoto', 'Osaka', 'Hiroshima'];
  return auraImages
    .filter(
      (item) =>
        item.type === 'place' &&
        item.name &&
        japanCityNames.includes(item.name)
    )
    .map((item, index) => ({
      id: `japan-${index}`,
      name: item.name!, // Non-null assertion, safe because of filter
      type: item.type,
      imageUrl: item.imageUrl,
    }));
};

// Repeat for other get*Items functions:
const getDetectiveItems = () => {
  const detectiveNames = ['Detective Conan', 'Moriarty', 'John Watson'];
  return auraImages
    .filter(
      (item) =>
        item.type === 'fictional character' &&
        item.name &&
        detectiveNames.some(
          (detective) => item.name?.toLowerCase() === detective.toLowerCase()
        )
    )
    .map((item, index) => ({
      id: `detective-${index}`,
      name: item.name!, // Non-null assertion
      type: item.type,
      imageUrl: item.imageUrl,
    }));
};

const getPeopleItems = () => {
  return auraImages
    .filter(
      (item) =>
        (item.type === 'person' ||
          item.type === 'real person' ||
          item.type === 'fictional character') &&
        item.name
    )
    .map((item, index) => ({
      id: `person-${index}`,
      name: item.name!, // Non-null assertion
      type: item.type,
      imageUrl: item.imageUrl,
    }));
};

const getCityItems = () => {
  return auraImages
    .filter((item) => item.type === 'place' && item.name)
    .map((item, index) => ({
      id: `city-${index}`,
      name: item.name!, // Non-null assertion
      type: item.type,
      imageUrl: item.imageUrl,
    }));
};

const getThingItems = () => {
  return auraImages
    .filter((item) => item.type === 'thing' && item.name)
    .map((item, index) => ({
      id: `thing-${index}`,
      name: item.name!, // Non-null assertion
      type: item.type,
      imageUrl: item.imageUrl,
    }));
};

export default function RecommendedContent() {
  const router = useRouter();

  const [trending] = useState(trendingTopicsData);
  const [tokyoItems, setTokyoItems] = useState<AuraItem[]>([]);
  const [sherlockItems, setSherlockItems] = useState<AuraItem[]>([]);
  const [people, setPeople] = useState<AuraItem[]>([]);
  const [cities, setCities] = useState<AuraItem[]>([]);
  const [things, setThings] = useState<AuraItem[]>([]);

  useEffect(() => {
    setTokyoItems(getJapanItems());
    setSherlockItems(getDetectiveItems());
    setPeople(getPeopleItems());
    setCities(getCityItems());
    setThings(getThingItems());
  }, []);

  const handleItemClick = (item: AuraItem) => {
  router.push(`/discover/search?q=${encodeURIComponent(item.name ?? '')}`);
};

const handleTrendingClick = (topic: { id: string; title: string; count: string }) => {
  router.push(`/discover/search?q=${encodeURIComponent(topic.title)}`);
};

  return (
    <div className={`${satoshi.className} w-full max-w-screen-md mx-auto bg-slate-50`}>
      <TrendingTopicsSection trending={trending} onTrendingClick={handleTrendingClick} />
      <HorizontalCardList
        title="Because You Searched For Tokyo"
        subtitle="You might be interested in these auras"
        items={tokyoItems}
        onItemClick={handleItemClick}
        getTypeIcon={(item) =>
          item.type === 'place' ? <MapPin size={14} className="text-white mr-1" /> : null
        }
      />
      <GridCardSection
        title="Recommended Places For You"
        icon={<MapPin size={22} className="text-[#816FE9] mr-2" />}
        items={[...cities].sort(() => Math.random() - 0.5).slice(0, 8)}
        onItemClick={handleItemClick}
      />
      <GridCardSection
        title="Recommended Brands For You"
        icon={<Heart size={22} className="text-[#FF7E6E] mr-2" />}
        items={[...things].sort(() => Math.random() - 0.5).slice(0, 8)}
        onItemClick={handleItemClick}
      />
      <HorizontalCardList
        title="Because You Liked Sherlock Holmes"
        subtitle="You might be interested in these auras"
        items={sherlockItems}
        onItemClick={handleItemClick}
        getTypeIcon={(item) =>
          item.type === 'fictional character' ? <User size={14} className="text-white mr-1" /> : null
        }
      />
      <GridCardSection
        title="Recommended People For You"
        icon={<User size={22} className="text-pink-500 mr-2" />}
        items={[...people].sort(() => Math.random() - 0.5).slice(0, 8)}
        onItemClick={handleItemClick}
      />
      <GridCardSection
        title="Recommended Things For You"
        icon={<Package size={22} className="text-blue-500 mr-2" />}
        items={[...things].sort(() => Math.random() - 0.5).slice(0, 8)}
        onItemClick={handleItemClick}
      />
    </div>
  );
}