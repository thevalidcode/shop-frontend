"use client";

import Wrapper from "@/components/wrapper";
import { Footer } from "@/components/Footer";
import { useAppContext } from "@/context/appContext";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, error, userInfo, generalSetting } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !error && userInfo) {
      const excludePaths = [
        "/", // main page only
        "/auth/forgot-password",
        "/auth/reset-password",
        "/terms-of-service",
        "/privacy-policy",
      ];
      const currentPath = window.location.pathname;
      // Only exclude if exactly on main page ("/")
      if (
        currentPath !== "/" &&
        !excludePaths.slice(1).some((path) => currentPath.startsWith(path))
      ) {
        router.push("/client/products");
      }
    }
  }, [isLoading, error, userInfo]);

  useEffect(() => {
    if (generalSetting) {
      document.title = `${generalSetting.shopName}`;
    } else {
      document.title = "Loading…";
    }
  }, [generalSetting]);

  if (isLoading) return <Loading />;

  return (
    <Wrapper>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </Wrapper>
  );
}
