import TagGroup from '@/components/discover/TagGroup';
import { getTagsByType } from '@/lib/data';

export default function DiscoverPage() {
  const peopleTags = getTagsByType('person');
  const placesTags = getTagsByType('place');
  const brandsTags = getTagsByType('brand');

  return (
    <div className="page-container space-y-6">
      <h1 className="h1-title">Discover Auras</h1>
      <TagGroup title="People" tags={peopleTags} />
      <TagGroup title="Places" tags={placesTags} />
      <TagGroup title="Brands" tags={brandsTags} />
    </div>
  );
}