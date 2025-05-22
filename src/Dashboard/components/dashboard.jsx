import React from "react";
import { PopOver } from "../ui/aceternity/popover";

export const Dashboard = () => {
  return (
    <>
      <div className="flex min-h-screen flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-5">
          <h1 className="primaryText mb-3 text-lg font-semibold">
            Welcome back, User
          </h1>

          <div className="flex justify-between">
            <div>
              <h1 className="secondaryText text-xl font-semibold">
                Business Overview
              </h1>
              <p className="secondaryText">
                Here is how your business is doing today
              </p>
            </div>
            <div className="hidden md:flex">
              <PopOver />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {/* Total Revenue */}
            <div className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-2">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h1 className="primaryText text-lg font-medium">
                    Total Revenue
                  </h1>
                  <p className="successRateText flex w-15 items-center justify-center rounded-md">
                    <i class="bx bx-plus"></i> 17.2%
                  </p>
                </div>

                <div>
                  <i className="bx bx-dollar rounded-full bg-gray-200 p-1"></i>
                </div>
              </div>
              <p className="text-2xl font-semibold">₦27, 962</p>
            </div>

            {/* Total Orders */}
            <div className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-2">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h1 className="primaryText text-lg font-medium">
                    Total Orders
                  </h1>
                  <p className="successRateText flex w-15 items-center justify-center rounded-md">
                    <i class="bx bx-plus"></i> 17.2%
                  </p>
                </div>

                <div>
                  <i className="bx bxs-shopping-bag rounded-full bg-gray-200 p-1"></i>
                </div>
              </div>
              <p className="text-2xl font-semibold">26</p>
            </div>

            {/* Impressions */}
            <div className="flex w-full flex-col gap-5 rounded-lg bg-gray-100 p-2">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h1 className="primaryText text-lg font-medium">
                    Impressions
                  </h1>
                  <p className="failureRateText flex w-15 items-center justify-center rounded-md">
                    <i class="bx bx-minus"></i> 1.2%
                  </p>
                </div>

                <div>
                  <i className="bx bx-trending-down rounded-full bg-gray-200 p-1"></i>
                </div>
              </div>
              <p className="text-2xl font-semibold">500K</p>
            </div>
          </div>
          <div className="flex flex-1 gap-2">
            {[...new Array(2)].map((i, idx) => (
              <div
                key={"second-array-demo-1" + idx}
                className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
