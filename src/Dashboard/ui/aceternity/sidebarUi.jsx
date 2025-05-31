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

export function SidebarUi() {
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Transactions",
      href: "/dashboard/transactions",
      icon: <i className="bx bx-transfer"></i>,
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Zion",
              href: "/profile",
              icon: (
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  return (
    <>
      <a
        href="/dashboard"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
      >
        <div className="bg-validGreen h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm dark:bg-white" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-black dark:text-white"
        >
          <p className="text-xl font-semibold text-neutral-800">Valid Shops</p>
        </motion.span>
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
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="bg-validGreen h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm dark:bg-white" />
    </a>
  );
};
