import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BarcodeCarousel from './barcodeCarousel';

type PopularType = {
    id: string;
    name: string;
    iconUrl?: string;
    description?: string;
};

type OptionType = {
    key: string;
    value: string;
};



interface BarcodeSelectorProps {
    popularBarcodeTypes: PopularType[];
    barcodeOptions: OptionType[];
    gs1Barcodes: PopularType[];
    otherBarcodeTypes: PopularType[];
    selectedType: string;
    setSelectedType: (type: string) => void;
    activeTab?: string;

}

const BarcodeSelector: React.FC<BarcodeSelectorProps> = ({
    popularBarcodeTypes,
    barcodeOptions,
    selectedType,
    setSelectedType,
    gs1Barcodes,
    activeTab,
    otherBarcodeTypes
}) => {
    const [showOtherTypes, setShowOtherTypes] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowOtherTypes(false);
            }
        };

        if (showOtherTypes) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOtherTypes]);

    const filteredOptions = barcodeOptions.filter((type) =>
        type.value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = barcodeOptions.find((item) => item.key === selectedType);

    return (
        <div className="mb-8 w-full">
            {/* activeTab == 'gs1' ? gs1Barcodes : activeTab == '2d' ?  */}

            { activeTab == 'gs1' && <BarcodeCarousel
                title="GS1 Barcode Types"
                items={gs1Barcodes}
                selectedId={selectedType}
                onSelect={setSelectedType}
            />}
            { activeTab == '1dbarcodes/other' &&
                <BarcodeCarousel
                    title="Other Barcode Types"
                    items={otherBarcodeTypes}
                    selectedId={selectedType}
                    onSelect={setSelectedType}
                />}

            { activeTab == '2d' &&
                <> <h3 className="text-base font-semibold text-gray-800 mb-4">Select Barcode Type</h3>
                    {/* Popular barcode types */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {popularBarcodeTypes.map((type) => {
                            const isSelected = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    className={`flex flex-col items-center justify-center mh-44 px-4 py-5 rounded-2xl transition-all duration-300 border-[3px] text-center
                ${isSelected
                                            ? 'border-gray-600 bg-gray-50 shadow-lg'
                                            : 'border-gray-300 bg-white hover:border-gray-500 hover:shadow-md'
                                        }`}
                                    onClick={() => {
                                        setSelectedType(type.id);
                                        setShowOtherTypes(false);
                                    }}
                                >
                                    {/* {type.iconUrl && (
                                        <img
                                            src={type.iconUrl}
                                            alt={type.name}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-3"
                                        />
                                    )} */}
                                    <span className={`text-sm font-bold w-full text-left ${isSelected ? 'text-gray-950' : 'text-gray-700'}`}>
                                        {type.name}
                                    </span>
                                    <p className="text-xs font-medium w-full text-gray-500 mt-1 text-left">{type?.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </>
            }



            {activeTab == 'other' &&
                < div className="relative w-full max-w-sm" ref={dropdownRef}>
                    <button
                        className={`flex items-center justify-between px-4 py-3 rounded-xl w-full border-[3px] text-sm font-medium transition-all duration-200 ${showOtherTypes || selectedOption?.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-500'
                            }`}
                        onClick={() => setShowOtherTypes(!showOtherTypes)}
                    >
                        <span className="text-gray-700">
                            {selectedOption?.value || 'Other Types'}
                        </span>
                        <ChevronDown size={20} className="text-gray-500" />
                    </button>

                    {showOtherTypes && (
                        <div className="absolute right-0 mt-2 w-full max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl z-20 border border-gray-200">
                            <div className="p-3">
                                <input
                                    type="text"
                                    placeholder="Search types..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="mb-3 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <div className="space-y-1">
                                    {filteredOptions.map((type) => (
                                        <button
                                            key={type.key}
                                            className={`w-full text-left px-3 py-2 rounded-md transition text-sm font-medium ${selectedType === type.key
                                                ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                                                : 'text-gray-800 hover:bg-gray-100'
                                                }`}
                                            onClick={() => {
                                                setSelectedType(type.key);
                                                setShowOtherTypes(false);
                                                setSearchTerm('');
                                            }}
                                        >
                                            {type.value}
                                        </button>
                                    ))}

                                    {filteredOptions.length === 0 && (
                                        <p className="text-gray-500 text-sm px-2 py-1">No types found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            }
        </div >
    );
};

export default BarcodeSelector;
