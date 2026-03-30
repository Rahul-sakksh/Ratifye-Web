import { QrCode, ScanLine, ShieldCheck } from "lucide-react";

export const pages = {
  generation: {
    path: "/features/barcode-generation",
    title: "Barcode Generation | SAKKSH",
    description: "Generate GS1-compliant barcodes with SAKKSH. Customize formats, batch-create, and export in multiple formats.",
    keywords: "barcode generation, GS1, QR code, batch barcodes",
    icon: QrCode,
    hero: {
      title: "Enterprise-grade Barcode Generation",
      subtitle: "Generate GS1-compliant barcodes (EAN, UPC, QR) with advanced customization, batch processing, and export options.",
      media: "https://via.placeholder.com/800x400?text=Barcode+Generation",
    },
    useCases: [
      "Batch generate 10,000+ barcodes for retail packaging",
      "Embed GS1 Application Identifiers in QR codes",
      "Export in SVG/PNG with branding customization",
    ],
    steps: [
      { title: "Select Barcode Type", desc: "Choose GS1 DataMatrix, QR, UPC, or EAN" },
      { title: "Input Data", desc: "Enter GTINs, batch numbers, or custom payloads" },
      { title: "Export & Integrate", desc: "Download or integrate via API" },
    ],
    api: {
      endpoints: [
        { method: "POST", path: "/api/barcodes/generate", desc: "Generate barcodes" },
        { method: "GET", path: "/api/barcodes/{id}", desc: "Retrieve generated barcode" },
      ],
      sdk: `import { generateBarcode } from "@sakksh/sdk";

const barcode = await generateBarcode({
  type: "GS1QR",
  data: { gtin: "09506000134352", batch: "ABC123" },
});`,
    },
    faqs: [
      { q: "Which barcode formats are supported?", a: "GS1 QR, DataMatrix, UPC, EAN, Code128, and more." },
      { q: "Can I batch generate barcodes?", a: "Yes, up to 100k per batch via API." },
    ],
  },

  scanning: {
    path: "/features/barcode-scanning",
    title: "Barcode Scanning SDK | SAKKSH",
    description: "Scan barcodes using web & mobile SDKs with GS1 compliance, offline support, and camera integration.",
    keywords: "barcode scanning, SDK, GS1 compliance, react-native vision camera",
    icon: ScanLine,
    hero: {
      title: "Advanced Barcode Scanning",
      subtitle: "Scan GS1 barcodes in web or mobile apps. High accuracy, offline fallback, and integration with React Native Vision Camera.",
      media: "https://via.placeholder.com/800x400?text=Barcode+Scanning",
    },
    useCases: [
      "Retail checkout scanning",
      "Warehouse inventory updates",
      "Healthcare drug authentication",
    ],
    steps: [
      { title: "Integrate SDK", desc: "Install via npm/yarn" },
      { title: "Configure Camera", desc: "Enable VisionCamera / web camera" },
      { title: "Process Results", desc: "Get structured GS1 data instantly" },
    ],
    api: {
      endpoints: [
        { method: "POST", path: "/api/scanner/init", desc: "Initialize scanning session" },
        { method: "POST", path: "/api/scanner/process", desc: "Process scanned data" },
      ],
      sdk: `import { useBarcodeScanner } from "@sakksh/sdk";

const { startScanner } = useBarcodeScanner();
await startScanner({
  containerId: "scanner",
  onResult: (data) => console.log(data),
});`,
    },
    faqs: [
      { q: "Does it work offline?", a: "Yes, SDK supports offline scanning." },
      { q: "Which platforms are supported?", a: "Web, iOS, Android (React Native)." },
    ],
  },

  auth: {
    path: "/features/authentication",
    title: "Product Authentication | SAKKSH",
    description: "Enable GS1-compliant product authentication using unique identifiers in barcodes.",
    keywords: "barcode authentication, product verification, GS1",
    icon: ShieldCheck,
    hero: {
      title: "Product Authentication",
      subtitle: "Authenticate products via GS1 barcodes. Protect brands, fight counterfeits, and ensure trust.",
      media: "https://via.placeholder.com/800x400?text=Authentication",
    },
    useCases: [
      "Pharma drug authentication",
      "Cosmetics anti-counterfeit protection",
      "Electronics warranty validation",
    ],
    steps: [
      { title: "Assign GTIN", desc: "Each product gets a unique identifier" },
      { title: "Generate Secure Barcode", desc: "Embed authentication data" },
      { title: "Verify in Field", desc: "Scan and verify authenticity" },
    ],
    api: {
      endpoints: [
        { method: "POST", path: "/api/auth/verify", desc: "Verify barcode authenticity" },
      ],
      sdk: `import { verifyBarcode } from "@sakksh/sdk";

const result = await verifyBarcode("09506000134352");
console.log(result.valid);`,
    },
    faqs: [
      { q: "Can customers verify authenticity?", a: "Yes, via our mobile/web apps." },
      { q: "Which industries benefit?", a: "Pharma, cosmetics, electronics, luxury goods." },
    ],
  },
};
