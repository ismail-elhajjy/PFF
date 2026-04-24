import { useEffect } from "react";
import { useLocation } from "react-router-dom";


// hadi dartha bach user fach ybadl page ydakhloh fi lawl dyl page machi yb9a fi nafs scroll li kan fih

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);  

  return null;
};

export default ScrollToTop;
