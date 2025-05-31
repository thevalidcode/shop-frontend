import SettingsComponent from "@/Dashboard/components/SettingsComponent";
import { SidebarUi } from "@/Dashboard/ui/aceternity/sidebarUi";
import React from "react";
import { Outlet } from "react-router-dom";

const SettingsLayout = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row">
        <SidebarUi />
        <SettingsComponent>
          <Outlet />
        </SettingsComponent>
      </div>
    </>
  );
};

export default SettingsLayout;
