import Image from 'next/image';
import { lato } from '@/fonts/lato';

interface CardItem {
    id: string;
    name: string;
    type?: string;
    imageUrl: string;
    icon?: React.ReactNode;
}

interface HorizontalCardListProps {
    title: string;
    subtitle?: string;
    items: CardItem[];
    onItemClick: (item: CardItem) => void;
    getTypeIcon?: (item: CardItem) => React.ReactNode;
}

export default function HorizontalCardList({
    title,
    subtitle,
    items,
    onItemClick,
    getTypeIcon,
}: HorizontalCardListProps) {
    return (
        <div className="mb-10">
            {subtitle && (
                <div className="text-sm text-[#696763] font-medium mb-1 px-1">{subtitle}</div>
            )}
            <h2 className="text-lg font-bold text-[#363430] mb-6 px-1">{title}</h2>
            <div className="flex overflow-x-auto gap-5 pb-2 scrollbar-hide">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => onItemClick(item)}
                        className="w-[250px] cursor-pointer flex-shrink-0"
                    >
                        <div
                            className="relative rounded-2xl overflow-hidden bg-white w-[250px] h-[180px]"
                            style={{
                                boxShadow: `
                -2px -2px 8px 0px #95EE932B,
                0px 2px 8px 0px #E99DF726,
                0px 8px 10px 0px #89D6E81A
              `
                            }}
                        >
                            <Image
                                src={`/api/image-proxy?url=${encodeURIComponent(item.imageUrl)}&width=250&quality=90`}
                                alt={item.name}
                                fill
                                sizes="250px"
                                className="object-cover rounded-2xl transition-opacity duration-700"
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
                            <div
                                className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-12 rounded-b-2xl"
                                style={{
                                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.8) 100%)',
                                    backdropFilter: 'blur(0.5px)'
                                }}
                            >
                                <p className="text-white text-2xl font-bold drop-shadow-md">{item.name}</p>
                                {item.type && (
                                    <div className={`${lato.className} flex items-center text-white text-md font-medium drop-shadow`}>
                                        {getTypeIcon && getTypeIcon(item)}
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}