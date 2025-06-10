import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const OrderSummaryCard = ({
  title,
  description,
  amount,
  trend,
  percentageChange,
  icon,
}) => (
  <div className="rounded-md px-3 py-5 shadow">
    <div className="flex justify-between">
      <div>
        <h1 className="text-lg font-medium">{title}</h1>
        <p className="text-sm text-gray-500"> {description} </p>
      </div>

      <div className="h-fit rounded px-2 shadow">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <i className="bx bx-dots-horizontal-rounded"></i>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Keyboard shortcuts
                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem>
                New Team
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div className="mt-5 flex items-center gap-2">
      <p className="text-xl font-semibold"> {amount} </p>
      <p
        className={`flex items-center rounded border ${trend === "up" ? "bg-green-100 px-1 text-green-500" : "bg-red-100 px-1 text-red-500"} `}
      >
        {trend === "up" ? (
          <i className="bx bx-up-arrow-alt"></i>
        ) : (
          <i className="bx bx-down-arrow-alt"></i>
        )}
        {percentageChange}
      </p>
    </div>

    <div className="mt-3 flex items-center justify-between rounded bg-gray-200 px-3 py-2">
      <p className="text-sm text-gray-500">From Last Month</p>
      <button className="cursor-pointer text-sm font-medium">
        See details <i className={`${icon}`}></i>
      </button>
    </div>
  </div>
);
