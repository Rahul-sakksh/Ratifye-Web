import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import MultiUrlBarcode from '../../components/MultiUrlBarcodeForm';
import { FileText, ScanLine, Wrench } from 'lucide-react';
import { useState } from 'react';

const MultiUrlBarcodePage = () => {

  const [activeTab, setActiveTab] = useState<"create" | "generated">("create");


  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.5 },
  };
  return (
    <motion.div {...fadeInUp} className="container mx-auto sm:px-4 py-8">
      <h1 className="text-3xl md:text-5xl font-semibold text-[#1F4B73] mb-4 text-center leading-snug">
        One QR. Infinite Possibilities.
      </h1>

      <p className="text-base md:text-lg text-slate-600 mb-8 text-center max-w-2xl mx-auto leading-relaxed">
        Route every scan dynamically — by user, device, location, time, or scan count — and make your QR smarter than ever.
      </p>

      <section className="mb-10 px-4 sm:px-0">

        {/* Buttons */}
        <div className="w-full flex justify-center mt-6 gap-4 flex-wrap">

          {/* Primary Button */}
          <button
            onClick={() => navigate("/requestForDemo")}
            className="px-6 py-3 md:w-44 rounded-2xl font-semibold text-white text-center 
      shadow-md transition-all duration-300 
      bg-[#1F4B73] hover:bg-[#183b5a]"
          >
            Request Demo
          </button>

          {/* Secondary Button */}
          <button
            onClick={() => navigate("/pricingByBcType/multiurl")}
            className="px-6 py-3 md:w-44 rounded-2xl font-semibold text-center 
      border border-[#0EA5A4] text-[#0EA5A4] 
      hover:bg-[#0EA5A4] hover:text-white 
      transition-all duration-300"
          >
            Get Pricing
          </button>

        </div>

      </section>

      <div className={`bg-white rounded-2xl shadow-lg mx-4 sm:mx-0 px-6 py-6 lg:py-2 items-start  grid grid-cols-1 md:grid-cols-${activeTab === 'create' ? "2" : "1"} gap-6   lg:px-18 lg:gap-10`} >



        <motion.div {...fadeInUp} className="lg:py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Multi Url</h2>
          <MultiUrlBarcode onGenerate={() => { }} title={false} activeTAB={(tab) => { setActiveTab(tab) }} />
        </motion.div>



        {activeTab === 'create' && <div className='lg:py-10 flex flex-col items-center  gap-10 h-full w-full'>
          <h2 className="text-2xl font-bold text-gray-800">Barcode Preview</h2>

          <motion.div {...fadeInUp}>
            <div className="flex flex-col items-center w-full space-y-8">
              {/* Preview */}
              <div className="w-full grid items-center justify-center">
                <div className="bg-gray-50 border-2 border-dashed rounded-2xl w-72 h-72 flex items-center justify-center shadow-md hover:shadow-lg transition">
                  <div className="text-gray-600 text-center px-3">
                    {/* <p className="font-bold text-lg mb-2">{getSelectedType()?.name || "Select a Type"}</p> */}
                    <p className="text-sm">Barcode Preview</p>
                  </div>
                </div>
              </div>

              {/* Use Cases */}
              <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                  <FileText className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-lg">CSV Export</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Export all your customized barcodes to CSV for bulk usage.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                  <Wrench className="w-10 h-10 text-green-600 mb-4" />
                  <h3 className="font-semibold text-lg">Customization</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Personalize colors, add text, and adjust layouts easily.
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition hover:-translate-y-1">
                  <ScanLine className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="font-semibold text-lg">Test Scanner</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Instantly test your barcode with our built-in scanner tool.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>




        </div>}

      </div>











    </motion.div>
  );
};

export default MultiUrlBarcodePage;
