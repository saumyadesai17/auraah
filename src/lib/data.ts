export interface Aura {
  id: string;
  name: string;
  type: 'person' | 'place' | 'brand';
  auraColor: string; // Hex color or Tailwind color class
  info: string;
  imageUrl?: string; // Optional image for the card
}

export interface Tag {
  id: string;
  name: string;
  type: 'person' | 'place' | 'brand';
  auraId: string; // ID of the corresponding Aura
}

export const mockAuras: Aura[] = [
  // Person
  { id: 'aura1', name: 'Elon Musk', type: 'person', auraColor: 'bg-red-500', info: 'Innovator and entrepreneur.' },
  { id: 'aura2', name: 'Wonder Woman', type: 'person', auraColor: 'bg-yellow-500', info: 'Amazonian Princess.' },
  { id: 'aura3', name: 'Albert Einstein', type: 'person', auraColor: 'bg-orange-500', info: 'Theoretical physicist and genius.' },
  { id: 'aura4', name: 'Tony Stark', type: 'person', auraColor: 'bg-rose-500', info: 'Genius billionaire in a suit of armor.' },
  { id: 'aura5', name: 'Oprah Winfrey', type: 'person', auraColor: 'bg-pink-500', info: 'Media mogul and philanthropist.' },
  { id: 'aura6', name: 'Darth Vader', type: 'person', auraColor: 'bg-gray-800', info: 'The dark lord of the Sith.' },
  { id: 'aura7', name: 'Mahatma Gandhi', type: 'person', auraColor: 'bg-green-200', info: 'Leader of nonviolent resistance.' },
  { id: 'aura8', name: 'Harry Potter', type: 'person', auraColor: 'bg-indigo-400', info: 'The boy who lived.' },
  { id: 'aura9', name: 'Beyoncé', type: 'person', auraColor: 'bg-fuchsia-500', info: 'Global music icon and performer.' },
  { id: 'aura10', name: 'Sherlock Holmes', type: 'person', auraColor: 'bg-slate-600', info: 'Fictional detective known for logic and deduction.' },

  // Place
  { id: 'aura11', name: 'Paris', type: 'place', auraColor: 'bg-blue-500', info: 'The city of lights.' },
  { id: 'aura12', name: 'Hogwarts', type: 'place', auraColor: 'bg-purple-500', info: 'School of Witchcraft and Wizardry.' },
  { id: 'aura13', name: 'New York', type: 'place', auraColor: 'bg-cyan-500', info: 'The Big Apple.' },
  { id: 'aura14', name: 'Wakanda', type: 'place', auraColor: 'bg-emerald-600', info: 'Fictional African nation rich in vibranium.' },
  { id: 'aura15', name: 'Mount Everest', type: 'place', auraColor: 'bg-blue-800', info: 'Highest peak on Earth.' },
  { id: 'aura16', name: 'Atlantis', type: 'place', auraColor: 'bg-sky-400', info: 'Mythical underwater city.' },
  { id: 'aura17', name: 'Tokyo', type: 'place', auraColor: 'bg-pink-400', info: 'Vibrant capital of Japan.' },
  { id: 'aura18', name: 'Narnia', type: 'place', auraColor: 'bg-indigo-300', info: 'Magical world beyond the wardrobe.' },
  { id: 'aura19', name: 'Amazon Rainforest', type: 'place', auraColor: 'bg-green-600', info: 'Lungs of the planet.' },
  { id: 'aura20', name: 'Gotham City', type: 'place', auraColor: 'bg-gray-900', info: 'Dark, crime-ridden home of Batman.' },

  // Brand
  { id: 'aura21', name: 'Apple', type: 'brand', auraColor: 'bg-gray-300', info: 'Technology giant.' },
  { id: 'aura22', name: 'Nike', type: 'brand', auraColor: 'bg-green-500', info: 'Just Do It.' },
  { id: 'aura23', name: 'Google', type: 'brand', auraColor: 'bg-yellow-300', info: 'Search engine and tech leader.' },
  { id: 'aura24', name: 'Coca-Cola', type: 'brand', auraColor: 'bg-red-700', info: 'Iconic soft drink brand.' },
  { id: 'aura25', name: 'Tesla', type: 'brand', auraColor: 'bg-black', info: 'Electric vehicles and energy innovation.' },
  { id: 'aura26', name: 'Disney', type: 'brand', auraColor: 'bg-blue-300', info: 'Magic and storytelling.' },
  { id: 'aura27', name: 'Netflix', type: 'brand', auraColor: 'bg-red-600', info: 'Streaming entertainment platform.' },
  { id: 'aura28', name: 'LEGO', type: 'brand', auraColor: 'bg-yellow-400', info: 'Creative building blocks.' },
  { id: 'aura29', name: 'McDonald’s', type: 'brand', auraColor: 'bg-amber-500', info: 'Fast food giant.' },
  { id: 'aura30', name: 'SpaceX', type: 'brand', auraColor: 'bg-gray-700', info: 'Space exploration company.' },
];

export const mockTags: Tag[] = mockAuras.map((aura, index) => ({
  id: `tag${index + 1}`,
  name: aura.name,
  type: aura.type,
  auraId: aura.id,
}));

export const getAuraById = (id: string): Aura | undefined => mockAuras.find(aura => aura.id === id);

export const getTagsByType = (type: 'person' | 'place' | 'brand'): Tag[] =>
  mockTags.filter(tag => tag.type === type);

export const getTagById = (id: string): Tag | undefined =>
  mockTags.find(tag => tag.id === id);

// Function to get "similar" tags - for now, just returns other tags of the same type, excluding the current one
export const getSimilarTags = (currentTagId: string, type: 'person' | 'place' | 'brand'): Tag[] => {
  return mockTags.filter(tag => tag.type === type && tag.id !== currentTagId).slice(0, 5);
};
