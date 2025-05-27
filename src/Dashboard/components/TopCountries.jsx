import React from "react";

const TopCountries = ({
  image,
  trend,
  countryName,
  totalAmount,
  className,
}) => {
  return (
    <>
      <div className={`flex items-center justify-between py-3 ${className} `}>
        <div className="flex items-center gap-2">
          {" "}
          <img
            src={image}
            alt="Country Flag"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="w-25 truncate text-sm">{countryName}</p>
        </div>
        <p
          className={`text-lg font-semibold ${trend === "up" ? "text-red-500" : "text-green-400"} `}
        >
          {trend === "up" ? (
            <i class="bx bx-trending-up"></i>
          ) : (
            <i class="bx bx-trending-down"></i>
          )}
        </p>
        <p> {totalAmount} </p>
      </div>
    </>
  );
};

export default TopCountries;
