import { isAdminRole } from "@/lib/auth/roles";
import { getServerAuthContext } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await getServerAuthContext();
  if (!isAdminRole(role)) redirect("/auth/retuenUrl=/dashboard");
  return <> {children} </>;
}
