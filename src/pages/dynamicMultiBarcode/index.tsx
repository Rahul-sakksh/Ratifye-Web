import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GS1DigitalLinkBarcodeWeb from "../../components/gs1DigitalLink";
import GS12DBarcodeForm from "../../components/gs12DBarcode";
import MultiUrlBarcodeForm from "../../components/MultiUrlBarcodeForm";
import axiosInstance from "../../services/axiosInterceptor";
import QRTypeSelector from "../../components/QRTypeSelector";
import SizeSelector from "../../components/SizeSelector";
import ActiveIndicator from "../../components/activeIndicator";
import AuthCheckbox from "../../components/authCheckbox";
// import QRCodeForm from "../../components/QRCodeForm";

import barcodeImage from "../../assets/svg/barcode.svg";
import vite from "../../assets/svg/vite.svg";
import ErrorModal from "../../components/ErrorModal";
import EnhancedCarouselWithCustomizer from "../../components/carousal";
import { ChevronDown, FileText, Globe2, Info, ScanLine, Wrench } from "lucide-react";
import MultiUrlBarcode from "../../components/MultiUrlBarcodeForm";
import BarcodePricing from "../../components/pricingTier";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthPopup from "../../components/authPopup";
import barcodeLimit from "../../utils/barcodeLimit";
import BarcodeLimitIndicator from "../../components/BarcodeLimitIndicator";
import FAQ from "../../components/f&qComponent";

interface FormState {
    data: string;
    bc_nos: string;
    width: string;
    height: string;
    qrType?: string;
    barcodeName: string;
}

const initialState: FormState = {
    data: '',
    bc_nos: '',
    width: '100',
    height: '100',
    qrType: 'static',
    barcodeName: ''
};

type Errors = { [key: string]: string };



const DynamicMultiBarcodePage = () => {
    const [selectedType, setSelectedType] = useState("gs1digitallink");
    const [hoverType, setHoverType] = useState('');

    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);


    const [form, setForm] = useState<FormState>({ ...initialState });

    const fadeInUp = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.5 },
    };



    const [isGenerated, setIsGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseImage, setResponseImage] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [singleBarcodeImage, setSingleBarcodeImage] = useState<string>('');
    const [barcodeImageLoading, setBarcodeImageLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});
    const [showToast, setShowToast] = useState(false);
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    // add this state at top of your component
    const [showAll, setShowAll] = useState(false);




    const [errorModal, setErrorModal] = useState({
        show: false,
        title: '',
        message: ''
    });

    const [authenticationType, setAuthenticationType] = useState<'withAuth' | 'withoutAuth'>('withAuth');

    const { type } = useParams(); // "type" comes from the URL
    const navigate = useNavigate();

    useEffect(() => {
        if (type) {
            setSelectedType(type);
        }
    }, [type]);


    const PRICING = [
        {
            name: "Starter",
            price: "Free",
            blurb: "Kick the tires with limited volume",
            generation: "Up to 5k scans/mo",
            users: "3 seats",
            analytics: "Basic dashboards",
            adminAccess: "Standard roles",
            features: ["Multi-URL sandbox", "Basic GS1 encodes", "Email support"],
            href: "#/extend-trial",
        },
        {
            name: "Growth",
            price: "$299/mo",
            blurb: "For teams scaling ops",
            generation: "Up to 50k scans/mo",
            users: "25 seats",
            analytics: "Advanced + exports",
            adminAccess: "RBAC + audit logs",
            features: ["Unlimited rules", "On-device scanning", "Reports & exports"],
            href: "#/request-demo",
            highlight: true,
        },
        {
            name: "Enterprise",
            price: "Talk to us",
            blurb: "Security, SSO & SLAs",
            generation: "Custom limit",
            users: "Unlimited seats",
            analytics: "Enterprise + APIs",
            adminAccess: "SSO, SCIM, SOC2",
            features: ["Custom domains", "RBAC & approvals", "Premium support"],
            href: "#/request-demo",
        },
    ];

    const barcodeData = [
        {
            id: "gs12dbarcode",
            type: "GS1 2D Barcode",
            header: "Global Identification. Seamless Supply Chains.",
            subtext: "Enable universal product recognition and transparency across manufacturing, retail, and logistics using GS1 barcoding standards."
        },

        {
            id: "gs1digitallink",
            type: "GS1 Digital Link",
            header: "Connect Products to the Digital Ecosystem.",
            subtext: "Transform static packaging into interactive digital identities with GS1-compliant digital links for global traceability and engagement."
        },

        {
            id: "sscc18",
            type: "SSCC-18",
            info: " (Serial Shipping Container Code)",
            header: "Intelligent Logistics. Real-Time Visibility.",
            subtext: "Track shipments at every stage with serialized container codes that enhance logistics accuracy, traceability, and delivery efficiency."
        },
        {
            id: "multiurl",
            type: "Multi-URL",
            header: "One Code. Infinite Possibilities.",
            subtext: "Deliver dynamic experiences by routing each scan based on role, location, device, or time — all from a single, editable QR."
        },
        {
            id: "qrcode",
            type: "QR Code",
            header: "Smarter Scans. Instant Connections.",
            subtext: "Bridge the physical and digital worlds with secure, data-rich QR codes that deliver real-time insights to businesses and consumers."
        },


        {
            id: "ean13",
            type: "EAN-13",
            header: "Retail-Ready Identification, Globally Accepted.",
            subtext: "Streamline product management and point-of-sale operations using the world’s most recognized retail barcode format."
        },
        {
            id: "code128",
            type: "CODE-128",
            header: "Data-Dense, Precision-Driven Encoding.",
            subtext: "Capture complex logistics and manufacturing data efficiently with high-density CODE-128 barcoding for enterprise-grade operations."
        },
        {
            id: "cln",
            type: "GLN",
            info: " (Global Location Number)",
            header: " Location Identity You Can Trust.",
            subtext: "Assign GS1-compliant GLNs to legal entities, facilities, docks, shelves, and digital endpoints to enable error-free EDI, WMS/TMS routing, recall precision, and partner onboarding."
        }
    ];

    const barcodeDetails = [
        {
            id: "multiurl",
            title: "Multi-URL",
            header: "Discover the Power of Multi-URL Routing",
            subtext: "Learn how dynamic QR routing adapts by user role, location, and device—simplifying compliance, marketing, and analytics."
        },
        {
            id: "gs1digitallink",
            title: "GS1 Digital Link (QR)",
            header: "Turn Packaging into a Digital Identity",
            subtext: "Route every scan to the right, compliant experience while capturing real-time analytics across markets and channels."
        },
        {
            id: "qrcode",
            title: "QR Code (Standard)",
            header: "Connect Physical to Digital in One Scan",
            subtext: "Deliver product pages, videos, and support instantly—boosting engagement and measuring performance at every touchpoint."
        },
        {
            id: "ean13",
            title: "EAN-13 (Retail GTIN-13)",
            header: "Speed Up Checkout, Standardize Identity",
            subtext: "Ensure universal POS recognition and inventory accuracy with globally accepted GTINs."
        },
        {
            id: "code128",
            title: "GS1-128 / Code-128 (with AIs)",
            header: "Encode What Operations Need to Know",
            subtext: "Carry GTIN, batch/lot, expiry, and more in a high-density symbol for manufacturing, warehousing, and healthcare."
        },
        {
            id: "sscc18",
            title: "SSCC (Serial Shipping Container Code)",
            header: "Track Every Pallet from Dock to Door",
            subtext: "Gain end-to-end shipment visibility and cleaner ASN/EDI flows with serialized logistics units."
        },
        {
            id: "cln",
            title: "GLN (Global Location Number)",
            header: "Give Every Site a Single Source of Truth",
            subtext: "Identify plants, warehouses, stores, and doors unambiguously—reducing routing errors and accelerating partner onboarding."
        },
        {
            id: "gs12dbarcode",
            title: "GS1 Barcode (Standards Suite)",
            header: "One Language for the Entire Supply Chain",
            subtext: "Adopt interoperable identifiers that unify products, locations, and shipments—driving compliance, traceability, and scale."
        }
    ];

    const selectedItem = barcodeDetails.find(item => item.id === selectedType);

    const brand = "#005EB8";





    const handleChange = (name: string, value: string) => {
        clearError(name);
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const isPositiveInt = (val: string) => /^\d+$/.test(val) && parseInt(val, 10) >= 0;

    const clearError = (field: string) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const runValidation = (): boolean => {
        const newErrors: Errors = {};

        if (form.bc_nos.trim() !== '' && !isPositiveInt(form.bc_nos)) {
            newErrors.bc_nos = 'Barcode Qty must be a positive integer';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length) {
            return false;
        }
        return true;
    };

    const hanleGenerateBarcode = () => {

        if (!runValidation()) return;

        const params: Record<string, any> = {
            bc_type: selectedType,
            data: form.data,
            ...(form.width.trim() !== '' && { width: Number(form.width) }),
            ...(form.height.trim() !== '' && { height: Number(form.height) }),
            ...(form.bc_nos.trim() !== '' && Number(form.bc_nos) > 0 && { serialised: Number(form.bc_nos) }),
            ...(form.bc_nos.trim() !== '' && Number(form.bc_nos) > 0 && { bc_nos: Number(form.bc_nos) }),

        };
        generateBarcode(params)
    }



    const generateBarcode = async (params?: any) => {
        const isLoggedIn = barcodeLimit.isUserLoggedIn();

        if (!isLoggedIn) {
            if (!barcodeLimit.canGenerateStatic(params.bc_type)) {
                const { message } = barcodeLimit.getLimitStatus(params.bc_type);
                alert(
                    `Generation Limit Reached: ${message} Please register or login to continue generating Multi-URL barcodes.`
                );
                return;
            }
        }

        setIsGenerated(true);

        console.log('params', params);

        try {
            setLoading(true);
            const res = await axiosInstance.get(`/gen/gen-barcode${authenticationType == 'withoutAuth' ? "-woenc" : ""}`, { params });

            if (res.status == 200) {
                if (!isLoggedIn) {
                    barcodeLimit.incrementCount(params.bc_type);
                }
                if (res.data?.['filenames']) {
                    console.log('res.data.filenames', res.data.filenames);
                    setResponseImage(res.data.filenames);
                    setShowModal(true);
                    setShowToast(true);

                    // Hide toast after 3 seconds
                    setTimeout(() => {
                        setShowToast(false);
                    }, 3000);
                } else if (res.data?.['filename']) {
                    console.log('res.data.filename', res.data.filename);
                    setResponseImage([res.data.filename]);
                    setShowModal(true);
                    setShowToast(true);

                    // Hide toast after 3 seconds
                    setTimeout(() => {
                        setShowToast(false);
                    }, 3000);
                } else {
                    setResponseImage([]);
                    setShowModal(false);

                    alert('Error : Empty response from server');
                }
            }
        } catch (err: any) {
            console.log(err.response);

            setResponseImage([]);
            setShowModal(false);


            let title = 'Request Failed';
            let message = 'Please try again later.';

            if (err.message === 'Network Error' || !err.response) {
                title = 'Connection Failed';
                message = 'Unable to reach the server. Check your internet connection and try again.';
            } else if (err.response.status === 500) {
                const errorDetail = err.response?.data?.detail || '';

                if (errorDetail.includes('GS1bad')) {
                    title = 'Barcode Generation Failed';
                    const aiMatch = errorDetail.match(/AI (\d+)/);
                    const ai = aiMatch?.[1];

                    const aiMessages: Record<string, string> = {
                        '01': 'Invalid GTIN (Global Trade Item Number). The checksum is incorrect.',
                        '17': 'Invalid Expiry Date (AI 17). Check the format (YYMMDD).',
                        '10': 'Invalid Batch/Lot number (AI 10). Check the input.',
                        '21': 'Invalid serial number (AI 21). Check the input.'
                    };

                    message = ai
                        ? aiMessages[ai] || `Invalid data in Application Identifier (AI ${ai}). Check the format.`
                        : 'Invalid barcode data. Please check and try again.';
                } else if (errorDetail.includes('ean8badLength')) {
                    title = 'Invalid EAN-8 Barcode';
                    message = 'EAN-8 must be 7 or 8 digits long. Please correct the input.';
                } else if (errorDetail.includes('ean13badLength')) {
                    title = 'Invalid EAN-13 Barcode';
                    message = 'EAN-13 must be 12 or 13 digits long. Please correct the input.';
                } else {
                    message = errorDetail || message;
                }
            } else {
                message = err.response?.data?.detail || message;
            }

            setErrorModal({
                show: true,
                title,
                message
            });
        } finally {
            setLoading(false);
        }
    }

    const closeModal = () => {
        setErrorModal({
            show: false,
            title: '',
            message: ''
        });
    };


    return (
        <motion.div {...fadeInUp} className="container w-full mx-auto sm:px-4 py-6 md:px-10 lg:px-10 ">

            <ErrorModal
                show={errorModal.show}
                title={errorModal.title}
                message={errorModal.message}
                onClose={closeModal}
            />
            {showToast && (
                <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-medium">Barcode generated successfully!</span>
                    </div>
                </div>
            )}
            <h1 className="text-center pt-2 pb-4 text-3xl sm:text-4xl font-semibold text-[#1F4B73] leading-snug">
                Fast, Accurate and Smart GS1 Barcode Generator for the Digital Supply Chain.
            </h1>

            <p className="text-center pb-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Generate and authenticate secure GS1 barcodes in seconds — all in one API-powered platform.
            </p>

            <div className="gap-8  grid grid-cols-1 overflow-visible ">




                <div className="bg-gray-50  shadow-lg rounded-2xl flex flex-col gap-4 overflow-visible">
                    {/* <h2 className="text-xl px-6 pt-6 font-bold  text-gray-800 mb-1">
                        GS1 & Enterprise Formats — What to use, where, and why.
                    </h2> */}



                    <div className="py-6 px-6 lg:px-18 overflow-y-auto">

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                            {barcodeData.slice(0, 4).map((type, index) => (
                                <Link
                                    key={type.id}
                                    to={type.id === "multiurl" ? "/multiurl" : `/barcodeGen/${type.id}`}
                                >
                                    <motion.div
                                        whileHover={{ y: -6 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`relative cursor-pointer rounded-[24px] border transition-all duration-300 h-full flex flex-col
          ${type.id === "multiurl"
                                                ? "border-[#0EA5A4] bg-[#f0fdfc] shadow-md"
                                                : selectedType === type.id
                                                    ? "border-[#1F4B73] bg-[#f5f9fc] shadow-md"
                                                    : "border-[#e6eef5] bg-white hover:border-[#0EA5A4] hover:shadow-lg"
                                            }`}
                                        onClick={() => setSelectedType(type.id)}
                                    >

                                        {/* Badge */}
                                        {type.id === "multiurl" && (
                                            <span className="absolute -top-2 -right-2 bg-[#0EA5A4] text-white text-[10px] font-semibold px-2 py-[2px] rounded-full shadow">
                                                Most Popular
                                            </span>
                                        )}

                                        <div className="p-5 flex-1">
                                            <div className="flex items-center gap-4">

                                                {/* Icon */}
                                                <div
                                                    className={`rounded-xl p-3
                ${type.id === "multiurl"
                                                            ? "bg-[#0EA5A4]"
                                                            : selectedType === type.id
                                                                ? "bg-[#1F4B73]"
                                                                : "bg-[#f1f5f9]"
                                                        }`}
                                                >
                                                    <img
                                                        src={selectedType === type.id || type.id === "multiurl" ? vite : barcodeImage}
                                                        alt={type.type}
                                                        className="h-8 w-8"
                                                    />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">

                                                    {/* Title + Tooltip */}
                                                    <div className="flex items-center gap-1 relative">

                                                        <span
                                                            className={`font-semibold text-[15px]
                    ${selectedType === type.id
                                                                    ? "text-[#1F4B73]"
                                                                    : "text-slate-800"
                                                                }`}
                                                        >
                                                            {type.type}
                                                        </span>

                                                        <span
                                                            className="relative flex items-center"
                                                            onMouseEnter={() => setHoverType(type.id)}
                                                            onMouseLeave={() => setHoverType("")}
                                                        >
                                                            <Info
                                                                size={14}
                                                                className="text-slate-400 cursor-pointer hover:text-[#0EA5A4]"
                                                            />

                                                            {/* Tooltip */}
                                                            {hoverType === type.id && (
                                                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 
                      bg-white border border-[#e6eef5] text-xs text-slate-600 
                      p-3 rounded-xl shadow-lg z-50">

                                                                    {type.info && <p className="mb-1">{type.info}</p>}
                                                                    {type.subtext && (
                                                                        <p className="text-slate-500">{type.subtext}</p>
                                                                    )}

                                                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 
                        w-2 h-2 bg-white border-l border-t border-[#e6eef5] rotate-45" />
                                                                </div>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Subtitle */}
                                                    <h5
                                                        className={`text-[12px] mt-1
                  ${selectedType === type.id
                                                                ? "text-[#0EA5A4]"
                                                                : "text-slate-500"
                                                            }`}
                                                    >
                                                        {type.header}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Button */}
                        {barcodeData.length > 4 && (
                            <div className="flex mt-7">
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-[#1F4B73] hover:bg-[#183b5a] rounded-xl shadow transition-all"
                                >
                                    Other Barcodes
                                </button>
                            </div>
                        )}

                        {/* Remaining */}
                        {showAll && (
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                {barcodeData.slice(4).map((type, index) => (
                                    <Link key={type.id} to={`/barcodeGen/${type.id}`}>
                                        <motion.div
                                            whileHover={{ y: -6 }}
                                            className={`rounded-[24px] border p-5 transition-all
          ${selectedType === type.id
                                                    ? "border-[#1F4B73] bg-[#f5f9fc]"
                                                    : "border-[#e6eef5] bg-white hover:border-[#0EA5A4]"
                                                }`}
                                            onClick={() => setSelectedType(type.id)}
                                        >
                                            <div className="flex items-center gap-4">

                                                {/* ICON */}
                                                <div
                                                    className={`rounded-xl p-3
              ${selectedType === type.id
                                                            ? "bg-[#1F4B73]"
                                                            : "bg-[#f1f5f9]"
                                                        }`}
                                                >
                                                    <img
                                                        src={selectedType === type.id ? vite : barcodeImage}
                                                        alt={type.type}
                                                        className="h-8 w-8"
                                                    />
                                                </div>

                                                {/* TEXT */}
                                                <div className="flex-1 min-w-0">

                                                    {/* TITLE + INFO */}
                                                    <div className="flex items-center gap-1 relative">

                                                        <span className="text-sm font-semibold text-[#1F4B73]">
                                                            {type.type}
                                                        </span>

                                                        <span
                                                            className="relative flex items-center"
                                                            onMouseEnter={() => setHoverType(type.id)}
                                                            onMouseLeave={() => setHoverType("")}
                                                        >
                                                            <Info
                                                                size={14}
                                                                className="text-slate-400 cursor-pointer hover:text-[#0EA5A4]"
                                                            />

                                                            {/* TOOLTIP */}
                                                            {hoverType === type.id && (
                                                                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 
                    bg-white border border-[#e6eef5] text-xs text-slate-600 
                    p-3 rounded-xl shadow-lg z-50">

                                                                    {type?.info && <p className="mb-1">{type.info}</p>}
                                                                    {type?.subtext && (
                                                                        <p className="text-slate-500">{type.subtext}</p>
                                                                    )}

                                                                    {/* Arrow */}
                                                                    <div className="absolute left-1/2 -translate-x-1/2 -top-1 
                      w-2 h-2 bg-white border-l border-t border-[#e6eef5] rotate-45" />
                                                                </div>
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* SUBTEXT */}
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {type.header}
                                                    </p>

                                                </div>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>


                </div>

                <section className="px-4 sm:px-0 pt-8 pb-4 sm:mt-[-30px]">
                    {selectedItem && (
                        <div className="rounded-[28px] border border-[#e6eef5] bg-white p-5 md:p-6 
    flex flex-col md:flex-row items-start md:items-center justify-between gap-6 
    shadow-[0_16px_45px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_60px_rgba(31,75,115,0.12)] 
    transition-all duration-300">

                            {/* Text */}
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-semibold text-[#1F4B73] mb-2">
                                    {selectedItem.header}
                                </h2>
                                <p className="text-slate-600 leading-relaxed">
                                    {selectedItem.subtext}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">

                                {/* Primary */}
                                <button
                                    onClick={() => navigate("/requestForDemo")}
                                    className="px-6 py-3 rounded-2xl font-semibold text-white text-center 
          shadow-md transition-all duration-300 
          bg-[#1F4B73] hover:bg-[#183b5a]"
                                >
                                    Request Demo
                                </button>

                                {/* Secondary */}
                                <button
                                    onClick={() => navigate(`/pricingByBcType/${selectedItem?.id}`)}
                                    className="px-6 py-3 rounded-2xl font-semibold text-center 
          border border-[#0EA5A4] text-[#0EA5A4] 
          hover:bg-[#0EA5A4] hover:text-white 
          transition-all duration-300"
                                >
                                    Get Pricing
                                </button>
                            </div>
                        </div>
                    )}
                </section>



                {/* <h1 className="px-6 lg:px-18 text-left pt-10 text-xl">Live Barcode & QR Generator — Type, validate, download</h1> */}

                <div className="bg-white rounded-2xl shadow-lg mx-4 sm:mx-0 px-6 py-6 lg:py-2 items-start  grid grid-cols-1 md:grid-cols-2 gap-6   lg:px-18 lg:gap-10 ">

                    {selectedType === 'gs1digitallink' && (
                        <motion.div {...fadeInUp} className="lg:py-10 flex flex-col justify-between min-h-[500px] h-full">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">GS1 Digital Link</h2>

                            <GS1DigitalLinkBarcodeWeb
                                onGenerate={generateBarcode}
                                loading={loading}
                                authenticationType={authenticationType}
                                setAuthenticationType={(type: any) => setAuthenticationType(type)}
                                titel={false}
                            />
                        </motion.div>
                    )}

                    {/* GS1 2D Barcode */}
                    {selectedType === 'gs12dbarcode' && (
                        <motion.div {...fadeInUp} className="lg:py-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">GS1 2D Barcode</h2>

                            <GS12DBarcodeForm
                                onGenerate={generateBarcode}
                                loading={loading}
                                authenticationType={authenticationType}
                                setAuthenticationType={(type: any) => setAuthenticationType(type)}
                                title={false}
                            />
                        </motion.div>
                    )}

                    {/* Multi URL Barcode */}
                    {selectedType === 'multiurl' && (
                        <motion.div {...fadeInUp} className="lg:py-10">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Multi Url</h2>
                            <MultiUrlBarcode onGenerate={generateBarcode} loading={loading} title={false} />
                        </motion.div>
                    )}




                    {!['gs1digitallink', 'gs12dbarcode', 'multiurl'].includes(selectedType) && <motion.div {...fadeInUp}>
                        <div className='lg:py-10  flex flex-col min-h-[500px] h-full '>


                            <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedType?.toLocaleUpperCase()}</h2>

                            <QRTypeSelector qrType={form.qrType} setQRType={(type) => { handleChange('qrType', type) }} />

                            <BarcodeLimitIndicator
                                className="mb-4"
                                onLogout={() => {


                                }}
                                type={selectedType}
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


                            {/* Barcode Data Input */}
                            <div className="mb-6">
                                <label htmlFor="barcodeData" className="block text-sm text-left font-medium text-gray-700 mb-2">
                                    Barcode content<span className="text-red-500 pl-[1px]">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="barcodeData"
                                        value={form.data}
                                        onChange={(e) => handleChange('data', e.target.value)}
                                        className="w-full px-4 py-2 pr-[105px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 font-mono">
                                        {form.data.length} chars
                                    </div>
                                </div>
                            </div>


                            <SizeSelector form={form} handleChange={handleChange} />



                            {/* Font Size and Quantity */}
                            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                            <div>
                                <label htmlFor="quantity" className="block text-left text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max="100"
                                    value={form.bc_nos}
                                    onChange={(e) => handleChange('bc_nos', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {errors.bc_nos && (
                                    <p className="mt-1 text-sm text-left text-red-600">{errors.bc_nos}</p>
                                )}
                            </div>
                        </div> */}

                            {/* {{activeTab == '2d' && */}
                            <AuthCheckbox authenticationType={authenticationType} setAuthenticationType={(type: any) => setAuthenticationType(type)} />

                            {/*  }  */}

                            {/* Generate and Download Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    disabled={form.data.trim() === '' || loading || form.barcodeName.trim() === ''}
                                    onClick={hanleGenerateBarcode}
                                    className={`flex items-center justify-center gap-2 flex-1 px-6 py-3 ${form.data.trim() === '' || loading || form.barcodeName.trim() === '' ? 'bg-gray-400' : 'bg-[#1F4B73]'
                                        } text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium cursor-pointer`}
                                >
                                    {loading ? (
                                        <>
                                            <ActiveIndicator />
                                            Loading...
                                        </>
                                    ) : isGenerated ? (
                                        'Regenerate Barcode'
                                    ) : (
                                        'Generate Barcode'
                                    )}
                                </button>
                            </div>

                        </div>
                    </motion.div>}


                    <div className='lg:py-10 flex flex-col items-center  gap-10 h-full w-full'>
                        <h2 className="text-2xl font-bold text-gray-800">Barcode Preview</h2>

                        {showModal && responseImage.length > 0 ? (
                            // Replace the old Carousel with the new EnhancedCarouselWithCustomizer
                            <motion.div {...fadeInUp}>
                                <EnhancedCarouselWithCustomizer data={responseImage} />
                            </motion.div>
                        ) : singleBarcodeImage ? (
                            // Display single barcode image from MultiUrlBarcodeForm
                            <motion.div {...fadeInUp}>
                                <div className="flex flex-col items-center w-full space-y-8">
                                    <div className="w-full grid items-center justify-center">
                                        <div className="bg-white border-2 rounded-2xl w-72 h-72 flex items-center justify-center shadow-md hover:shadow-lg transition relative">
                                            {barcodeImageLoading ? (
                                                <div className="text-gray-600 text-center px-3">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                    <p className="text-sm">Loading barcode...</p>
                                                </div>
                                            ) : (
                                                <img
                                                    src={singleBarcodeImage}
                                                    alt="Generated Barcode"
                                                    className="max-w-full max-h-full object-contain rounded-lg"
                                                    onError={() => {
                                                        console.error('Error loading barcode image');
                                                        setBarcodeImageLoading(false);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div {...fadeInUp}>
                                <div className="flex flex-col items-center w-full space-y-8">
                                    {/* Preview */}
                                    <div className="w-full grid items-center justify-center">
                                        <div className="bg-gray-50 border-2 border-dashed rounded-2xl w-72 h-72 flex items-center justify-center shadow-md hover:shadow-lg transition">
                                            <div className="text-gray-600 text-center px-3">
                                                {/* <p className="font-bold text-lg mb-2">{getSelectedType()?.name || "Select a Type"}</p> */}
                                                <p className="text-sm">Barcode Preview</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Use Cases */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                                        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                                            <FileText className="w-10 h-10 text-blue-600 mb-4" />
                                            <h3 className="font-semibold text-lg">CSV Export</h3>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Export all your customized barcodes to CSV for bulk usage.
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                                            <Wrench className="w-10 h-10 text-green-600 mb-4" />
                                            <h3 className="font-semibold text-lg">Customization</h3>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Personalize colors, add text, and adjust layouts easily.
                                            </p>
                                        </div>

                                        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                                            <ScanLine className="w-10 h-10 text-slate-600 mb-4" />
                                            <h3 className="font-semibold text-lg">Test Scanner</h3>
                                            <p className="text-gray-500 text-sm mt-2">
                                                Instantly test your barcode with our built-in scanner tool.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                        )}

                        {/* <div className="flex flex-col w-full xl:w-4/6 sm:flex-row gap-3 md:flex-col lg:flex-row">
                        {isGenerated && responseImage.length > 0 && (
                            <>
                                <button
                                    onClick={() => { }}
                                    className="px-6 py-3 bg-green-600 w-full  text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-medium flex items-center justify-center"
                                >
                                    <Download className="mr-2" size={20} />
                                    Download ({responseImage.length})
                                </button>

                                <button
                                    onClick={() => { }}
                                    className="px-6 py-3 bg-blue-600 w-full  text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        width={20}
                                        height={20}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 12v2a4 4 0 004 4h8a4 4 0 004-4v-2M16 6l-4-4m0 0L8 6m4-4v16"
                                        />
                                    </svg>
                                    Share
                                </button>
                            </>
                        )}
                    </div> */}

                    </div>

                </div>

            </div>



            <section className=" px-4  pt-12 sm:px-0 sm:pt-14 pb-8 ">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Barcode Generation: Key Questions Before Implementation
                </h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                    Your go-to checklist for tech leaders, quality managers, and brand owners planning a compliant, future-ready barcode rollout across global or Indian supply chains
                </p>
                <FAQ expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} faqs={[
                    {
                        q: "What is Barcode Generation and why is it important for businesses?",
                        a: "Barcode generation is the process of creating unique scannable codes (like QR Codes, GS1 GTIN, or EAN-13) that store product, asset, or tracking information. These codes simplify inventory management, authentication, logistics, and retail checkout. For businesses, barcodes reduce manual errors, speed up operations, and ensure data accuracy across the supply chain. Platforms like SAKKSH Barcode Generator make it easy to create GS1-compliant, dynamic, and multi-URL barcodes with just a few clicks.",
                        keywords: ["barcode generation", "GS1 barcode", "barcode generator online", "product barcode creation", "business barcoding"],
                    },
                    {
                        q: "How can I create a barcode online for my products?",
                        a: "You can easily generate barcodes online using advanced platforms like SAKKSH. Just enter your product details (GTIN, SKU, or asset ID), choose the barcode type (EAN-13, UPC, QR Code, GS1 Digital Link, etc.), and download the barcode in formats like PNG, SVG, or PDF. SAKKSH supports both static and dynamic barcodes, allowing you to edit links or data even after printing — perfect for smart packaging and real-time analytics.",
                        keywords: ["create barcode online", "GS1 barcode generator", "QR code for product", "dynamic barcode generation", "barcode for packaging"],
                    },
                    {
                        q: "What are the different types of barcodes and which one should I use?",
                        a: "The most common barcode types include:\n\n• EAN-13 / UPC-A – Retail and consumer goods\n• Code 128 – Logistics, shipping, and warehouses\n• Data Matrix / QR Code – Pharma, healthcare, and traceability\n• GS1 Digital Link QR – Smart packaging and connected products\n\nThe choice depends on your industry and regulatory needs. For example, Pharma and FMCG brands should use GS1-compliant codes for compliance and supply-chain visibility.",
                        keywords: ["barcode types", "EAN-13 vs QR code", "GS1 Digital Link", "pharma barcode", "retail barcode"],
                    },
                    {
                        q: "What is a GS1 Barcode and how does it differ from normal barcodes?",
                        a: "A GS1 barcode is a globally standardized barcode issued under the GS1 system that ensures unique product identification worldwide. It includes structured data like GTIN (Global Trade Item Number) and can link to digital product information using GS1 Digital Link. Unlike generic barcodes, GS1 barcodes support traceability, compliance, and interoperability, making them essential for exports, pharma regulations, and large retail chains.",
                        keywords: ["GS1 barcode meaning", "GS1 Digital Link", "GS1 barcode registration India", "GS1 vs normal barcode", "global product identification"],
                    },
                    {
                        q: "What are Dynamic Barcodes and how do they improve traceability and marketing?",
                        a: "Dynamic barcodes (such as Multi-URL QR codes) can be updated even after printing — enabling businesses to change URLs, track scans, and personalize experiences for each user or region. With SAKKSH, brands can use dynamic QR codes for track & trace, anti-counterfeit protection, digital authentication, and smart campaigns, turning every product into an interactive digital touchpoint.",
                        keywords: ["dynamic barcode", "multi-URL QR code", "smart packaging", "barcode tracking", "product authentication QR"],
                    },
                ]} />
            </section>




            <AuthPopup
                show={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
            />


            {/* <section id="pricing" >
                <BarcodePricing selectedType={selectedItem?.title} />
            </section> */}

        </motion.div >
    );
};

export default DynamicMultiBarcodePage;


