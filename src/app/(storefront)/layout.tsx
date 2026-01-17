// src/app/storefront/layout.tsx (make lookup resilient)
import { headers as nextHeaders } from "next/headers";
import { getShopDataByDomain } from "@/lib/api/shop";
import NavBar from "@/components/app/NavBar";
import Footer from "@/components/app/Footer";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await nextHeaders();
  const host =
    hdrs.get("x-original-host") ?? hdrs.get("host") ?? "validpanel.com";

  // Don't block page render with API call - make it non-blocking
  const shopDataPromise = getShopDataByDomain(host).catch(() => null);

  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
