// src/components/GS1DigitalLinkBarcodeWeb.tsx
import { useEffect, useRef, useState } from 'react';
import axiosInstancetandt from '../services/axiosInstance';
import DatePicker from 'react-datepicker';
import { gs1ApplicationIndicators } from '../constants/applicationIndicators';
import dayjs from 'dayjs';
import "react-datepicker/dist/react-datepicker.css";
import AuthCheckbox from './authCheckbox';
import SizeSelector from './SizeSelector';
import { CircleFadingArrowUp } from 'lucide-react';
import BarcodeLimitIndicator from './BarcodeLimitIndicator';


interface DataAttribute {
    key: string;
    value: string;
}

interface FormState {
    data: string;
    bc_nos: string;
    width: string;
    height: string;
    gtin: string;
    batch_no: string;
    consumer_product_variant: string;
    serial_no: string;
    serial_prefix: string;
    dataAttributes: DataAttribute[];
    domain: string;
    serial_start: string;
    [key: string]: any;
    productName: any
    productImage: any
    productId: any
    barcodeName: any
}


type Errors = { [key: string]: string };

const initialState: FormState = {
    data: '',
    bc_nos: '',
    width: '100',
    height: '100',
    gtin: '',
    batch_no: '',
    serial_no: '',
    consumer_product_variant: '',
    dataAttributes: [{ key: '', value: '' }],
    domain: 'gs1.example.org',
    serial_prefix: '',
    serial_start: '',
    productName: '',
    productImage: '',
    productId: '',
    barcodeName: ''
};

const DOMAIN_OPTIONS = [
    { value: 'Sakksh.com', key: 'Sakksh.com' },
    { value: '8aiku.com', key: '8aiku.com' },
    { value: 'Custom Domain', key: 'customdomain' }
];

const gs1ApplicationIdentifiers = [
    { key: '00', value: 'Serial Shipping Container Code (SSCC)' },
    { key: '01', value: 'Global Trade Item Number (GTIN)' },
    { key: '253', value: 'Global Document Type Identifier (GDTI)' },
    { key: '255', value: 'Global Coupon Number (GCN)' },
    { key: '401', value: 'Global Identification Number for Consignment (GINC)' },
    { key: '402', value: 'Global Shipment Identification Number (GSIN)' },
    { key: '414', value: 'Identification of a physical location - Global Location Number' },
    { key: '417', value: 'Party GLN' },
    { key: '8003', value: 'Global Returnable Asset Identifier (GRAI)' },
    { key: '8004', value: 'Global Individual Asset Identifier (GIAI)' },
    { key: '8006', value: 'Identification of an individual trade item piece' },
    { key: '8010', value: 'Component/Part Identifier (CPID)' },
    { key: '8013', value: 'Global Model Number (GMN)' },
    { key: '8017', value: 'Global Service Relation Number - Provider' },
    { key: '8018', value: 'Global Service Relation Number - Recipient' },
    { key: '0000', value: 'None' }
];

const GS1DigitalLinkBarcodeWeb = ({ titel = true, onGenerate, loading, authenticationType, setAuthenticationType }: {
    onGenerate: (params: any) => void;
    loading: boolean;
    authenticationType?: string;
    setAuthenticationType?: (type: string) => void
    titel?: boolean
}) => {
    const [form, setForm] = useState<FormState>({ ...initialState });
    const [errors, setErrors] = useState<Errors>({});
    const [checkbox, setCheckbox] = useState(false);
    const [linkTypecheckbox, setLinkTypeCheckbox] = useState(false);
    const [showAttributes, setShowAttributes] = useState(false);
    const [bctype, setBcType] = useState('gs1dlqrcode');
    const [text, setText] = useState('');
    const [enableDomainInput, setEnableDomainInput] = useState(false);
    const [domain, setDomain] = useState('Sakksh.com');
    const [identifiers, setIdentifiers] = useState('');
    const [keyQualifiers, setKeyQualifiers] = useState(false);
    const [linkTypes, setLinkTypes] = useState<any[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [showMessage, setShowMessage] = useState(false);
    const [showPlanMessage, setShowPlanMessage] = useState(false);

    const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);




    const [showDatePickers, setShowDatePickers] = useState<boolean[]>([]);

    const datePickerRefs = useRef<(HTMLDivElement | null)[]>([]);




    // Initialize date picker visibility state when attributes change
    useEffect(() => {
        setShowDatePickers(new Array(form.dataAttributes.length).fill(false));
    }, [form.dataAttributes]);


    const parseYYMMDDToDate = (str: string | null | undefined): Date | null => {

        console.log('str', str);


        if (!str || typeof str !== 'string' || str.length !== 6) {
            console.error('Invalid date string format. Expected YYMMDD, got:', str);
            return null;
        }

        try {
            const year = '20' + str.slice(0, 2);
            const month = str.slice(2, 4);
            const day = str.slice(4, 6);
            const dateStr = `${year}-${month}-${day}`;
            const date = new Date(dateStr);

            // Validate the date
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }

            console.log('datedatedate', date);

            return date;
        } catch (error) {
            console.error('Failed to parse date:', error);
            return null;
        }
    };

    const parseCustomDate = (str: string) => {
        if (!str || str.length !== 6) return "";

        const year = 2000 + parseInt(str.slice(0, 2)); // Assumes year >= 2000
        const month = parseInt(str.slice(2, 4)) - 1;   // Month is 0-indexed
        const day = parseInt(str.slice(4, 6));

        const date = new Date(year, month, day);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        }); // e.g. "Jul 11, 2025"
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const newVisibility = [...showDatePickers];
            let shouldUpdate = false;

            showDatePickers.forEach((isVisible, i) => {
                if (isVisible && datePickerRefs.current[i]) {
                    if (
                        datePickerRefs.current[i] &&
                        !datePickerRefs.current[i]!.contains(event.target as Node)
                    ) {
                        newVisibility[i] = false;
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                setShowDatePickers(newVisibility);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDatePickers]);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isMobile = width < 400;


    useEffect(() => {
        const getGs1Types = async () => {
            try {
                const { status, data } = await axiosInstancetandt.get('/unknown/gs1/links');
                console.log('data', data);
                if (status === 200) {
                    setLinkTypes(data.map((prod: any) => ({
                        key: prod?.id || '',
                        value: prod?.title,
                        description: prod?.description
                    })));
                }
            } catch (err) {
                console.error('Failed to fetch GS1 types:', err);
            }
        };
        getGs1Types();
    }, []);

    useEffect(() => {
        const baseUrl = `https://${enableDomainInput ? form.domain : domain}`;
        const gtinPart = form.gtin?.trim() ? `/${identifiers}/${form.gtin}` : '';
        const pathQualifiers = [];

        if (keyQualifiers) {
            if (form.consumer_product_variant?.trim()) {
                pathQualifiers.push(`/22/${form.consumer_product_variant}`);
            }
            if (form.batch_no?.trim()) {
                pathQualifiers.push(`/10/${form.batch_no}`);
            }
            if (form.serial_no?.trim() && (!checkbox || form.bc_nos?.trim() === '')) {
                pathQualifiers.push(`/21/${form.serial_no}`);
            }
        }

        const attributeParams = showAttributes
            ? form.dataAttributes
                .filter(attr => attr.key && attr.value)
                .map(attr => `${encodeURIComponent(attr.key)}=${encodeURIComponent(attr.value)}`)
            : [];

        const linkTypeParams = linkTypecheckbox
            ? selectedTypes.map(type => `linkType=gs1:${type.trim().toLowerCase().replace(/\s+/g, '')}`)
            : [];

        const allQueryParams = [...attributeParams, ...linkTypeParams].join('&');
        const url = `${baseUrl}${gtinPart}${pathQualifiers.join('')}${allQueryParams ? `?${allQueryParams}` : ''}`;

        setText(url);
    }, [
        domain,
        form,
        enableDomainInput,
        identifiers,
        keyQualifiers,
        showAttributes,
        selectedTypes,
        linkTypecheckbox,
        checkbox
    ]);

    const clearError = (field: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleChange = (name: string, value: string) => {
        clearError(name);
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAttribute = () => {
        setForm(prev => ({
            ...prev,
            dataAttributes: [...prev.dataAttributes, { key: '', value: '' }]
        }));
    };

    const handleRemoveAttribute = (index: number) => {
        setForm(prev => ({
            ...prev,
            dataAttributes: prev.dataAttributes.filter((_, i) => i !== index)
        }));
    };

    const handleAttributeChange = (index: number, field: 'key' | 'value', text: string) => {
        setForm(prev => {
            const updatedAttributes = [...prev.dataAttributes];
            updatedAttributes[index] = { ...updatedAttributes[index], [field]: text };
            return { ...prev, dataAttributes: updatedAttributes };
        });
    };

    const isPositiveInt = (val: string) => /^\d+$/.test(val) && parseInt(val, 10) >= 0;
    const isAlphaNumericWithSpecialChars = (val: string) => /^[A-Z0-9\-\s]+$/.test(val);

    const runValidation = (): boolean => {
        const newErrors: Errors = {};

        if (keyQualifiers && form.consumer_product_variant.trim() !== '' && !isPositiveInt(form.consumer_product_variant)) {
            newErrors.consumer_product_variant = 'Consumer product variant must be a positive integer';
        }

        if (keyQualifiers && form.batch_no.trim() !== '' && !isAlphaNumericWithSpecialChars(form.batch_no)) {
            newErrors.batch_no = 'Batch number must be uppercase letters, numbers, hyphens (e.g. BATCH-001)';
        }

        if (keyQualifiers && form.serial_no.trim() !== '' && !isAlphaNumericWithSpecialChars(form.serial_no)) {
            newErrors.serial_no = 'Serial number must be uppercase letters, numbers, hyphens (e.g. SN-2025-A1)';
        }

        if (form.serial_prefix.trim() !== '' && !isAlphaNumericWithSpecialChars(form.serial_prefix)) {
            newErrors.serial_prefix = 'Serial prefix must be uppercase letters, numbers, hyphens (e.g. DEV-, MFG-A1-)';
        }

        if (form.height.trim() !== '' && !isPositiveInt(form.height)) {
            newErrors.height = 'Height must be a positive integer';
        }

        if (form.width.trim() !== '' && !isPositiveInt(form.width)) {
            newErrors.width = 'Width must be a positive integer';
        }

        if (checkbox && form.bc_nos.trim() !== '' && !isPositiveInt(form.bc_nos)) {
            newErrors.bc_nos = 'Barcode Qty must be a positive integer';
        }

        if (checkbox && form.bc_nos.trim() !== '') {
            if (form.serial_start.trim() === '') {
                newErrors.serial_start = 'Please enter Serial start';
            } else if (!isPositiveInt(form.serial_start)) {
                newErrors.serial_start = 'Serial start must be a positive integer';
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length) {
            //   const firstField = Object.keys(newErrors)[0];
            //   alert(`Validation Error: ${newErrors[firstField]}`);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!runValidation()) return;

        const params = {
            bc_type: bctype,
            data: text,
            ...(form.width.trim() && { width: form.width }),
            ...(form.height.trim() && { height: form.height }),
            ...(checkbox && form.bc_nos.trim() && {
                serialised: form.bc_nos,
                serial_prefix: form.serial_prefix,
                serial_start: form.serial_start,
                bc_nos: form.bc_nos
            }),
        };

        onGenerate(params);
    };

    const handleDomainSelect = (key: any) => {
        if (key === "customdomain") {
            setEnableDomainInput(true);
        } else {
            setEnableDomainInput(false);
            setDomain(key);
        }
    };



    useEffect(() => {
        if (form.bc_nos.trim() !== '') {
            setForm(prev => ({ ...prev, serial_no: '' }));
        }
    }, [form.bc_nos]);

    useEffect(() => {
        if (form.serial_no.trim() !== '') {
            setCheckbox(false);
        }
    }, [form.serial_no]);


    const handleToggle = (type?: string) => {
        // Example check: user is not logged in or plan is limited
        const userLoggedIn = false; // replace with your auth check
        const hasPremiumPlan = false; // replace with plan check

        if (type === "EnableDataAttributes") {
            if (!userLoggedIn || !hasPremiumPlan) {
                setShowMessage(true);
                // Optionally reset the checkbox
                setShowAttributes(false);
                // Hide message after 3 seconds
                setTimeout(() => setShowMessage(false), 2000);
                return;
            }

            setShowAttributes(!showAttributes);
        } else {
            if (!userLoggedIn || !hasPremiumPlan) {
                setShowPlanMessage(true);
                // Optionally reset the checkbox
                setLinkTypeCheckbox(false);
                // Hide message after 3 seconds
                setTimeout(() => setShowPlanMessage(false), 2000);
                return;
            }
            setLinkTypeCheckbox(!linkTypecheckbox)

        }

    };

    const handleDisable = () => {
        // Required fields
        if (!form.barcodeName.trim() || !form.productName.trim()) return true;

        // Identifier must be selected
        if (!identifiers) return true;

        // If "None" is selected, Product ID is required
        if (identifiers === "0000" && !form.productId.trim()) return true;

        // For other identifiers, GTIN is required
        if (identifiers !== "0000" && !form.gtin.trim()) return true;

        // All checks passed → enable button
        return false;
    };


    return (
        <div className="w-full">

            {titel && <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Your GS1 Digital Link</h2>}

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Generated URL</h3>
                <div className="text-sm text-gray-800 break-all">{text}</div>
            </div>

            <div className={`${isMobile ? "flex flex-col gap-4" : "flex  gap-5 w-full items-center justify-center "} mb-6`}>
                <div className="flex items-center">
                    <input
                        id='GS1 DL - QR Code'
                        type="checkbox"
                        checked={bctype === 'gs1dlqrcode'}
                        onChange={() => setBcType('gs1dlqrcode')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor='GS1 DL - QR Code' className="ml-2  block text-sm font-medium text-gray-700">
                        GS1 DL - QR Code
                    </label>
                </div>

                <div className="flex items-center">
                    <input
                        id='GS1 DL - DataMatrix'
                        type="checkbox"
                        checked={bctype === 'gs1dldatamatrix'}
                        onChange={() => setBcType('gs1dldatamatrix')}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor='GS1 DL - DataMatrix' className="ml-2 block text-sm font-medium text-gray-700">
                        GS1 DL - DataMatrix
                    </label>
                </div>
            </div>

            <BarcodeLimitIndicator
                className="mb-4"
                onLogout={() => {


                }}
                type="gs1dlqrcode"
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


            <div className="space-y-6 mb-5">
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
                                } h-12`} // 👈 same height as input
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


            <div className="mb-6">
                <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                    Choose Your Domain
                </label>
                <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => handleDomainSelect(e.target.value)}
                >
                    {DOMAIN_OPTIONS.map(option => (
                        <option key={option.key} value={option.key}>
                            {option.value}
                        </option>
                    ))}
                </select>
            </div>

            {enableDomainInput && (
                <div className="mb-6">
                    <label className="block  text-left text-sm font-medium text-gray-700 mb-2">
                        Custom Domain
                    </label>
                    <input
                        type="text"
                        value={form.domain}
                        onChange={(e) => handleChange('domain', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            )}

            <div className="mb-6">
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                    Choose Your Identifier<span className="text-red-500 pl-[1px]">*</span>
                </label>

                <select
                    className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    onChange={(e) => setIdentifiers(e.target.value)}
                    value={identifiers}
                >
                    {/* Default placeholder - cannot be selected */}
                    <option key="default" value="" disabled>
                        -- Select an Identifier --
                    </option>

                    {gs1ApplicationIdentifiers.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.value}
                        </option>
                    ))}
                </select>


                {identifiers === "0000" ?
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
                    </div> : identifiers !== "" ? (
                        <div className="flex">

                            <input
                                disabled={true}
                                type="text"
                                value={`(${identifiers})`}
                                onChange={(e) => handleChange('gtin', e.target.value)}
                                placeholder=""
                                className="w-1/6 px-3 py-2 text-center border border-r-0 border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

                            />

                            <input
                                type="text"
                                value={form.gtin}
                                onChange={(e) => handleChange('gtin', e.target.value)}
                                className="w-5/6 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter identifier value"
                            />
                        </div>) : null}

            </div>

            <div className="mb-6 flex items-center">
                <input
                    id='keyQualifiers'
                    type="checkbox"
                    checked={keyQualifiers}
                    onChange={() => setKeyQualifiers(!keyQualifiers)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor='keyQualifiers' className="ml-2 block text-sm font-medium text-gray-700">
                    Specify Key Qualifiers
                </label>
            </div>

            {keyQualifiers && (
                <>
                    <div className="mb-4">
                        <label className="block text-sm text-left font-medium text-gray-700 mb-1">
                            Consumer product variant (22)
                        </label>
                        <input
                            type="text"
                            value={form.consumer_product_variant}
                            placeholder="Enter consumer product variant"
                            onChange={(e) => handleChange('consumer_product_variant', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.consumer_product_variant && (
                            <p className="mt-1 text-left text-sm text-red-600">{errors.consumer_product_variant}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm  text-left font-medium text-gray-700 mb-1">
                            Batch or lot number (10)
                        </label>
                        <input
                            type="text"
                            value={form.batch_no}
                            placeholder="Enter batch or lot number"
                            onChange={(e) => handleChange('batch_no', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.batch_no && (
                            <p className="mt-1 text-left text-sm text-red-600">{errors.batch_no}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm  text-left font-medium text-gray-700 mb-1">
                            Serial number (21)
                        </label>
                        <input
                            type="text"
                            value={form.serial_no}
                            onChange={(e) => handleChange('serial_no', e.target.value)}
                            placeholder="Enter serial number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {errors.serial_no && (
                            <p className="mt-1 text-left text-sm text-red-600">{errors.serial_no}</p>
                        )}
                    </div>
                </>
            )}

            <div className="mb-6 flex items-center opacity-50">
                <input
                    id='showAttributes'
                    type="checkbox"
                    checked={showAttributes}
                    onChange={() => handleToggle("EnableDataAttributes")}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor='showAttributes' className="ml-2 block text-sm font-medium text-gray-700">
                    Enable Data Attributes
                </label>
                <CircleFadingArrowUp height={18} width={18} style={{ paddingLeft: 3 }} />
            </div>

            {showMessage && (
                <div className=" text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 mt-[-20px] mb-2">
                    Please <span className="font-semibold underline cursor-pointer">log in</span> or <span className="font-semibold underline cursor-pointer">upgrade your plan</span> to enable this feature.
                </div>
            )}

            {showAttributes && (
                <div className="mb-6">
                    <h3 className="text-sm text-left font-medium text-gray-700 mb-3">Data Attributes:</h3>

                    {form.dataAttributes.map((attr, index) => (
                        <div key={index} className="flex items-end mb-4">
                            <div className="flex-1 mr-2">
                                <label className="block text-left text-sm text-gray-600 mb-1">Key</label>
                                <select
                                    value={attr.key}
                                    onChange={(e) => { handleAttributeChange(index, 'key', e.target.value); handleAttributeChange(index, 'value', '') }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Key</option>
                                    {gs1ApplicationIndicators.map(ai => (
                                        <option key={ai.key} value={ai.key}>
                                            {ai.value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-1 mr-2">
                                <label className="block text-sm text-left text-gray-600 mb-1">Value</label>
                                {['11', '12', '13', '15', '16', '17', '7003'].includes(attr.key) ? (
                                    <div className="relative" ref={(el) => (datePickerRefs.current[index] = el)}>
                                        <input
                                            type="text"
                                            value={parseCustomDate(attr.value || '')}
                                            onClick={() => {
                                                const newShowDatePickers = [...showDatePickers];
                                                newShowDatePickers[index] = true;
                                                setShowDatePickers(newShowDatePickers);
                                            }}
                                            className="w-full h-[38.19px] px-3 py-2 border border-gray-300 rounded-md"
                                            readOnly
                                            placeholder="Click to select date"
                                        />

                                        {showDatePickers[index] && (
                                            <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                                                <DatePicker
                                                    inline
                                                    // selected={attr.value ? new Date(attr.value) : null}
                                                    selected={attr.value ? parseYYMMDDToDate(attr.value) : null}

                                                    onChange={(date) => {
                                                        if (date) {
                                                            // const formattedDate = formatDate(date);
                                                            const formattedDate = dayjs(date).format('YYMMDD');
                                                            handleAttributeChange(index, 'value', formattedDate);

                                                            // Close the date picker after selection
                                                            const newShowDatePickers = [...showDatePickers];
                                                            newShowDatePickers[index] = false;
                                                            setShowDatePickers(newShowDatePickers);
                                                        }
                                                    }}
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    dropdownMode="select"
                                                    calendarClassName="!bg-white !rounded-md !shadow-md"


                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type={['10', '21', '250', '8011'].includes(attr.key) ? "number" : "text"}
                                        value={attr.value}
                                        onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                        placeholder='Enter the value'
                                        className="w-full h-[38.19px]  px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveAttribute(index)}
                                className="px-3 h-[38.19px]  py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                disabled={form.dataAttributes.length <= 1}
                            >
                                -
                            </button>
                        </div>
                    ))}

                    <div className="w-full flex items-start">
                        <button
                            type="button"
                            onClick={handleAddAttribute}
                            className="px-3 py-2 bg-indigo-600  text-white rounded-md hover:bg-indigo-700"
                        >
                            + Add Attribute
                        </button>
                    </div>
                </div>
            )}

            <div className="mb-6 flex items-center opacity-50">
                <input
                    id='linkTypecheckbox'
                    type="checkbox"
                    checked={linkTypecheckbox}
                    onChange={() => handleToggle()}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor='linkTypecheckbox' className="ml-2 block text-sm font-medium text-gray-700">
                    Specify Link Type
                </label>
                <CircleFadingArrowUp height={18} width={18} style={{ paddingLeft: 3 }} />
            </div>

            {showPlanMessage && (
                <div className=" text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100 mt-[-20px] mb-2">
                    Please <span className="font-semibold underline cursor-pointer">log in</span> or <span className="font-semibold underline cursor-pointer">upgrade your plan</span> to enable this feature.
                </div>
            )}

            {linkTypecheckbox && (
                <div className="mb-6">
                    <label className="block text-sm text-left font-medium text-gray-700 mb-2">
                        Select GS1 Link Type
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        onChange={(e) => setSelectedTypes([e.target.value])}
                    >
                        <option value="">Select a link type</option>
                        {linkTypes.map(link => (
                            <option key={link.key} value={link.value}>
                                {link.value}
                            </option>
                        ))}
                    </select>
                </div>
            )}



            <SizeSelector form={form} handleChange={handleChange} />



            {(!keyQualifiers || form.serial_no.trim() === '') && (
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <input
                            id='Serialization'
                            type="checkbox"
                            checked={checkbox}
                            onChange={() => setCheckbox(!checkbox)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <label htmlFor='Serialization' className="ml-2 block text-sm font-medium text-gray-700">
                            Serialization
                        </label>
                    </div>

                    {checkbox && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Serial Prefix
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., ABC-"
                                    value={form.serial_prefix}
                                    onChange={(e) => handleChange('serial_prefix', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.serial_prefix && (
                                    <p className="mt-1 text-left text-sm text-red-600">{errors.serial_prefix}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Serial Start
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g., 1000"
                                    value={form.serial_start}
                                    onChange={(e) => handleChange('serial_start', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.serial_start && (
                                    <p className="mt-1 text-left text-sm text-red-600">{errors.serial_start}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                                    Barcode Quantity
                                </label>
                                <input
                                    type="number"
                                    placeholder="Number of barcodes"
                                    value={form.bc_nos}
                                    onChange={(e) => handleChange('bc_nos', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.bc_nos && (
                                    <p className="mt-1 text-sm text-left text-red-600">{errors.bc_nos}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}


            <AuthCheckbox authenticationType={authenticationType} setAuthenticationType={setAuthenticationType} />

            <button
                onClick={handleSubmit}
                disabled={loading || handleDisable()}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${loading || handleDisable() ? 'bg-gray-400' : 'bg-[#1F4B73]'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {loading ? 'Generating...' : 'Generate Barcode'}
            </button>
        </div>
    );
};

export default GS1DigitalLinkBarcodeWeb;