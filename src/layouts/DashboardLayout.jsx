import BreadCrumb from "@/Dashboard/components/BreadCrumb";
import DashboardHeader from "@/Dashboard/components/header";
import { SidebarUi } from "@/Dashboard/ui/aceternity/sidebarUi";
import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <SidebarUi />
        <DashboardHeader>
          <Outlet />
        </DashboardHeader>
      </div>
    </>
  );
};

export default DashboardLayout;
