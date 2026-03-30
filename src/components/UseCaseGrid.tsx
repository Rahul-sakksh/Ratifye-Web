import { Barcode, QrCode, FileText, ShieldCheck, Package } from "lucide-react";

const industryUseCases: Record<string, { title: string; description: string }[]> = {
  "Pharma & Healthcare": [
    {
      title: "Drug Authentication",
      description:
        "Verify medicine authenticity, eliminate counterfeit drugs, and protect patient safety with secure solutions.",
    },
    {
      title: "Supply Chain Traceability",
      description:
        "Track medicines from manufacturer to consumer for compliance, visibility, and end-to-end transparency.",
    },
    {
      title: "Medical Equipment Tracking",
      description:
        "Monitor usage, maintenance, and lifecycle of critical equipment for efficiency and safety.",
    },
  ],
  "Retail & FMCG": [
    {
      title: "Real-time Inventory Management",
      description:
        "Improve stock accuracy, reduce wastage, and boost efficiency with real-time inventory tracking.",
    },
    {
      title: "Product Authenticity",
      description:
        "Guarantee genuine products, protect your brand, and build customer trust with secure verification.",
    },
    {
      title: "Consumer Engagement",
      description:
        "Drive customer loyalty with scan-based offers, promotions, and instant product information.",
    },
  ],
  Electronics: [
    {
      title: "Warranty Management",
      description:
        "Automate warranty validation, simplify customer claims, and reduce fraud with digital solutions.",
    },
    {
      title: "Product Lifecycle Monitoring",
      description:
        "Track devices from manufacturing to resale, repair, and recycling for full lifecycle visibility.",
    },
    {
      title: "Anti-Counterfeiting",
      description:
        "Protect high-value electronics from counterfeit risks with secure identifiers and verification.",
    },
  ],
  Cosmetics: [
    {
      title: "Counterfeit Prevention",
      description:
        "Ensure product originality, safeguard beauty brands, and protect customers from fake goods.",
    },
    {
      title: "Consumer Trust & Transparency",
      description:
        "Enable ingredient checks, expiry validation, and sourcing transparency with a simple scan.",
    },
    {
      title: "Smart Marketing & Loyalty",
      description:
        "Increase engagement through scan-based rewards, authenticity checks, and personalized offers.",
    },
  ],
};

// 🔹 Component to render industry-specific use cases
const UseCaseGrid = ({ selectedIndustry }: { selectedIndustry: string }) => {
    
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Key Use Cases for {selectedIndustry}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(industryUseCases[selectedIndustry] || []).map((useCase, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2"
          >
            {/* Icon placeholder — choose dynamically if you want */}
            <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              {useCase.title.toLowerCase().includes("authentic") ? (
                <ShieldCheck className="text-indigo-600" size={24} />
              ) : useCase.title.toLowerCase().includes("inventory") ? (
                <Package className="text-indigo-600" size={24} />
              ) : useCase.title.toLowerCase().includes("trace") ? (
                <QrCode className="text-indigo-600" size={24} />
              ) : useCase.title.toLowerCase().includes("warranty") ? (
                <FileText className="text-indigo-600" size={24} />
              ) : (
                <Barcode className="text-indigo-600" size={24} />
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {useCase.title}
            </h3>
            <p className="text-gray-600">{useCase.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseCaseGrid;
