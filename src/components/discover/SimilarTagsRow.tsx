import { Tag } from '@/lib/data';
import TagButton from '@/components/discover/TagButton';

interface SimilarTagsRowProps {
  tags: Tag[];
  currentTagId?: string;
  highlightedType?: string;
}

export default function SimilarTagsRow({ tags, currentTagId, highlightedType }: SimilarTagsRowProps) {
  if (!tags || tags.length === 0) {
    return <p className="text-center text-custom-text-secondary mt-4">No similar auras found.</p>;
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-semibold text-tropical-indigo">Similar Auras</h3>
        
        {/* Tag count indicator */}
        <span className="text-xs bg-tropical-indigo/10 text-tropical-indigo px-2 py-1 rounded-full">
          {tags.length} {tags.length === 1 ? 'tag' : 'tags'}
        </span>
      </div>

      {/* Using flex-wrap for a responsive layout on all screen sizes */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id} className="flex-shrink-0">
            <TagButton 
              tag={tag} 
              isActive={tag.id === currentTagId}
              highlight={tag.type === highlightedType} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}