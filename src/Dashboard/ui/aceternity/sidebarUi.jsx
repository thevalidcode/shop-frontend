"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/Sidebars/DashBoardSidebar";

import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Dashboard } from "@/Dashboard/components/dashboard";
import { useLocation } from "react-router-dom";

export function SidebarUi() {
  const locaction = useLocation();
  const currentPath = locaction.pathname;

  // const pageTitle = "Settings";

  const menuSections = [
    {
      title: "Main Menu",
      links: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: <i className="bx bxs-dashboard"></i>,
        },
        {
          label: "Orders",
          href: "/dashboard/orders", // 🆕 Order Management
          icon: <i className="bx bx-cart"></i>,
        },
        {
          label: "Products",
          href: "/dashboard/products", // 🆕 Product Management
          icon: <i className="bx bx-package"></i>,
        },
        {
          label: "Customers",
          href: "/dashboard/customers", // 🆕 Customer Management
          icon: <i className="bx bx-user"></i>,
        },
        {
          label: "Reports",
          href: "/dashboard/reports", // 🆕 Analytics & Reports
          icon: <i className="bx bx-bar-chart"></i>,
        },
      ],
    },
    {
      title: "Payment",
      links: [
        {
          label: "Transactions",
          href: "/dashboard/transactions",
          icon: <i className="bx bx-transfer"></i>,
        },
        {
          label: "Payouts",
          href: "/dashboard/payouts", // 🆕 Payout/Withdrawal
          icon: <i className="bx bx-credit-card"></i>,
        },
      ],
    },
    {
      title: "Account",
      links: [
        // {
        //   label: "Profile",
        //   href: "/dashboard/profile",
        //   icon: <IconUserBolt className="h-5 w-5 shrink-0" />,
        // },
        {
          label: "Settings",
          href: "/dashboard/settings/profile",
          icon: <IconSettings className="h-5 w-5 shrink-0" />,
        },
        {
          label: "Support",
          href: "/dashboard/support", // 🆕 Support/Ticket System
          icon: <i className="bx bx-help-circle"></i>,
        },
        {
          label: "Logout",
          href: "/logout",
          icon: <IconArrowLeft className="h-5 w-5 shrink-0" />,
        },
      ],
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div className="flex">
      {" "}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="scrollbar-hide flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <LogoIcon />
            <div className="mt-8 flex flex-col gap-2">
              {menuSections.map((section, idx) => {
                return (
                  <div>
                    <p
                      key={idx}
                      className="mb-2 text-sm font-semibold text-neutral-700"
                    >
                      {section.title}
                    </p>

                    {section.links.map((link, i) => {
                      const isActive = currentPath === link.href;
                      return (
                        <SidebarLink
                          key={i}
                          link={link}
                          className={`flex rounded px-2 ${isActive ? "bg-validGreen/50 text-white" : ""} `}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const LogoIcon = () => {
  return (
    <>
      <a
        href="/dashboard"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      >
        <div className="bg-validGreen h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm dark:bg-white" />
        <p className="text-xl font-semibold text-neutral-800">Valid Shops</p>
      </a>

      <div className="bg-validGreen/5 me-5 mt-5 flex items-center gap-3 rounded-md px-2 py-3">
        <img
          src="https://images.pexels.com/photos/32141424/pexels-photo-32141424/free-photo-of-serene-field-of-wildflowers-in-bloom.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-neutral-800">John Doe</p>
          <p className="text-sm text-neutral-500">Seller</p>
        </div>
      </div>
    </>
  );
};
