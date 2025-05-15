'use client';

import { TrendingUp } from 'lucide-react';

interface TrendingTopic {
    id: string;
    title: string;
    count: string;
}

interface TrendingTopicsSectionProps {
    trending: TrendingTopic[];
    onTrendingClick: (topic: TrendingTopic) => void;
}

export default function TrendingTopicsSection({ trending, onTrendingClick }: TrendingTopicsSectionProps) {
    return (
        <div className="w-full mb-14">
            <h2 className="text-xl font-bold mt-6 mb-8 text-[#363430] text-center">
                Trending Today On The Internet
            </h2>
            <div
                className="
                    flex flex-wrap gap-3 3xl:gap-6 w-full justify-center
                "
            >
                {trending.map((topic) => (
                    <div
                        key={topic.id}
                        onClick={() => onTrendingClick(topic)}
                        className="cursor-pointer mb-2"
                    >
                        <div
                            className="flex items-center rounded-full border-transparent bg-[linear-gradient(270deg,_#FEB778_0%,_#E09BFE_33%,_#7ED4EA_66%,_#D0FAD0_100%)] p-[1px]"
                            style={{
                                backgroundOrigin: 'border-box',
                            }}
                        >
                            <div className="flex items-center rounded-full px-4 py-2.5 bg-white">
                                <TrendingUp size={20} className="mr-3" style={{ color: '#816FE9' }} />
                                <p className="font-medium text-[#282724] text-md flex-1 truncate max-w-xs">{topic.title}</p>
                                <span className="ml-2 text-sm text-gray-400 font-normal">
                                    ({topic.count})
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}