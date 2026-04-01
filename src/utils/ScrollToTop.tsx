import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const previousPath = useRef<string>("");

  useEffect(() => {

    const isBarcodeRoute = pathname.startsWith("/barcodeGen");
    const wasBarcodeRoute = previousPath.current.startsWith("/barcodeGen");

    if (!wasBarcodeRoute || isBarcodeRoute !== wasBarcodeRoute) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }

    previousPath.current = pathname;
  }, [pathname]);

  return null;
};

export default ScrollToTop;
