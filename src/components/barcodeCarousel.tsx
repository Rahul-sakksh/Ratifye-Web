import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselItem = {
    id: string;
    name: string;
    iconUrl?: string;
};

interface BarcodeCarouselProps {
    title: string;
    items: CarouselItem[];
    selectedId: string;
    onSelect: (id: string) => void;
}

const BarcodeCarousel: React.FC<BarcodeCarouselProps> = ({
    title,
    items,
    selectedId,
    onSelect
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLButtonElement>(null);

    const filteredItems = items
        .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) =>
            a.name.toLowerCase() === searchTerm.toLowerCase() ? -1 :
                b.name.toLowerCase() === searchTerm.toLowerCase() ? 1 : 0
        );

    const scroll = (dir: 'left' | 'right') => {
        if (containerRef.current) {
            const width = containerRef.current.clientWidth;
            containerRef.current.scrollBy({ left: dir === 'left' ? -width : width, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (selectedRef.current && containerRef.current) {
            const parent = containerRef.current;
            const item = selectedRef.current;
            const itemLeft = item.offsetLeft - parent.offsetLeft;
            const scrollLeft = itemLeft - parent.clientWidth / 2 + item.clientWidth / 2;
            parent.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [selectedId]);

    return (
        <div className="w-full mb-8">
            <h3 className="text-base font-semibold text-gray-800 mb-4">{title}</h3>
            <input
                type="text"
                placeholder="Search barcode types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md mb-6 text-sm"
            />

            <div className="relative">
                <button
                    onClick={() => scroll('left')}
                    className="absolute z-10 top-1/2 -translate-y-1/2 left-0 p-2 bg-white shadow-md rounded-full"
                >
                    <ChevronLeft />
                </button>

                <div 
                    ref={containerRef}
                    className="overflow-x-auto whitespace-nowrap hide-scrollbar scroll-smooth px-10"
                >
                    <div className="inline-flex gap-4">
                        {filteredItems.length === 0 ? (
                            <p className="text-gray-500 text-sm">No barcode types found.</p>
                        ) : (
                            filteredItems.map((item) => {
                                const isSelected = item.id === selectedId;
                                return (
                                    <button
                                        key={item.id}
                                        ref={isSelected ? selectedRef : null}
                                        className={`flex flex-col items-center justify-center w-44 h-44 px-4 py-5 rounded-2xl border-[3px] transition-all duration-300 text-center
                      ${isSelected ? 'border-blue-600 bg-blue-50 shadow-lg' : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-md'}
                    `}
                                        onClick={() => onSelect(item.id)}
                                    >
                                        {item.iconUrl && (
                                            <img
                                                src={item.iconUrl}
                                                alt={item.name}
                                                className="w-16 h-16 object-contain mb-3"
                                            />
                                        )}
                                        <div>

                                        </div>
                                        <div className=''>
                                        <span className={`text-sm font-medium break-words whitespace-normal ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                                            {item.name}
                                        </span>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute z-10 top-1/2 -translate-y-1/2 right-0 p-2 bg-white shadow-md rounded-full"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};

export default BarcodeCarousel;
