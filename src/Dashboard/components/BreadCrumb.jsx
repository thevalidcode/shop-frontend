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

const BreadCrumb = ({ children }) => {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);
  return (
    <>
      <div className="w-full bg-gradient-to-b from-white to-transparent shadow">
        <Breadcrumb className={`mb-2 rounded border-b px-2 py-5`}>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block"></BreadcrumbItem>
            {pathnames.map((name, index) => {
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
            })}
          </BreadcrumbList>
        </Breadcrumb>
        {children}
      </div>
    </>
  );
};

export default BreadCrumb;
