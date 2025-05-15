import Image from 'next/image';

interface GridCardItem {
    id: string;
    name: string;
    imageUrl: string;
}

interface GridCardSectionProps {
    title: string;
    icon?: React.ReactNode;
    items: GridCardItem[];
    onItemClick: (item: GridCardItem) => void;
}

export default function GridCardSection({
    title,
    icon,
    items,
    onItemClick,
}: GridCardSectionProps) {
    return (
        <div className="mb-10">
            <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-lg font-bold text-[#363430]">{title}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="cursor-pointer"
                    >
                        <div
                            className="relative w-full min-w-[120px] h-[66px] rounded-2xl overflow-hidden bg-white"
                            style={{
                                boxShadow: `-2px -2px 8px 0px #95EE932B, 0px 2px 8px 0px #E99DF726, 0px 8px 10px 0px #89D6E81A`
                            }}
                        >
                            <Image
                                src={`/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}&width=192&quality=90`}
                                alt={item.name}
                                fill
                                sizes="192px"
                                className="object-cover"
                                quality={90}
                                style={{ opacity: 0 }}
                                onLoad={event => {
                                    const img = event.currentTarget;
                                    setTimeout(() => {
                                        img.style.opacity = '1';
                                    }, 50);
                                }}
                                loading="lazy"
                                priority={false}
                            />
                            {/* Blurred gradient overlay for text readability */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-2xl"
                                style={{
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 100%)',
                                    backdropFilter: 'blur(0.5px)'
                                }}>
                                <p className="text-white text-base font-semibold text-center px-2 drop-shadow-md">{item.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}