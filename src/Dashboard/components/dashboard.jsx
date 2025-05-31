import React, { useEffect, useState } from "react";
import { PopOver } from "../ui/aceternity/popover";
import { MetricsSummaryCard } from "./MetricsSummaryCard";
import axios from "axios";
import ChartComponent from "./chart";
import PopularProducts from "./PopularProducts";
import RecentOrders from "./RecentOrders";
import TopCountries from "./TopCountries";
import { useDashboardMobile } from "@/lib/utils";
import { MobileDock } from "../ui/aceternity/mobileDock";

export const Dashboard = () => {
  const [summaryMetrics, setSummaryMetrics] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCountries, setTopCountries] = useState([]);

  // Fetch summary metrics, top products, and top countries data
  const DashboardMobile = useDashboardMobile();

  useEffect(() => {
    axios.get("http://localhost:2001/summaryMetrics").then((res) => {
      console.log(res.data);
      setSummaryMetrics(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:2001/topProducts").then((res) => {
      setTopProducts(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:2001/topCountries").then((res) => {
      setTopCountries(res.data);
    });
  }, []);

  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    style: "currency",
    currency: "NGN",
    currencyDisplay: "symbol",
  });

  const totalAmount = formatter.format(
    topCountries.reduce((acc, country) => acc + country.totalAmount, 0),
  );
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

          <div
            className={`mt-5 flex ${DashboardMobile ? "flex-col" : "flex-row"} gap-3`}
          >
            {/* Chart component and popular products */}

            <div className="flex flex-3 flex-col gap-5">
              <ChartComponent className={`flex-3`} />
              <div>
                <div className="flex items-center justify-between px-3">
                  <p className="mb-5 text-xl font-semibold">Popular Products</p>
                </div>{" "}
                <div className="scrollbar-hide flex-3 overflow-x-auto">
                  <table className="min-w-full overflow-hidden">
                    <thead className="">
                      <tr>
                        <th className="rounded-tl-lg px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Image
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Stat
                        </th>
                        <th className="rounded-tr-lg px-4 py-2 text-left text-sm font-semibold text-gray-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts && topProducts.length > 0 ? (
                        topProducts.map((t, i) => (
                          <PopularProducts
                            key={i}
                            id={t.productId}
                            image={t.image}
                            name={t.name}
                            price={t.price}
                            stat={t.stat}
                            stockQuantity={t.stockQuantity}
                          />
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">No products available</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/*  */}
            <div className="flex flex-1 flex-col gap-5">
              {/* Top countries */}
              <div className="h-fit w-full flex-1 rounded-xl border p-7 shadow-sm">
                <div className="mb-3 flex items-center border-b pb-3">
                  <p className="text-xl">Top Countries by sells</p>
                </div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xl"> {totalAmount}</p>
                  <p className="text-sm text-gray-500">Updated every week</p>
                </div>
                {topCountries && topCountries.length > 0
                  ? topCountries
                      .slice(0, 5)
                      .map((country, i) => (
                        <TopCountries
                          key={i}
                          image={country.flag}
                          countryName={country.country}
                          trend={country.trend}
                          totalAmount={country.totalAmount}
                        />
                      ))
                  : ""}
              </div>

              {/* Recent orders */}
              <div className="h-fit w-full flex-1 rounded-xl border p-7 shadow-sm">
                <div className="mb-3 flex items-center border-b pb-3">
                  <p className="text-xl">Recent Orders</p>
                </div>
                {topProducts && topProducts.length > 0 ? (
                  topProducts.map((t, i) =>
                    t.stockQuantity > 0 ? (
                      <RecentOrders
                        key={i}
                        name={t.name}
                        category={t.category}
                        price={t.price}
                        image={t.image}
                      />
                    ) : null,
                  )
                ) : (
                  <tr>
                    <td colSpan="6">No products available</td>
                  </tr>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
