import { MobileDock } from "@/Dashboard/ui/aceternity/mobileDock";
import { SidebarUi } from "@/Dashboard/ui/aceternity/sidebarUi";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <SidebarUi />
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
