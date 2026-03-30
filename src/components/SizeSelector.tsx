import React from "react";
import { ArrowDownRight, ArrowUpLeft } from "lucide-react";

type Size = { w: number; h: number };

interface SizeSelectorProps {
  form: { width: string; height: string };
  handleChange: (field: "width" | "height", value: string) => void;
  sizes?: Size[];
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  form,
  handleChange,
  sizes = [
    { w: 100, h: 100 },
    { w: 400, h: 400 },
    { w: 800, h: 800 },
    { w: 1000, h: 1000 },
  ],
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-[#1F4B73] mb-3">
        Select Size
      </label>

      <div className="flex flex-wrap gap-4">
        {sizes.map((size) => {
          const value = `${size.w}x${size.h}`;
          const isChecked =
            form.width === size.w.toString() &&
            form.height === size.h.toString();

          return (
            <label
              key={value}
              className={`relative cursor-pointer rounded-xl border transition-all duration-200 
              flex items-center justify-center
              h-20 w-20 text-sm font-medium
              ${
                isChecked
                  ? "border-[#1F4B73] bg-[#f0f7fb] text-[#1F4B73] shadow-md scale-105"
                  : "border-[#d9e7f1] bg-white text-slate-600 hover:border-[#0EA5A4] hover:text-[#0EA5A4]"
              }`}
            >
              {/* Hidden radio */}
              <input
                type="radio"
                name="size"
                value={value}
                checked={isChecked}
                onChange={() => {
                  handleChange("width", size.w.toString());
                  handleChange("height", size.h.toString());
                }}
                className="hidden"
              />

              {/* Top Left Icon */}
              <div className="absolute top-1 left-1 opacity-60">
                <ArrowUpLeft size={14} />
              </div>

              {/* Bottom Right Icon */}
              <div className="absolute bottom-1 right-1 opacity-60">
                <ArrowDownRight size={14} />
              </div>

              {/* Text */}
              <span className="z-10">{value}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;