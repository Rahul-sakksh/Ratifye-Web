import React from "react";

import { ShieldCheck, ArrowRight, Play, CheckCircle2, Terminal, BookText, Layers, LinkIcon, BarChart3 } from "lucide-react";

const site = {
  brand: "SAKKSH",
  domain: "https://gs1r.ai",
};

const baseKeywords = [
  "SAKKSH",
  "GS1",
  "barcode generation",
  "barcode scanning",
  "product authentication",
  "anti-counterfeit",
  "traceability",
  "QR codes",
  "DataMatrix",
  "UPC EAN",
  "serialization",
  "supply chain",
];



function Hero({ icon: Icon, eyebrow, title, subtitle, media }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider">
            <Icon className="w-4 h-4" /> <span>{eyebrow}</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-black">{title}</h1>
          <p className="mt-3 text-zinc-600 leading-relaxed">{subtitle}</p>
          <div className="mt-6 flex gap-3">
            <a href="#trial" className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm flex items-center gap-2">Start Free Trial <ArrowRight className="w-4 h-4" /></a>
            <a href="#demo" className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-900 text-sm flex items-center gap-2">Request Demo <Play className="w-4 h-4" /></a>
          </div>
        </div>
        <MediaPanel {...media} />
      </div>
    </section>
  );
}

function MediaPanel({ images = [], video }) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        {images.slice(0, 4).map((img, i) => (
          <figure key={i} className="aspect-[4/3] w-full rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200">
            {img?.src ? (
              <img src={img.src} alt={img.alt || "SAKKSH product visual"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-zinc-400 text-sm">Image {i + 1}</div>
            )}
          </figure>
        ))}
      </div>
      <div className="aspect-video w-full rounded-2xl overflow-hidden border border-zinc-200 bg-black">
        {video?.src ? (
          <video controls poster={video.poster} className="w-full h-full">
            <source src={video.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full grid place-items-center">
            <div className="flex items-center gap-3 text-white/70"><Play className="w-5 h-5"/> Feature Video</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, subtitle, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-zinc-700" />}
        <h2 className="text-xl font-semibold text-black">{title}</h2>
      </div>
      {subtitle && <p className="text-zinc-600 mt-2">{subtitle}</p>}
    </div>
  );
}

function UseCases({ items = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Section title="Use Cases" subtitle="Proven patterns you can ship today." icon={BookText} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((uc, i) => (
          <article key={i} className="rounded-2xl border border-zinc-200 p-5 bg-white hover:shadow-sm transition-shadow">
            <h3 className="text-black font-medium">{uc.title}</h3>
            <p className="text-sm text-zinc-600 mt-2">{uc.desc}</p>
            {uc.metrics && (
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {uc.metrics.map((m, j) => (
                  <div key={j} className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                    <dt className="text-zinc-500">{m.label}</dt>
                    <dd className="text-black font-semibold mt-1">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function ResearchSection({ data }) {
  if (!data) return null;
  const { stats = [], bullets = [], sources = [] } = data;
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Section title="Research & Insights" subtitle="Context, benchmarks, and standards to inform your rollout." icon={BarChart3} />
      {!!stats.length && (
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-6 bg-white">
              <div className="text-2xl font-semibold text-black">{s.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
              {s.context && <p className="text-sm text-zinc-600 mt-2">{s.context}</p>}
            </div>
          ))}
        </div>
      )}
      {!!bullets.length && (
        <ul className="mt-6 grid gap-3 text-sm text-zinc-700 list-disc pl-5">
          {bullets.map((b, i) => (<li key={i}>{b}</li>))}
        </ul>
      )}
      {!!sources.length && (
        <div className="mt-6 rounded-2xl border border-zinc-200 p-5 bg-zinc-50">
          <div className="text-xs uppercase tracking-wider text-zinc-500">Suggested sources to cite</div>
          <ul className="mt-3 text-sm text-zinc-700">
            {sources.map((s, i) => (
              <li key={i}>
                {s.href ? <a className="underline hover:text-black" href={s.href} target="_blank" rel="noreferrer">{s.label}</a> : s.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ThreeStepImplementation({ steps = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Section title="3‑Step Implementation" subtitle="From sandbox to scale in days, not months." icon={Layers} />
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="rounded-2xl border border-zinc-200 p-5 bg-white">
            <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase tracking-wider"><span className="w-6 h-6 rounded-full bg-black text-white grid place-items-center text-xs">{i+1}</span> {s.badge}</div>
            <h3 className="mt-3 font-medium text-black">{s.title}</h3>
            <p className="text-sm text-zinc-600 mt-2">{s.desc}</p>
            {Array.isArray(s.checks) && s.checks.length > 0 && (
              <ul className="mt-4 grid gap-2 text-sm">
                {s.checks.map((c,k) => (
                  <li key={k} className="flex items-center gap-2 text-zinc-700"><CheckCircle2 className="w-4 h-4"/> {c}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function ApiIntegration({ featureKey, endpoints = [], sdk = {} }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Section title="API Integration" subtitle="Clean REST endpoints with SDKs for rapid adoption." icon={Terminal} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-600">Endpoints</div>
            <div className="p-4 grid gap-4">
              {endpoints.map((ep, i) => (
                <div key={i} className="rounded-xl border border-zinc-200 p-4">
                  <div className="text-xs text-zinc-500 uppercase tracking-wider">{ep.method}</div>
                  <div className="font-mono text-sm text-black mt-1">{ep.path}</div>
                  <p className="text-sm text-zinc-600 mt-2">{ep.desc}</p>
                  {ep.sample && (
                    <pre className="mt-3 bg-zinc-950 text-zinc-100 rounded-xl p-4 overflow-x-auto text-xs"><code>{ep.sample}</code></pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-600 flex items-center gap-2"><LinkIcon className="w-4 h-4"/> SDK Snippet</div>
            <div className="p-4">
              <pre className="bg-zinc-950 text-zinc-100 rounded-xl p-4 overflow-x-auto text-xs"><code>{sdk.code}</code></pre>
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-3">Need help? <a href="#demo" className="underline hover:text-black">Book a technical walkthrough</a>.</p>
        </div>
      </div>
    </section>
  );
}

function CtaBand(){
  return (
    <section className="bg-zinc-50 border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-[1fr_auto] items-center">
        <div>
          <h3 className="text-2xl font-semibold text-black">One scan. Infinite possibilities.</h3>
          <p className="text-zinc-600 mt-1">Start with the feature you need—grow into a unified platform for codes, scans, and trust.</p>
        </div>
        <div className="flex gap-3">
          <a href="#trial" className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-white text-sm">Start Free Trial</a>
          <a href="#demo" className="px-4 py-2 rounded-xl bg-black text-white hover:bg-zinc-900 text-sm">Request Demo</a>
        </div>
      </div>
    </section>
  );
}

export default function AuthenticationPage() {
  
    const config = {
    path: "/features/product-authentication",
    title: "Product Authentication",
    description: "Stop counterfeits at the source. Verify product authenticity with serialized barcodes and AI-driven validation.",
    keywords: ["product authentication", "anti-counterfeit", "digital trust", "track & trace", "secure QR"],
    icon: ShieldCheck,
    hero: {
      eyebrow: "Feature",
      title: "Product Authentication — protect your brand, protect customers",
      subtitle: "Empower consumers, retailers, and inspectors to instantly verify product authenticity using serialized barcodes and secure QR codes.",
      media: {
        images: [
          { src: "/mockups/auth-1.png", alt: "Scan to authenticate UI" },
          { src: "/mockups/auth-2.png", alt: "Consumer trust screen" },
          { src: "/mockups/auth-3.png", alt: "Retailer verification dashboard" },
          { src: "/mockups/auth-4.png", alt: "Anti-counterfeit analytics" },
        ],
        video: { poster: "", src: "" },
      },
    },
    useCases: [
      {
        title: "Consumer Trust",
        desc: "Let customers instantly validate authenticity by scanning the code on product packaging.",
        metrics: [
          { label: "Fake detection", value: "95%+" },
          { label: "Avg. verification time", value: "<2s" },
        ],
      },
      {
        title: "Retailer & Distributor Checks",
        desc: "Enable supply chain partners to validate incoming goods against the central registry.",
        metrics: [
          { label: "Verification scale", value: "Global" },
          { label: "Batch verification", value: "Supported" },
        ],
      },
      {
        title: "Regulatory Compliance",
        desc: "Meet DSCSA, EU FMD, and WHO guidelines for serialization and authentication.",
        metrics: [
          { label: "Standards coverage", value: "GS1 + ISO" },
          { label: "Ready for audits", value: "Yes" },
        ],
      },
    ],
    research: {
      stats: [
        { label: "Counterfeit losses annually", value: "$500B+", context: "World Customs Organization" },
        { label: "Consumer trust uplift", value: "+65%", context: "when authentication QR is visible" },
        { label: "Verification success rate", value: "99.99%", context: "with GS1 digital link standard" },
      ],
      bullets: [
        "Serialization ensures every product unit is uniquely identifiable.",
        "Tamper-proof QR codes can embed cryptographic signatures.",
        "Consumers prefer instant mobile verification without apps.",
      ],
      sources: [
        { label: "GS1 Digital Link Standard" },
        { label: "WHO Anti-Counterfeit Guidelines" },
      ],
    },
    steps: [
      {
        badge: "Serialize",
        title: "Apply secure identifiers",
        desc: "Generate GS1 barcodes or QR codes with unique serial numbers.",
        checks: ["GS1 compliant", "Cryptographic seal", "Unit-level IDs"],
      },
      {
        badge: "Verify",
        title: "Scan & validate",
        desc: "Enable consumers and partners to authenticate instantly with our SDK or web tools.",
        checks: ["Multi-channel (web, mobile, API)", "Offline verification", "Error-tolerant"],
      },
      {
        badge: "Monitor",
        title: "Track & analyze",
        desc: "Detect counterfeit hotspots and monitor supply chain trust metrics.",
        checks: ["Real-time dashboards", "Anomaly detection", "Geo insights"],
      },
    ],
    api: {
      endpoints: [
        {
          method: "POST",
          path: "/api/v1/auth/verify",
          desc: "Verify authenticity of a scanned product code.",
          sample: `curl -X POST https://api.gs1r.ai/api/v1/auth/verify \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "01076123456789001724123110LOT42",
    "channel": "consumer"
  }'`,
        },
        {
          method: "GET",
          path: "/api/v1/auth/{id}",
          desc: "Fetch verification history and authentication results for a product.",
          sample: `curl -H "Authorization: Bearer <token>" https://api.gs1r.ai/api/v1/auth/VER_123`,
        },
      ],
      sdk: {
        code: `import { Authenticator } from "@sakksh/react-auth";

export default function AuthBox(){
  return <Authenticator onVerify={(result) => console.log(result)} secure={true} />
}`,
      },
    },
    faqs: [
      { q: "How does authentication work?", a: "Each product carries a serialized GS1 barcode or QR code. When scanned, it’s verified against a secure registry." },
      { q: "Can counterfeiters copy the code?", a: "Codes are unique and cryptographically protected. Reuse attempts trigger anomaly detection." },
      { q: "Do consumers need a special app?", a: "No. Verification works directly in modern mobile browsers or through partner apps." },
    ],
  };

  // ✅ JSON-LD blocks
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Features", item: `${site.domain}/features` },
      { "@type": "ListItem", position: 2, name: config.title, item: `${site.domain}${config.path}` },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${config.title} in 3 Steps`,
    step: config.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const Icon = config.icon;

  return (
    <main>
    

      <Hero icon={Icon} eyebrow="Feature" title={config.hero.title} subtitle={config.hero.subtitle} media={config.hero.media} />
      <UseCases items={config.useCases} />
      <ResearchSection data={config.research} />
      <ThreeStepImplementation steps={config.steps} />
      <ApiIntegration featureKey={config.path} endpoints={config.api.endpoints} sdk={config.api.sdk} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <Section title="FAQs" subtitle="Answers to common questions." />
        <dl className="grid gap-4 md:grid-cols-2">
          {config.faqs.map((f, i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 p-5 bg-white">
              <dt className="font-medium text-black">{f.q}</dt>
              <dd className="text-sm text-zinc-600 mt-2">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <CtaBand />
    </main>
  );
}