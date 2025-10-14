import { Button, ButtonGroup } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import featuredProducts, { FeaturedProducts } from "./product";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  prodId: string | null;
};

export default function ProdDetails({ prodId }: Props) {
  const [value, setValue] = useState(1);
  //   const [product, setProduct] = useState<FeaturedProducts | null>(null);

  const router = useRouter();

  function handleDec() {
    if (value === 0) {
      return;
    }

    setValue((prev) => prev - 1);
  }

  const selectedItem = featuredProducts.find(
    (p) => p.id === parseInt(prodId as string)
  );

  if (!selectedItem) {
    return <p className="text-base text-red-500">Item not found :(</p>;
  }

  return (
    <div>
      <div className="relative flex flex-col items-center w-full space-y-2 border-0">
        {selectedItem?.image && (
          <Image
            src={selectedItem?.image}
            alt={selectedItem?.itemName}
            priority
            placeholder="blur"
            className="object-cover h-full border-0 max-sm:w-full w-80"
          />
        )}

        <div className="flex flex-row items-center justify-between border-0 min-w-80 max-sm:w-full">
          <div className="flex flex-col space-y-0.5">
            <p className="text-base max-sm:text-2xl">
              {selectedItem?.itemName}
            </p>
            <p className="max-sm:text-2xl max-sm:font-bold font-semibold text-xl text-validPurple">
              ${selectedItem?.price}
            </p>
          </div>

          <div className="flex flex-col text-center">
            <p className="text-light text-xs text-[#5F0DB3] max-sm:text-base">
              Available
            </p>
            <ButtonGroup className="flex flex-row space-x-1 bg-[#5F0DB3] border-0 rounded-full items-center">
              <Button
                variant="bordered"
                className="rounded-full cursor-pointer text-white text-base"
                onPress={handleDec}
              >
                <Minus color="white" />
              </Button>
              <p className="text-white text-base">{value}</p>
              <Button
                variant="bordered"
                className="rounded-full cursor-pointer text-white text-base"
                onPress={() => setValue((prev) => prev + 1)}
              >
                <Plus color="white" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
      <div className="border-0 w-full flex flex-col items-center">
        <p className="text-xl max-sm:text-lg font-light text-black">
          Product Description
        </p>

        <p className="text-light text-lg text-[#7E7E7E] max-sm:text-base">
          designer shades, you&apos;ll love designer shades
        </p>

        <Link href="/cart">
          <Button
            variant="bordered"
            className="rounded-full cursor-pointer text-white text-base bg-[#5F0DB3] mt-6 px-5 py-5 max-sm:py-6"
          >
            Add To Cart ${selectedItem?.price}.00
          </Button>
        </Link>
      </div>
    </div>
  );
}
