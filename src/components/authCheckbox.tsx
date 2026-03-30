import { Info } from "lucide-react";
import { useState, useEffect } from "react";

interface AuthCheckboxProps {
  authenticationType?: string;
  setAuthenticationType?: (type: string) => void;
}

const AuthCheckbox: React.FC<AuthCheckboxProps> = ({ authenticationType, setAuthenticationType }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);

  // Update width on window resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = width < 400;

  return (
    <div className="flex flex-col gap-3 w-full mb-6 relative">
      {/* Label and tooltip */}
      <div className="text-sm text-left font-medium text-gray-700 flex items-center gap-1 relative">
        <span>Authentication Type</span>
        <span
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info height={16} width={16} color="gray" className="cursor-pointer" />

          {showTooltip && (
            <div className="absolute top-6 left-0 w-64 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
              <p>
                <strong>Secured:</strong> Requires authentication for access.<br />
                <strong>Non Secured:</strong> No authentication required.
              </p>
            </div>
          )}
        </span>
      </div>

      {/* Options */}
      <div className={`${isMobile ? "flex flex-col gap-2" : "flex gap-8"}`}>
        {/* Secured */}
        <div
          className={`flex items-center cursor-pointer px-3 py-2 rounded-xl border transition 
            ${authenticationType === "withAuth"
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          onClick={() => setAuthenticationType?.("withAuth")}
        >
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border 
              ${authenticationType === "withAuth"
                ? "border-green-500 bg-green-500"
                : "border-gray-400"
              }`}
          >
            {authenticationType === "withAuth" && (
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            )}
          </span>
          <span
            className={`ml-3 text-sm font-medium ${
              authenticationType === "withAuth"
                ? "text-green-600 font-semibold"
                : "text-gray-700"
            }`}
          >
            Secured
          </span>
        </div>

        {/* Non Secured */}
        <div
          className={`flex items-center cursor-pointer px-3 py-2 rounded-xl border transition 
            ${authenticationType === "withoutAuth"
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-white hover:bg-gray-50"
            }`}
          onClick={() => setAuthenticationType?.("withoutAuth")}
        >
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full border 
              ${authenticationType === "withoutAuth"
                ? "border-red-500 bg-red-500"
                : "border-gray-400"
              }`}
          >
            {authenticationType === "withoutAuth" && (
              <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
            )}
          </span>
          <span
            className={`ml-3 text-sm font-medium ${
              authenticationType === "withoutAuth"
                ? "text-red-500 font-semibold"
                : "text-gray-700"
            }`}
          >
            Non Secured
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthCheckbox;
