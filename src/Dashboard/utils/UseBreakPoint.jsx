import React, { useEffect, useState } from "react";

export const useTablet = () => {
  const [isTablet, setIsTablet] = useState(
    window !== undefined ? window.innerWidth <= 1200 : false,
  );

  useEffect(() => {
    const handleDashboardTablet = () => {
      setIsTablet(window.innerWidth <= 1200);
    };

    window.addEventListener("resize", handleDashboardTablet);

    return () => window.removeEventListener("resize", handleDashboardTablet);
  }, []);
  return isTablet;
};

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(
    window !== undefined ? window.innerWidth <= 1200 : false,
  );

  useEffect(() => {
    const handleDashboardTablet = () => {
      setIsMobile(window.innerWidth <= 1200);
    };

    window.addEventListener("resize", handleDashboardTablet);

    return () => window.removeEventListener("resize", handleDashboardTablet);
  }, []);
  return isMobile;
};
