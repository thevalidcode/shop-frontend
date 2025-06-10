import BreadCrumb from "@/Dashboard/components/BreadCrumb";
import { SidebarUi } from "@/Dashboard/ui/aceternity/sidebarUi";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <SidebarUi />
        <BreadCrumb>
          <Outlet />
        </BreadCrumb>
      </div>
    </>
  );
};

export default DashboardLayout;
