import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CONTACT_EMAIL = "sales@sakksh.ai";
const WHATSAPP_LINK = "https://wa.me/919876543210";
const INDUSTRIES = [
    "Pharma & Healthcare",
    "Retail & FMCG",
    "Electronics",
    "Cosmetics & Beauty",
    "Logistics & Warehousing",
    "Hospitality",
    "Other",
];
const USE_CASES = [
    "Dynamic / Multi-URL QR",
    "GS1 DataMatrix / Barcodes",
    "Asset Tracking",
    "Anti-counterfeit / Authentication",
    "Picking / Packing / Receiving",
    "Regulatory / Compliance",
    "Marketing & Loyalty",
];

function validateForm(form) {
    const e = {};
    if (!form.name?.trim()) e.name = "Please enter your full name";
    if (!/.+@.+\..+/.test(form.email || "")) e.email = "Enter a valid work email";
    if (!form.company?.trim()) e.company = "Please enter your company";
    if (!form.industry) e.industry = "Select an industry";
    if (!form.consent) e.consent = "Required to proceed";
    return e;
}

function canSubmitForm(f, submitting) {
    return (
        !!(
            f.name?.trim() &&
            /.+@.+\..+/.test(f.email || "") &&
            f.company?.trim() &&
            f.industry &&
            f.consent
        ) && !submitting
    );
}

export default function App() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        industry: "",
        useCases: [],
        volume: "",
        message: "",
        consent: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showUseCases, setShowUseCases] = useState(false);


    const [errors, setErrors] = useState({});
    const canSubmit = useMemo(
        () => canSubmitForm(form, submitting),
        [form, submitting]
    );

     const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUseCases(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowUseCases]);

    const fadeInUp = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration: 0.5 },
    };


  
    const change = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    async function onSubmit(e) {
        e.preventDefault();
        const err = validateForm(form);
        setErrors(err);
        if (Object.keys(err).length) return;
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 600));
        setSubmitting(false);
        setSuccess(true);
    }



    if (success) {
        return (
            <div className="min-h-screen w-full grid place-items-center px-4">
                <div className="bg-white border rounded-2xl shadow-sm max-w-lg w-full text-center">
                    <div className="px-5 pt-5">
                        <h3 className="text-lg font-semibold text-brand-navy">
                            Thanks! Your demo request is in.
                        </h3>
                    </div>
                    <div className="px-5 pb-5 space-y-4">
                        <p className="text-slate-600">
                            We sent a confirmation to{" "}
                            <span className="font-semibold">{form.email}</span>. You’ll hear
                            from us shortly with a calendar invite.
                        </p>
                        <div className="text-xs text-slate-500">
                            Need to talk sooner? Email{" "}
                            <a
                                className="underline text-brand-navy"
                                href={`mailto:${CONTACT_EMAIL}`}
                            >
                                {CONTACT_EMAIL}
                            </a>
                            .
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div {...fadeInUp} className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-5">
            {/* HEADER */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl mb-3 md:text-4xl font-semibold tracking-tight text-brand-navy">
                        Request a Demo
                    </h1>
                    <p className="text-base text-slate-600">
                        Tell us about your workflows; we’ll tailor a live walkthrough.
                    </p>
                </div>
                {/* <div className="flex items-center gap-2">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            title="Email"
            className="inline-flex items-center justify-center rounded-full p-2 border border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5"
            aria-label="Email"
          >
            ✉️
          </a>
          <a
            href={WHATSAPP_LINK}
            title="WhatsApp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full p-2 border border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5"
            aria-label="WhatsApp"
          >
            📞
          </a>
        </div> */}
            </header>

            {/* FORM */}
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:items-center">
                    <div className="space-y-3">
                        <div className="bg-white border rounded-2xl shadow-sm ring-0 ring-brand-navy/10">
                            <div className="px-5 pt-5">
                                <h3 className="text-2xl mb-4 font-bold  text-brand-navy">
                                    Tell us about your needs
                                </h3>
                            </div>
                            <div className="px-5 pb-5">
                                <form onSubmit={onSubmit} className="space-y-4">
                                    {/* NAME + EMAIL */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <LabeledInput
                                            id="name"
                                            label="Full name"
                                            value={form.name}
                                            onChange={(v) => change("name", v)}
                                            // placeholder="Priyanka Marwah"
                                        />
                                        <LabeledInput
                                            id="email"
                                            type="email"
                                            label="Work email"
                                            value={form.email}
                                            onChange={(v) => change("email", v)}
                                            // placeholder="you@company.com"
                                        />
                                    </div>
                                    {errors.name && <ErrorText>{errors.name}</ErrorText>}
                                    {errors.email && <ErrorText>{errors.email}</ErrorText>}

                                    {/* COMPANY + PHONE */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <LabeledInput
                                            id="company"
                                            label="Company"
                                            value={form.company}
                                            onChange={(v) => change("company", v)}
                                            // placeholder="Acme Corp"
                                        />
                                        <LabeledInput
                                            id="phone"
                                            label="Phone (optional)"
                                            value={form.phone}
                                            onChange={(v) => change("phone", v)}
                                            // placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    {errors.company && <ErrorText>{errors.company}</ErrorText>}

                                    {/* INDUSTRY + VOLUME */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label
                                                className="text-sm font-medium text-brand-navy"
                                                htmlFor="industry"
                                            >
                                                Industry
                                            </label>
                                            <select
                                                id="industry"
                                                className="w-full rounded-md border border-slate-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy px-3 py-2"
                                                value={form.industry}
                                                onChange={(e) => change("industry", e.target.value)}
                                            >
                                                <option value="" disabled>
                                                    Select industry
                                                </option>
                                                {INDUSTRIES.map((i) => (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <LabeledInput
                                            id="volume"
                                            label="Expected monthly scans / items"
                                            value={form.volume}
                                            onChange={(v) => change("volume", v)}
                                            // placeholder="e.g., 50k – 250k"
                                        />
                                    </div>
                                    {errors.industry && <ErrorText>{errors.industry}</ErrorText>}

                                    {/* USE CASES */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-brand-navy">
                                            Primary use cases
                                        </label>
                                        <div className="w-full">
                                        
                                            <div className="relative w-full" ref={dropdownRef}>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowUseCases(!showUseCases)}
                                                    className="w-full flex justify-between items-center border border-slate-300 rounded-md px-3 py-2 bg-white"
                                                >
                                                    <span className="truncate">
                                                        {form.useCases.length > 0
                                                            ? form.useCases.join(", ")
                                                            : "Select use cases"}
                                                    </span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className={`w-4 h-4 transform transition-transform  ${showUseCases ? "rotate-180" : ""
                                                            }`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M19 9l-7 7-7-7"
                                                        />
                                                    </svg>
                                                </button>

                                                {showUseCases && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md max-h-48 overflow-y-auto">
                                                        {USE_CASES.map((u) => {
                                                            const selected = form.useCases.includes(u);
                                                            return (
                                                                <div
                                                                    key={u}
                                                                    onClick={() => {
                                                                        const on = form.useCases.includes(u);
                                                                        change(
                                                                            "useCases",
                                                                            on
                                                                                ? form.useCases.filter((x) => x !== u)
                                                                                : [...form.useCases, u]
                                                                        );
                                                                    }}
                                                                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-slate-100 ${selected ? "bg-slate-50 font-semibold text-brand-navy" : ""
                                                                        }`}
                                                                >
                                                                    <div
                                                                        className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-all duration-200 ${selected
                                                                                ? "bg-[#1976D2] border-[#1976D2] text-white"
                                                                                : "bg-white border-slate-400"
                                                                            }`}
                                                                    >
                                                                        {selected && (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="w-3 h-3"
                                                                                viewBox="0 0 20 20"
                                                                                fill="white"
                                                                            >
                                                                                <path
                                                                                    fillRule="evenodd"
                                                                                    d="M16.707 5.293a1 1 0 010 1.414l-8.364 8.364a1 1 0 01-1.414 0L3.293 11.05a1 1 0 011.414-1.414l3.222 3.222 7.657-7.657a1 1 0 011.414 0z"
                                                                                    clipRule="evenodd"
                                                                                />
                                                                            </svg>
                                                                        )}
                                                                    </div>

                                                                    <span>{u}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>

                                    {/* MESSAGE */}
                                    <div className="space-y-1.5">
                                        <label
                                            className="text-sm font-medium text-brand-navy flex items-center gap-2"
                                            htmlFor="message"
                                        >
                                            What would you like to see in the demo?{" "}
                                            <span className="text-slate-400">ℹ️</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={3}
                                            className="w-full rounded-md border border-slate-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy px-3 py-2"
                                            placeholder="Tell us about your goals, current tools, and success criteria"
                                            value={form.message}
                                            onChange={(e) => change("message", e.target.value)}
                                        />
                                    </div>

                                    {/* CONSENT */}
                                    <div className="flex items-start gap-2">
                                        <input
                                            id="consent"
                                            type="checkbox"
                                            checked={form.consent}
                                            onChange={(e) => change("consent", e.target.checked)}
                                            className="cursor-pointer mt-[2px]"
                                        />
                                        <label htmlFor={"consent"} className="text-sm text-slate-600 cursor-pointer">
                                            I agree to be contacted about this request and accept the{" "}
                                            <a
                                                className="underline text-brand-navy"
                                                href="#"
                                            >
                                                Privacy Policy
                                            </a>
                                            .
                                            {errors.consent && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    {errors.consent}
                                                </p>
                                            )}
                                        </label>
                                    </div>

                                    {/* BUTTONS */}
                                    <div className="mt-4 flex items-center gap-2 flex-wrap md:flex-nowrap">
                                        <button
                                            type="submit"
                                            disabled={!canSubmit || submitting}
                                            className={`inline-flex items-center gap-2 rounded-md px-6 py-2 font-semibold text-white ${submitting
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-brand-orange bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                                }`}
                                        >
                                            {submitting ? "Submitting…" : "Submit"}
                                        </button>

                                        {/* <a
                                            href="#"
                                            className="inline-flex items-center gap-2 rounded-md px-4 py-2  bg-brand-navy font-semibold border  border-neutral-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
                                        >
                                            Book on Calendly
                                        </a> */}

                                        {/* <a
                                            href={`mailto:${CONTACT_EMAIL}`}
                                            title="Email"
                                            className="rounded-full p-2 text-white bg-brand-navy hover:bg-[#0a234d]"
                                            aria-label="Email"
                                        >
                                            ✉️
                                        </a>
                                        <a
                                            href={WHATSAPP_LINK}
                                            title="WhatsApp"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-full p-2 text-white bg-brand-green hover:brightness-95"
                                            aria-label="WhatsApp"
                                        >
                                            🟢
                                        </a> */}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE CARDS */}
                    <div className="space-y-5">
                        <div className="bg-white border rounded-2xl shadow-sm ring-0 ring-brand-navy/10">
                            <div className="px-5 pt-5">
                                <h3 className="text-2xl mb-4 font-bold text-brand-navy">
                                    What you’ll get
                                </h3>
                            </div>
                            <div className="px-5 pb-5 space-y-3">
                                <Feature
                                    title="Tailored walkthrough"
                                    desc="Configured around dynamic QR, GS1, asset tracking, or anti-counterfeit."
                                />
                                <Feature
                                    title="POV in days"
                                    desc="A proof of value using a slice of your real data and barcodes."
                                />
                                <Feature
                                    title="Next-step plan"
                                    desc="Clear milestones, owners, and timelines for rollout."
                                />
                                <Feature
                                    title="Security & compliance"
                                    desc="SSO, RBAC, audit trails; GS1-ready artifacts."
                                />
                            </div>
                        </div>

                        <div className="bg-white border rounded-2xl shadow-sm ring-0 ring-brand-navy/10">
                            <div className="px-5 pt-5">
                                <h3 className="text-2xl mb-4 font-bold text-brand-navy">
                                    Why this demo?
                                </h3>
                            </div>
                            <div className="px-5 pb-5 space-y-3">
                                <Feature
                                    title="Tailored to your workflows"
                                    desc="We configure dynamic routing, roles, and analytics for your real use cases."
                                />
                                <Feature
                                    title="GS1-ready & enterprise secure"
                                    desc="Compliant barcodes with SSO, RBAC, and audit trails."
                                />
                                <Feature
                                    title="Launch fast"
                                    desc="From pilot to production in weeks, not months."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className=" mx-auto my-10 ">
                <div className="bg-white border rounded-2xl  ring-0 ring-brand-navy/10 shadow-sm p-4 md:p-6">
                    <h2 className="text-2xl font-bold text-brand-navy mb-1 md:mb-2 text-left">FAQ</h2>

                    <div className="space-y-3">
                        {/* FAQ 1 */}
                        <div>
                            <h3 className="text-md sm:text-lg font-bold text-brand-navy">
                                How long is the demo?
                            </h3>
                            <p className="text-slate-500 text-sm sm:text-md ">
                                Typically 30–45 minutes, with time for Q&amp;A and next steps.
                            </p>
                        </div>

                        <hr className="border-slate-200" />

                        {/* FAQ 2 */}
                        <div>
                            <h3 className="text-md sm:text-lg font-bold text-brand-navy">
                                Do you provide a POC?
                            </h3>
                            <p className="text-slate-500 text-sm sm:text-md ">
                                Yes. After the demo, we can set up a limited POC using your real data and barcodes.
                            </p>
                        </div>

                        <hr className="border-slate-200" />

                        {/* FAQ 3 */}
                        <div>
                            <h3 className="text-md sm:text-lg font-bold text-brand-navy">
                                What integrations are supported?
                            </h3>
                            <p className="text-slate-500 text-sm sm:text-md ">
                                We can connect with common ERPs/WMS (SAP, Oracle, Zoho, custom APIs).
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            <footer className="text-xs text-slate-500 text-center mt-6">
                © {new Date().getFullYear()} SAKKSH — Smart Barcodes, Real Results.
            </footer>
        </motion.div>
    );
}

function LabeledInput({ id, label, value, onChange, type = "text", placeholder = "" }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-brand-navy" htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-slate-300 focus:border-brand-navy focus:ring-1 focus:ring-brand-navy px-3 py-2"
            />
        </div>
    );
}

function ErrorText({ children }) {
    return <p className="text-xs text-red-600">{children}</p>;
}

function Feature({ title, desc }) {
    return (
        <div className="flex gap-3">
            <span className="mt-0.5"><CircleCheckBig width={18} height={18}  color="oklch(62.7% 0.194 149.214)" strokeWidth={2.2}   /></span>
            <div>
                <div className="font-medium text-brand-navy">{title}</div>
                <p className="text-sm text-slate-600">{desc}</p>
            </div>
        </div>
    );
}
