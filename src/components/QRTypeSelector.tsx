import { Info } from "lucide-react";
import { useState } from "react";

interface QRTypeProps {
    qrType?: string;
    setQRType?: (type: string) => void;
}

const QRTypeSelector: React.FC<QRTypeProps> = ({ qrType, setQRType }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const isStaticSelected = qrType === 'static';
    const isDynamicSelected = qrType === 'dynamic';

    return (
        <div className="flex flex-col gap-3 w-full mb-6">
            {/* Header */}
            <div className="text-sm text-left font-medium text-gray-700 flex flex-row items-center gap-1 relative">
                <span>QR Code Type</span>
                <span
                    className="relative ml-2"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Info height={16} width={16} color="gray" className="cursor-pointer" />
                    {showTooltip && (
                        <div className="absolute top-6 left-0 w-64 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
                            <p>
                                <strong>Static QR:</strong> Fixed URL, does not track scans.<br />
                                <strong>Dynamic QR:</strong> Can edit URL and track scan data.
                            </p>
                        </div>
                    )}
                </span>
            </div>

            {/* QR Cards */}
            <div className="flex flex-col lg:flex-row gap-4 items-start sm:items-stretch">
                {/* Static QR */}
                <div
                    className={`flex flex-col justify-center items-center cursor-pointer px-3 py-2 rounded-xl border transition min-h-[40px] w-full sm:w-auto
                        ${isStaticSelected
                            ? 'border-black bg-gray-100'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                    onClick={() => setQRType?.('static')}
                >
                    <div className="flex items-center gap-2">
                        <span
                            className={`w-5 h-5 flex items-center justify-center rounded-full border 
                                ${isStaticSelected ? 'border-black bg-black' : 'border-gray-400'}
                            `}
                        >
                            {isStaticSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                        </span>
                        <span className={`text-sm font-medium ${isStaticSelected ? 'text-black font-semibold' : 'text-gray-700'}`}>
                            Static QR
                        </span>
                    </div>
                </div>

                {/* Dynamic QR */}
                <div
                    className={`flex flex-col gap-2 lg:flex-row justify-between cursor-pointer px-3 py-2 rounded-xl border transition min-h-[40px] w-full sm:w-auto
                        ${isDynamicSelected
                            ? 'border-black bg-gray-100'
                            : 'border-gray-300 bg-white hover:bg-gray-50'
                        }`}
                    onClick={() => setQRType?.('dynamic')}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 flex items-center justify-center rounded-full
                            ${isDynamicSelected ? 'bg-black' : 'bg-gray-300'}`}
                        >
                            {isDynamicSelected && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                        </div>
                        <span className={`text-sm font-medium ${isDynamicSelected ? 'text-black' : 'text-gray-700'}`}>
                            Dynamic QR
                        </span>
                    </div>

                    {/* Actions - always visible */}
                    <div className="flex flex-wrap sm:flex-row items-center gap-2 text-xs bg-[#cfdae1] py-1 px-2.5 rounded-2xl text-gray-500">
                        <button className="hover:underline flex items-center gap-1">
                            Edit URL
                        </button>
                        <span className="h-3 w-[1px] bg-black"></span>
                        <button className="hover:underline flex items-center gap-1">
                            Track Data
                        </button>
                        <span className="relative">
                            <Info size={12} className="cursor-pointer" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRTypeSelector;
