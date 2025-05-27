import React from "react";

const PopularProducts = ({ id, image, name, price, stat, stockQuantity }) => {
  return (
    <>
      <tr className="border-t">
        <td className="px-4 py-2">{id}</td>
        <td className="px-4 py-2">
          {" "}
          <img
            src={image}
            alt=""
            className="h-10 w-10 rounded-md object-cover"
          />{" "}
        </td>
        <td className="truncate px-4 py-2"> {name} </td>
        <td className="px-4 py-2"> ₦{price} </td>
        <td className="px-4 py-2"> {stat} </td>
        <td className="px-4 py-2">
          <span
            className={`inline-block w-fit truncate rounded border px-2 py-1 ${
              stockQuantity <= 0
                ? "border-red-300 text-red-500"
                : "text-validGreen border-validGreen/70"
            }`}
          >
            {stockQuantity > 0 ? "In stock" : "Out of stock"}
          </span>
        </td>
      </tr>
    </>
  );
};

export default PopularProducts;
