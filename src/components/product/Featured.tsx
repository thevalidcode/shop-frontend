"use client";

import React from "react";

import Image from "next/image";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { Button, ButtonGroup } from "@heroui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

import featuredProducts from "./product";

export default function Featured() {
  const router = useRouter();
  function handleProduct(id: number) {
    const selectedProduct = featuredProducts.find(
      (product) => product.id === id
    );

    if (selectedProduct) {
      router.push(`/product-details?id=${id}`);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-5 py-5 space-y-6">
      <div className="flex flex-col items-center space-y-1">
        <h1 className="text-4xl font-medium text-black">FEATURED</h1>
        <p className="px-4 text-lg font-extralight text-[#7E7E7E] ">
          bestsellers
        </p>
      </div>

      <div className="grid grid-cols-4 w-full gap-10 border-0 max-sm:grid-cols-1 max-sm:space-y-20">
        {featuredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col w-full space-x-7 border-0"
          >
            <div className="flex items-center justify-center w-full border-0 h-80">
              <Image
                src={product.image}
                alt="product-image"
                className="flex object-contain border-0 justify-self-center cursor-pointer"
                onClick={() => handleProduct(product.id)}
              />
            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col space-y-0.5">
                <p className="text-base max-sm:text-2xl font-light">
                  {product.itemName}
                </p>
                <p className="max-sm:text-2xl max-sm:font-bold font-semibold text-xl text-[#5F0DB3]">
                  ${product.price}
                </p>
              </div>

              <ButtonGroup className="flex flex-row space-x-1 border-0">
                <Link href="/cart">
                  <Button
                    variant="bordered"
                    className="rounded-full bg-[#5F0DB3] max-sm:h-14 max-sm:w-14 h-12 w-12 cursor-pointer"
                  >
                    <ShoppingBag color="white" />
                  </Button>
                </Link>
                <Button
                  variant="bordered"
                  className="rounded-full bg-[#5F0DB3] max-sm:h-14 max-sm:w-14 w-12 h-12 cursor-pointer"
                >
                  <ArrowUpRight color="white" />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        ))}
      </div>

      <Link href="#" className="self-end font-light text-[#5F0DB3]  underline">
        <p className="text-sm">see more..</p>
      </Link>
    </div>
  );
}
