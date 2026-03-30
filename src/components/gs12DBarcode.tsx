import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AuthCheckbox from './authCheckbox';
import { ArrowDownRight, ArrowUpLeft } from 'lucide-react';
import SizeSelector from './SizeSelector';
import BarcodeLimitIndicator from './BarcodeLimitIndicator';
import axios from 'axios';

interface FormState {
    gtin: string;
    bc_nos: string;
    width: string;
    height: string;
    [key: string]: any;
    productName: any;
    productImage: any;
    productId: any;
    barcodeName: any;
}

type Errors = { [key: string]: string };

const initialState: FormState = {
    gtin: '',
    expiry_date: '',
    batch_no: '',
    production_date: '',
    packaging_date: '',
    best_before_date: '',
    serial_no: '',
    serial_prefix: '',
    serial_start: '',
    bc_nos: '',
    width: '100',
    height: '100',
    productName: '',
    productImage: '',
    productId: '',
    barcodeName: ''
};

const isPositiveInt = (val: string) => /^\d+$/.test(val) && parseInt(val, 10) >= 0;
const isGTIN14 = (val: string) => /^\d{14}$/.test(val);
const isAlphaNumericWithSpecialChars = (val: string) => /^[A-Z0-9\-\s]+$/.test(val);

interface GS12DBarcodeFormProps {
    onGenerate: (params: any) => void;
    loading: boolean;
    authenticationType?: string;
    setAuthenticationType?: (type: string) => void;
    title?: boolean;
}

const GS12DBarcodeForm: React.FC<GS12DBarcodeFormProps> = ({
    onGenerate,
    loading,
    authenticationType,
    setAuthenticationType,
    title = true
}) => {
    const [form, setForm] = useState<FormState>(initialState);
    const [selectedAI, setSelectedAI] = useState<string[]>([]);
    const [applicationIndicators, setApplicationIndicators] = useState<any[]>([]);

    const [errors, setErrors] = useState<Errors>({});
    const [checkbox, setCheckbox] = useState(false);
    const [bctype, setBcType] = useState('gs1qrcode');
    const [datePickerVisible, setDatePickerVisible] = useState<{ [key: string]: boolean }>({});
    const [showAIDropdown, setShowAIDropdown] = useState(false);
    const aiDropdownRef = useRef<HTMLDivElement>(null);
    const aiButtonRef = useRef<HTMLButtonElement>(null);

    const [gtinType, setGtinType] = useState("01");
    const [activeTab, setActiveTab] = useState<"gtin" | "productId">("gtin");
    const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

    const datePickerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    useEffect(() => {
        fetchAIData();
    }, []);

    const fetchAIData = async () => {
        try {
            const res = await axios.get(
                "https://api.tnt.sakksh.com/company-configs/gs1/ai-data"
            );

            console.log("Fetched AI Raw Data:", res.data);

            const formattedAI = res.data.map((item: any) => ({
                key: item.ai.replace(/[^0-9]/g, ""), // clean ai code
                value: item.data_title || item.data_content,
                aicode: item.ai.replace(/[^0-9]/g, ""),
                description: item.data_content,
                type: item.format?.includes("N6") ? "date" : "text",
                format: item.format || "",
                // Extract max length from format like "N2+N14" or "X..20"
                maxLength: extractMaxLength(item.format)
            }));

            console.log("Fetched AI Data:", formattedAI);

            setApplicationIndicators(formattedAI);
        } catch (error) {
            console.error("AI API Error:", error);
        }
    };

    // Helper to extract max length from format strings
    const extractMaxLength = (format: string): number | null => {
        if (!format) return null;
        
        // Match patterns like "X..20", "N..20", "X20", "N14"
        const match = format.match(/\.\.(\d+)|[XN](\d+)/);
        if (match) {
            return parseInt(match[1] || match[2]);
        }
        return null;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                aiDropdownRef.current &&
                !aiDropdownRef.current.contains(event.target as Node) &&
                aiButtonRef.current &&
                !aiButtonRef.current.contains(event.target as Node)
            ) {
                setShowAIDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const GS1 = {
        pad: (value: string, len: number) => value.toString().padStart(len, '0'),

        buildData: (form: FormState, selectedAI: string[]) => {
            const parts: string[] = [];

            // Always add GTIN first
            if (gtinType === "01") {
                parts.push(`(01)${GS1.pad(form.gtin, 14)}`);
            } else if (gtinType === "02") {
                parts.push(`(02)${GS1.pad(form.gtin, 14)}`);
            }

            applicationIndicators.forEach(({ key, aicode }) => {
                if (selectedAI.includes(key) && form[key]) {
                    if (key === 'SERIAL') {
                        if (!checkbox || form.bc_nos?.trim() === '') {
                            parts.push(`(${aicode})${form[key]}`);
                        }
                    } else if (form[key].trim() !== '') {
                        parts.push(`(${aicode})${form[key]}`);
                    }
                }
            });

            return parts.join('');
        },

        // Dynamic pattern builder based on selected AIs
        buildPattern: (selectedAI: string[]): RegExp => {
            let pattern = `^\\((01|02)\\)\\d{14}`; // Always start with GTIN

            // Add patterns for each selected AI in order
            selectedAI.forEach(aiKey => {
                const aiItem = applicationIndicators.find(item => item.key === aiKey);
                if (!aiItem) return;

                const aicode = aiItem.aicode;
                const isDate = aiItem.type === 'date';
                const maxLen = aiItem.maxLength;

                if (isDate) {
                    pattern += `(?:\\(${aicode}\\)\\d{6})?`;
                } 
                // else if (aiKey === 'SERIAL' || aiKey === 'BATCH/LOT') {
                //     const len = maxLen || 25;
                //     pattern += `(?:\\(${aicode}\\)[A-Z0-9\\-\\s]{1,${len}})?`;
                // } else if (maxLen) {
                //     pattern += `(?:\\(${aicode}\\)\\d{1,${maxLen}})?`;
                // } else {
                //     pattern += `(?:\\(${aicode}\\)[A-Z0-9\\-\\s]{1,30})?`;
                // }
            });

            pattern += '$';
            return new RegExp(pattern);
        }
    };

    const clearError = (field: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleChange = (name: any, value: string) => {
        clearError(name);
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const runValidation = (): boolean => {
        const newErrors: Errors = {};

        if (!isGTIN14(form.gtin)) newErrors.gtin = 'GTIN must be 14 digits';

        // Dynamic validation based on selected AIs
        selectedAI.forEach(aiKey => {
            const aiItem = applicationIndicators.find(item => item.key === aiKey);
            if (!aiItem) return;

            const value = form[aiKey];
            if (!value || value.trim() === '') return;

            // Date validation
            if (aiItem.type === 'date') {
                if (!/^\d{6}$/.test(value)) {
                    newErrors[aiKey] = `${aiItem.value} must be 6 digits (YYMMDD)`;
                }
            }
            // else if (aiKey === 'BATCH/LOT' || aiKey === 'SERIAL') {
            //     if (!isAlphaNumericWithSpecialChars(value)) {
            //         newErrors[aiKey] = `${aiItem.value} must be uppercase letters, numbers, hyphens`;
            //     }
            //     if (aiItem.maxLength && value.length > aiItem.maxLength) {
            //         newErrors[aiKey] = `${aiItem.value} must not exceed ${aiItem.maxLength} characters`;
            //     }
            // }
          
            // else if (aiItem.format?.startsWith('N')) {
            //     if (!/^\d+$/.test(value)) {
            //         newErrors[aiKey] = `${aiItem.value} must be numeric`;
            //     }
            //     if (aiItem.maxLength && value.length > aiItem.maxLength) {
            //         newErrors[aiKey] = `${aiItem.value} must not exceed ${aiItem.maxLength} digits`;
            //     }
            // }
        });

        if (form.bc_nos.trim() !== '' && !isPositiveInt(form.bc_nos) && checkbox) {
            newErrors.bc_nos = 'Barcode Qty must be a positive integer';
        }

        if (checkbox && form.bc_nos.trim() !== '' && form.serial_start.trim() === '') {
            newErrors.serial_start = 'Please enter Serial start';
        } else if (checkbox && form.bc_nos.trim() !== '' && !isPositiveInt(form.serial_start)) {
            newErrors.serial_start = 'Serial start must be a positive integer';
        }

        if (form.height.trim() !== '' && !isPositiveInt(form.height)) {
            newErrors.height = 'Height must be a positive integer';
        }

        if (form.width.trim() !== '' && !isPositiveInt(form.width)) {
            newErrors.width = 'Width must be a positive integer';
        }

        if (form.serial_prefix.trim() !== '' && !isAlphaNumericWithSpecialChars(form.serial_prefix)) {
            newErrors.serial_prefix = 'Serial prefix must be uppercase letters, numbers, hyphens (e.g. DEV-, MFG-A1-)';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length) {
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!runValidation()) return;

        const gs1String = GS1.buildData(form, selectedAI);
        
        // Dynamic pattern validation
        const dynamicPattern = GS1.buildPattern(selectedAI);
        
        console.log("Generated GS1 String:", gs1String);
        console.log("Dynamic Pattern:", dynamicPattern);
        
        // if (!dynamicPattern.test(gs1String)) {
        //     alert('Invalid GS1 Pattern: The generated GS1 pattern is invalid. Please check your inputs.');
        //     return;
        // }

        const params = {
            bc_type: bctype,
            data: gs1String,
            ...(form.width.trim() && { width: form.width }),
            ...(form.height.trim() && { height: form.height }),
            ...(form.bc_nos.trim() && checkbox && {
                serialised: form.bc_nos,
                bc_nos: form.bc_nos,
                ...(form.serial_prefix.trim() && { serial_prefix: form.serial_prefix }),
                ...(form.serial_start.trim() && { serial_start: form.serial_start }),
            }),
        };

        console.log("params", params);

        onGenerate(params);
    };

    const handleDateChange = (name: keyof FormState, date: Date | null) => {
        if (date) {
            const y = date.getFullYear().toString().slice(2);
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            const yymmdd = y + m + d;
            handleChange(name, yymmdd);
        } else {
            handleChange(name, '');
        }
        setDatePickerVisible(prev => ({ ...prev, [name]: false }));
    };

    const formatDateValue = (value: string) => {
        if (!value || value.length !== 6) return '';
        const year = `20${value.slice(0, 2)}`;
        const month = value.slice(2, 4);
        const day = value.slice(4, 6);
        return `${year}-${month}-${day}`;
    };

    const toggleAI = (key: string) => {
        setSelectedAI(prev =>
            prev.includes(key)
                ? prev.filter(k => k !== key)
                : [...prev, key]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const updatedVisibility: { [key: string]: boolean } = { ...datePickerVisible };
            let shouldUpdate = false;

            Object.entries(datePickerVisible).forEach(([key, isVisible]) => {
                const ref = datePickerRefs.current[key];
                if (isVisible && ref && !ref.contains(event.target as Node)) {
                    updatedVisibility[key] = false;
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                setDatePickerVisible(updatedVisibility);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [datePickerVisible]);

    useEffect(() => {
        if (form.bc_nos.trim() !== '') {
            setForm(prev => ({ ...prev, serial_no: '' }));
        }
    }, [form.bc_nos]);

    useEffect(() => {
        if (form.serial_no.trim() !== '') {
            setCheckbox(false);
        }
    }, [form.serial_no, selectedAI]);

    const getAILabel = (key: string) => {
        const aiItem = applicationIndicators.find(item => item.key === key);
        return aiItem ? aiItem.value : key.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const getAIDescription = (key: string) => {
        return applicationIndicators.find(item => item.key === key)?.description || '';
    };

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = width < 400;

    const handleDisable = () => {
        // Check if Barcode Name and Product Name are filled
        if (!form?.barcodeName?.trim() || !form?.productName?.trim()) return true;

        // Check active tab
        if (activeTab === "gtin" && !form.gtin.trim()) return true;
        if (activeTab === "productId" && !form.productId.trim()) return true;

        return false; // enable button
    };

    return (
        <div className="w-full max-w-3xl mx-auto pt-0 bg-white rounded-lg text-left">
            {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Your GS1 2D Barcode</h2>}
            <div className={`${isMobile ? "flex flex-col gap-4" : "flex gap-5 w-full items-center justify-center"} mb-6`}>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="gs1qrcode"
                        checked={bctype === 'gs1qrcode'}
                        onChange={() => setBcType('gs1qrcode')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label
                        htmlFor="gs1qrcode"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        GS1 - QR Code
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="gs1datamatrix"
                        checked={bctype === 'gs1datamatrix'}
                        onChange={() => setBcType('gs1datamatrix')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <label
                        htmlFor="gs1datamatrix"
                        className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        GS1 - DataMatrix
                    </label>
                </div>
            </div>

            <BarcodeLimitIndicator
                className="mb-4"
                onLogout={() => { }}
                type="gs1qrcode"
            />

            <div className="flex-1 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode Name<span className="text-red-500 pl-[1px]">*</span>
                </label>
                <input
                    type="text"
                    value={form.barcodeName}
                    onChange={(e) => handleChange("barcodeName", e.target.value)}
                    className={`w-full h-12 px-3 py-2 border ${errors.barcodeName ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter Barcode Name"
                />
                {errors.barcodeName && (
                    <p className="mt-1 text-sm text-red-600">{errors.barcodeName}</p>
                )}
            </div>

            <div className="space-y-6">
                {/* Product Name + Image */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Name */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name<span className="text-red-500 pl-[1px]">*</span>
                        </label>

                        <input
                            type="text"
                            value={form.productName}
                            onChange={(e) => handleChange("productName", e.target.value)}
                            className={`w-full h-12 px-3 py-2 border ${errors.productName ? "border-red-500" : "border-gray-300"
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Enter Product Name"
                        />
                        {errors.productName && (
                            <p className="mt-1 text-sm text-red-600">{errors.productName}</p>
                        )}
                    </div>

                    {/* Product Image */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Image
                        </label>
                        <div
                            className={`flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer ${errors.productImage
                                ? "border-red-500"
                                : "border-gray-300 hover:border-indigo-500"
                                } h-12`}
                            onClick={() => document.getElementById("imageUpload")?.click()}
                        >
                            {form.productImage ? (
                                <img
                                    src={URL.createObjectURL(form.productImage)}
                                    alt="Preview"
                                    className="h-8 w-8 object-cover rounded"
                                />
                            ) : (
                                <p className="text-sm text-gray-500">Click to upload</p>
                            )}
                        </div>
                        <input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                handleChange("productImage", e.target.files?.[0] || null)
                            }
                        />
                        {errors.productImage && (
                            <p className="mt-1 text-sm text-red-600">{errors.productImage}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="">
                {/* Normal Radio Buttons */}
                <div className="flex items-center gap-6 pb-4 pt-5">
                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="radio"
                            name="inputType"
                            value="gtin"
                            checked={activeTab === "gtin"}
                            onChange={() => setActiveTab("gtin")}
                            className="h-4 w-4"
                        />
                        GTIN
                    </label>

                    <label className="flex items-center gap-2 text-gray-700">
                        <input
                            type="radio"
                            name="inputType"
                            value="productId"
                            checked={activeTab === "productId"}
                            onChange={() => setActiveTab("productId")}
                            className="h-4 w-4"
                        />
                        Product ID
                    </label>
                </div>

                {/* GTIN Input */}
                {activeTab === "gtin" && (
                    <div className="mb-3">
                        <div className="flex gap-3 mb-2">
                            {["01", "02"].map((type) => (
                                <label
                                    key={type}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer text-sm
                                        ${gtinType === type ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-300"}`}
                                >
                                    <input
                                        type="radio"
                                        name="gtinType"
                                        value={type}
                                        checked={gtinType === type}
                                        onChange={(e) => setGtinType(e.target.value)}
                                        className="hidden"
                                    />

                                    {gtinType === type && (
                                        <span className="text-blue-600 font-bold">✔</span>
                                    )}

                                    GTIN ({type})<span className="text-red-500">*</span>
                                </label>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={form.gtin}
                            onChange={(e) => handleChange("gtin", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Enter 14-digit GTIN"
                            maxLength={14}
                        />
                        {errors.gtin && (
                            <p className="mt-1 text-sm text-red-600">{errors.gtin}</p>
                        )}
                    </div>
                )}

                {/* Product ID Input */}
                {activeTab === "productId" && (
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product ID<span className="text-red-500 pl-[1px]">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.productId}
                            onChange={(e) => handleChange("productId", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter Product ID"
                        />
                    </div>
                )}
            </div>

            {/* Selected AI Fields */}
            <div className="space-y-4 mb-6 text-left">
                {selectedAI.map(aiKey => {
                    const aiItem = applicationIndicators.find(item => item.key === aiKey);
                    if (!aiItem) return null;

                    const isDateField = aiItem.type === 'date';

                    return (
                        <div key={aiKey} className="mb-4 text-left">
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                {getAILabel(aiKey)}
                            </label>

                            {isDateField ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatDateValue(form[aiKey])}
                                        onClick={() => setDatePickerVisible(prev => ({ ...prev, [aiKey]: true }))}
                                        readOnly
                                        className={`w-full px-3 py-2 border ${errors[aiKey] ? 'border-red-500' : 'border-gray-300'
                                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer`}
                                        placeholder={`Select ${getAILabel(aiKey)}`}
                                    />
                                    {datePickerVisible[aiKey] && (
                                        <div ref={el => (datePickerRefs.current[aiKey] = el)} className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                            <DatePicker
                                                selected={form[aiKey] ? new Date(formatDateValue(form[aiKey])) : null}
                                                onChange={(date) => handleDateChange(aiKey as keyof FormState, date)}
                                                inline
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <input
                                    type={aiItem.format?.startsWith('N') ? 'number' : 'text'}
                                    value={form[aiKey]}
                                    onChange={(e) => handleChange(aiKey as keyof FormState, e.target.value)}
                                    className={`w-full px-3 py-2 border ${errors[aiKey] ? 'border-red-500' : 'border-gray-300'
                                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                    placeholder={`Enter ${getAILabel(aiKey)}`}
                                    maxLength={aiItem.maxLength || undefined}
                                />
                            )}

                            {errors[aiKey] && (
                                <p className="mt-1 text-sm text-red-600 text-left">{errors[aiKey]}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 text-left">
                                {getAIDescription(aiKey)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Application Indicators Dropdown */}
            <div className="mb-6 text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Application Indicators
                </label>

                <div className="relative">
                    <button
                        ref={aiButtonRef}
                        onClick={() => setShowAIDropdown(!showAIDropdown)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-left focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 flex justify-between items-center"
                    >
                        <span>
                            {selectedAI.length === 0
                                ? 'Select indicators'
                                : `${selectedAI.length} indicator${selectedAI.length !== 1 ? 's' : ''} selected`}
                        </span>
                        <svg
                            className={`h-5 w-5 text-gray-400 transform transition-transform ${showAIDropdown ? 'rotate-180' : ''
                                }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {showAIDropdown && (
                        <div
                            ref={aiDropdownRef}
                            className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                        >
                            {applicationIndicators.map((item) => (
                                <div
                                    key={item.key}
                                    className="flex items-center px-3 py-2 hover:bg-gray-100"
                                >
                                    <input
                                        id={`ai-${item.key}`}
                                        type="checkbox"
                                        checked={selectedAI.includes(item.key)}
                                        onChange={() => toggleAI(item.key)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label
                                        htmlFor={`ai-${item.key}`}
                                        className="ml-3 text-sm font-medium text-gray-700 cursor-pointer flex-1"
                                    >
                                        <span className="font-semibold">{item.value} ({item.aicode})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <SizeSelector form={form} handleChange={handleChange} />

            {/* Serialization Section */}
            <div className="mb-6 text-left">
                <div className="flex items-center mb-4">
                    <input
                        id="serialization"
                        type="checkbox"
                        checked={checkbox}
                        onChange={() => setCheckbox(!checkbox)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label
                        htmlFor="serialization"
                        className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        Enable Serialization
                    </label>
                </div>

                {checkbox && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Serial Prefix
                            </label>
                            <input
                                type="text"
                                value={form.serial_prefix}
                                onChange={(e) => handleChange('serial_prefix', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.serial_prefix ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="e.g., ABC-"
                            />
                            {errors.serial_prefix && (
                                <p className="mt-1 text-sm text-red-600 text-left">{errors.serial_prefix}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Serial Start
                            </label>
                            <input
                                type="number"
                                value={form.serial_start}
                                onChange={(e) => handleChange('serial_start', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.serial_start ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="e.g., 1000"
                            />
                            {errors.serial_start && (
                                <p className="mt-1 text-sm text-red-600 text-left">{errors.serial_start}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                                Barcode Quantity
                            </label>
                            <input
                                type="number"
                                value={form.bc_nos}
                                onChange={(e) => handleChange('bc_nos', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors.bc_nos ? 'border-red-500' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Number of barcodes"
                            />
                            {errors.bc_nos && (
                                <p className="mt-1 text-sm text-red-600 text-left">{errors.bc_nos}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <AuthCheckbox authenticationType={authenticationType} setAuthenticationType={setAuthenticationType} />

            {/* Generate Button */}
            <button
                onClick={handleSubmit}
                disabled={loading || handleDisable()}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading || handleDisable()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#1F4B73]'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                ) : (
                    'Generate Barcode'
                )}
            </button>
        </div>
    );
};

export default GS12DBarcodeForm;