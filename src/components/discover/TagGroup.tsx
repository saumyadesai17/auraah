import { Tag } from '@/lib/data';
import TagButton from '@/components/discover/TagButton';

interface TagGroupProps {
  title: string;
  tags: Tag[];
}

export default function TagGroup({ title, tags }: TagGroupProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <section className="animate-fade-in">
      <h2 className="text-xl font-semibold mb-3 text-amethyst">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div key={tag.id}>
            <TagButton tag={tag} />
          </div>
        ))}
      </div>
    </section>
  );
}