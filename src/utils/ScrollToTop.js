import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // This forces the window to the top
  }, [pathname]); // Runs every time the URL path changes

  return null;
};

export default ScrollToTop;