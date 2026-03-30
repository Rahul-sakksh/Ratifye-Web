import React from 'react';
import { AlertCircle, Info, Lock, LogOut } from 'lucide-react';
import barcodeLimit from '../utils/barcodeLimit';
import { useNavigate } from 'react-router-dom';
import AuthPopup from './authPopup';

interface BarcodeLimitIndicatorProps {
  className?: string;
  onLogout?: () => void;
  type: string | undefined;
}

const BarcodeLimitIndicator: React.FC<BarcodeLimitIndicatorProps> = ({ className = '', onLogout, type }) => {
  const [showAuthRegistPopup, setShowAuthRegistPopup] = React.useState(false);
  const { message, remainingCount } = barcodeLimit.getLimitStatus(type);
  const isLoggedIn = barcodeLimit.isUserLoggedIn();
  const userInfo = barcodeLimit.getUserInfo();

  const navigate = useNavigate();

  const scrollToSection = (id:any) => {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

  console.log('BarcodeLimitIndicator render:', { isLoggedIn, userInfo, remainingCount });


  if (isLoggedIn && userInfo) {
    // Show logged-in user info
    return (
      <div className={`flex items-center gap-2 p-3 border rounded-lg bg-green-50 border-green-200 text-green-700 ${className}`}>
        <Info className="w-4 h-4 text-green-500" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            Welcome, {userInfo.companyName}!
          </p>
          <p className="text-xs opacity-80 mt-1">
            Unlimited generation available
          </p>
        </div>
        <button
          onClick={() => {
            barcodeLimit.logout();
            window.location.reload();
            if (onLogout) {
              onLogout(); // Call parent callback if provided
            } else {
              window.location.reload(); // Fallback to page refresh
            }
          }}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
          title="Logout"
        >
          <LogOut className="w-3 h-3" />
          Logout
        </button>
      </div>
    );
  }

  if (isLoggedIn) {
    return null; // Don't show indicator for logged-in users without user info
  }

  const getIcon = () => {
    if (remainingCount === 0) {
      return <Lock className="w-4 h-4 text-red-500" />;
    }
    if (remainingCount <= 1) {
      return <AlertCircle className="w-4 h-4 text-amber-500" />;
    }
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const getBackgroundColor = () => {
    if (remainingCount === 0) {
      return 'bg-red-50 border-red-200 text-red-700';
    }
    if (remainingCount <= 1) {
      return 'bg-amber-50 border-amber-200 text-amber-700';
    }
    return 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <>
      <div className={`flex items-center gap-2 p-3 border rounded-lg ${getBackgroundColor()} ${className}`}>
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm font-medium">
            {remainingCount > 0 ? `${remainingCount} free generations remaining` : 'Generation limit reached'}
          </p>
          <p className="text-xs opacity-80 mt-1">
            {message}
          </p>
        </div>
      </div>

      {!(remainingCount > 0) &&
        <div className="flex flex-wrap gap-2 mt-2 mb-4">
          <button onClick={()=>setShowAuthRegistPopup(true)} className="px-3 py-1.5 text-xs font-medium bg-blue-500 text-white rounded-md hover:bg-blue-400 transition cursor-pointer">
            Extend Free Trial
          </button>
          <button  onClick={()=>setShowAuthRegistPopup(true)} className="px-3 py-1.5 text-xs font-medium bg-indigo-500 text-white rounded-md hover:bg-indigo-400 transition cursor-pointer">
            View Analytics
          </button>
          <button
           onClick={() => {navigate("/requestForDemo")}}
            className="px-3 py-1.5 text-xs font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-400 transition cursor-pointer"
          >
            Request for Demo
          </button>

          <button onClick={() => scrollToSection("pricing")} className="px-3 py-1.5 text-xs font-medium bg-sky-500 text-white rounded-md hover:bg-sky-400 transition cursor-pointer">
            View Pricing
          </button>

        </div>
      }

      <AuthPopup
        show={showAuthRegistPopup}
        onClose={() => setShowAuthRegistPopup(false)}
        

      />
    </>
  );
};

export default BarcodeLimitIndicator;
