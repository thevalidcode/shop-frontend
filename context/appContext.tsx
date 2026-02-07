"use client";

import { useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance } from "axios";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { get, set } from "idb-keyval";
import { CurrencyCode } from "@/lib/currencyConverter";
import { Admin, User } from "@/types";
import { Shop } from "@/types";
import { timezoneToCurrency } from "@/app/_docs/doc";
import { isNull } from "util";

export interface GeneralSettingProps {
  shopName: string;
  logoUrl: string;
  shopDescription: string;
  showBanner: boolean;
  shopId: number;
  faviconUrl: string;
  defaultClientCurrency: CurrencyCode;
  onboardingCompleted: boolean;
  instagramUrl?: string;
  xUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  shopStreet?: string;
  shopCity?: string;
  shopState?: string;
  shopPostalCode?: string;
  shopCountry?: string;
  shopPhone?: string;
}

interface CurrencyRates {
  [key: string]: number;
}

interface AppContextType {
  api: AxiosInstance;
  generalSetting: GeneralSettingProps | null;
  isShopGeneralSettingsLoading: boolean;
  domain: string;
  userInfo: User | null;
  adminInfo: Admin | null;
  setUserInfo: (user: User | null) => void; // Allow setting to null for logout
  setAdminInfo: (user: Admin | null) => void; // Allow setting to null for logout
  shopId: number | null;
  shopInfo: Shop | null;
  setShopId: (shopId: number) => void;
  isLoading: boolean;
  isRatesLoading: boolean;
  isAuthLoading: boolean;
  setGeneralSetting: (setting: GeneralSettingProps | null) => void;
  rates?: CurrencyRates;
  userCurrency: CurrencyCode;
  setUserCurrency: (currency: string) => void;
  error: Error | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [domain, setDomain] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href.replace(/^https?:\/\//, "");
    let d = currentUrl.split("/")[0];
    if (d.startsWith("www.")) d = d.slice(4);
    setDomain(d);
  }, []);

  const router = useRouter();
  const [shopId, setShopId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const storedShopId = localStorage.getItem("shopId");
    const parsedId =
      storedShopId && !isNaN(parseInt(storedShopId, 10))
        ? parseInt(storedShopId, 10)
        : null;
    if (storedShopId && !parsedId) {
      localStorage.removeItem("shopId");
    }
    return parsedId;
  });

  const handleSetShopId = (shopId: number) => {
    setShopId(shopId);
    if (typeof window !== "undefined") {
      localStorage.setItem("shopId", shopId.toString());
    }
  };

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [rates, setRates] = useState<CurrencyRates | {}>();
  const [adminInfo, setAdminInfo] = useState<Admin | null>(null);
  const [shopInfo, setShopInfo] = useState<Shop | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [userCurrency, setUserCurrencyState] = useState<CurrencyCode>("USD");
  const [generalSetting, setGeneralSetting] =
    useState<GeneralSettingProps | null>(null);

  // Load user from IndexedDB on mount
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await get<User | null>("userInfo");
        if (storedUser) setUserInfo(storedUser);
        const storedAdmin = await get<Admin | null>("adminInfo");
        if (storedAdmin) setAdminInfo(storedAdmin);
      } catch (err) {
        console.error("Failed to load user info from IndexedDB:", err);
      } finally {
        setIsAuthLoading(false);
      }
    };
    loadUserInfo();
  }, []);

  useEffect(() => {
    const saveAuthInfo = async () => {
      // This is to ensure that only one authentication state will stay because of cookies!
      try {
        if (userInfo !== null) {
          await set("userInfo", userInfo);
          await set("adminInfo", null);
        }
        if (adminInfo !== null) {
          await set("adminInfo", adminInfo);
          await set("userInfo", null);
        }
      } catch (err) {
        console.error("Failed to save auth info:", err);
      }
    };
    saveAuthInfo();
  }, [userInfo, adminInfo]);

  // Sync currency with localStorage and auto-detect from locale
  useEffect(() => {
    const savedCurrency = localStorage.getItem("userCurrency");
    if (savedCurrency && savedCurrency.trim() !== "") {
      setUserCurrencyState(savedCurrency.toUpperCase() as CurrencyCode);
    } else {
      // Auto-detect currency from user's locale
      const detectedCurrency = detectUserCurrency();
      setUserCurrencyState(detectedCurrency);
      localStorage.setItem("userCurrency", detectedCurrency);
    }
  }, []);

  // Function to detect user's currency from locale
  const detectUserCurrency = (): CurrencyCode => {
    try {
      // Use timezone for more accurate currency detection
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      if (timezoneToCurrency[timeZone]) {
        return timezoneToCurrency[timeZone];
      }

      // Fallback: try to extract region from timezone
      const region = timeZone.split("/")[0];
      if (region === "America") return "USD";
      if (region === "Europe") return "EUR";
      if (region === "Asia") return "USD";
      if (region === "Africa") return "NGN";

      // Final fallback to USD
      return "USD";
    } catch (error) {
      console.error("Failed to detect currency:", error);
      return "USD";
    }
  };

  // Wrap setter to automatically persist and normalize to uppercase
  const setUserCurrency = (currency: string) => {
    const upper = currency.toUpperCase();
    setUserCurrencyState(upper as CurrencyCode);
    localStorage.setItem("userCurrency", upper);
  };

  const handleSetUserInfo = async (user: User | null) => {
    // Update state
    setUserInfo(user);
  };

  const handleSetAdminInfo = async (admin: Admin | null) => {
    // Update state
    setAdminInfo(admin);
  };

  // Memoize the api instance to avoid re-creating it on every render.
  const api = useMemo(() => {
    if (!domain) return null as unknown as AxiosInstance;

    const baseURL =
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:7030/v1"
        : `https://api.${domain}/v1`;

    const newAxios = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    newAxios.interceptors.request.use((config) => {
      const csrfToken = Cookies.get("csrf_token");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
      return config;
    });

    newAxios.interceptors.response.use((response) => {
      const newToken = response.headers["x-csrf-token"];
      if (newToken) {
        Cookies.set("csrf_token", newToken);
      }
      return response;
    });

    return newAxios;
  }, [domain]);

  const { error, isLoading } = useQuery({
    queryKey: ["shopId", domain],
    queryFn: async () => {
      const res = await api.get<Shop>(`/shops/data`);
      if (!res.data || !res.data.shopId) {
        throw new Error("No shopId found for this domain");
      }
      const { shopId } = res.data;
      handleSetShopId(shopId);
      setShopInfo(res.data);
      return shopId;
    },
    enabled: !!domain,
    retry: false,
  });

  // Redirect to shop not found when shop lookup fails
  useEffect(() => {
    if (error && typeof window !== "undefined" && !isLoading) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on a public or shop-not-found page
      if (!currentPath.startsWith("/shop-not-found")) {
        router.push("/shop-not-found?reason=not-found");
      }
    }
  }, [error, isLoading, router]);

  const { isLoading: isShopGeneralSettingsLoading, error: settingsError } =
    useQuery({
      queryKey: ["shopSettings", shopId, domain],
      queryFn: async () => {
        const res = await api.get(`/shops/${shopId}/general-data`);
        if (!res.data) {
          throw new Error("No General Settings found for this shop");
        }
        setGeneralSetting(res.data);
        return res.data;
      },
      enabled: !!shopId && !!domain,
    });

  // Redirect to shop not found when settings are missing
  useEffect(() => {
    if (
      settingsError &&
      typeof window !== "undefined" &&
      !isShopGeneralSettingsLoading &&
      shopId
    ) {
      const currentPath = window.location.pathname;
      // Only redirect if not already on a public or shop-not-found page
      if (!currentPath.startsWith("/shop-not-found")) {
        router.push("/shop-not-found?reason=missing-settings");
      }
    }
  }, [settingsError, isShopGeneralSettingsLoading, shopId, router]);

  const { isLoading: isRatesLoading } = useQuery({
    queryKey: ["rates"],
    queryFn: async () => {
      const res = await api.get(`/rates`);
      if (!res.data) {
        throw new Error("No rates data found");
      }
      setRates(res.data.rates as CurrencyRates);
      return res.data;
    },
    enabled: !!domain,
  });

  return (
    <AppContext.Provider
      value={{
        userInfo,
        adminInfo,
        shopId,
        api,
        setUserInfo: handleSetUserInfo,
        setAdminInfo: handleSetAdminInfo,
        setShopId: handleSetShopId,
        isRatesLoading,
        rates,
        setGeneralSetting,
        domain,
        isLoading,
        generalSetting,
        isShopGeneralSettingsLoading,
        shopInfo,
        userCurrency,
        setUserCurrency,
        isAuthLoading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
