export function getAuraColor(type: 'person' | 'fictional character' | 'place' | 'brand' | 'thing'): string {
  switch (type) {
    case 'person':
      return 'bg-primary/80';
    case 'fictional character':
      return 'bg-purple-500/80';
    case 'place':
      return 'bg-secondary/80';
    case 'brand':
      return 'bg-accent/80';
    case 'thing':
      return 'bg-blue-500/80';
    default:
      return 'bg-primary/80';
  }
}

export function getEntityType(description?: string): 'person' | 'place' | 'brand' {
  if (!description) return 'brand';
  const desc = description.toLowerCase();
  if (desc.includes('person')) return 'person';
  if (desc.includes('place')) return 'place';
  return 'brand';
}