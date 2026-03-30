import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Crown, LayoutDashboard, PlusCircle, ScanLine, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import barcodeLimit from "../utils/barcodeLimit";

export type Tab = "dashboard" | "generate" | "testScanner" | "priceTier";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check login status on component mount and location changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = barcodeLimit.isUserLoggedIn();
      const userData = barcodeLimit.getUserInfo();
      setIsLoggedIn(loggedIn);
      setUserInfo(userData);
    };

    checkLoginStatus();
    
    // Check again when location changes (in case user logs in/out)
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [location]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showProfileMenu && !(event.target as Element).closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  // Map tab to route
  const tabToRoute: Record<Tab, string> = {
    dashboard: "/dashboard",
    generate: "/generate",
    testScanner: "/testscan",
    priceTier: "/pricingtire",
  };

  // Derive current tab from pathname (support prefix match for /generate/*)
  let selectedTab: Tab | undefined;
  if (location.pathname.startsWith("/generate")) {
    selectedTab = "generate";
  } else if (location.pathname.startsWith("/dashboard")) {
    selectedTab = "dashboard";
  } else if (location.pathname.startsWith("/testscan")) {
    selectedTab = "testScanner";
  } else if (location.pathname.startsWith("/pricingtire")) {
    selectedTab = "priceTier";
  }

  const handleTabClick = (tab: Tab) => {
    navigate(tabToRoute[tab]);
    setMobileMenuOpen(false);
  };

  const handleNav = () => {
    setMobileMenuOpen(false);
    const stored = localStorage.getItem("selectedIndustry");

    if (stored) {
      navigate(`/generate/${stored}`);
    } else {
      navigate("/landing");
    }
  };

  const handleLogout = () => {
    barcodeLimit.logout();
    window.location.reload();
    setIsLoggedIn(false);
    setUserInfo(null);
    setShowProfileMenu(false);
    // Optionally redirect to home or reload the page
    window.location.reload();
  };

  // Get company first letter for profile display
  const getCompanyInitial = () => {
    if (userInfo?.companyName) {
      return userInfo.companyName.charAt(0).toUpperCase();
    }
    return 'U'; // Default fallback
  };

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold text-gray-900">
            <div  onClick={()=> navigate("/")} className="flex items-center gap-2 font-extrabold tracking-tight">
              <span> Track & Trace</span>
            </div>
          </div>

         

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm text-gray-600">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`flex items-center gap-1 hover:text-gray-900 ${
              selectedTab === "dashboard" ? "text-gray-900 font-semibold" : ""
            }`}
          >
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button
            onClick={handleNav}
            className={`flex items-center gap-1 hover:text-gray-900 ${
              selectedTab === "generate" ? "text-gray-950 font-semibold" : ""
            }`}
          >
            <PlusCircle size={16} /> Generate
          </button>
          <button
            onClick={() => handleTabClick("testScanner")}
            className={`flex items-center gap-1 hover:text-gray-900 ${
              selectedTab === "testScanner" ? "text-gray-950 font-semibold" : ""
            }`}
          >
            <ScanLine size={16} /> Test Scanner
          </button>
        </nav>

        {/* Upgrade Button */}
        <div
          onClick={() => handleTabClick("priceTier")}
          className="hidden md:flex items-center gap-2 cursor-pointer"
        >
          <Crown className="text-yellow-500" size={18} />
          <button className="px-3 py-1 rounded bg-gray-900 text-white text-sm hover:bg-gray-950 transition">
            Upgrade Plan
          </button>
        </div>

        {/* User Profile (when logged in) */}
        {isLoggedIn && userInfo && (
          <div className="relative hidden md:block profile-menu">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              {getCompanyInitial()}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 min-w-48 max-w-64 w-max bg-white rounded-lg shadow-lg py-2 z-50">
                <div className="px-4 py-2">
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">{userInfo.companyName}</p>
                  <p className="text-xs text-gray-500 whitespace-nowrap">{userInfo.companyEmail}</p>
                </div>
                <div className="px-2 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-bold text-gray-950">Menu</span>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-4 text-gray-600">
          <button
            onClick={() => handleTabClick("dashboard")}
            className={`flex items-center gap-2 hover:text-gray-950 ${
              selectedTab === "dashboard" ? "text-gray-900 font-semibold" : ""
            }`}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={handleNav}
            className={`flex items-center gap-2 hover:text-gray-950 ${
              selectedTab === "generate" ? "text-gray-900 font-semibold" : ""
            }`}
          >
            <PlusCircle size={18} /> Generate
          </button>
          <button
            onClick={() => handleTabClick("testScanner")}
            className={`flex items-center gap-1 hover:text-gray-950 ${
              selectedTab === "testScanner" ? "text-gray-900 font-semibold" : ""
            }`}
          >
            <ScanLine size={16} /> Test Scanner
          </button>

          <button
            onClick={() => handleTabClick("priceTier")}
            className="flex items-center gap-2 text-gray-900  font-semibold mt-4"
          >
            <Crown className="text-yellow-500" size={18} /> Upgrade Plan
          </button>

          {/* Mobile Profile Section */}
          {isLoggedIn && userInfo && (
            <div className="border-t mt-4 pt-4">
              <div className="flex items-center gap-3 mb-3 px-2">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getCompanyInitial()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{userInfo.companyName}</p>
                  <p className="text-xs text-gray-500">{userInfo.companyEmail}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-2 py-2 rounded w-full"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
