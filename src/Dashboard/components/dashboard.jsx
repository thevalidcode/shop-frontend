import React, { useEffect, useState } from "react";
import { PopOver } from "../ui/aceternity/popover";
import { MetricsSummaryCard } from "./MetricsSummaryCard";
import axios from "axios";
import ChartComponent from "./chart";
import ColorSwitch from "./colorSwitcher";

export const Dashboard = () => {
  const [summaryMetrics, setSummaryMetrics] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:2001/summaryMetrics").then((res) => {
      console.log(res.data);
      setSummaryMetrics(res.data);
    });
  }, []);

  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor");
    if (savedColor) {
      document.documentElement.style.setProperty(
        "--color-validGreen",
        savedColor,
      );
    }
  }, []);
  return (
    <>
      {/* <ColorSwitch /> */}
      <div className="flex min-h-screen flex-1">
        <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 md:p-5">
          <h1 className="secondaryText mt-3 text-lg font-semibold">
            Welcome back, Zion
          </h1>

          <div className="flex justify-between">
            <div>
              <h1 className="secondaryText text-xl font-semibold">
                Business Overview
              </h1>
              <p className="secondaryText text-sm">
                Here is how your business is doing today.
              </p>
            </div>
            <div className="hidden md:flex">
              <PopOver />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {summaryMetrics.map((metric, i) => (
              <MetricsSummaryCard
                key={i}
                title={metric.title}
                amount={metric.amount}
                change={metric.change}
                trend={metric.trend}
                icon={metric.icon}
                bgColor={metric.bgColor}
              />
            ))}
          </div>

          <ChartComponent />
        </div>
      </div>
    </>
  );
};
