import React, { useEffect, useMemo, useState } from "react";
import AnimatedWrapper from "../../components/AnimatedWrapper";
import AuthPopup from "../../components/authPopup";
import { useNavigate, useParams } from "react-router-dom";
import logo from "/src/assets/jpg/RatifyeLogo.jpeg";
import { ChevronDown, ChevronRight } from "lucide-react";
import SolutionTabsComponent from "../../components/solutionTabComponent";
import { a } from "framer-motion/client";

const NAV_ITEMS = [
    { key: "home", label: "Home" },
    { key: "solutions", label: "Solutions" },
    { key: "blogs", label: "Blogs" },
    { key: "contact", label: "Contact" },
];

const IMAGE_ASSETS = {
    heroBackdrop:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=1600&q=80",
    heroPack:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1400&q=80",
    scannerPhone:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80",
    warehouse:
        "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1400&q=80",
    packagingLine:
        "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=80",
    gs1Explainer:
        "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1400&q=80",
    authentication:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    serialization:
        "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1400&q=80",
    traceability:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    digitalLink:
        "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80",
    warehouseVerification:
        "https://images.unsplash.com/photo-1586528116493-0e3d3b5fd2df?auto=format&fit=crop&w=1400&q=80",
    blogGs1:
        "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=1400&q=80",
    blogAuth:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1400&q=80",
    blogSerial:
        "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1400&q=80",
    blogTrace:
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1400&q=80",
    contact:
        "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1400&q=80",
    fallback:
        "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?auto=format&fit=crop&w=1400&q=80",
};

const SOLUTIONS = [
    {
        pageKey: "gs1",
        slug: "gs1-barcode-generation",
        title: "GS1 Barcode Generation",
        short: "Generate GS1 DataMatrix, QR, and barcode identities for pharmaceutical packaging.",
        heroTitle: "GS1 Barcode Generation for Pharmaceutical Products",
        heroText:
            "Create GS1-compliant barcode structures for primary, secondary, and tertiary packaging using GTIN, batch, expiry, and serial-linked identity rules.",
        keywords: ["GS1 barcode generation", "GS1 DataMatrix", "GTIN barcode", "pharma barcode"],
        image: IMAGE_ASSETS.packagingLine,
        points: [
            "Generate packaging-level barcode identities",
            "Support GTIN, batch, expiry, and serial structures",
            "Align printed codes with enterprise workflows",
            "Prepare packaging for authentication and traceability",
        ],
    },
    {
        pageKey: "authentication",
        slug: "barcode-authentication",
        title: "Pharmaceutical Authentication",
        short: "Verify medicines using scan-based product authentication workflows.",
        heroTitle: "Pharmaceutical Product Authentication System",
        heroText:
            "Enable medicine verification through GS1 barcode scanning, authentication logic, and trusted product-response flows across pharmaceutical supply chains.",
        keywords: ["pharmaceutical authentication", "medicine verification", "product authentication system"],
        image: IMAGE_ASSETS.authentication,
        points: [
            "Scan-based authenticity checks",
            "Verification against product identity and trust rules",
            "Useful for pharmacies, distributors, and consumers",
            "Supports anti-counterfeit positioning and response workflows",
        ],
    },
    {
        pageKey: "serialization",
        slug: "pharma-serialization",
        title: "Serialization",
        short: "Assign unique product identity for stronger traceability and product control.",
        heroTitle: "Pharmaceutical Serialization with GS1 Barcode Identity",
        heroText:
            "Connect each pharmaceutical unit to a serial-linked identity structure that strengthens product-level visibility, trust, and downstream verification workflows.",
        keywords: ["pharma serialization", "serialized barcode", "drug serialization system"],
        image: IMAGE_ASSETS.serialization,
        points: [
            "Unique serial identity for each product unit",
            "Supports packaging hierarchy and aggregation logic",
            "Improves track and trace readiness",
            "Builds stronger product-level trust across the supply chain",
        ],
    },
    {
        pageKey: "track",
        slug: "track-and-trace",
        title: "Track and Trace",
        short: "Monitor product movement and scan-based visibility across the supply chain.",
        heroTitle: "Track and Trace System for Pharmaceutical Supply Chains",
        heroText:
            "Use barcode-linked interactions to improve visibility, movement tracking, and verification events across warehouses, distributors, pharmacies, and downstream checkpoints.",
        keywords: ["track and trace pharma", "supply chain traceability", "drug traceability system"],
        image: IMAGE_ASSETS.traceability,
        points: [
            "Visibility across product movement touchpoints",
            "Distributor and warehouse verification checkpoints",
            "Supports downstream trust and operational control",
            "Connects scans with product journey intelligence",
        ],
    },
    {
            pageKey: "digital",
        slug: "market-diversion-detection",
        title: "Market Diversion",
        short: "Identify suspicious market movement through barcode-linked channel and route validation.",
        heroTitle: "Market Diversion Detection for Pharmaceutical Supply Chains",
        heroText:
            "Detect and prevent unauthorized product movement by validating barcode scans against defined distribution routes, geographies, and channel flows.",
        keywords: [
            "market diversion detection",
            "pharma diversion control",
            "supply chain anomaly detection",
            "barcode route validation"
        ],
        image: IMAGE_ASSETS.digitalLink, // you can change if you have a specific asset
        points: [
            "Detect route and channel-level anomalies",
            "Validate product movement using geo and scan data",
            "Identify unauthorized distribution patterns",
            "Strengthen control over supply chain integrity",
        ],
    },
    {
        pageKey: "warehouse",
        slug: "warehouse-verification",
        title: "Warehouse Verification",
        short: "Enable scan-based validation at warehouse and distribution checkpoints.",
        heroTitle: "Warehouse and Distribution Barcode Verification",
        heroText:
            "Improve scanning discipline and operational trust by validating product identity, packaging status, and verification logic at warehouse and distributor checkpoints.",
        keywords: ["warehouse barcode verification", "distribution scanning", "pharma warehouse verification"],
        image: IMAGE_ASSETS.warehouseVerification,
        points: [
            "Role-based verification flows",
            "Operational scanning checkpoints for warehouses",
            "Better control over product movement and validation",
            "Supports downstream supply chain trust workflows",
        ],
    },
];

const BLOGS = [
    {
        slug: "what-is-gs1-barcode-in-pharma",
        title: "What Is a GS1 Barcode in Pharma?",
        excerpt:
            "Understand how GS1 barcodes support product identity, compliance, and traceability in pharmaceutical packaging.",
        category: "GS1 Education",
        image: IMAGE_ASSETS.blogGs1,
    },
    {
        slug: "how-to-authenticate-medicines-using-barcodes",
        title: "How to Authenticate Medicines Using Barcode Scanning",
        excerpt:
            "Learn how scan-based product authentication improves trust, verification speed, and anti-counterfeit readiness.",
        category: "Authentication",
        image: IMAGE_ASSETS.blogAuth,
    },
    {
        slug: "why-pharma-serialization-matters",
        title: "Why Pharmaceutical Serialization Matters",
        excerpt:
            "Explore why serial-linked identity is important for product traceability, compliance, and supply chain visibility.",
        category: "Serialization",
        image: IMAGE_ASSETS.blogSerial,
    },
    {
        slug: "track-and-trace-in-pharmaceutical-supply-chains",
        title: "Track and Trace in Pharmaceutical Supply Chains",
        excerpt:
            "See how barcode-linked visibility improves product movement tracking from packaging to downstream verification.",
        category: "Traceability",
        image: IMAGE_ASSETS.blogTrace,
    },
];

function Icon({ name, className = "h-5 w-5" }) {
    const common = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.8",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
    };

    switch (name) {
        case "arrow-right":
            return (
                <svg {...common}>
                    <path d="M5 12h14" />
                    <path d="m13 5 7 7-7 7" />
                </svg>
            );
        case "chevron-right":
            return (
                <svg {...common}>
                    <path d="m9 18 6-6-6-6" />
                </svg>
            );
        case "menu":
            return (
                <svg {...common}>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                </svg>
            );
        case "scan":
            return (
                <svg {...common}>
                    <path d="M4 7V5a1 1 0 0 1 1-1h2" />
                    <path d="M17 4h2a1 1 0 0 1 1 1v2" />
                    <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
                    <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
                    <path d="M4 12h16" />
                </svg>
            );
        case "shield":
            return (
                <svg {...common}>
                    <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
                    <path d="m9.5 12 1.7 1.7 3.3-3.7" />
                </svg>
            );
        case "layers":
            return (
                <svg {...common}>
                    <path d="m12 3 9 5-9 5-9-5 9-5z" />
                    <path d="m3 12 9 5 9-5" />
                    <path d="m3 16 9 5 9-5" />
                </svg>
            );
        case "database":
            return (
                <svg {...common}>
                    <ellipse cx="12" cy="5" rx="7" ry="3" />
                    <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                    <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
                </svg>
            );
        case "mail":
            return (
                <svg {...common}>
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                </svg>
            );
        case "chart":
            return (
                <svg {...common}>
                    <path d="M4 19h16" />
                    <path d="M7 16V9" />
                    <path d="M12 16V5" />
                    <path d="M17 16v-7" />
                </svg>
            );
        case "code":
            return (
                <svg {...common}>
                    <path d="m8 8-4 4 4 4" />
                    <path d="m16 8 4 4-4 4" />
                    <path d="m14 4-4 16" />
                </svg>
            );
        default:
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="8" />
                </svg>
            );
    }
}

function PharmaImage({ src, alt, className = "", overlay = true }) {
    const [error, setError] = useState(false);
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                src={error ? IMAGE_ASSETS.fallback : src}
                alt={alt}
                className="h-full w-full object-cover"
                onError={() => setError(true)}
            />
            {overlay ? (
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,75,115,0.04),rgba(31,75,115,0.28))]" />
            ) : null}
        </div>
    );
}

function Badge({ children }) {
    return (
        <span className="rounded-full border border-[#d9e7f1] bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
            {children}
        </span>
    );
}

function Card({ children, className = "" }) {
    return (
        <div
            className={`rounded-[32px] border border-[#e6eef5] bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ${className}`}
        >
            {children}
        </div>
    );
}

function SectionTitle({ eyebrow, title, text, invert = false, centered = false }) {
    return (
        <div className={`${centered ? "mx-auto text-center" : ""} max-w-3xl`}>
            <p
                className={`text-sm font-semibold uppercase tracking-[0.18em] ${invert ? "text-[#8fe5dd]" : "text-[#0EA5A4]"
                    }`}
            >
                {eyebrow}
            </p>
            <h2
                className={`mt-2 text-3xl font-semibold tracking-tight md:text-4xl ${invert ? "text-white" : "text-[#1F4B73]"
                    }`}
            >
                {title}
            </h2>
            {text ? (
                <p className={`mt-4 text-base leading-8 ${invert ? "text-slate-300" : "text-slate-600"}`}>
                    {text}
                </p>
            ) : null}
        </div>
    );
}

function ScannerDemo() {
    const [status, setStatus] = useState("success");

    const statusStyles =
        status === "success"
            ? {
                background: "rgba(16,185,129,0.15)",
                borderColor: "rgba(16,185,129,0.3)",
                label: "Authentic Product",
                chip: "✔ Verified",
            }
            : {
                background: "rgba(239,68,68,0.15)",
                borderColor: "rgba(239,68,68,0.3)",
                label: "Verification Failed",
                chip: "✖ Failed",
            };

    return (
        <div className="mx-auto flex w-full max-w-5xl justify-center rounded-[28px] border border-[#e6eef5] bg-white p-3 shadow-[0_20px_60px_rgba(31,75,115,0.08)] lg:p-4">
            <div className="grid w-full max-w-4xl gap-3 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
                <div className="flex items-center justify-center rounded-[32px] bg-[linear-gradient(135deg,#0f172a_0%,#1F4B73_50%,#0b3f52_100%)] p-5 text-white shadow-inner">
                    <div className="relative w-full max-w-[290px] rounded-[34px] border border-white/10 bg-[#07111d] p-3">
                        <div className="overflow-hidden rounded-[28px] bg-slate-950 relative">
                            <div className="relative h-[520px]">
                                <PharmaImage src={IMAGE_ASSETS.scannerPhone} alt="scanner" className="absolute inset-0" />
                                <div className="absolute left-5 right-5 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#5EEAD4] via-white to-[#5EEAD4] animate-pulse" />
                                <div
                                    className="absolute bottom-4 left-4 right-4 rounded-xl p-4 backdrop-blur-md border text-sm"
                                    style={{
                                        background: statusStyles.background,
                                        borderColor: statusStyles.borderColor,
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{statusStyles.label}</span>
                                        <span className="text-xs">{statusStyles.chip}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-4">
                    <Card>
                        <h3 className="text-lg font-semibold text-[#1F4B73]">Live Scanner State</h3>
                        <p className="mt-2 text-sm text-slate-600">Toggle between authentication outcomes.</p>
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => setStatus("success")}
                                className="rounded-full bg-[#0EA5A4] px-4 py-2 text-sm text-white"
                            >
                                Show Success
                            </button>
                            <button
                                onClick={() => setStatus("fail")}
                                className="rounded-full bg-[#1F4B73] px-4 py-2 text-sm text-white"
                            >
                                Show Failed
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function CapabilityCard({ title, text, image }) {
    return (
        <Card className="group overflow-hidden bg-white p-0 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,75,115,0.10)]">
            <PharmaImage src={image} alt={title} className="h-44 w-full" />
            <div className="p-6">
                <h3 className="text-xl font-semibold tracking-tight text-[#1F4B73]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
        </Card>
    );
}

function Homepage({ setCurrentPage, setActiveSolution }) {
    return (
        <main>
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0c1f33_0%,#1F4B73_58%,#0EA5A4_100%)] text-white">
                <div className="absolute inset-0 opacity-20">
                    <PharmaImage
                        src={IMAGE_ASSETS.heroBackdrop}
                        alt="Pharmaceutical GS1 barcode background"
                        className="h-full w-full"
                        overlay={false}
                    />
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(143,229,221,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(31,75,115,0.25),transparent_36%)]" />

                <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pt-24">
                    <div>
                        <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#dffaf7] backdrop-blur">
                            GS1 barcode • authentication • serialization • track & trace
                        </div>

                        <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                            Pharmaceutical Barcode Authentication & GS1 Traceability Platform
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                            Generate GS1 barcodes, verify medicines instantly, and connect each product to structured authentication, serialization, and supply chain traceability workflows.
                        </p>

                        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-200/90">
                            Ratifye gives pharmaceutical teams a cleaner way to scan, validate, and trust every barcode-driven product interaction.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1F4B73] shadow-lg">
                                Generate GS1 Barcode <Icon name="arrow-right" className="h-4 w-4" />
                            </button>

                            <button
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
                                onClick={() => setCurrentPage("contact")}
                            >
                                Book Pharma Demo <Icon name="chevron-right" className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-200">
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">GS1 compliant</span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">Mobile ready</span>
                            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur">No hardware required</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/8 p-3 shadow-[0_30px_80px_rgba(7,17,29,0.28)] backdrop-blur">
                            <PharmaImage
                                src={IMAGE_ASSETS.heroPack}
                                alt="GS1 barcode pharmaceutical packaging and authentication"
                                className="h-[460px] w-full rounded-[28px]"
                            />
                        </div>

                        <div className="absolute -left-5 top-8 rounded-[22px] border border-white/10 bg-[#0f2740]/85 p-4 shadow-xl backdrop-blur">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8fe5dd]">Authentication state</div>
                            <div className="mt-2 text-sm font-semibold text-white">Authentic product verified</div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-200">
                                <div className="rounded-lg bg-white/8 px-2.5 py-2">GTIN matched</div>
                                <div className="rounded-lg bg-white/8 px-2.5 py-2">Batch confirmed</div>
                                <div className="rounded-lg bg-white/8 px-2.5 py-2">Expiry visible</div>
                                <div className="rounded-lg bg-white/8 px-2.5 py-2">Serial verified</div>
                            </div>
                        </div>

                        <div className="absolute -bottom-7 left-6 right-6 grid grid-cols-4 gap-3">
                            {[
                                ["01", "GTIN"],
                                ["10", "Batch"],
                                ["17", "Expiry"],
                                ["21", "Serial"],
                            ].map(([ai, label]) => (
                                <div key={label} className="rounded-xl border border-white/12 bg-white/92 px-3 py-2 text-center shadow-lg">
                                    <div className="text-sm font-bold text-[#1F4B73]">{ai}</div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0EA5A4]">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <Card className="overflow-hidden p-0 bg-white">
                    <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-8">
                            <SectionTitle
                                eyebrow="Trust Layer"
                                title="GS1 Barcode and Pharmaceutical Traceability System for Regulated Supply Chains"
                                text="Built for pharmaceutical companies requiring GS1 compliance, product authentication, and supply chain traceability."
                            />
                            <div className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                {[
                                    ["scan", "GS1 Barcode Generation"],
                                    ["shield", "Barcode Scanning"],
                                    ["layers", "Product Authentication"],
                                    ["database", "Supply Chain Traceability"],
                                ].map(([icon, label]) => (
                                    <div key={label} className="rounded-2xl bg-[#f5f9fc] px-4 py-5 text-center font-medium text-slate-700">
                                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1F4B73] shadow-sm">
                                            <Icon name={icon} className="h-4 w-4" />
                                        </div>
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <PharmaImage src={IMAGE_ASSETS.warehouse} alt="Pharmaceutical warehouse scanning" className="min-h-[320px] w-full" />
                    </div>
                </Card>
            </section>

            <section className="bg-white py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Core Capabilities"
                        title="GS1 Barcode Generation, Scanning and Pharmaceutical Authentication System"
                        text="Capture, verify, and track pharmaceutical product data using GS1 barcodes, barcode scanning, and authentication systems."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        <CapabilityCard
                            title="GS1 Barcode Generation"
                            text="Create GS1 QR, GS1 DataMatrix, and packaging-level barcode identities for primary, secondary, and tertiary pharmaceutical packs."
                            image={IMAGE_ASSETS.packagingLine}
                        />
                        <CapabilityCard
                            title="Barcode Scanning"
                            text="Enable fast, reliable barcode scanning across mobile devices for warehouses, distributors, field teams, and verification touchpoints."
                            image={IMAGE_ASSETS.scannerPhone}
                        />
                        <CapabilityCard
                            title="Product Authentication"
                            text="Turn a scan into a verification event by matching GTIN, batch, expiry, serial, and trust rules."
                            image={IMAGE_ASSETS.authentication}
                        />
                        <CapabilityCard
                            title="Smart Data Capture"
                            text="Capture structured scan data and connect it with pharmaceutical product identity, packaging hierarchy, and traceability workflows."
                            image={IMAGE_ASSETS.gs1Explainer}
                        />
                    </div>
                </div>
            </section>

            <section className="bg-[#f5f9fc] py-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Product Demo"
                        title="Pharmaceutical Barcode Authentication Flow"
                        text="Scan GS1 barcodes, extract product data, validate against source systems, and return real-time pharmaceutical authentication results."
                    />

                    <div className="mt-12 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                        <Card className="overflow-hidden bg-white p-0">
                            <div className="grid lg:grid-cols-2 h-full">
                                <div className="flex flex-col justify-between border-b border-[#e6eef5] bg-[#f8fbfd] p-6 lg:border-b-0 lg:border-r">
                                    <div>
                                        <div className="mb-5 overflow-hidden rounded-[24px]">
                                            <PharmaImage src={IMAGE_ASSETS.gs1Explainer} alt="GS1 barcode explainer" className="h-72 w-full" />
                                        </div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0EA5A4]">GS1 barcode explainer</p>
                                        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[#1F4B73]">Scan to verify in 4 structured steps</h3>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">
                                            Ratifye reads GS1 barcode data, validates product intelligence, and returns an authenticity result instantly.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 flex items-center">
                                    <div className="w-full">
                                        <div className="relative">
                                            <div className="absolute left-[23px] top-4 bottom-4 w-px bg-[#d9e7f1]" />
                                            <div className="space-y-4">
                                                {[
                                                    ["Scan", "User scans a medicine barcode using the Ratifye interface."],
                                                    ["Read", "GS1 data is decoded into GTIN, batch, expiry, and serial."],
                                                    ["Validate", "The system checks barcode data against product and trust logic."],
                                                    ["Verify", "A clear product authenticity result is shown immediately."],
                                                ].map(([step, text], i) => (
                                                    <div key={step} className="relative flex items-start gap-4">
                                                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1F4B73] text-sm font-semibold text-white">
                                                            {i + 1}
                                                        </div>
                                                        <div className="w-full rounded-xl border border-[#e6eef5] bg-white p-4">
                                                            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0EA5A4]">{step}</div>
                                                            <p className="mt-1 text-sm leading-6 text-slate-700">{text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="grid gap-6">
                            <Card className="overflow-hidden border-transparent bg-[linear-gradient(135deg,#0f172a_0%,#1F4B73_60%,#0b3f52_100%)] p-0 text-white">
                                <PharmaImage src={IMAGE_ASSETS.heroPack} alt="Pharma pack with GS1 code" className="h-52 w-full" />
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8fe5dd]">GS1 data visualization</p>
                                            <h3 className="mt-2 text-2xl font-semibold">Key identifiers inside every scan</h3>
                                        </div>
                                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">GS1 ready</div>
                                    </div>
                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        {[
                                            ["01", "GTIN"],
                                            ["10", "Batch / Lot"],
                                            ["17", "Expiry"],
                                            ["21", "Serial"],
                                        ].map(([ai, label]) => (
                                            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                                                <div className="text-3xl font-bold text-[#8fe5dd]">{ai}</div>
                                                <div className="mt-2 text-sm text-slate-200">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card className="bg-white">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f9fc] text-[#1F4B73] shadow-sm">
                                        <Icon name="scan" className="h-5 w-5" />
                                    </div>
                                    <h4 className="mt-4 text-lg font-semibold text-[#1F4B73]">Structured scan capture</h4>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">Reads barcode data into usable GS1 fields for downstream product intelligence.</p>
                                </Card>
                                <Card className="bg-white">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f9fc] text-[#1F4B73] shadow-sm">
                                        <Icon name="shield" className="h-5 w-5" />
                                    </div>
                                    <h4 className="mt-4 text-lg font-semibold text-[#1F4B73]">Instant verification result</h4>
                                    <p className="mt-2 text-sm leading-7 text-slate-600">Returns a product verdict fast for teams, distributors, pharmacies, or consumers.</p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="bg-white py-16" id="solutions">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Solutions"
                        title="Pharmaceutical GS1 Barcode, Authentication, Serialization and Track and Trace Solutions"
                        text="Solutions for pharmaceutical barcode generation, product authentication, serialization, and supply chain traceability."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {SOLUTIONS.map((item, idx) => (
                            <Card key={item.slug} className="group overflow-hidden bg-white p-0 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,75,115,0.10)]">
                                <PharmaImage src={item.image} alt={item.title} className="h-40 w-full" />
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full bg-[#f5f9fc] px-3 py-1 text-[10px] font-semibold text-[#1F4B73]">0{idx + 1}</span>
                                        <Icon name="arrow-right" className="h-4 w-4 text-slate-400 group-hover:text-[#0EA5A4]" />
                                    </div>
                                    <h3 className="mt-8 text-2xl font-semibold tracking-tight text-[#1F4B73]">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.short}</p>
                                    <button
                                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0EA5A4]"
                                        onClick={() => {
                                            setActiveSolution(item);
                                            setCurrentPage("solutions");
                                        }}
                                    >
                                        See How It Works <Icon name="chevron-right" className="h-4 w-4" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}

            <section className="bg-[linear-gradient(135deg,#0f172a_0%,#1F4B73_55%,#0b3f52_100%)] py-16 text-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="How It Works"
                        title="How GS1 Barcode, Authentication and Track and Trace Systems Work in Pharma"
                        text="Transform pharmaceutical packaging into a connected system of product identity, verification, serialization, and traceability."
                        invert
                    />
                    <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                        <div className="grid gap-4">
                            {[
                                "Define pharmaceutical product and packaging data",
                                "Generate GS1 barcode with GTIN, batch, expiry and serial",
                                "Enable scan-based product authentication",
                                "Track product movement across supply chain",
                            ].map((step, idx) => (
                                <div key={step} className="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0EA5A4]/20 text-sm font-semibold text-[#8fe5dd]">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">{step}</h3>
                                        <p className="mt-2 text-sm leading-7 text-slate-300">
                                            Structured for regulated pharmaceutical product workflows and downstream trust
                                            systems.
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-3">
                            <PharmaImage src={IMAGE_ASSETS.traceability} alt="Pharma traceability workflow" className="h-full min-h-[420px] w-full rounded-[26px]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div>
                        <SectionTitle
                            eyebrow="Why Ratifye"
                            title="Why Ratifye for Pharmaceutical Barcode Authentication and Traceability"
                            text="Ratifye combines GS1 barcode generation, authentication, serialization, and track and trace into one system."
                        />
                        <div className="mt-8 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#1F4B73_0%,#0EA5A4_100%)] text-white shadow-[0_18px_50px_rgba(31,75,115,0.18)]">
                            <PharmaImage src={IMAGE_ASSETS.authentication} alt="Medicine verification" className="h-56 w-full" />
                            <div className="p-7">
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#dffaf7]">Positioning</p>
                                <h3 className="mt-2 text-2xl font-semibold">Not just scanning. A pharmaceutical trust system.</h3>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            ["3x", "Faster Product Verification", "scan", IMAGE_ASSETS.authentication],
                            ["40%", "Better Supply Chain Visibility", "database", IMAGE_ASSETS.traceability],
                            ["24/7", "Real-time Authentication Across Touchpoints", "shield", IMAGE_ASSETS.scannerPhone],
                            ["Risk", "Reduced Counterfeit Exposure", "layers", IMAGE_ASSETS.heroPack],
                        ].map(([value, label, icon, image]) => (
                            <Card key={label} className="overflow-hidden bg-white p-0 text-center">
                                <div className="relative h-28">
                                    <PharmaImage src={image} alt={label} className="h-full w-full" />
                                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/90 text-[#1F4B73] shadow-sm">
                                        <Icon name={icon} className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="text-4xl font-semibold tracking-tight text-[#1F4B73]">{value}</div>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{label}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#f5f9fc] py-16" id="blogs">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Insights"
                        title="GS1 Barcode, Pharmaceutical Serialization and Authentication Insights"
                        text="Educational content designed to capture high-intent search traffic and explain how barcode systems improve pharmaceutical supply chain integrity."
                    />
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {BLOGS.map((item) => (
                            <Card key={item.slug} className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,75,115,0.10)]">
                                <div className="relative h-44">
                                    <PharmaImage src={item.image} alt={item.title} className="h-full w-full" />
                                    <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1F4B73]">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold tracking-tight text-[#1F4B73]">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16" id="contact">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                        <div>
                            <SectionTitle
                                eyebrow="Contact"
                                title="Talk to Ratifye about GS1 barcode, authentication and traceability"
                                text="Use this page for demo requests, solution discussions, integration planning, and pharmaceutical barcode implementation conversations."
                            />
                            <div className="mt-8 overflow-hidden rounded-[28px]">
                                <PharmaImage src={IMAGE_ASSETS.contact} alt="Pharma plant" className="h-64 w-full" />
                            </div>
                            <div className="mt-8 grid gap-4">
                                {[
                                    ["mail", "sales@ratifye.example"],
                                    ["chart", "Book a product walkthrough"],
                                    ["code", "Discuss integration and API requirements"],
                                ].map(([icon, label]) => (
                                    <Card key={label} className="rounded-[24px] p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f9fc] text-[#1F4B73]">
                                                <Icon name={icon} className="h-4 w-4" />
                                            </div>
                                            <div className="text-sm text-slate-700">{label}</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-[34px] border border-[#e6eef5] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                            <div className="grid gap-4">
                                {["Full name", "Work email", "Company name", "Requirement"].map((field, idx) => (
                                    <div key={field}>
                                        <label className="mb-2 block text-sm font-medium text-slate-700">{field}</label>
                                        {idx < 3 ? (
                                            <input className="w-full rounded-2xl border border-[#d9e7f1] bg-[#f5f9fc] px-4 py-3 outline-none" placeholder={field} />
                                        ) : (
                                            <textarea
                                                className="min-h-[140px] w-full rounded-2xl border border-[#d9e7f1] bg-[#f5f9fc] px-4 py-3 outline-none"
                                                placeholder="Tell us about your barcode, authentication, serialization, or track and trace requirement"
                                            />
                                        )}
                                    </div>
                                ))}
                                <button className="mt-2 rounded-2xl bg-[#1F4B73] px-5 py-3 text-sm font-semibold text-white">
                                    Request Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function SolutionsPage({ activeSolution, setActiveSolution }) {


    console.log("Active solution:", activeSolution);
    
     return (
        <SolutionTabsComponent pageKey={activeSolution.pageKey} />
    )
   
   
    if (!activeSolution) {
        return (
            // <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            //     <SectionTitle
            //         eyebrow="Solutions"
            //         title="Pharmaceutical barcode and authentication solutions"
            //         text="Select a solution card to view its dedicated page layout, SEO heading, and content structure."
            //     />
            //     <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            //         {SOLUTIONS.map((item) => (
            //             <Card key={item.slug} className="overflow-hidden p-0">
            //                 <PharmaImage src={item.image} alt={item.title} className="h-48 w-full" />
            //                 <div className="p-6">
            //                     <h3 className="text-xl font-semibold text-[#1F4B73]">{item.title}</h3>
            //                     <p className="mt-3 text-sm leading-7 text-slate-600">{item.short}</p>
            //                     <button
            //                         className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0EA5A4]"
            //                         onClick={() => setActiveSolution(item)}
            //                     >
            //                         Open page <Icon name="chevron-right" className="h-4 w-4" />
            //                     </button>
            //                 </div>
            //             </Card>
            //         ))}
            //     </div>
            // </main>
            null
        );
    }

   

    return (
        <main>
            <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0f172a_0%,#1F4B73_55%,#0b3f52_100%)] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.14),transparent_25%)]" />
                <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                    <button
                        className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"
                        onClick={() => setActiveSolution(null)}
                    >
                        <Icon name="chevron-right" className="h-4 w-4 rotate-180" /> Back to all solutions
                    </button>
                    <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
                        <div>
                            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#8fe5dd]">
                                {activeSolution.keywords.join(" • ")}
                            </div>
                            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                                {activeSolution.heroTitle}
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{activeSolution.heroText}</p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <button className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1F4B73]">
                                    Book Pharma Demo
                                </button>
                                <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white">
                                    Talk to Sales
                                </button>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-3 backdrop-blur">
                            <PharmaImage src={activeSolution.image} alt={activeSolution.title} className="h-[420px] w-full rounded-[26px]" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-2">
                    <Card>
                        <SectionTitle
                            eyebrow="SEO heading"
                            title={activeSolution.heroTitle}
                            text="This solution page is structured as a high-intent solution page with clear value, SEO focus, and conversion-ready CTA placement."
                        />
                    </Card>
                    <Card>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0EA5A4]">Target keywords</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            {activeSolution.keywords.map((keyword) => (
                                <Badge key={keyword}>{keyword}</Badge>
                            ))}
                        </div>
                    </Card>
                </div>
                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {activeSolution.points.map((point) => (
                        <Card key={point} className="h-full">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5f9fc] text-[#1F4B73]">
                                <Icon name="scan" className="h-5 w-5" />
                            </div>
                            <p className="mt-5 text-sm leading-7 text-slate-700">{point}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}

function BlogsPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <SectionTitle
                eyebrow="Blogs"
                title="GS1 Barcode, Pharmaceutical Serialization and Authentication Insights"
                text="Topic-led content architecture designed for educational search intent, long-tail SEO growth, and internal linking to solutions pages."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {BLOGS.map((item) => (
                    <Card key={item.slug} className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(31,75,115,0.10)]">
                        <div className="relative h-44">
                            <PharmaImage src={item.image} alt={item.title} className="h-full w-full" />
                            <div className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#1F4B73]">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-semibold tracking-tight text-[#1F4B73]">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-600">{item.excerpt}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </main>
    );
}

function ContactPage() {
    return (
        <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                    <SectionTitle
                        eyebrow="Contact"
                        title="Talk to Ratifye about GS1 barcode, authentication and traceability"
                        text="Use this page for demo requests, solution discussions, integration planning, and pharmaceutical barcode implementation conversations."
                    />
                    <div className="mt-8 overflow-hidden rounded-[28px]">
                        <PharmaImage src={IMAGE_ASSETS.contact} alt="Pharma plant" className="h-64 w-full" />
                    </div>
                    <div className="mt-8 grid gap-4">
                        {[
                            ["mail", "sales@ratifye.example"],
                            ["chart", "Book a product walkthrough"],
                            ["code", "Discuss integration and API requirements"],
                        ].map(([icon, label]) => (
                            <Card key={label} className="rounded-[24px] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f9fc] text-[#1F4B73]">
                                        <Icon name={icon} className="h-4 w-4" />
                                    </div>
                                    <div className="text-sm text-slate-700">{label}</div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="rounded-[34px] border border-[#e6eef5] bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
                    <div className="grid gap-4">
                        {["Full name", "Work email", "Company name", "Requirement"].map((field, idx) => (
                            <div key={field}>
                                <label className="mb-2 block text-sm font-medium text-slate-700">{field}</label>
                                {idx < 3 ? (
                                    <input className="w-full rounded-2xl border border-[#d9e7f1] bg-[#f5f9fc] px-4 py-3 outline-none" placeholder={field} />
                                ) : (
                                    <textarea
                                        className="min-h-[140px] w-full rounded-2xl border border-[#d9e7f1] bg-[#f5f9fc] px-4 py-3 outline-none"
                                        placeholder="Tell us about your barcode, authentication, serialization, or track and trace requirement"
                                    />
                                )}
                            </div>
                        ))}
                        <button className="mt-2 rounded-2xl bg-[#1F4B73] px-5 py-3 text-sm font-semibold text-white">
                            Request Demo
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
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

function AppShell({
    children,
    currentPage,
    setCurrentPage,
    activeSolution,
    setActiveSolution,
    mobileOpen,
    setMobileOpen,
}) {
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    const [open, setOpen] = useState(false);
    const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);


    const navigate = useNavigate();


    // const currentMeta = useMemo(() => {
    //     if (currentPage === "home") {
    //         return {
    //             title: "GS1 Barcode & Pharma Authentication Platform | Ratifye",
    //             description:
    //                 "Generate GS1 barcodes, enable pharmaceutical authentication, serialization, and track and trace systems with Ratifye for secure supply chains.",
    //         };
    //     }
    //     if (currentPage === "solutions" && activeSolution) {
    //         return { title: `${activeSolution.title} | Ratifye`, description: activeSolution.short };
    //     }
    //     if (currentPage === "blogs") {
    //         return {
    //             title: "GS1 Barcode, Pharmaceutical Serialization and Authentication Insights | Ratifye",
    //             description:
    //                 "Explore GS1 barcode, pharmaceutical authentication, serialization, and traceability insights for pharmaceutical supply chains.",
    //         };
    //     }
    //     return {
    //         title: "Contact Ratifye | Pharma Barcode and Authentication Platform",
    //         description:
    //             "Contact Ratifye to discuss GS1 barcode generation, pharmaceutical authentication, serialization, and track and trace workflows.",
    //     };
    // }, [currentPage, activeSolution]);

    return (
        <div
            className="min-h-screen bg-white text-[#1F4B73]"
            style={{
                fontFamily:
                    'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
        >
            {/* <div className="border-b border-[#e6eef5] bg-[#1F4B73] text-white">
        <div className="mx-auto max-w-7xl px-6 py-2 text-xs uppercase tracking-[0.18em] lg:px-8">
          Meta Title: {currentMeta.title}
        </div>
      </div> */}
            <header className="sticky top-0 z-50 border-b border-[#e6eef5] bg-white/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                    <button
                        className="flex items-center gap-3 text-left"
                        onClick={() => {
                            setCurrentPage("home");
                            setActiveSolution(null);
                        }}
                    >
                        <div className="flex items-center gap-3 cursor-pointer">

                            {/* LOGO IMAGE */}
                            <img
                                src={logo}
                                alt="Ratifye Logo"
                                className="h-12  object-contain rounded-md p-2 shadow-[0_10px_30px_rgba(31,75,115,0.18)]"
                            />

                            {/* TEXT */}
                            {/* <div>
                                <div className="text-lg font-semibold tracking-tight">
                                    Ratifye
                                </div>
                                <div className="text-xs text-slate-500">
                                    GS1 pharma trust platform
                                </div>
                            </div> */}

                        </div>
                    </button>
                    <nav className="hidden items-center gap-8 text-sm font-medium text-slate-700 lg:flex">
                        {NAV_ITEMS.map((item) => (
                            <button

                                key={item.key}
                                onClick={() => {


                                    if (item.key === "solutions") {
                                        setOpen((prev) => !prev);
                                    } else {
                                        setOpen(false);
                                        setCurrentPage(item.key);
                                        setActiveSolution(null);
                                    }
                                }}
                                onMouseEnter={() => {
                                    if (item.key === "solutions") {
                                        setOpen(true);
                                    }
                                }}
                                onMouseLeave={() => {
                                    if (item.key === "solutions") {
                                        setOpen(false);
                                    }
                                }}
                                className={`transition ${currentPage === item.key ? "text-[#1F4B73] font-semibold" : "hover:text-[#0EA5A4]"}`}
                            >
                                {item.label}



                                {item.label === "Solutions" && open ? (
                                    <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%-35px)] mt-2 z-50 w-[980px] overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
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
                                                        className={`group rounded-[28px] border p-5 text-left transition
                                                            "border-slate-200 bg-white/80  hover:bg-white hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)] ${activeSolution && activeSolution.pageKey === page.key ? "border-[#0EA5A4] bg-white shadow-[0_12px_36px_rgba(14,165,164,0.12)]" : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"}`}
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
                                ) : null}

                            </button>
                        ))}
                    </nav>
                    <div className="hidden items-center gap-3 lg:flex">
                        <button onClick={() => setShowAuthPopup(true)} className="rounded-full border border-[#d9e7f1] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#f5f9fc]">
                            Login
                        </button>
                        <button onClick={() => navigate("/barcodeGen/gs1digitallink")} className="rounded-full bg-[#1F4B73] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(31,75,115,0.18)] hover:bg-[#183b5a]">
                            Generate GS1 Barcode
                        </button>
                    </div>
                    <button className="lg:hidden" onClick={() => setMobileOpen((prev) => !prev)}>
                        <Icon name="menu" className="h-5 w-5" />
                    </button>
                </div>
                {mobileOpen && (
                    <div className="border-t border-[#e6eef5] bg-white px-6 py-4 lg:hidden">
                        <div className="flex flex-col gap-3">
                            {NAV_ITEMS.map((item) => (
                                <div key={item.key}>
                                    {/* Main Nav Item */}
                                    <button
                                        onClick={() => {
                                            if (item.key === "solutions") {
                                                setMobileSolutionsOpen(!mobileSolutionsOpen);
                                            } else {
                                                setCurrentPage(item.key);
                                                setActiveSolution(null);
                                                setMobileOpen(false);
                                            }
                                        }}
                                        className={`w-full flex items-center justify-between text-left text-sm font-medium text-slate-700 ${currentPage === item.key ? 'text-[#1F4B73] font-semibold' : 'hover:text-[#0EA5A4]'}`}
                                    >
                                        <span>{item.label}</span>
                                        {item.key === "solutions" && (
                                            <ChevronDown
                                                className={`h-4 w-4 transition-transform ${mobileSolutionsOpen ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </button>

                                    {/* Solutions Submenu */}
                                    {item.key === "solutions" && mobileSolutionsOpen && (
                                        <div className="ml-4 mt-2 space-y-2">
                                            {NAV_PAGES.map((page) => (
                                                <button
                                                    key={page.key}
                                                    onClick={() => {
                                                        navigate(`/main/solutions/${page.slug}`);
                                                        setMobileOpen(false);
                                                        setMobileSolutionsOpen(false);
                                                    }}
                                                    className={`w-full text-left py-2 px-3 text-sm text-slate-600 hover:text-[#0EA5A4] rounded-lg hover:bg-slate-50 ${activeSolution?.slug === page?.slug ? 'bg-slate-100 text-[#0EA5A4]' : ''}`}
                                                >
                                                    <div className="font-semibold">{page.shortTitle}</div>
                                                    <div className="text-xs text-slate-500 mt-1">{page.subtitle}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <button onClick={() => setShowAuthPopup(true)} className="rounded-full border border-[#d9e7f1] px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#f5f9fc]">
                                Login
                            </button>
                            <button onClick={() => navigate("/barcodeGen/gs1digitallink")} className="rounded-full bg-[#1F4B73] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(31,75,115,0.18)] hover:bg-[#183b5a]">
                                Generate GS1 Barcode
                            </button>

                        </div>


                    </div>
                )}
            </header>
            {children}

            <AuthPopup
                show={showAuthPopup}
                onClose={() => setShowAuthPopup(false)}
                AuthMode="login"
            />

            <footer className="border-t border-[#e6eef5] bg-white">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
                    <div>
                        <div className="text-lg font-semibold text-[#1F4B73]">Ratifye</div>
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                            Ratifye is a GS1-powered pharmaceutical barcode, authentication, serialization, and track and trace platform for regulated pharmaceutical supply chains.
                        </p>
                        {/* <p className="mt-3 text-xs text-slate-400">Meta Description: {currentMeta.description}</p> */}
                    </div>
                    <div className="flex flex-wrap gap-5 text-sm text-slate-500">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => {

                                    if (item.key === "solutions") {
                                        setOpen(!open);
                                    } else {
                                        setCurrentPage(item.key);
                                        setActiveSolution(null);
                                    }
                                }}
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

function sanityChecks() {
    return [
        NAV_ITEMS.length === 4,
        SOLUTIONS.length >= 6,
        BLOGS.length >= 4,
        SOLUTIONS.every((item) => item.image && item.keywords.length >= 3 && item.points.length >= 4),
        BLOGS.every((item) => item.image && item.title && item.excerpt),
    ].every(Boolean);
}

function runtimeSelfCheck() {
    const errors = [];
    if (typeof NAV_ITEMS[0]?.key !== "string") errors.push("NAV_ITEMS invalid");
    if (!SOLUTIONS[0]?.image) errors.push("SOLUTIONS missing image");
    if (!BLOGS[0]?.title) errors.push("BLOGS missing title");
    return errors;
}


export default function HomePage() {
    const { page, slug } = useParams();
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState("home");
    const [activeSolution, setActiveSolution] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const isValid = sanityChecks();
    const selfCheckErrors = runtimeSelfCheck();

    console.log('Current page:', page);  // Add this debug
    console.log('Current slug:', slug);

    // ✅ SYNC URL → STATE
    useEffect(() => {
        if (!page) {
            setCurrentPage("home");
        } else {
            setCurrentPage(page);
        }
    }, [page]);

    useEffect(() => {
        if (page !== "solutions" || !slug) {
            setActiveSolution(null);
            return;
        }

        const matched = SOLUTIONS.find(
            (item) => item.slug === slug
        );

        setActiveSolution(matched || null);
    }, [page, slug]);

    // ✅ OPTIONAL: STATE → URL (important for nav clicks)
    const handlePageChange = (newPage: string) => {
        setCurrentPage(newPage);
        navigate(`/main/${newPage}`);
    };

    let pageComponent;

    if (currentPage === "home") {
        pageComponent = (
            <Homepage
                setCurrentPage={handlePageChange}
                setActiveSolution={setActiveSolution}
            />
        );
    } else if (currentPage === "solutions") {
        pageComponent = (
            <SolutionsPage
                activeSolution={activeSolution}
                setActiveSolution={setActiveSolution}
            />
        );
    } else if (currentPage === "blogs") {
        pageComponent = <BlogsPage />;
    } else {
        pageComponent = <ContactPage />;
    }

    return (
        <AnimatedWrapper>
            <AppShell
                currentPage={currentPage}
                setCurrentPage={handlePageChange} // 🔥 IMPORTANT
                activeSolution={activeSolution}
                setActiveSolution={setActiveSolution}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            >
                {isValid && selfCheckErrors.length === 0 ? (
                    pageComponent
                ) : (
                    <div className="mx-auto max-w-7xl px-6 py-10 text-sm text-red-700">
                        Content configuration error:{" "}
                        {selfCheckErrors.join(", ") ||
                            "one or more data blocks are incomplete."}
                    </div>
                )}
            </AppShell>
        </AnimatedWrapper>
    );
}
