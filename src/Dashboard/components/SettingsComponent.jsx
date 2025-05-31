import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/Sidebars/ProfileSidebar";
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

export default function SettingsComponent({ children }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const pageTitle = "Settings";

  useEffect(() => {
    document.title = `${pageTitle} - Valid Shop`;
  }, [pageTitle]);
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
              {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                const isFirst = index === 0;

                return (
                  <BreadcrumbItem key={name}>
                    {isLast ? (
                      <BreadcrumbPage>
                        {decodeURIComponent(name)}{" "}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        className={` ${isFirst ? "capitalize" : ""} `}
                        href={routeTo}
                      >
                        {decodeURIComponent(name)}
                      </BreadcrumbLink>
                    )}

                    {!isLast && <BreadcrumbSeparator />}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
        </header>
        {children}
      </SidebarInset>
      <AppSidebar side="right" />
    </SidebarProvider>
  );
}
