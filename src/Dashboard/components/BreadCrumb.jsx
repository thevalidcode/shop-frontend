import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation } from "react-router-dom";
import {
  Box,
  Folder,
  GitGraph,
  Home,
  List,
  Settings,
  User,
  Users,
} from "lucide-react";

const BreadCrumb = ({ children }) => {
  const icons = {
    dashboard: <Home size={"20"} />,
    product: <Box size={"20"} />,
    orders: <List size={"20"} />,
    settings: <Settings size={"20"} />,
    users: <Users size={"20"} />,
    profile: <User size={"20"} />,
    analytics: <GitGraph size={"20"} />,
  };

  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  const lastSegment = pathnames[pathnames.length - 1];

  const icon = icons[lastSegment?.toLocaleLowerCase()] || <Folder />;
  return (
    <>
      <div className="w-fit">
        <div>
          <Breadcrumb className={`mb-2 px-2 py-5`}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="text flex items-center gap-2 rounded p-2 capitalize">
                <span> {icon} </span>
                {decodeURIComponent(lastSegment)}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {/* {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const isFirst = index === 0;

              return (
                <BreadcrumbItem
                  key={name}
                  className={` ${isFirst ? "capitalize" : ""} `}
                >
                  {isLast ? (
                    <BreadcrumbPage>{decodeURIComponent(name)} </BreadcrumbPage>
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
            })} */}
          </Breadcrumb>
        </div>

        {children}
      </div>
    </>
  );
};

export default BreadCrumb;
