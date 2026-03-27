import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export function MarketingLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.hash]);

  return <Outlet />;
}

