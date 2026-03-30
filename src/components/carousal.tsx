import React, { useState, useRef, useEffect } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Palette,
    Type,
    Download,
    RotateCcw
} from 'lucide-react';

interface CarouselProps {
    data: string[];
}

const EnhancedCarouselWithCustomizer: React.FC<CarouselProps> = ({ data = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [customizedImages, setCustomizedImages] = useState<(string | null)[]>([]);
    const [isOriginalView, setIsOriginalView] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    // Customization options
    const [customText, setCustomText] = useState('Sample Text');
    const [textPosition, setTextPosition] = useState('bottom');
    const [barcodeColor, setBarcodeColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000000');
    const [textSize, setTextSize] = useState(16);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize customized images array when data changes
    useEffect(() => {
        setCustomizedImages([]);
    }, [data]);

    // Initialize customized images array when data changes
    useEffect(() => {
        if (data.length > 0 && customizedImages.length !== data.length) {
            setCustomizedImages(new Array(data.length).fill(null));
        }
    }, [data.length]);

    // Handle index bounds when switching views or when arrays change
    useEffect(() => {
        const maxIndex = data.length - 1;
        if (currentIndex > maxIndex && maxIndex >= 0) {
            setCurrentIndex(maxIndex);
        } else if (currentIndex < 0) {
            setCurrentIndex(0);
        }
    }, [currentIndex, data.length]);

    const getImageUrl = (filename: string) =>
        `https://dlhub.8aiku.com/dmai/download-image/?folder_variable=TMP_IMAGE_FOLDER&filename=${filename}`;

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            }
            : null;
    };

    const processImage = async (imgUrl: string, index: number): Promise<string | null> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(null);

                    // Determine if text should be rendered and measure it
                    let topPadding = 0;
                    let bottomPadding = 0;
                    let textHeight = 0;

                    if (textPosition !== 'none' && customText.trim()) {
                        ctx.font = `${textSize}px Arial`;
                        const metrics = ctx.measureText(customText);
                        textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

                        if (textPosition === 'top') {
                            topPadding = textHeight + 10; // 5px top and bottom padding
                        } else if (textPosition === 'bottom') {
                            bottomPadding = textHeight + 10;
                        }
                    }

                    // Set canvas dimensions
                    canvas.width = img.width;
                    canvas.height = img.height + topPadding + bottomPadding;

                    // Draw background
                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw barcode with Y-offset if top text exists
                    const barcodeY = topPadding;
                    const tempCanvas = document.createElement('canvas');
                    const tempCtx = tempCanvas.getContext('2d');
                    if (!tempCtx) return resolve(null);

                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    tempCtx.drawImage(img, 0, 0);

                    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
                    const data = imageData.data;
                    const fg = hexToRgb(barcodeColor);
                    const bg = hexToRgb(backgroundColor);

                    if (data && fg && bg) {
                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            if (r < 128 && g < 128 && b < 128) {
                                data[i] = fg.r;
                                data[i + 1] = fg.g;
                                data[i + 2] = fg.b;
                            } else {
                                data[i] = bg.r;
                                data[i + 1] = bg.g;
                                data[i + 2] = bg.b;
                            }
                        }
                        tempCtx.putImageData(imageData, 0, 0);
                    }

                    ctx.drawImage(tempCanvas, 0, barcodeY);

                    // Draw text
                    if (textPosition !== 'none' && customText.trim()) {
                        ctx.fillStyle = textColor;
                        ctx.font = `${textSize}px Arial`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'alphabetic'; // Ensures consistent alignment

                        let textY = 0;

                        if (textPosition === 'top') {
                            textY = textHeight + 5; // baseline at bottom of top padding
                        } else if (textPosition === 'bottom') {
                            textY = canvas.height - 5; // baseline at top of bottom padding
                        }

                        ctx.fillText(customText, canvas.width / 2, textY);
                    }


                    resolve(canvas.toDataURL('image/png'));
                } catch (error) {
                    console.error('Error processing image:', error);
                    resolve(null);
                }
            };

            img.onerror = () => {
                console.error('Failed to load image:', imgUrl);
                resolve(null);
            };
            img.src = imgUrl;
        });
    };

    const customizeAllImages = async () => {
        setIsProcessing(true);
        const customized: (string | null)[] = new Array(data.length).fill(null);

        try {
            for (let i = 0; i < data.length; i++) {
                const url = getImageUrl(data[i]);
                const processed = await processImage(url, i);
                customized[i] = processed;
            }

            setCustomizedImages(customized);
            setIsOriginalView(false);
        } catch (error) {
            console.error('Error customizing all images:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadAllCustomizedImages = () => {
        customizedImages.forEach((img, i) => {
            if (img) {
                const a = document.createElement('a');
                a.href = img;
                a.download = `customized-barcode-${i + 1}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    };

    const downloadImageFromUrl = async (url: string, filename: string) => {
        try {
            const response = await fetch(url, { mode: "cors" });
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error(`Failed to download ${filename}:`, error);
        }
    };

    const downloadAllOriginalImages = async () => {
        for (let i = 0; i < data.length; i++) {
            const url = getImageUrl(data[i]);
            await downloadImageFromUrl(url, `original-barcode-${i + 1}.png`);
        }
    };



    const downloadCurrentImage = async () => {
        const filename = `barcode-${currentIndex + 1}.png`;
        let imageUrl: string | null = null;

        if (isOriginalView) {
            imageUrl = getImageUrl(data[currentIndex]);
        } else {
            imageUrl = customizedImages[currentIndex] || getImageUrl(data[currentIndex]);
        }

        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl, { mode: 'cors' });
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Failed to download current image:', error);
        }
    };


    const resetAllCustomizations = () => {
        setCustomizedImages(new Array(data.length).fill(null));
        setIsOriginalView(true);
        setCurrentIndex(0);
    };

    const handleCustomizeCurrent = async () => {
        if (!data[currentIndex]) return;

        setIsProcessing(true);
        try {
            const url = getImageUrl(data[currentIndex]);
            const processed = await processImage(url, currentIndex);

            const updated = [...customizedImages];
            updated[currentIndex] = processed;
            setCustomizedImages(updated);
            setIsOriginalView(false);
        } catch (error) {
            console.error('Error customizing current image:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper functions
    const hasAnyCustomizedImages = () => {
        return customizedImages.some(img => img !== null);
    };

    const getCurrentImageSrc = () => {
        if (isOriginalView) {
            return data[currentIndex] ? getImageUrl(data[currentIndex]) : null;
        } else {
            const customImg = customizedImages[currentIndex];
            return customImg || (data[currentIndex] ? getImageUrl(data[currentIndex]) : null);
        }
    };

    const getTotalImages = () => data.length;

    const canGoToPrevious = () => currentIndex > 0;
    const canGoToNext = () => currentIndex < data.length - 1;

    const goToPrevious = () => {
        if (canGoToPrevious()) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const goToNext = () => {
        if (canGoToNext()) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const switchToOriginalView = () => {
        setIsOriginalView(true);
    };

    const switchToCustomizedView = () => {
        if (hasAnyCustomizedImages()) {
            setIsOriginalView(false);
        }
    };

    if (data.length === 0) {
        return (
            <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
                <div className="text-center text-gray-500">No images to display</div>
            </div>
        );
    }

    const currentImageSrc = getCurrentImageSrc();

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
            {/* Controls */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={switchToOriginalView}
                        className={`px-4 py-2 rounded transition-colors ${isOriginalView ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                    >
                        Original ({data.length})
                    </button>
                    <button
                        onClick={switchToCustomizedView}
                        disabled={!hasAnyCustomizedImages()}
                        className={`px-4 py-2 rounded transition-colors ${!isOriginalView ? 'bg-green-500 text-white' :
                            hasAnyCustomizedImages() ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Customized ({customizedImages.filter(img => img !== null).length})
                    </button>
                </div>
                <div className="text-sm text-gray-600">
                    {isProcessing && <span className="text-blue-600">Processing...</span>}
                </div>
            </div>

            {/* Image Carousel */}
            <div className="flex justify-center items-center mb-4">
                <button
                    onClick={goToPrevious}
                    disabled={!canGoToPrevious()}
                    className={`p-2 rounded ${canGoToPrevious()
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'text-gray-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="mx-4 flex justify-center items-center min-h-64">
                    {currentImageSrc ? (
                        <img
                            src={currentImageSrc}
                            alt={`Barcode ${currentIndex + 1}`}
                            className="max-h-64 max-w-full object-contain rounded border"
                            onError={(e) => {
                                console.error('Image failed to load:', currentImageSrc);
                                // Optional: You could set a placeholder image here
                            }}
                        />
                    ) : (
                        <div className="w-64 h-64 bg-gray-100 rounded border flex items-center justify-center text-gray-500">
                            Image not available
                        </div>
                    )}
                </div>

                <button
                    onClick={goToNext}
                    disabled={!canGoToNext()}
                    className={`p-2 rounded ${canGoToNext()
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'text-gray-300 cursor-not-allowed'
                        }`}
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="text-center mb-4 text-sm text-gray-700">
                Image {currentIndex + 1} / {getTotalImages()}
                {!isOriginalView && customizedImages[currentIndex] && (
                    <span className="ml-2 text-green-600">(Customized)</span>
                )}
                {!isOriginalView && !customizedImages[currentIndex] && (
                    <span className="ml-2 text-orange-600">(Original - Not Customized)</span>
                )}
            </div>

            {/* Customizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
                <div>
                    <label className="block text-sm mb-1">Barcode Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={barcodeColor}
                            onChange={(e) => setBarcodeColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="text-xs">{barcodeColor}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm mb-1">Background</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="text-xs">{backgroundColor}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm mb-1">Text Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-10 h-10 rounded cursor-pointer"
                        />
                        <span className="text-xs">{textColor}</span>
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm mb-1">Custom Text</label>
                    <input
                        type="text"
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Enter text to display"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Text Position</label>
                    <select
                        value={textPosition}
                        onChange={(e) => setTextPosition(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                    >
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="none">None</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm mb-1">Text Size: {textSize}px</label>
                    <input
                        type="range"
                        min="10"
                        max="40"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-4">
                {/* Primary Actions */}
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={handleCustomizeCurrent}
                        disabled={isProcessing || !data[currentIndex]}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? 'Processing...' : 'Apply to Current'}
                    </button>
                    <button
                        onClick={customizeAllImages}
                        disabled={isProcessing || data.length === 0}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isProcessing ? 'Processing...' : `Customize All (${data.length})`}
                    </button>
                    <button
                        onClick={resetAllCustomizations}
                        disabled={!hasAnyCustomizedImages()}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <RotateCcw size={16} className="inline mr-1" />
                        Reset All
                    </button>
                </div>

                {/* Download Actions */}
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={downloadCurrentImage}
                        disabled={!currentImageSrc}
                        className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download size={16} className="inline mr-1" />
                        Download Current
                    </button>

                    <button
                        onClick={downloadAllOriginalImages}
                        disabled={data.length === 0}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download size={16} className="inline mr-1" />
                        Download All Original ({data.length})
                    </button>

                    <button
                        onClick={downloadAllCustomizedImages}
                        disabled={!hasAnyCustomizedImages()}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download size={16} className="inline mr-1" />
                        Download All Customized ({customizedImages.filter(img => img !== null).length})
                    </button>
                </div>
            </div>

            {/* Hidden canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default EnhancedCarouselWithCustomizer;