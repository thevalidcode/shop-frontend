// src/app/storefront/after-login/page.tsx

import { isAdminRole } from "@/lib/auth/roles";
import { getServerAuthContext } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AfterLogin() {
  const { role, status } = await getServerAuthContext();

  //Handle Suspended
  if (status && ["suspended", "banned"].includes(status.toLowerCase())) {
    redirect("/auth?error=suspended");
  }

  if (isAdminRole(role)) {
    redirect("/dashboard"); //shop owner/staff dashboard under /storefront/dashboard
  }
}
