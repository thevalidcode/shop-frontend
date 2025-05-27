import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const useDashboardMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 970);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 970);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
