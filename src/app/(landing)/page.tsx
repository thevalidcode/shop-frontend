import Image from "next/image";

import productHero from "@public/assets/product/productHero.png";
import homeImage from "@public/homeImage.png";
import { Button } from "@heroui/button";
import { ArrowUpRight } from "lucide-react";
import Featured from "@/components/product/Featured";

export default function Home() {
  return (
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    <main className="flex flex-col items-center w-full px-5 py-5 max-sm:px-0 space-y-6">
      <div
        className="relative flex flex-row items-center w-full border-0 lg:bg-black md:bg-black sm:bg-black 
        rounded-md py-8 px-8 max-sm:px-5 lg:justify-between"
      >
        <div className="flex flex-col space-y-2 max-sm:hidden">
          <h1 className="text-white font-medium text-5xl w-80">
            NEW COLLECTION
          </h1>

          <p className="text-white text-2xl font-light lg:w-80">
            Our latest collection, where classic and contemporary styles
            converge in perfect harmony
          </p>

          <Button className="bg-[#5F0DB3] rounded-full w-fit text-white font-normal text-2xl">
            EXPLORE
            <ArrowUpRight color="white" />
          </Button>
        </div>
        <div className="flex flex-col items-center border-0 w-full lg:w-fit">
          <div className="border-0 max-sm:w-full">
            <Image
              src={productHero}
              alt="hero-img"
              priority
              className="object-cover border-0 max-sm:w-full max-sm:block lg:hidden"
            />

            <Image
              src={homeImage}
              alt="home-img"
              className="object-cover border-0 max-sm:w-full md:hidden lg:block sm:hidden max-sm:hidden"
            />
          </div>

          <ul className="absolute bottom-10 flex flex-row space-x-2.5 lg:hidden">
            {["designer", "dark", "stylish", "new collection"].map(
              (list, index) => (
                <li key={index} className="text-[#A1A1A1] leading-2.5">
                  {list}
                </li>
              )
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-center border-0">
        <h1 className="text-[#5F0DB3] font-medium text-4xl">NEW COLLECTION</h1>

        <p className="px-4 text-lg font-light text-[#7E7E7E] ">
          Our latest collection, where classic and{" "}
          <span className="text-[#5F0DB3] font-light">contemporary styles</span>{" "}
          converge in perfect harmony.
        </p>

        <Button
          variant="bordered"
          className="rounded-full bg-[#5F0DB3] h-14 w-14"
        >
          <ArrowUpRight color="white" />
        </Button>
      </div>

      <Featured />
    </main>
  );
}
