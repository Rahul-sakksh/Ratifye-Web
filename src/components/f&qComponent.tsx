

import React from "react";
import {
    Globe2,
    ChevronDown
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";


interface FAQItem {
    q: string;
    a: string;
    keywords?: string[];
}

interface FAQProps {
    expandedFaq: number | null;
    setExpandedFaq: (idx: number | null) => void;
    faqs?: FAQItem[];
}

const FAQ:React.FC<FAQProps> = ({ expandedFaq, setExpandedFaq ,faqs=[]}) => {
  
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((f, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                    <div
                        key={idx}
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className={`bg-white border  ${!isOpen && expandedFaq !== null && 'h-fit'} border-gray-200 rounded-xl p-4 sm:p-6 text-left cursor-pointer transition-shadow duration-300 ${isOpen ? "shadow-lg border-indigo-200" : "hover:shadow-md"
                            }`}
                    >
                        {/* Question Row */}
                        <div className="flex justify-between items-start gap-2 sm:gap-3">
                            <div className="flex items-start gap-2">
                                <Globe2 className="w-5 h-5 text-indigo-600 flex-shrink-0 sm:mt-[1.5px]" />
                                <span className="text-gray-900 font-semibold text-sm sm:text-base ">{f.q}</span>
                            </div>
                            <motion.div
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            </motion.div>
                        </div>

                        {/* Animated Answer */}
                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    key="content"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="text-gray-600 text-sm leading-relaxed mt-3 pt-3 border-t border-gray-200">
                                        {f.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

export default FAQ;