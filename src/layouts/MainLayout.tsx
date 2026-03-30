import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import AuthPopup from "../components/authPopup";
import logo from "/src/assets/jpg/RatifyeLogo.jpeg";
import { ChevronRight, ChevronDown } from "lucide-react";


const NAV_ITEMS = [
    { label: "Home", path: "/main/home" },
    { label: "Solutions", path: "/main/solutions" },
    { label: "Blogs", path: "/main/blogs" },
    { label: "Contact", path: "/main/contact" },
];


const NAV_PAGES = [
    {
        key: "gs1",
        label: "GS1",
        slug: "gs1-barcode-generation",
        href: "/gs1-barcode-generation",
        shortTitle: "GS1 Barcode Foundation",
        subtitle: "Structured product identity",
        brief:
            "Generate GS1-ready barcode identity using GTIN, batch, expiry, and serial logic for pharma packaging.",
    },
    {
        key: "authentication",
        label: "Authentication",
        slug: "barcode-authentication",
        href: "/barcode-authentication",
        shortTitle: "Barcode Authentication",
        subtitle: "Scan to trust decision",
        brief:
            "Turn barcode scans into real-time verification outcomes with trust signals and product validation logic.",
    },
    {
        key: "serialization",
        label: "Serialization",
        slug: "pharma-serialization",
        href: "/pharma-serialization",
        shortTitle: "Pharma Serialization",
        subtitle: "Unit-level identity",
        brief:
            "Assign unique serial identity across unit, carton, and pallet layers for stronger control and traceability.",
    },
    {
        key: "track",
        label: "Track & Trace",
        slug: "track-and-trace",
        href: "/track-and-trace",
        shortTitle: "Track & Trace",
        subtitle: "Movement visibility",
        brief:
            "Connect scan events with downstream product movement records across warehouse, distributor, and pharmacy checkpoints.",
    },
    {
        key: "digital",
        label: "Diversion",
        slug: "market-diversion-detection",
        href: "/market-diversion-detection",
        shortTitle: "Market Diversion",
        subtitle: "Route anomaly detection",
        brief:
            "Identify suspicious market movement through barcode-linked channel, geo, and route validation workflows.",
    },
    {
        key: "warehouse",
        label: "Warehouse",
        slug: "warehouse-verification",
        href: "/warehouse-barcode-verification",
        shortTitle: "Warehouse Verification",
        subtitle: "Operational scan control",
        brief:
            "Validate product identity during receiving, storage, handling, and dispatch with structured scan states.",
    },
];

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [open, setOpen] = useState(false);
    const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);


    return (
        <div className="min-h-screen bg-white text-[#1F4B73] font-sans">

            {/* HEADER */}
            <header className="sticky top-0 z-50 border-b border-[#e6eef5] bg-white/90 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

                    {/* LOGO */}
                    <div onClick={() => navigate('/main/home')} className="flex items-center gap-3 cursor-pointer">
                        <img
                            src={logo}
                            alt="Ratifye Logo"
                            className="h-12 object-contain rounded-md p-2 shadow-[0_10px_30px_rgba(31,75,115,0.18)]"
                        />
                    </div>

                    {/* NAV - Desktop */}
                    <nav className="hidden lg:flex gap-8 text-sm relative">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.path} className="relative">
                                <button
                                    onClick={() => {
                                        if (item.label === "Solutions") {
                                            setOpen((prev) => !prev);
                                        } else {
                                            setOpen(false);
                                            navigate(item.path)
                                        }
                                    }}
                                    onMouseEnter={() => {
                                        if (item.label === "Solutions") {
                                            setOpen(true);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (item.label === "Solutions") {
                                            setOpen(false);
                                        }
                                    }}
                                    className={`transition ${location.pathname === item.path
                                        ? "text-[#1F4B73] font-semibold"
                                        : "text-slate-600 hover:text-[#0EA5A4]"
                                    }`}
                                >
                                    {item.label}
                                </button>

                                {/* CENTERED DROPDOWN */}
                                {item.label === "Solutions" && open && (
                                    <div  onMouseEnter={() => {
                                            setOpen(true);
                                    }}
                                    onMouseLeave={() => {
                                            setOpen(false);
                                    }} className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-5px)] mt-2 z-50 w-[980px] overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.10),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(31,75,115,0.08),transparent_22%)]" />

                                        <div className="relative grid gap-4 lg:grid-cols-[0.34fr_0.66fr]">
                                            <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#07111D_0%,#1F4B73_60%,#0EA5A4_100%)] p-6 text-white">
                                                <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">
                                                    Solutions Overview
                                                </div>
                                                <h3 className="mt-3 text-2xl font-semibold">
                                                    Connected pharma workflows built around barcode intelligence
                                                </h3>
                                                <p className="mt-4 text-sm leading-7 text-slate-100">
                                                    Explore GS1 barcode generation, authentication, serialization,
                                                    track and trace, market diversion review, and warehouse
                                                    verification through one premium product system.
                                                </p>

                                                <div className="mt-6 grid gap-3">
                                                    {[
                                                        "GS1-ready product identity",
                                                        "Scan-based verification logic",
                                                        "Operational movement visibility",
                                                    ].map((item) => (
                                                        <div
                                                            key={item}
                                                            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100"
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-4 md:grid-cols-2">
                                                {NAV_PAGES.map((page) => (
                                                    <button
                                                        key={page.key}
                                                        type="button"
                                                        onClick={() => {
                                                            navigate(`/main/solutions/${page.slug}`);
                                                            setOpen(false);
                                                        }}
                                                        className="group rounded-[28px] border p-5 text-left transition border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <div className="text-xs uppercase tracking-[0.18em] text-teal-600">
                                                                    {page.subtitle}
                                                                </div>
                                                                <div className="mt-2 text-lg font-semibold text-slate-900">
                                                                    {page.shortTitle}
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                                                        </div>

                                                        <p className="mt-3 text-sm leading-7 text-slate-600">
                                                            {page.brief}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* ACTIONS */}
                    <div className="hidden lg:flex gap-3">
                        <button
                            onClick={() => setShowAuthPopup(true)}
                            className="px-4 py-2 rounded-full border border-[#d9e7f1] text-sm"
                        >
                            Login
                        </button>

                        <button
                            onClick={() => navigate("/barcodeGen/gs1digitallink")}
                            className="px-5 py-2 rounded-full bg-[#1F4B73] text-white text-sm"
                        >
                            Generate
                        </button>
                    </div>

                    {/* MOBILE MENU */}
                    <button
                        className="lg:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        ☰
                    </button>
                </div>

                {/* MOBILE NAV */}
                {mobileOpen && (
                    <div className="lg:hidden px-6 pb-4">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.path}>
                                {/* Main Nav Item */}
                                <div
                                    onClick={() => {
                                        if (item.label === "Solutions") {
                                            setMobileSolutionsOpen(!mobileSolutionsOpen);
                                        } else {
                                            navigate(item.path);
                                            setMobileOpen(false);
                                        }
                                    }}
                                    className="py-2 text-slate-700 cursor-pointer flex items-center justify-between"
                                >
                                    <span>{item.label}</span>
                                    {item.label === "Solutions" && (
                                        <ChevronDown 
                                            className={`h-4 w-4 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                                        />
                                    )}
                                </div>

                                {/* Solutions Submenu */}
                                {item.label === "Solutions" && mobileSolutionsOpen && (
                                    <div className="ml-4 mt-2 space-y-2">
                                        {NAV_PAGES.map((page) => (
                                            <div
                                                key={page.key}
                                                onClick={() => {
                                                    navigate(`/main/solutions/${page.slug}`);
                                                    setMobileOpen(false);
                                                    setMobileSolutionsOpen(false);
                                                }}
                                                className="py-2 px-3 text-sm text-slate-600 hover:text-[#0EA5A4] cursor-pointer rounded-lg hover:bg-slate-50"
                                            >
                                                <div className="font-semibold">{page.shortTitle}</div>
                                                <div className="text-xs text-slate-500 mt-1">{page.subtitle}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </header>

            {/* PAGE CONTENT */}
            <Outlet />

            {/* AUTH POPUP */}
            <AuthPopup
                show={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
                AuthMode="login"
            />

            {/* FOOTER */}
            <footer className="border-t border-[#e6eef5] mt-10">
                <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between flex-wrap gap-4 text-sm text-slate-500">
                    <div>
                        <div className="font-semibold text-[#1F4B73]">Ratifye</div>
                        <p className="text-xs mt-1">
                            GS1 barcode & pharma platform
                        </p>
                    </div>

                    <div className="flex gap-5">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.path}
                                onClick={() =>{ if(
                                    item.label === "Solutions"      ){
                                        setOpen(prev => !prev);
                                }else{ navigate(item.path)}}}
                                className="hover:text-[#0EA5A4]"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}