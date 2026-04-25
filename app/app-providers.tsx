"use client";

import { AppProvider } from "@/context/appContext";
import { UseMounted } from "@/lib/mounted";
import { QueryProvider } from "@/provider/queryProvider";
import { ThemeProvider } from "./providers/theme-provider";
import FaviconSetter from "@/components/FaviconSetter";
import CustomToaster from "@/components/CustomToaster";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UseMounted>
      <QueryProvider>
        <AppProvider>
          <ThemeProvider>
            <FaviconSetter />
            <CustomToaster />
            {children}
          </ThemeProvider>
        </AppProvider>
      </QueryProvider>
    </UseMounted>
  );
}
