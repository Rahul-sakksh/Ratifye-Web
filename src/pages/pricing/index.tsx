import { useParams } from "react-router-dom";
import BarcodePricing from "../../components/pricingTier";
import { motion } from "framer-motion";



const pricing = () => {

      const { type } = useParams<{ type: string }>();

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

    const selectedItem = barcodeDetails.find(item => item.id === type);

     const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.5 },
};

    return(
       <motion.div  {...fadeInUp} className="container w-full mx-auto sm:px-4 py-6 md:px-10 lg:px-10 ">
         <BarcodePricing selectedType={selectedItem?.title} />
        </motion.div>
    )
}

export default pricing;