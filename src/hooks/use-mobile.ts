"use client";

import { useState, useEffect } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
  isLargeMobile: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  isIOS: boolean;
  isAndroid: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  isTouchDevice: boolean;
  isRetina: boolean;
  pixelRatio: number;
  viewportWidth: number;
  viewportHeight: number;
}

export interface BreakpointInfo {
  isXS: boolean; // < 640px
  isSM: boolean; // >= 640px
  isMD: boolean; // >= 768px
  isLG: boolean; // >= 1024px
  isXL: boolean; // >= 1280px
  is2XL: boolean; // >= 1536px
  currentBreakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export function useMobile(): DeviceInfo & BreakpointInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isSmallMobile: false,
    isLargeMobile: false,
    isLandscape: false,
    isPortrait: false,
    screenWidth: 0,
    screenHeight: 0,
    userAgent: "",
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isEdge: false,
    isTouchDevice: false,
    isRetina: false,
    pixelRatio: 1,
    viewportWidth: 0,
    viewportHeight: 0,
  });

  const [breakpointInfo, setBreakpointInfo] = useState<BreakpointInfo>({
    isXS: false,
    isSM: false,
    isMD: false,
    isLG: false,
    isXL: false,
    is2XL: false,
    currentBreakpoint: "xs",
  });

  useEffect(() => {
    function updateDeviceInfo() {
      const userAgent = navigator.userAgent;
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;

      // Device type detection
      const isMobile = viewportWidth < 768;
      const isTablet = viewportWidth >= 768 && viewportWidth < 1024;
      const isDesktop = viewportWidth >= 1024;
      const isSmallMobile = viewportWidth < 375;
      const isLargeMobile = viewportWidth >= 375 && viewportWidth < 768;

      // Orientation detection
      const isLandscape = viewportWidth > viewportHeight;
      const isPortrait = viewportWidth <= viewportHeight;

      // OS detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);

      // Browser detection
      const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
      const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
      const isFirefox = /Firefox/.test(userAgent);
      const isEdge = /Edge/.test(userAgent);

      // Touch device detection
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;

      // Retina display detection
      const isRetina = pixelRatio > 1;

      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        isSmallMobile,
        isLargeMobile,
        isLandscape,
        isPortrait,
        screenWidth,
        screenHeight,
        userAgent,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isFirefox,
        isEdge,
        isTouchDevice,
        isRetina,
        pixelRatio,
        viewportWidth,
        viewportHeight,
      });

      // Breakpoint detection (Tailwind CSS breakpoints)
      const isXS = viewportWidth < 640;
      const isSM = viewportWidth >= 640;
      const isMD = viewportWidth >= 768;
      const isLG = viewportWidth >= 1024;
      const isXL = viewportWidth >= 1280;
      const is2XL = viewportWidth >= 1536;

      let currentBreakpoint: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" = "xs";
      if (is2XL) currentBreakpoint = "2xl";
      else if (isXL) currentBreakpoint = "xl";
      else if (isLG) currentBreakpoint = "lg";
      else if (isMD) currentBreakpoint = "md";
      else if (isSM) currentBreakpoint = "sm";

      setBreakpointInfo({
        isXS,
        isSM,
        isMD,
        isLG,
        isXL,
        is2XL,
        currentBreakpoint,
      });
    }

    // Initial call
    updateDeviceInfo();

    // Add event listeners
    window.addEventListener("resize", updateDeviceInfo);
    window.addEventListener("orientationchange", updateDeviceInfo);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
      window.removeEventListener("orientationchange", updateDeviceInfo);
    };
  }, []);

  return { ...deviceInfo, ...breakpointInfo };
}

// Convenience hooks for specific use cases
export function useIsMobile(): boolean {
  const { isMobile } = useMobile();
  return isMobile;
}

export function useIsTablet(): boolean {
  const { isTablet } = useMobile();
  return isTablet;
}

export function useIsDesktop(): boolean {
  const { isDesktop } = useMobile();
  return isDesktop;
}

export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useMobile();
  return isTouchDevice;
}

export function useBreakpoint(): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" {
  const { currentBreakpoint } = useMobile();
  return currentBreakpoint;
}

export function useIsLandscape(): boolean {
  const { isLandscape } = useMobile();
  return isLandscape;
}

export function useIsPortrait(): boolean {
  const { isPortrait } = useMobile();
  return isPortrait;
}

// Hook for responsive values
export function useResponsiveValue<T>(mobile: T, tablet?: T, desktop?: T): T {
  const { isMobile, isTablet, isDesktop } = useMobile();

  if (isMobile) return mobile;
  if (isTablet && tablet !== undefined) return tablet;
  if (isDesktop && desktop !== undefined) return desktop;

  // Fallback chain
  return tablet !== undefined ? tablet : mobile;
}

// Hook for conditional rendering based on screen size
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

// Predefined media query hooks
export function useIsSmallScreen(): boolean {
  return useMediaQuery("(max-width: 640px)");
}

export function useIsMediumScreen(): boolean {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
}

export function useIsLargeScreen(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}

export function useIsDarkMode(): boolean {
  return useMediaQuery("(prefers-color-scheme: dark)");
}

export function useIsReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
