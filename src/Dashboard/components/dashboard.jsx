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

          <div className="flex gap-2">
            {[...new Array(4)].map((i, idx) => (
              <div
                key={"first-array-demo-1" + idx}
                className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
              ></div>
            ))}
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
