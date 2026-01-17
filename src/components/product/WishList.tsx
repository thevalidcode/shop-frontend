import React from "react";
import featuredProducts from "./product";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

type WishListType = {
  id: number;
  itemName: string;
  image: StaticImageData;
  price: number;
};

export default function WishList() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-5 py-5 max-sm:px-0 space-y-6 border-0">
      <div className="flex flex-col">
        <h1 className="text-black font-medium text-4xl">WISHLIST</h1>

        <p className="text-lg text-slate-500 font-extralight text-center">
          add to your cart.
        </p>
      </div>

      <div className="w-full flex flex-row max-sm:grid max-sm:grid-cols-2 max-sm:space-y-4 space-x-4 max-sm:gap-2 border-0 justify-center">
        {featuredProducts.map((p: WishListType) => (
          <div key={p.id} className="border-0">
            <div className="flex items-center justify-center w-full border-0">
              <Image
                src={p.image}
                alt="product-image"
                priority
                className="flex object-contain border-0 max-sm:w-80 justify-self-center"
              />
            </div>

            <div className="flex items-center justify-between border-0">
              <div className="flex flex-col space-y-0.5 max-sm:text-center border-0 w-full">
                <p className="text-base">{p.itemName}</p>
                <p className="max-sm:text-2xl max-sm:font-bold font-semibold text-xl text-[#5F0DB3]">
                  ${p.price}
                </p>

                <Link
                  href="/cart"
                  className="flex flex-row gap-1 border-0 max-sm:text-xs text-sm justify-center underline text-[#5F0DB3]"
                >
                  Add to cart <ShoppingBag size={14} color="#5F0DB3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
