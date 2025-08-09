import React from "react";
import BreadCrumb from "./BreadCrumb";
import { Bell, Book, BookOpen, BookOpenText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardHeader = ({ children }) => {
  return (
    <>
      <div className="w-full bg-gradient-to-b from-white to-transparent shadow">
        <div className="flex w-full items-center justify-between gap-10 px-4 py-2">
          {/* Breadcrumb & Search component */}

          <div className="flex w-[70%] items-center">
            <BreadCrumb />
            <div className="relative w-full rounded border bg-gray-200 px-2 py-1 text-gray-600">
              <input
                type="text"
                placeholder="Search here..."
                name=""
                id=""
                className="w-full px-7 outline-none"
              />
              <Search size={"20"} className="absolute top-1" />
            </div>
          </div>

          {/* Third side */}
          <div className="flex w-[25%] items-center gap-5">
            <Link to={"routeTo"} className="flex gap-1">
              <BookOpenText className="text-validGreen" />
              <p>Set Up Guide</p>
            </Link>
            <Bell />

            <DropdownMenu>
              <DropdownMenuTrigger>
                <img
                  src="/neclcnacacassccaccacac;src/assets/dashboard/profile-pic.png"
                  alt=""
                  className="h-10 w-10 cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {children}
      </div>
    </>
  );
};

export default DashboardHeader;
