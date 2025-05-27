import React from "react";

const RecentOrders = ({ name, price, statstockQuantity, image, category }) => {
  return (
    <>
      <tr className="mb-3 flex items-center justify-between">
        <td className="flex items-center gap-2 py-2">
          <img
            src={image}
            className="h-10 w-10 rounded-full object-cover"
            alt=""
          />
          <div className="flex flex-col justify-center">
            <p className="w-[50%] truncate">{name}</p>
            <p className="text-sm text-gray-400"> {category} </p>
          </div>
        </td>
        <td className="py-2"> ₦{price} </td>
      </tr>{" "}
    </>
  );
};

export default RecentOrders;
