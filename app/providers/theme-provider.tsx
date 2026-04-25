"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { adminTheme } from "@/app/_docs/doc";
import { useGetShopDesign, useUpdateShopDesign } from "@/hooks/use-shop";
import { useAppContext } from "@/context/appContext";

type ThemeSchema = {
  ":root": Record<string, string>;
  ".dark"?: Record<string, string>;
};

type ThemeOption = {
  name: string;
  hex: string;
  schema: ThemeSchema;
};

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  applyTheme: (schema: ThemeOption) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = adminTheme[0];
const THEME_MODE_STORAGE_KEY = "themeMode";

const getThemeStorageKey = (scope: string | number | null | undefined) =>
  scope ? `selectedTheme:${scope}` : "selectedTheme";

// Apply CSS variables
const applyThemeStyles = (schema: ThemeSchema, isDark: boolean) => {
  if (typeof window === "undefined") return;

  const styleElement = document.createElement("style");
  styleElement.id = "theme-styles";

  const existing = document.getElementById("theme-styles");
  if (existing) existing.remove();

  let css = `:root {\n`;
  Object.entries(schema[":root"]).forEach(([k, v]) => {
    css += `  ${k}: ${v};\n`;
  });
  css += `}\n`;

  if (schema[".dark"] && isDark) {
    css += `.dark {\n`;
    Object.entries(schema[".dark"]).forEach(([k, v]) => {
      css += `  ${k}: ${v};\n`;
    });
    css += `}\n`;
  }

  styleElement.textContent = css;
  document.head.appendChild(styleElement);
};

const loadLocalTheme = (storageKey: string) => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const loadThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return "dark";

  const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");
  const isDark = theme === "dark";

  const { shopId, domain } = useAppContext();
  const { data: dbTheme } = useGetShopDesign();
  const updateThemeMutation = useUpdateShopDesign();
  const storageKey = getThemeStorageKey(shopId ?? domain);

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, nextTheme);
    }
  };

  // MAIN apply function
  const applyTheme = async (theme: ThemeOption) => {
    applyThemeStyles(theme.schema, isDark);

    const savedTheme = await updateThemeMutation.mutateAsync({ ...theme });
    localStorage.setItem(storageKey, JSON.stringify(savedTheme ?? theme));
  };

  // Initialize mode from localStorage/system preference on mount.
  useEffect(() => {
    setThemeState(loadThemeMode());
  }, []);

  // Keep html class in sync with active mode.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Initial load: DB first, then scoped localStorage, then black fallback
  useEffect(() => {
    if (!shopId && !domain) return;

    const saved = loadLocalTheme(storageKey);

    if (dbTheme?.schema) {
      applyThemeStyles(dbTheme.schema, isDark);
      localStorage.setItem(storageKey, JSON.stringify({ ...dbTheme }));
      return;
    }

    if (saved?.schema) {
      applyThemeStyles(saved.schema, isDark);
      localStorage.setItem(storageKey, JSON.stringify(saved));
      return;
    }

    applyThemeStyles(defaultTheme.schema, isDark);
    localStorage.setItem(storageKey, JSON.stringify({ ...defaultTheme }));
  }, [dbTheme, domain, isDark, shopId, storageKey]);

  return (
    <ThemeContext.Provider value={{ applyTheme, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};
