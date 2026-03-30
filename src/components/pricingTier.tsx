import React, { useMemo, useState } from "react";

/**
 * SAKKSH — Barcode Pricing Component
 * - Bundle ON: hide normal tiers and show Bundle Builder with correct totals
 * - Bundle OFF: show selected product tiers only
 * - Growth tier marked Most Popular
 */

const CURRENCY = "₹";
const BUNDLE_DISCOUNT = 15;
const POPULAR_TIER = "growth";

const TIER_TEMPLATES = {
  starter: {
    id: "starter",
    name: "Starter",
    monthly: 199,
    annual: 159,
    generations: 1000,
    api: true,
    apiLimit: "500 calls/month",
    analytics: "Basic",
    features: ["Single workspace", "PNG/SVG exports", "Email support", "Basic scan counters"],
  },
  growth: {
    id: "growth",
    name: "Growth",
    monthly: 999,
    annual: 799,
    generations: 10000,
    api: true,
    apiLimit: "10,000 calls/month",
    analytics: "Advanced",
    features: ["Bulk generation", "CSV import/export", "Editable after print", "Webhooks & integrations"],
  },
  business: {
    id: "business",
    name: "Business",
    monthly: 2499,
    annual: 1999,
    generations: 50000,
    api: true,
    apiLimit: "100,000 calls/month",
    analytics: "Advanced",
    features: ["API rate boost", "SSO (SAML/OAuth)", "Role-based access (RBAC)", "Audit logs"],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthly: null,
    annual: null,
    generations: null,
    api: true,
    apiLimit: "Custom SLA",
    analytics: "Enterprise",
    features: ["Custom limits & SLA", "Dedicated VPC/region", "Custom SOW & onboarding", "Dedicated CSM"],
  },
};

const CATALOG = [
  { id: "gs1-digital-link", name: "GS1 Digital Link (QR)", popular: true },
  { id: "multi-url-qr", name: "Multi-URL QR" },
  { id: "qr-standard", name: "QR Code (Standard)" },
  { id: "ean-13", name: "EAN-13 (Retail GTIN-13)" },
  { id: "gs1-128", name: "GS1-128 / Code-128 (AIs)" },
  { id: "sscc", name: "SSCC (Logistics Units)" },
  { id: "gln", name: "GLN (Global Location Number)" },
];

function priceFor(t, billing) { return billing === "monthly" ? t.monthly : t.annual; }

function Money({ value }) {
  if (value === null) return <span className="text-2xl font-semibold text-gray-800">Custom</span>;
  return (
    <div className="flex items-end gap-1">
      <span className="text-3xl font-bold tracking-tight text-gray-900">{CURRENCY}{value}</span>
      <span className="mb-1 text-sm text-gray-500">/mo</span>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex justify-between text-sm border-b border-gray-100 py-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function TierCard({ tier, featured }) {
  return (
    <article className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      {featured && (
        <div className="absolute -right-2 -top-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          Most Popular
        </div>
      )}
      <h4 className="text-base font-semibold text-gray-900">{tier.name}</h4>
      <div className="mt-1"><Money value={tier._price} /></div>
      <div className="mt-4 space-y-2">
        <Metric label="Generations" value={tier.generations ? `${tier.generations.toLocaleString()}/mo` : 'Custom'} />
        <Metric label="Scanning" value="Unlimited" />
        <Metric label="API Limit" value={tier.apiLimit} />
        <Metric label="Analytics" value={tier.analytics} />
      </div>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-gray-700">
        {tier.features?.map((f) => (<li key={f}>{f}</li>))}
      </ul>
      <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
        {tier._price === null ? 'Contact Sales' : 'Choose Plan'}
      </button>
    </article>
  );
}

interface BarcodePricingProps {
   selectedType: string | undefined;
}

const BarcodePricingComponent:React.FC<BarcodePricingProps> = ({selectedType}) => {

  const [billing, setBilling] = useState("monthly");
  const [selectedProductId, setSelectedProductId] = useState(CATALOG[0].id);
  const [bundleEnabled, setBundleEnabled] = useState(false);

  // Bundle state
  const [primaryTierId, setPrimaryTierId] = useState("growth");
  const [addonProductId, setAddonProductId] = useState(CATALOG[1].id);
  const [addonTierId, setAddonTierId] = useState("starter");

  const selectedProduct = useMemo(() => CATALOG.find(p => p.id === selectedProductId), [selectedProductId]);
  const tiers = useMemo(() => Object.fromEntries(Object.entries(TIER_TEMPLATES).map(([k, v]) => [k, { ...v, _price: priceFor(v, billing) }])), [billing]);

  // Bundle calculations
  const primaryTier = tiers[primaryTierId];
  const addonTier = tiers[addonTierId];
  const p1 = primaryTier._price;
  const p2 = addonTier._price;
  const bothPriced = p1 !== null && p2 !== null;
  const cheaper = bothPriced ? Math.min(p1, p2) : null;
  const discount = bothPriced ? Math.round(cheaper * (BUNDLE_DISCOUNT / 100)) : null;
  const subtotal = bothPriced ? p1 + p2 : null;
  const total = bothPriced ? subtotal - discount : null;

  return (
    <section className="py-8 px-4 sm:px-0  sm:py-10 ">
      <div className="mx-auto max-w-full space-y-8">
        {/* Header */}
        <header className="items-center justify-items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left pb-6">
            <h1 className="text-3xl text-center font-extrabold text-gray-900">Pricing</h1>
            <p className=" text-md font-semibold text-gray-600 mt-4">Flexible, transparent plans for every scale — from startups to enterprise supply chains.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-700">Billing</label>
            <select 
              className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
              value={billing} 
              onChange={(e)=>setBilling(e.target.value)}
            >
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
            <label className="ml-4 flex items-center gap-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                checked={bundleEnabled} 
                onChange={()=>setBundleEnabled(!bundleEnabled)} 
              /> 
              Enable Bundle
            </label>
          </div>
        </header>

        {/* Product selector */}
        {/* <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Barcode</span>
          <select 
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
            value={selectedProductId} 
            onChange={(e)=>setSelectedProductId(e.target.value)}
          >
            {CATALOG.map((b)=>(<option key={b.id} value={b.id}>{b.name}</option>))}
          </select>
        </div> */}

        {/* View 1: Normal tiers (only when bundle is OFF) */}
        {!bundleEnabled && (
          <div className="rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900">{selectedType}</h2>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              <TierCard tier={tiers.starter} />
              <TierCard tier={{...tiers.growth}} featured={POPULAR_TIER === 'growth'} />
              <TierCard tier={tiers.business} />
              <TierCard tier={tiers.enterprise} />
            </div>
          </div>
        )}

        {/* View 2: Bundle builder (only when bundle is ON) */}
        {bundleEnabled && (
          <div className="rounded-3xl border border-gray-200 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bundle Builder</h3>
                <p className="text-sm text-gray-600">Pick tier + barcode for both lines. {BUNDLE_DISCOUNT}% off cheaper line.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Line A */}
              <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 p-4">
                <h4 className="mb-2 font-medium text-gray-900">Line A</h4>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
                    value={primaryTierId} 
                    onChange={(e)=>setPrimaryTierId(e.target.value)}
                  >
                    {Object.values(TIER_TEMPLATES).map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                  <select 
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
                    value={selectedProductId} 
                    onChange={(e)=>setSelectedProductId(e.target.value)}
                  >
                    {CATALOG.map(b=>(<option key={b.id} value={b.id}>{b.name}</option>))}
                  </select>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="text-gray-700 font-medium">Amount: {p1 === null ? 'Custom' : `${CURRENCY}${p1}/mo`}</div>
                  <div className="text-gray-500">Generations: {primaryTier.generations ? primaryTier.generations.toLocaleString() : 'Custom'} • API limit: {primaryTier.apiLimit} • Analytics: {primaryTier.analytics}</div>
                </div>
              </div>

              {/* Line B */}
              <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-4">
                <h4 className="mb-2 font-medium text-gray-900">Line B</h4>
                <div className="grid grid-cols-2 gap-3">
                  <select 
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
                    value={addonTierId} 
                    onChange={(e)=>setAddonTierId(e.target.value)}
                  >
                    {Object.values(TIER_TEMPLATES).map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
                  </select>
                  <select 
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200" 
                    value={addonProductId} 
                    onChange={(e)=>setAddonProductId(e.target.value)}
                  >
                    {CATALOG.filter(b=>b.id!==selectedProductId).map(b=>(<option key={b.id} value={b.id}>{b.name}</option>))}
                  </select>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="text-gray-700 font-medium">Amount: {p2 === null ? 'Custom' : `${CURRENCY}${p2}/mo`}</div>
                  <div className="text-gray-500">Generations: {addonTier.generations ? addonTier.generations.toLocaleString() : 'Custom'} • API limit: {addonTier.apiLimit} • Analytics: {addonTier.analytics}</div>
                </div>
              </div>
            </div>

            {/* Receipt */}
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-md">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <div className="flex items-center justify-between sm:col-span-1">
                  <span className="text-gray-600">Line A</span>
                  <span className="font-medium text-gray-900">{p1 === null ? 'Custom' : `${CURRENCY}${p1}`}</span>
                </div>
                <div className="flex items-center justify-between sm:col-span-1">
                  <span className="text-gray-600">Line B</span>
                  <span className="font-medium text-gray-900">{p2 === null ? 'Custom' : `${CURRENCY}${p2}`}</span>
                </div>
                <div className="flex items-center justify-between sm:col-span-1">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">{bothPriced ? `−${CURRENCY}${discount}` : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between sm:col-span-1">
                  <span className="text-gray-600">Total</span>
                  <span className="text-lg font-bold text-gray-900">{bothPriced ? `${CURRENCY}${total}/mo` : 'Custom'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="mx-auto max-w-3xl text-center text-xs text-gray-500">Scanning is unlimited across tiers. Generation & API limits are placeholders—configure final SAKKSH numbers before launch.</p>
      </div>
    </section>
  );
}

export default BarcodePricingComponent;