export interface Aura {
  id: string;
  name: string;
  type: 'person' | 'fictional character' | 'place' | 'brand' | 'thing';
  auraColor: string; // Hex color or Tailwind color class
  info: string;
  imageUrl?: string; // Optional image for the card
  claimToFame?: string; // Specific claim to fame
  auraScore?: number; // Score from AI analysis
  auraReason?: string; // Reason for the score
  description?: string; // Description of the aura
  auraMeter?: number; // Score from 1 to 100
}

export interface Tag {
  id: string;
  name: string;
  type: 'person' | 'fictional character' | 'place' | 'brand' | 'thing';
  auraId: string; // ID of the corresponding Aura
}

export const mockAuras: Aura[] = [
  // Person
  { id: 'aura1', name: 'Elon Musk', type: 'person', auraColor: 'bg-accent', info: 'Innovator and entrepreneur.' },
  { id: 'aura2', name: 'Wonder Woman', type: 'person', auraColor: 'bg-primary/90', info: 'Amazonian Princess.' },
  { id: 'aura3', name: 'Albert Einstein', type: 'person', auraColor: 'bg-chart-5', info: 'Theoretical physicist and genius.' },
  { id: 'aura4', name: 'Tony Stark', type: 'person', auraColor: 'bg-accent/90', info: 'Genius billionaire in a suit of armor.' },
  { id: 'aura5', name: 'Oprah Winfrey', type: 'person', auraColor: 'bg-accent/80', info: 'Media mogul and philanthropist.' },
  { id: 'aura6', name: 'Darth Vader', type: 'person', auraColor: 'bg-background', info: 'The dark lord of the Sith.' },
  { id: 'aura7', name: 'Mahatma Gandhi', type: 'person', auraColor: 'bg-primary/70', info: 'Leader of nonviolent resistance.' },
  { id: 'aura8', name: 'Harry Potter', type: 'person', auraColor: 'bg-secondary/80', info: 'The boy who lived.' },
  { id: 'aura9', name: 'Beyoncé', type: 'person', auraColor: 'bg-accent/70', info: 'Global music icon and performer.' },
  { id: 'aura10', name: 'Sherlock Holmes', type: 'person', auraColor: 'bg-chart-3/80', info: 'Fictional detective known for logic and deduction.' },

  // Place
  { id: 'aura11', name: 'Paris', type: 'place', auraColor: 'bg-chart-3', info: 'The city of lights.' },
  { id: 'aura12', name: 'Hogwarts', type: 'place', auraColor: 'bg-secondary', info: 'School of Witchcraft and Wizardry.' },
  { id: 'aura13', name: 'New York', type: 'place', auraColor: 'bg-chart-3/80', info: 'The Big Apple.' },
  { id: 'aura14', name: 'Wakanda', type: 'place', auraColor: 'bg-primary/90', info: 'Fictional African nation rich in vibranium.' },
  { id: 'aura15', name: 'Mount Everest', type: 'place', auraColor: 'bg-chart-3/90', info: 'Highest peak on Earth.' },
  { id: 'aura16', name: 'Atlantis', type: 'place', auraColor: 'bg-chart-3/70', info: 'Mythical underwater city.' },
  { id: 'aura17', name: 'Tokyo', type: 'place', auraColor: 'bg-accent/80', info: 'Vibrant capital of Japan.' },
  { id: 'aura18', name: 'Narnia', type: 'place', auraColor: 'bg-secondary/60', info: 'Magical world beyond the wardrobe.' },
  { id: 'aura19', name: 'Amazon Rainforest', type: 'place', auraColor: 'bg-primary', info: 'Lungs of the planet.' },
  { id: 'aura20', name: 'Gotham City', type: 'place', auraColor: 'bg-background/90', info: 'Dark, crime-ridden home of Batman.' },

  // Brand
  { id: 'aura21', name: 'Apple', type: 'brand', auraColor: 'bg-card', info: 'Technology giant.' },
  { id: 'aura22', name: 'Nike', type: 'brand', auraColor: 'bg-primary/80', info: 'Just Do It.' },
  { id: 'aura23', name: 'Google', type: 'brand', auraColor: 'bg-chart-5/80', info: 'Search engine and tech leader.' },
  { id: 'aura24', name: 'Coca-Cola', type: 'brand', auraColor: 'bg-accent/90', info: 'Iconic soft drink brand.' },
  { id: 'aura25', name: 'Tesla', type: 'brand', auraColor: 'bg-background/80', info: 'Electric vehicles and energy innovation.' },
  { id: 'aura26', name: 'Disney', type: 'brand', auraColor: 'bg-chart-3/60', info: 'Magic and storytelling.' },
  { id: 'aura27', name: 'Netflix', type: 'brand', auraColor: 'bg-accent', info: 'Streaming entertainment platform.' },
  { id: 'aura28', name: 'LEGO', type: 'brand', auraColor: 'bg-chart-5/90', info: 'Creative building blocks.' },
  { id: 'aura29', name: "McDonald's", type: 'brand', auraColor: 'bg-chart-5', info: 'Fast food giant.' },
  { id: 'aura30', name: 'SpaceX', type: 'brand', auraColor: 'bg-card/90', info: 'Space exploration company.' },
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