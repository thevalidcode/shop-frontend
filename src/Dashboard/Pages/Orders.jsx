import React, { useEffect, useState } from "react";

import axios from "axios";
import { OrderSummaryCard } from "../components/OrderSummaryCard";

const Orders = () => {
  const [orderMetrics, setOrderMetrics] = useState([]);

  useEffect(() => {
    axios("http://localhost:2003/orderMetrics").then((res) => {
      setOrderMetrics(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <>
      <div className="w-full p-10">
        <p className="text-2xl font-medium">Order Management</p>
        <div className="grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {orderMetrics.slice(0, 3).map((order, i) => (
            <OrderSummaryCard
              key={i}
              title={order.title}
              description={order.description}
              amount={order.amount}
              icon={order.icon}
              trend={order.trend}
              percentageChange={order.percentageChange}
            />
          ))}{" "}
        </div>
      </div>
    </>
  );
};

export default Orders;
