import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

type PageKey = "gs1" | "authentication" | "serialization" | "track" | "digital" | "warehouse";
type HeroVariant = "split" | "scanner" | "diagram" | "timeline" | "risk" | "dashboard";

type SEOEntry = {
  title: string;
  description: string;
  url: string;
  ogImage: string;
  schemaType: string;
};

type HeroProps = {
  title: string;
  text: string;
  badge: string;
  statA: string;
  statB: string;
  statC: string;
  variant: HeroVariant;
};

type TitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
  invert?: boolean;
  align?: "left" | "center";
};

type NavPage = {
  key: PageKey;
  label: string;
  href: string;
};

type FAQItem = {
  q: string;
  a: string;
};

const BASE_URL = "https://ratifye.com";

const theme = {
  primary: "#1F4B73",
  accent: "#0EA5A4",
  dark: "#07111D",
  darker: "#030712",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
} as const;

const NAV_PAGES: NavPage[] = [
  { key: "gs1", label: "GS1", href: "/gs1-barcode-generation" },
  { key: "authentication", label: "Authentication", href: "/barcode-authentication" },
  { key: "serialization", label: "Serialization", href: "/pharma-serialization" },
  { key: "track", label: "Track & Trace", href: "/track-and-trace" },
  { key: "digital", label: "Diversion", href: "/market-diversion-detection" },
  { key: "warehouse", label: "Warehouse", href: "/warehouse-barcode-verification" },
];

const SEO: Record<PageKey, SEOEntry> = {
  gs1: {
    title: "GS1 Barcode Generation for Pharma | Ratifye",
    description:
      "Generate GS1-compliant pharma barcodes with GTIN, batch, expiry, and serial data for authentication, serialization, and pharmaceutical traceability workflows.",
    url: "/gs1-barcode-generation",
    ogImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
  authentication: {
    title: "Pharma Barcode Authentication | Ratifye",
    description:
      "Verify pharmaceutical products with GS1 barcode scanning, data validation, and trust signals. Detect counterfeit risk with real-time barcode authentication workflows.",
    url: "/barcode-authentication",
    ogImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
  serialization: {
    title: "Pharma Serialization Software | Ratifye",
    description:
      "Enable pharmaceutical serialization with unique unit identity, serial numbers, aggregation, and GS1 barcode structure for stronger verification and downstream traceability.",
    url: "/pharma-serialization",
    ogImage: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
  track: {
    title: "Pharma Track and Trace Software | Ratifye",
    description:
      "Track pharmaceutical product movement across warehouse, distributor, pharmacy, and downstream checkpoints with GS1 barcode data and scan-based traceability records.",
    url: "/track-and-trace",
    ogImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
  digital: {
    title: "Pharma Market Diversion Detection | Ratifye",
    description:
      "Detect unauthorized pharmaceutical product movement across markets, regions, and channels using barcode-linked product intelligence, scan checkpoints, and diversion alerts.",
    url: "/market-diversion-detection",
    ogImage: "https://images.unsplash.com/photo-1586528116493-0e3d3b5fd2df?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
  warehouse: {
    title: "Warehouse Barcode Verification | Ratifye",
    description:
      "Enable warehouse barcode verification for pharmaceutical receiving, storage, dispatch, and distributor validation with scan-based identity checks and operational rules.",
    url: "/warehouse-barcode-verification",
    ogImage: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=80",
    schemaType: "SoftwareApplication",
  },
};

const FAQS: Record<PageKey, FAQItem[]> = {
  gs1: [
    { q: "What is GS1 barcode generation in pharma?", a: "GS1 barcode generation structures product identity using GTIN, batch, expiry, and serial data so pharmaceutical products can be identified, verified, and tracked consistently." },
    { q: "Which GS1 data elements matter most?", a: "The most common elements are GTIN, batch or lot number, expiry date, and serial number when serialization is enabled." },
    { q: "Why is GS1 barcode generation important?", a: "It builds the base for authentication, serialization, warehouse validation, and track and trace workflows across pharmaceutical supply chains." },
  ],
  authentication: [
    { q: "How does pharma authentication work?", a: "A product is scanned, GS1 barcode data is read, GTIN, batch, expiry, and serial are validated, and the system returns a trust result such as authentic, warning, or failed verification." },
    { q: "Can authentication help reduce counterfeit risk?", a: "Yes. Scan-based authentication adds stronger product verification signals across pharmacy, distributor, warehouse, and consumer touchpoints." },
    { q: "What data is used during authentication?", a: "Authentication can use GTIN, batch, expiry, serial, and mapped product intelligence inside the verification workflow." },
  ],
  serialization: [
    { q: "What is serialization in pharma?", a: "Serialization creates a unique identity for each product unit so every saleable pack can be distinguished, verified, and connected to downstream events." },
    { q: "How is serialization different from a normal barcode?", a: "A normal barcode may identify a product class, while serialization gives each product unit a unique identity through serial-linked logic." },
    { q: "Why does serialization matter?", a: "It supports unit-level control, stronger verification, and later traceability expansion across the supply chain." },
  ],
  track: [
    { q: "What is track and trace in pharma?", a: "Track and trace captures product movement events across warehouse, distributor, pharmacy, and other checkpoints through barcode-linked scan records." },
    { q: "How does track and trace improve operations?", a: "It improves visibility, supports recall readiness, and makes movement history easier to review during exceptions or investigations." },
    { q: "Can track and trace work with GS1 barcodes?", a: "Yes. GS1 barcode structure supports stronger identity reads that can feed traceability workflows." },
  ],
  digital: [
    { q: "What is market diversion in pharma?", a: "Market diversion happens when products appear in unintended regions, channels, or downstream distribution paths." },
    { q: "How can diversion be detected?", a: "Diversion signals can be identified by comparing expected product route logic with actual scan events and observed channel behavior." },
    { q: "Why does diversion monitoring matter?", a: "It helps surface suspicious movement, investigate channel risk, and strengthen distribution control." },
  ],
  warehouse: [
    { q: "What is warehouse barcode verification?", a: "Warehouse barcode verification checks product identity and scan rules during receiving, storage, handling, and dispatch workflows." },
    { q: "What outcomes can a warehouse verification system show?", a: "Typical outcomes include match, mismatch, and blocked states depending on expected product logic and operational rules." },
    { q: "Why is scan-based warehouse validation useful?", a: "It reduces uncertainty, improves operational speed, and supports stronger control at warehouse and distribution checkpoints." },
  ],
};

const TRUST_SIGNALS: Record<PageKey, string[]> = {
  gs1: ["GS1-ready identification", "GTIN, batch, expiry structure", "Packaging hierarchy mapping", "Machine-readable output"],
  authentication: ["Scan-based verification", "Counterfeit risk reduction", "Role-based outcomes", "Authentic or mismatch results"],
  serialization: ["Unit-level serial control", "Aggregation support", "Serial-linked traceability", "Downstream scan readiness"],
  track: ["Checkpoint history", "Movement visibility", "Recall readiness", "Supply chain intelligence"],
  digital: ["Geo anomaly detection", "Channel validation", "Diversion review logic", "Risk escalation support"],
  warehouse: ["Receiving validation", "Dispatch verification", "Operational exception control", "Role-aware scan rules"],
};

const BLOG_PREVIEWS: Record<PageKey, { title: string; summary: string }[]> = {
  gs1: [
    { title: "What Is GS1 Barcode Generation in Pharma?", summary: "A breakdown of GTIN, batch, expiry, and serial-ready barcode structure for pharmaceutical packaging and compliance workflows." },
    { title: "GS1 DataMatrix vs GS1 QR for Pharma Packaging", summary: "When to use each barcode style for pharmaceutical scanning, packaging, and downstream verification needs." },
  ],
  authentication: [
    { title: "How Pharma Barcode Authentication Works", summary: "From product scan to authenticity result, understand the trust workflow behind pharmaceutical barcode verification." },
    { title: "How Barcode Verification Reduces Counterfeit Drug Risk", summary: "Why barcode reading alone is not enough and how authentication logic strengthens product trust." },
  ],
  serialization: [
    { title: "What Is Pharma Serialization and How It Works", summary: "A clear explanation of serial numbers, unit-level identity, aggregation, and why serialization matters in pharma." },
    { title: "Serialization vs Non-Serialized Pharma Packaging", summary: "A comparison of control, validation, and traceability readiness across pharmaceutical workflows." },
  ],
  track: [
    { title: "Pharma Track and Trace in the Supply Chain", summary: "How scan events become movement history across warehouse, distributor, and pharmacy checkpoints." },
    { title: "Why Recall Readiness Depends on Traceability", summary: "A practical view of why checkpoint visibility matters in pharmaceutical exception and recall workflows." },
  ],
  digital: [
    { title: "How to Detect Market Diversion in Pharma", summary: "The role of geo signals, route mismatches, and suspicious downstream scans in diversion monitoring." },
    { title: "Market Diversion Monitoring vs Basic Traceability", summary: "Why channel-risk review needs more than simple movement records in pharmaceutical distribution." },
  ],
  warehouse: [
    { title: "Warehouse Barcode Verification in Pharma Operations", summary: "How scan-based validation improves pharmaceutical receiving, storage, and dispatch workflows." },
    { title: "Match, Mismatch, and Blocked Scan States Explained", summary: "How warehouse teams act faster with structured barcode validation outcomes." },
  ],
};

const storyMap: Record<PageKey, { title: string; subtitle: string }> = {
  gs1: { title: "From GS1 structure to product identity", subtitle: "Understand how GTIN, batch, expiry, and serial combine to create a machine-readable pharmaceutical identity across packaging and supply chain workflows." },
  authentication: { title: "From scan to trust decision", subtitle: "See how a barcode scan is converted into a real-time authenticity result using GS1 data validation, product intelligence, and verification logic." },
  serialization: { title: "From product to unique unit identity", subtitle: "Explore how serialization assigns a unique identity to every pharmaceutical unit and connects packaging levels for downstream verification and control." },
  track: { title: "From movement to full visibility", subtitle: "Track how products move across warehouse, distributor, and pharmacy checkpoints through scan-based traceability and structured movement records." },
  digital: { title: "From expected route to anomaly detection", subtitle: "Identify how product scans reveal unexpected movement across regions, channels, and markets, enabling early detection of diversion risks." },
  warehouse: { title: "From scan to operational control", subtitle: "See how warehouse workflows use barcode validation to confirm product identity, detect mismatches, and control receiving and dispatch operations." },
};

const ROUTE_MAP: Record<PageKey, string> = NAV_PAGES.reduce((acc, item) => {
  acc[item.key] = item.href;
  return acc;
}, {} as Record<PageKey, string>);

const PATH_TO_KEY: Record<string, PageKey> = NAV_PAGES.reduce((acc, item) => {
  acc[item.href] = item.key;
  return acc;
}, {} as Record<string, PageKey>);

const pageDesignMap: Record<PageKey, { bg: string }> = {
  gs1: { bg: "bg-white" },
  authentication: { bg: "bg-slate-50" },
  serialization: { bg: "bg-white" },
  track: { bg: "bg-slate-50" },
  digital: { bg: "bg-white" },
  warehouse: { bg: "bg-slate-50" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function runSmokeTests(): string[] {
  const errors: string[] = [];
  const keys = NAV_PAGES.map((page) => page.key);
  const hrefs = NAV_PAGES.map((page) => page.href);
  const labels = NAV_PAGES.map((page) => page.label);

  if (new Set(keys).size !== keys.length) errors.push("Duplicate page keys found.");
  if (new Set(hrefs).size !== hrefs.length) errors.push("Duplicate page routes found.");
  if (new Set(labels).size !== labels.length) errors.push("Duplicate page labels found.");

  for (const key of keys) {
    if (!SEO[key]) errors.push(`Missing SEO config for ${key}.`);
    if (!FAQS[key] || FAQS[key].length === 0) errors.push(`Missing FAQs for ${key}.`);
    if (!storyMap[key]) errors.push(`Missing story copy for ${key}.`);
    if (!TRUST_SIGNALS[key] || TRUST_SIGNALS[key].length === 0) errors.push(`Missing trust signals for ${key}.`);
    if (!BLOG_PREVIEWS[key] || BLOG_PREVIEWS[key].length === 0) errors.push(`Missing blog previews for ${key}.`);
    if (!ROUTE_MAP[key]) errors.push(`Missing route map entry for ${key}.`);
    if (SEO[key].title.length > 60) errors.push(`SEO title too long for ${key}.`);
    if (SEO[key].description.length < 120) errors.push(`SEO description too short for ${key}.`);
  }

  for (const page of NAV_PAGES) {
    if (PATH_TO_KEY[page.href] !== page.key) {
      errors.push(`Path mapping mismatch for ${page.key}.`);
    }
  }

  return errors;
}

function SEOHead({ data, page }: { data: SEOEntry; page: PageKey }) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.title = data.title;

    const setMetaByName = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setMetaByProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMetaByName("description", data.description);
    setMetaByName("robots", "index, follow");
    setLink("canonical", `${BASE_URL}${data.url}`);
    setMetaByProperty("og:type", "website");
    setMetaByProperty("og:title", data.title);
    setMetaByProperty("og:description", data.description);
    setMetaByProperty("og:url", `${BASE_URL}${data.url}`);
    setMetaByProperty("og:image", data.ogImage);
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", data.title);
    setMetaByName("twitter:description", data.description);
    setMetaByName("twitter:image", data.ogImage);

    const faqEntities = FAQS[page].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }));

    let schemaEl = document.getElementById("ratifye-schema") as HTMLScriptElement | null;
    if (!schemaEl) {
      schemaEl = document.createElement("script");
      schemaEl.type = "application/ld+json";
      schemaEl.id = "ratifye-schema";
      document.head.appendChild(schemaEl);
    }

    let breadcrumbEl = document.getElementById("ratifye-breadcrumb-schema") as HTMLScriptElement | null;
    if (!breadcrumbEl) {
      breadcrumbEl = document.createElement("script");
      breadcrumbEl.type = "application/ld+json";
      breadcrumbEl.id = "ratifye-breadcrumb-schema";
      document.head.appendChild(breadcrumbEl);
    }

    schemaEl.text = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": data.schemaType,
        name: data.title,
        description: data.description,
        url: `${BASE_URL}${data.url}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        brand: { "@type": "Brand", name: "Ratifye" },
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Ratifye",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqEntities,
      },
    ]);

    breadcrumbEl.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: NAV_PAGES.find((item) => item.key === page)?.label || data.title,
          item: `${BASE_URL}${data.url}`,
        },
      ],
    });
  }, [data, page]);

  return null;
}

const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`relative px-6 py-24 lg:px-8 ${className}`}>
    <div className="mx-auto max-w-7xl">{children}</div>
  </section>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    variants={fadeUp}
    className={`group rounded-[28px] border border-white/60 bg-white/80 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.10)] ${className}`}
  >
    {children}
  </motion.div>
);

const GridGlow = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="absolute right-0 top-20 h-[22rem] w-[22rem] rounded-full bg-blue-500/10 blur-3xl" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_75%)]" />
  </div>
);

const Title = ({ eyebrow, title, description, invert = false, align = "left" }: TitleProps) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.2 }}
    className={`mb-12 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}
  >
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${invert ? "border-white/15 bg-white/10 text-cyan-100" : "border-teal-200 bg-teal-50 text-teal-700"}`}>
      <Sparkles className="h-3.5 w-3.5" />
      {eyebrow}
    </div>
    <h2 className={`mt-4 text-3xl font-semibold tracking-tight md:text-5xl ${invert ? "text-white" : "text-slate-950"}`}>{title}</h2>
    {description ? <p className={`mt-5 text-base leading-8 md:text-lg ${invert ? "text-slate-300" : "text-slate-600"}`}>{description}</p> : null}
  </motion.div>
);

const pills = {
  light: "rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-sm text-slate-700 leading-7 shadow-sm",
};

function MatrixCode({ size = 12 }: { size?: number }) {
  const cells = Array.from({ length: size * size }, (_, i) => ((i * 7 + Math.floor(i / 2)) % 5 === 0 ? 1 : 0));
  return (
    <div className="grid rounded-xl bg-white p-4" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: 3 }}>
      {cells.map((cell, idx) => (
        <div key={idx} style={{ width: 8, height: 8, backgroundColor: cell ? "#0f172a" : "#dbeafe" }} />
      ))}
    </div>
  );
}

function BarcodeStrip({ bars = 36 }: { bars?: number }) {
  return (
    <div className="flex items-end gap-[3px] rounded-xl bg-white px-4 py-5">
      {Array.from({ length: bars }, (_, i) => (
        <div key={i} style={{ width: [2, 3, 4, 2][i % 4], height: 26 + ((i * 11) % 28), backgroundColor: "#111827" }} />
      ))}
    </div>
  );
}

function IllustrationCard({ page, heightClass = "h-full" }: { page: PageKey; heightClass?: string }) {
  if (page === "gs1") {
    return (
      <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.20),transparent_28%),linear-gradient(135deg,#07111D_0%,#14324D_48%,#0EA5A4_100%)] p-6 text-white`}>
        <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">GS1 packaging identity</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
            <div className="text-sm font-semibold">Medicine pack with GS1 data</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-xs text-slate-200">01 GTIN • 10 Batch • 17 Expiry • 21 Serial</div>
              <div className="mt-4"><MatrixCode /></div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">GS1 fields</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[["01", "GTIN"], ["10", "Batch"], ["17", "Expiry"], ["21", "Serial"]].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3">
                    <div className="font-semibold">{k}</div>
                    <div className="text-slate-200">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">Barcode strip</div>
              <div className="mt-4"><BarcodeStrip /></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "authentication") {
    return (
      <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#0f2740_54%,#0EA5A4_100%)] p-6 text-white`}>
        <div className="mx-auto max-w-[320px] rounded-[32px] border border-white/10 bg-[#07111d] p-3 shadow-2xl">
          <div className="relative overflow-hidden rounded-[28px] bg-slate-950 p-4">
            <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">Live scan</div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-4"><MatrixCode /></div>
            <motion.div initial={{ x: -40 }} animate={{ x: 220 }} transition={{ duration: 2.1, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }} className="absolute left-6 right-6 top-[42%] h-[2px] bg-gradient-to-r from-cyan-300 via-white to-cyan-300" />
            <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/12 p-4 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">Authentic Product</div>
                <div className="rounded-full bg-white/10 px-2 py-1 text-[11px]">Verified</div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-200">
                {["GTIN match", "Batch valid", "Expiry read", "Serial valid"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center">{item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (page === "serialization") {
    return (
      <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.16),transparent_24%),linear-gradient(135deg,#07111D_0%,#17324A_52%,#0EA5A4_100%)] p-6 text-white`}>
        <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">Packaging hierarchy</div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {[["Unit", "Unique saleable pack"], ["Carton", "Aggregated grouping"], ["Pallet", "Distribution layer"]].map(([title, sub], idx) => (
            <div key={title} className={`rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur ${idx === 1 ? "md:mt-8" : idx === 2 ? "md:mt-16" : ""}`}>
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">0{idx + 1}</div>
              <div className="mt-3 text-xl font-semibold">{title}</div>
              <div className="mt-2 text-sm text-slate-200">{sub}</div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 p-3">
                <div className="text-xs text-slate-200">GTIN + Serial</div>
                <div className="mt-3"><BarcodeStrip bars={18} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "track") {
    return (
      <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.16),transparent_24%),linear-gradient(135deg,#07111D_0%,#16324B_52%,#0EA5A4_100%)] p-6 text-white`}>
        <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">Movement visibility</div>
        <div className="mt-6 grid gap-6 md:grid-cols-5">
          {["Factory", "Warehouse", "Distributor", "Pharmacy", "Patient"].map((step, i) => (
            <div key={step} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-sm font-semibold">0{i + 1}</div>
              <div className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan-100">{step}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 h-[2px] bg-gradient-to-r from-cyan-300 via-white to-cyan-300" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {["Scan event", "Movement record", "Traceability view"].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/10 px-3 py-3 text-center text-xs font-medium text-slate-200">{item}</div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "digital") {
    return (
      <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.20),transparent_26%),linear-gradient(135deg,#07111D_0%,#1a2b40_50%,#b45309_100%)] p-6 text-white`}>
        <div className="text-[11px] uppercase tracking-[0.22em] text-amber-200">Diversion risk intelligence</div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">Expected market</div>
            <div className="mt-3 text-2xl font-semibold">North India</div>
            <div className="mt-2 text-sm text-slate-200">Authorized distributor route</div>
          </div>
          <div className="rounded-3xl border border-amber-300/30 bg-amber-400/10 p-5 backdrop-blur">
            <div className="text-xs uppercase tracking-[0.18em] text-amber-200">Observed anomaly</div>
            <div className="mt-3 text-2xl font-semibold">South Zone Scan</div>
            <div className="mt-2 text-sm text-slate-200">Unexpected downstream appearance</div>
          </div>
        </div>
        <div className="mt-5 rounded-[28px] border border-white/10 bg-[#07111d]/45 p-5 backdrop-blur">
          <div className="grid gap-4 md:grid-cols-3">
            {[["Expected path", "Mapped route"], ["Actual scan", "Region mismatch"], ["Decision", "Escalate review"]].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-white/8 p-4 text-white">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">{title}</div>
                <div className="mt-2 text-sm text-slate-200">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${heightClass} relative overflow-hidden rounded-[inherit] bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.18),transparent_26%),linear-gradient(135deg,#07111D_0%,#15324A_50%,#0EA5A4_100%)] p-6 text-white`}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-100">Warehouse validation</div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {[["Match", "Pass validation"], ["Mismatch", "Needs review"], ["Blocked", "Stop movement"]].map(([title, text]) => (
          <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="text-lg font-semibold">{title}</div>
            <div className="mt-2 text-sm text-slate-200">{text}</div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
        <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">Operational checkpoints</div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {["Receiving", "Validation", "Storage / handling", "Dispatch"].map((step) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">{step}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function heroPage(variant: HeroVariant): PageKey {
  if (variant === "scanner") return "authentication";
  if (variant === "diagram") return "serialization";
  if (variant === "timeline") return "track";
  if (variant === "risk") return "digital";
  if (variant === "dashboard") return "warehouse";
  return "gs1";
}

function HeroVisual({ variant }: { variant: HeroVariant }) {
  const page = heroPage(variant);
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-[0_30px_120px_rgba(2,8,23,0.40)] backdrop-blur-2xl">
      <IllustrationCard page={page} heightClass="h-[420px]" />
    </div>
  );
}

const Hero = ({ title, text, badge, statA, statB, statC, variant }: HeroProps) => (
  <div className="relative overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${theme.darker} 0%, ${theme.primary} 55%, ${theme.accent} 100%)` }}>
    <GridGlow />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_18%)]" />
    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-28">
      <motion.div initial="hidden" animate="show" variants={stagger}>
        <motion.div variants={fadeUp} className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">{badge}</motion.div>
        <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">{title}</motion.h1>
        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">{text}</motion.p>
        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
          <a href="/main/contact" className="group rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1F4B73] shadow-lg transition hover:scale-[1.02]">Request Demo <ArrowRight className="ml-1 inline h-4 w-4" /></a>
          <a href="/main/contact" className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur">Talk to Sales</a>
        </motion.div>
        <motion.div variants={fadeUp} className="mt-10 grid gap-3 sm:grid-cols-3">
          {[statA, statB, statC].map((item) => (
            <div key={item} className="rounded-2xl border border-white/12 bg-white/8 px-4 py-4 backdrop-blur-xl">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">Capability</div>
              <div className="mt-2 text-sm font-medium text-white">{item}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}>
        <HeroVisual variant={variant} />
      </motion.div>
    </div>
  </div>
);

function PremiumNavbar({ current, onChange }: { current: PageKey; onChange: (key: PageKey) => void }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-white font-bold shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
            <span className="relative z-10">R</span>
            <div className="absolute inset-y-2 right-2 w-[2px] bg-white/90" />
            <div className="absolute inset-y-3 right-4 w-[2px] bg-white/80" />
            <div className="absolute inset-y-4 right-6 w-[2px] bg-white/65" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Ratifye</div>
            <div className="text-xs text-slate-500">Pharma barcode and trust platform</div>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm">
          {NAV_PAGES.map((page) => (
            <a key={page.key} href={page.href} onClick={(e) => { e.preventDefault(); onChange(page.key); }} className={`rounded-full px-4 py-2 text-sm font-medium transition ${current === page.key ? "text-white shadow-sm" : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"}`} style={{ backgroundColor: current === page.key ? theme.primary : "transparent" }}>
              {page.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href="/blogs" className="hidden sm:inline text-sm font-medium text-slate-600 hover:text-slate-900">Blogs</a>
          <a href="/main/contact" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Contact</a>
          <a href="/main/contact" className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm" style={{ backgroundColor: theme.primary }}>Request Demo</a>
        </div>
      </div>
    </header>
  );
}

function PremiumFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-slate-200 bg-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,164,0.08),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(31,75,115,0.08),transparent_22%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-white font-bold shadow-lg" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}>
              <span className="relative z-10">R</span>
              <div className="absolute inset-y-2 right-2 w-[2px] bg-white/90" />
              <div className="absolute inset-y-3 right-4 w-[2px] bg-white/80" />
              <div className="absolute inset-y-4 right-6 w-[2px] bg-white/65" />
            </div>
            <div className="text-lg font-semibold text-slate-900">Ratifye</div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">Ratifye helps pharmaceutical teams generate GS1 barcodes, authenticate products, enable serialization, track product movement, detect diversion risk, and strengthen warehouse verification workflows.</p>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Solutions</div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">{NAV_PAGES.map((item) => <a key={item.key} href={item.href} className="hover:text-slate-900">{item.label}</a>)}</div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Company</div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <a href="/about" className="hover:text-slate-900">About</a>
            <a href="/blogs" className="hover:text-slate-900">Blogs</a>
            <a href="/main/contact" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">Get started</div>
          <p className="mt-4 text-sm leading-7 text-slate-600">Book a walkthrough to review the Ratifye product story for your pharmaceutical workflow.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="/main/contact" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: theme.primary }}>Request Demo</a>
            <a href="/main/contact" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Talk to Sales</a>
          </div>
        </div>
      </div>
      <div className="relative border-t border-slate-200 px-6 py-5 text-center text-sm text-slate-500">© 2026 Ratifye. All rights reserved.</div>
    </footer>
  );
}

function StoryDivider({ page }: { page: PageKey }) {
  return (
    <Section className="py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(14,165,164,0.08),transparent_22%),radial-gradient(circle_at_right,rgba(31,75,115,0.08),transparent_20%)]" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Story Flow</div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{storyMap[page].title}</h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">{storyMap[page].subtitle}</p>
        </div>
      </motion.div>
    </Section>
  );
}

function MidCtaSection() {
  return (
    <Section className="py-12">
      <motion.div initial={{ opacity: 0, scale: 0.98, y: 18 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#07111D_0%,#1F4B73_55%,#0EA5A4_100%)] px-8 py-8 text-white shadow-[0_18px_70px_rgba(2,8,23,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_16%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Workflow Preview</div>
            <h3 className="mt-2 text-2xl font-semibold">See the workflow in a live demo</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100">Experience the live product flow, scan, validation, and operational states across real pharmaceutical workflows.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/main/contact" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1F4B73]">Book demo</a>
            <a href="/main/contact" className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white">Talk to sales</a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

function ScrollProgressRail() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      setProgress(Math.min(window.scrollY / max, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 xl:flex xl:flex-col xl:items-center">
      <div className="h-44 w-[3px] overflow-hidden rounded-full bg-slate-200/80">
        <motion.div className="w-[3px] rounded-full bg-[linear-gradient(180deg,#0EA5A4_0%,#1F4B73_100%)]" animate={{ height: `${Math.max(progress * 176, 18)}px` }} transition={{ duration: 0.12, ease: "linear" }} />
      </div>
      <div className="mt-3 rounded-full border border-slate-200 bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur">Scroll</div>
    </div>
  );
}

function SignatureBlock({ page }: { page: PageKey }) {
  if (page === "authentication") {
    return (
      <Section className="py-12">
        <div className="flex justify-center">
          <div className="w-[340px] rounded-[30px] border border-slate-200 bg-white p-6 shadow-lg">
            <div className="text-xs text-slate-500">Scan Result</div>
            <div className="mt-3 text-2xl font-semibold" style={{ color: theme.success }}>Authentic</div>
            <div className="mt-2 text-sm text-slate-600">GTIN • Batch • Expiry • Serial verified</div>
          </div>
        </div>
      </Section>
    );
  }

  if (page === "serialization") {
    return (
      <Section className="py-12">
        <div className="grid gap-6 text-center md:grid-cols-3">
          {["Unit", "Carton", "Pallet"].map((level) => (
            <div key={level} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">Level</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">{level}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (page === "track") {
    return (
      <Section className="py-12">
        <div className="flex items-center justify-between gap-4 text-center text-sm text-slate-600">
          {["Manufacturer", "Warehouse", "Distributor", "Pharmacy"].map((step) => (
            <div key={step} className="flex-1">
              <div className="mx-auto h-3 w-3 rounded-full bg-slate-900" />
              <div className="mt-2">{step}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  if (page === "digital") {
    return (
      <Section className="py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="font-semibold text-red-600">Market Mismatch Detected</div>
          <div className="mt-2 text-sm text-slate-600">Unexpected scan location versus assigned route.</div>
        </div>
      </Section>
    );
  }

  if (page === "warehouse") {
    return (
      <Section className="py-12">
        <div className="grid gap-4 md:grid-cols-3">
          {["Pass", "Mismatch", "Blocked"].map((state) => (
            <div key={state} className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-sm text-slate-500">Status</div>
              <div className="mt-2 font-semibold text-slate-900">{state}</div>
            </div>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section className="py-12">
      <div className="grid gap-6 md:grid-cols-4">
        {["01 GTIN", "10 Batch", "17 Expiry", "21 Serial"].map((ai) => (
          <div key={ai} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="text-sm text-slate-500">GS1 AI</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{ai}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function MediaShowcase({ page }: { page: PageKey }) {
  const visualHeadingMap: Record<PageKey, string> = {
    gs1: "GS1 Barcode Scanning and Verification Workflows in Pharma",
    authentication: "Pharma Barcode Authentication and Verification Screens",
    serialization: "Pharma Serialization and Packaging Identity Visuals",
    track: "Track and Trace Workflows Across Pharma Distribution",
    digital: "Market Diversion Detection and Barcode Risk Signals",
    warehouse: "Warehouse Barcode Verification in Pharma Operations",
  };

  return (
    <Section>
      <div className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,164,0.10),transparent_20%),radial-gradient(circle_at_bottom_left,rgba(31,75,115,0.08),transparent_20%)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-teal-600">Pharma Workflow Visuals</div>
            <h3 className="mt-2 text-3xl font-semibold text-slate-900">{visualHeadingMap[page]}</h3>
            <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">Visuals of GS1 barcode scanning, packaging, and pharmaceutical operations that show how products are verified, handled, and validated across real pharma workflows.</p>
          </div>
          <a href="/main/contact" className="rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ backgroundColor: theme.primary }}>Request Media Demo</a>
        </div>
        <div className="relative mt-8 grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm"><IllustrationCard page={page} heightClass="h-[420px]" /></div>
          <div className="grid gap-6">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm"><IllustrationCard page={page} heightClass="h-[200px]" /></div>
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#07111D_0%,#1F4B73_55%,#0EA5A4_100%)] p-5 text-white shadow-sm">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-100">Live workflow preview</div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Scan", "Validate", "Respond"].map((item, index) => (
                  <motion.div key={item} initial={{ opacity: 0.4, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: index * 0.08 }} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-center text-sm font-medium">
                    {item}
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ x: -40 }} whileInView={{ x: 0 }} transition={{ duration: 0.7 }} className="mt-5 h-[2px] w-full bg-gradient-to-r from-cyan-300 via-white to-cyan-300" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function BarcodeVisuals({ page }: { page: PageKey }) {
  const titleMap: Record<PageKey, string> = {
    gs1: "GS1-style barcode and 2D code visuals",
    authentication: "GS1 scan states and verification signals",
    serialization: "Serialization-ready barcode identity visuals",
    track: "Traceability identifiers across movement checkpoints",
    digital: "Barcode intelligence linked to route anomalies",
    warehouse: "Operational barcode states and validation views",
  };

  return (
    <Section className="bg-slate-50">
      <Title eyebrow="Barcode Visuals" title={titleMap[page]} description="GS1 DataMatrix, QR, and packaging-level barcode visuals used across real pharmaceutical workflows." />
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Linear barcode visual</div>
          <div className="mt-4"><BarcodeStrip /></div>
          <div className="mt-4 text-sm text-slate-600">GTIN, batch, and expiry oriented strip for packaging and operational storytelling.</div>
        </Card>
        <Card className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">2D code visual</div>
          <div className="mt-4"><MatrixCode /></div>
          <div className="mt-4 text-sm text-slate-600">2D matrix-style visual to represent GS1 DataMatrix or QR-led product journeys.</div>
        </Card>
      </motion.div>
    </Section>
  );
}

function TrustSection({ page }: { page: PageKey }) {
  return (
    <Section className="bg-slate-50">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <Title eyebrow="Trust Layer" title="Built for pharmaceutical workflows that need confidence, not just barcode reads" description="Ratifye positions barcode generation, authentication, serialization, traceability, diversion monitoring, and warehouse validation as connected workflow layers rather than isolated features." />
        </div>
        <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2">
          {TRUST_SIGNALS[page].map((item) => (
            <Card key={item} className="p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-2xl bg-teal-50 p-2 text-teal-700"><ShieldCheck className="h-5 w-5" /></div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">Signal</div>
                  <p className="mt-3 text-base leading-7 text-slate-700">{item}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

function InternalLinks({ current }: { current: PageKey }) {
  const related = NAV_PAGES.filter((page) => page.key !== current).slice(0, 3);
  return (
    <Section className="bg-slate-50 py-16">
      <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-teal-600">Related Pharma Solutions</div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Explore related barcode, verification, and traceability workflows</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Explore related Ratifye solutions including GS1 barcode generation, barcode authentication, serialization, track and trace, diversion monitoring, and warehouse verification.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {related.map((item) => (
              <a key={item.key} href={item.href} className="group inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:bg-slate-50">
                {item.label}
                <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function BlogPreviewSection({ page }: { page: PageKey }) {
  return (
    <Section>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-teal-600">Pharma Knowledge Hub</div>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">GS1 Barcode, Authentication, Serialization, and Traceability Insights</h3>
        </div>
        <a href="/blogs" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">View all blogs</a>
      </div>
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="mt-8 grid gap-6 md:grid-cols-2">
        {BLOG_PREVIEWS[page].map((item) => (
          <Card key={item.title} className="overflow-hidden p-0">
            <div className="h-52 overflow-hidden"><IllustrationCard page={page} heightClass="h-full" /></div>
            <div className="p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-teal-600">Blog Preview</div>
              <h4 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.summary}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </Section>
  );
}

function FAQBlock({ page }: { page: PageKey }) {
  return (
    <Section>
      <Title eyebrow="FAQ" title="Frequently asked questions" description="Questions about GS1 barcodes, authentication, and pharmaceutical workflows." align="center" />
      <div className="grid gap-4">
        {FAQS[page].map((item) => (
          <details key={item.q} className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition open:shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
            <summary className="cursor-pointer list-none text-lg font-semibold text-slate-900">{item.q}</summary>
            <p className="mt-4 text-sm leading-7 text-slate-600">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

function ConversionSection({ title }: { title: string }) {
  const heading = title === "GS1" ? "Request a GS1 Barcode Demo with Ratifye" : title === "Serialization" ? "Start Pharma Serialization with Ratifye" : `Experience the ${title} workflow in action with Ratifye`;
  return (
    <Section className="py-14">
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,#07111D_0%,#1F4B73_55%,#0EA5A4_100%)] px-8 py-10 text-white shadow-[0_25px_90px_rgba(2,8,23,0.18)] lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_16%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">Request Demo</div>
            <h3 className="mt-3 text-3xl font-semibold">{heading}</h3>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-100">Review the product flow, scan logic, operational states and reporting structure with a tailored product walkthrough for your team.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/main/contact" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1F4B73]">Request Demo</a>
            <a href="/main/contact" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white">Talk to Sales</a>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContactSection({ page }: { page: PageKey }) {
  return (
    <Section className="bg-slate-50">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <Title eyebrow="Contact Ratifye" title={`Talk to the team about ${NAV_PAGES.find((item) => item.key === page)?.label}`} description="Talk to the Ratifye team about your barcode, authentication, serialization, or traceability requirements." />
          <div className="grid gap-4 sm:grid-cols-2">
            {[ ["Email", "hello@ratifye.com"], ["Response", "Usually within 1 business day"], ["Focus", "Pharma barcode and trust workflows"], ["Format", "Demo, discovery or implementation call"] ].map(([title, text]) => (
              <Card key={title} className="p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-600">{title}</div>
                <div className="mt-2 text-sm leading-7 text-slate-700">{text}</div>
              </Card>
            ))}
          </div>
        </div>
        <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.07)]">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Name<input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" placeholder="Your name" /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Work email<input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" placeholder="name@company.com" /></label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">Company<input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" placeholder="Company name" /></label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">Solution interest<input className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" defaultValue={NAV_PAGES.find((item) => item.key === page)?.label} /></label>
          </div>
          <label className="mt-4 grid gap-2 text-sm font-medium text-slate-700">Requirements<textarea className="min-h-[140px] rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-500 focus:bg-white" placeholder="Tell us about your barcode, authentication, serialization, traceability or warehouse workflow." /></label>
          <div className="mt-6 flex flex-wrap gap-4"><a href="/main/contact" className="rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: theme.primary }}>Submit request</a><a href="/main/contact" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700">Book discovery call</a></div>
        </div>
      </div>
    </Section>
  );
}

function PageShell({ page, hero, children }: { page: PageKey; hero: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      <SEOHead data={SEO[page]} page={page} />
      <ScrollProgressRail />
      <div className={pageDesignMap[page].bg}>{hero}</div>
      <SignatureBlock page={page} />
      {children}
      <StoryDivider page={page} />
      <MediaShowcase page={page} />
      <div className="relative"><motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto my-10 h-[2px] w-24 bg-gradient-to-r from-teal-500 to-blue-500" /></div>
      <MidCtaSection />
      <BarcodeVisuals page={page} />
      <TrustSection page={page} />
      <InternalLinks current={page} />
      <BlogPreviewSection page={page} />
      <FAQBlock page={page} />
      <ConversionSection title={NAV_PAGES.find((n) => n.key === page)?.label || "this solution"} />
      <ContactSection page={page} />
    </>
  );
}

function Gs1Page() {
  return (
    <PageShell page="gs1" hero={<Hero title="GS1 Barcode Foundation" text="Generate GS1-compliant barcodes using GTIN (01), batch or lot (10), expiry (17), and serial (21) for pharmaceutical packaging." badge="GS1 Foundation" statA="GTIN Ready" statB="Batch + Expiry" statC="Serialization Ready" variant="split" />}>
      <Section>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Title eyebrow="GS1 Foundation" title="GS1 barcode defines pharmaceutical product identity" description="Ratifye helps pharmaceutical teams move from static barcode printing to structured GS1 product identification. The barcode becomes a machine-readable layer for packaging, scan-readiness, serialization, and downstream traceability workflows." />
            <motion.div variants={stagger} className="grid gap-4 sm:grid-cols-2">
              {["GTIN-based product identification", "Batch and expiry data structure", "Packaging hierarchy support", "Authentication and traceability readiness"].map((item) => <Card key={item} className="p-5"><p className="text-sm leading-7 text-slate-700">{item}</p></Card>)}
            </motion.div>
          </div>
          <Card className="bg-slate-50 p-8">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Why it matters</div>
            <h3 className="mt-3 text-2xl font-semibold text-slate-900">GS1 barcode structure supports scan, validation, and downstream control</h3>
            <div className="mt-6 space-y-3">
              {["Static barcodes do not create a usable pharmaceutical identity layer.", "GS1 structure improves packaging consistency across SKUs and packaging levels.", "Scan-based systems work better when barcode data is predictable and well-formed.", "Future serialization, authentication, and track and trace systems depend on a clean identity base."].map((item) => <div key={item} className={pills.light}>{item}</div>)}
            </div>
          </Card>
        </motion.div>
      </Section>
      <Section className="bg-slate-50">
        <Title eyebrow="Data" title="Core GS1 fields used in pharmaceutical barcode systems" description="These data elements make pharmaceutical barcode generation machine-readable, operationally useful, and ready for verification workflows." />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[["01", "GTIN", "Defines the core global trade item identity for the pharmaceutical product."], ["10", "Batch / Lot", "Connects the pack to production batch information for operational and trust workflows."], ["17", "Expiry", "Makes expiry data machine-readable for scanning, verification, and supply chain use."], ["21", "Serial", "Supports unique unit-level identity when serialization is implemented."]].map(([ai, label, text]) => (
            <Card key={ai} className="p-7">
              <div className="text-4xl font-semibold" style={{ color: theme.primary }}>{ai}</div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{label}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Card>
          ))}
        </motion.div>
      </Section>
    </PageShell>
  );
}

function AuthenticationPage() {
  return (
    <PageShell page="authentication" hero={<Hero title="Scan. Verify. Trust." text="Turn barcode scan into a real-time pharmaceutical authentication flow with clear result states, GS1 data reading, and trust-oriented scan outcomes." badge="Authentication" statA="Scan Ready" statB="Trust Result" statC="Anti-Counterfeit" variant="scanner" />}>
      <Section className="bg-slate-50">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid items-start gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div><Title eyebrow="Scanner" title="Live verification interface" description="The product scan should feel like a decision workflow, not a passive data read." /></div>
          <div>
            <Title eyebrow="Flow" title="Authentication flow from barcode scan to trust result" description="Authentication becomes clearer when the page shows how a scan turns into a product decision." />
            <motion.div variants={stagger} className="space-y-4">
              {[["01", "Scan the pharmaceutical barcode", "A pharmacy, distributor, warehouse operator, or consumer scans the medicine pack through a Ratifye-enabled interface."], ["02", "Read GS1 barcode data", "The system extracts GTIN, batch, expiry, serial, or linked product identity data from the barcode."], ["03", "Validate GTIN, batch, expiry, and serial", "Ratifye checks the scan against registered product data, expected values, and trust conditions."], ["04", "Return authentication result", "The scan ends with a clear result such as authentic, warning, mismatch, expired, or suspicious."]].map(([step, title, text]) => (
                <Card key={step} className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl font-semibold text-white shadow-sm" style={{ backgroundColor: theme.primary }}>{step}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}

function SerializationPage() {
  return (
    <PageShell page="serialization" hero={<Hero title="Unit-Level Identity" text="Assign unique serial numbers to each saleable pharmaceutical unit and connect unit, carton, and shipper layers through a serialization structure." badge="Serialization" statA="Unique Unit" statB="Aggregation" statC="Traceability Base" variant="diagram" />}>
      <Section>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div><Title eyebrow="System" title="Serialization turns packaging identity into unit-level control" description="Serialization assigns a unique identity to each saleable pack. That unit-level identity becomes the base for stronger verification, aggregation, downstream visibility, and future traceability workflows." /></div>
          <motion.div variants={stagger} className="grid gap-4 md:grid-cols-2">
            {[["GTIN", "Product reference"], ["Serial", "Unique unit identity"], ["Packaging", "Unit, carton, shipper linkage"], ["Aggregation", "Grouping for operations"]].map(([title, text]) => (
              <Card key={title} className="p-6 text-center">
                <div className="text-lg font-semibold text-slate-900">{title}</div>
                <div className="mt-2 text-sm text-slate-600">{text}</div>
              </Card>
            ))}
          </motion.div>
        </motion.div>
      </Section>
    </PageShell>
  );
}

function TrackPage() {
  return (
    <PageShell page="track" hero={<Hero title="Track Product Journey" text="Connect barcode scans with product movement visibility across warehouse, distributor, pharmacy, and downstream pharmaceutical checkpoints." badge="Track and Trace" statA="Checkpoint History" statB="Movement Visibility" statC="Recall Ready" variant="timeline" />}>
      <Section className="bg-slate-50">
        <Title eyebrow="Flow" title="Supply chain timeline" description="Movement visibility becomes easier to understand when the page maps product flow across operational stages." />
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {[["Manufacturer", "Product identity begins at packaging and release workflows."], ["Warehouse", "Scans validate receiving, storage, and dispatch events."], ["Distributor", "Movement checkpoints improve downstream handoff visibility."], ["Pharmacy", "Verification continues closer to dispense points."], ["Consumer / patient", "Final trust or engagement scans extend the product journey."]].map(([title, text], i) => (
            <Card key={title} className="p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">0{i + 1}</div>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </Card>
          ))}
        </motion.div>
      </Section>
    </PageShell>
  );
}

function MarketDiversionPage() {
  return (
    <PageShell page="digital" hero={<Hero title="Detect Market Diversion Before It Spreads" text="Use barcode-linked product intelligence, scan checkpoints, and channel validation to identify suspicious product movement across markets, regions, and unauthorized downstream routes." badge="Market Diversion" statA="Geo Mismatch" statB="Channel Review" statC="Alert Ready" variant="risk" />}>
      <Section className="bg-slate-50">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div><Title eyebrow="Diversion Risk" title="Why diverted pharmaceutical products are hard to detect" description="When the same product moves outside the intended market, distributor path, or regional channel, visibility becomes weak. Ratifye helps teams compare where a product was expected to move versus where it was actually scanned." /></div>
          <Card className="overflow-hidden p-0"><IllustrationCard page="digital" heightClass="h-[520px]" /></Card>
        </motion.div>
      </Section>
    </PageShell>
  );
}

function WarehousePage() {
  return (
    <PageShell page="warehouse" hero={<Hero title="Operational Verification" text="Add structured scan-based validation to warehouse and distributor workflows for stronger control across receiving, storage, dispatch, and handoff operations." badge="Warehouse Verification" statA="Receiving" statB="Dispatch" statC="Role-Based Checks" variant="dashboard" />}>
      <Section className="bg-slate-50">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={stagger} className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Title eyebrow="Operations" title="Warehouse verification workflow" description="Warehouse validation works best when receiving, handling, dispatch, and role-based checks are visible in one operational flow." />
            <motion.div variants={stagger} className="space-y-4">
              {[["01", "Receiving", "Products are scanned as they enter the warehouse or distribution environment."], ["02", "Validation", "Barcode identity and product status are checked against expected logic."], ["03", "Storage / handling", "Structured scans continue during internal movement or control workflows."], ["04", "Dispatch", "Outgoing products are validated before leaving the operational checkpoint."]].map(([step, title, text]) => (
                <Card key={step} className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl font-semibold text-white" style={{ backgroundColor: theme.primary }}>{step}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
          <div>
            <Title eyebrow="Dashboard" title="Validation states" description="Operational teams need scan outcomes that are easy to interpret and act on quickly." />
            <motion.div variants={stagger} className="grid gap-6 md:grid-cols-3">
              {[["Match", "Barcode identity aligns with expected product logic.", theme.success], ["Mismatch", "Barcode or product state needs review before movement.", theme.warning], ["Blocked", "High-risk or invalid state should be stopped.", theme.danger]].map(([label, text, color]) => (
                <Card key={label} className="p-6">
                  <div className="text-lg font-semibold" style={{ color: color as string }}>{label}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}

export default function SolutionTabsComponent(key: any) {
  const smokeErrors = useMemo(() => runSmokeTests(), []);

  console.log('key:', key?.pageKey);
  
  const pageNode = useMemo(() => {
    switch (key?.pageKey) {
      case "authentication":
        return <AuthenticationPage />;
      case "serialization":
        return <SerializationPage />;
      case "track":
        return <TrackPage />;
      case "digital":
        return <MarketDiversionPage />;
      case "warehouse":
        return <WarehousePage />;
      case "gs1":
      default:
        return <Gs1Page />;
    }
  }, [key]);

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-cyan-100 selection:text-slate-950">
      {/* <PremiumNavbar current={key} onChange={setKey} /> */}
      {smokeErrors.length > 0 ? (
        <Section className="bg-rose-50 py-8">
          <div className="rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-700">Configuration errors</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-rose-700">{smokeErrors.map((error) => <li key={error}>{error}</li>)}</ul>
          </div>
        </Section>
      ) : null}
      {pageNode}
      {/* <PremiumFooter /> */}
    </div>
  );
}