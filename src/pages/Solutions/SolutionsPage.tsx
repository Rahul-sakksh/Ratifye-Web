import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

type PageKey =
  | "gs1"
  | "authentication"
  | "serialization"
  | "track"
  | "digital"
  | "warehouse";

type NavPage = {
  key: PageKey;
  label: string;
  href: string;
  shortTitle: string;
  subtitle: string;
  brief: string;
};

const theme = {
  primary: "#1F4B73",
  accent: "#0EA5A4",
} as const;

const NAV_PAGES: NavPage[] = [
  {
    key: "gs1",
    label: "GS1",
    href: "/gs1-barcode-generation",
    shortTitle: "GS1 Barcode Foundation",
    subtitle: "Structured product identity",
    brief:
      "Generate GS1-ready barcode identity using GTIN, batch, expiry, and serial logic for pharma packaging.",
  },
  {
    key: "authentication",
    label: "Authentication",
    href: "/barcode-authentication",
    shortTitle: "Barcode Authentication",
    subtitle: "Scan to trust decision",
    brief:
      "Turn barcode scans into real-time verification outcomes with trust signals and product validation logic.",
  },
  {
    key: "serialization",
    label: "Serialization",
    href: "/pharma-serialization",
    shortTitle: "Pharma Serialization",
    subtitle: "Unit-level identity",
    brief:
      "Assign unique serial identity across unit, carton, and pallet layers for stronger control and traceability.",
  },
  {
    key: "track",
    label: "Track & Trace",
    href: "/track-and-trace",
    shortTitle: "Track & Trace",
    subtitle: "Movement visibility",
    brief:
      "Connect scan events with downstream product movement records across warehouse, distributor, and pharmacy checkpoints.",
  },
  {
    key: "digital",
    label: "Diversion",
    href: "/market-diversion-detection",
    shortTitle: "Market Diversion",
    subtitle: "Route anomaly detection",
    brief:
      "Identify suspicious market movement through barcode-linked channel, geo, and route validation workflows.",
  },
  {
    key: "warehouse",
    label: "Warehouse",
    href: "/warehouse-barcode-verification",
    shortTitle: "Warehouse Verification",
    subtitle: "Operational scan control",
    brief:
      "Validate product identity during receiving, storage, handling, and dispatch with structured scan states.",
  },
];

function runSmokeTests(): string[] {
  const errors: string[] = [];
  const keys = NAV_PAGES.map((page) => page.key);
  const hrefs = NAV_PAGES.map((page) => page.href);

  if (new Set(keys).size !== keys.length) {
    errors.push("Duplicate solution keys found.");
  }

  if (new Set(hrefs).size !== hrefs.length) {
    errors.push("Duplicate solution routes found.");
  }

  for (const page of NAV_PAGES) {
    if (!page.shortTitle.trim()) errors.push(`Missing shortTitle for ${page.key}.`);
    if (!page.subtitle.trim()) errors.push(`Missing subtitle for ${page.key}.`);
    if (!page.brief.trim()) errors.push(`Missing brief for ${page.key}.`);
  }

  return errors;
}

function SolutionsDropdown({
  current,
  onChange,
}: {
  current: PageKey;
  onChange: (key: PageKey) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white hover:text-slate-950"
      >
        Solutions
        <ChevronRight className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-[calc(100%+14px)] z-50 w-[980px] overflow-hidden rounded-[32px] border border-slate-200 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
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
                    onChange(page.key);
                    setOpen(false);
                  }}
                  className={`group rounded-[28px] border p-5 text-left transition ${
                    current === page.key
                      ? "border-slate-300 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
                      : "border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white hover:shadow-[0_12px_36px_rgba(15,23,42,0.08)]"
                  }`}
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
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState<PageKey>("authentication");
  const smokeErrors = runSmokeTests();
  const currentPage = NAV_PAGES.find((page) => page.key === current) ?? NAV_PAGES[0];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f8_100%)] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl text-white font-bold shadow-lg"
              style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})` }}
            >
              <span className="relative z-10">R</span>
              <div className="absolute inset-y-2 right-2 w-[2px] bg-white/90" />
              <div className="absolute inset-y-3 right-4 w-[2px] bg-white/80" />
              <div className="absolute inset-y-4 right-6 w-[2px] bg-white/65" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Ratifye</div>
              <div className="text-xs text-slate-500">Solutions dropdown preview</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SolutionsDropdown current={current} onChange={setCurrent} />
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
              Contact
            </button>
            <button
              className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm"
              style={{ backgroundColor: theme.primary }}
            >
              Request Demo
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {smokeErrors.length > 0 ? (
          <div className="mb-8 rounded-[28px] border border-rose-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-700">Configuration errors</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-rose-700">
              {smokeErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="rounded-[36px] border border-slate-200 bg-white/80 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="text-xs uppercase tracking-[0.18em] text-teal-600">
            Live Preview
          </div>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            {currentPage.shortTitle}
          </h1>
          <div className="mt-3 text-sm uppercase tracking-[0.16em] text-slate-500">
            {currentPage.subtitle}
          </div>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            {currentPage.brief}
          </p>
        </div>
      </main>
    </div>
  );
}

