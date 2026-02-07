"use client";

import { useEffect, ReactNode } from "react";
import withAuth from "@/lib/withAuth";
import { useGetUserByUid } from "@/hooks/use-user";
import { useAppContext } from "@/context/appContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function ClientLayoutComponent({ children }: { children: ReactNode }) {
  const { userInfo, setUserInfo } = useAppContext();
  const { data: userData } = useGetUserByUid(userInfo?.uid || "");

  useEffect(() => {
    if (userData) {
      setUserInfo({
        ...userInfo,
        ...userData,
      });
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="py-16 lg:py-25 container mx-auto px-2 flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default withAuth({
  WrappedComponent: ClientLayoutComponent,
  userType: "user",
  excludePaths: [
    "/client/products",
    "/client/faq",
    "/client/blog",
    "/client/api-docs",
  ],
});
