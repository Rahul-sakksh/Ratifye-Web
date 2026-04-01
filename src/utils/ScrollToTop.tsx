import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const previousPath = useRef<string>("");

  useEffect(() => {
  const container = document.getElementById("main-container");

  if (container) {
    container.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  previousPath.current = pathname;
}, [pathname]);

  return null;
};

export default ScrollToTop;
