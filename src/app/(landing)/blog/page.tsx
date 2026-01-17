import Image from "next/image";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import homeImage from "@public/homeImage.png";
import productHero from "@public/assets/product/productHero.png";
import feature2 from "@public/assets/product/feature2.png";
import TopStories from "@/components/product/TopStories";
import WishList from "@/components/product/WishList";

export default function page() {
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const date = dateFormat.format(new Date());

  return (
    <div className="flex flex-col items-center w-full px-5 py-0 max-sm:px-0 space-y-6 border-0">
      <div className="relative flex flex-col space-y-10 items-center justify-center w-full border-0 rounded-md py-4 px-8 max-sm:px-5">
        <div className="flex flex-col space-y-2.5 items-center border-0 justify-center w-full">
          <div className=" flex flex-col justify-center border-0 max-sm:w-full space-y-2.5">
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

            <div className="flex flex-row space-x-2 text-sm font-normal text-slate-500">
              <span className="text-slate-500 font-normal text-sm">{date}</span>
              <p>By Valid Panel</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2.5 border-0">
            <h1 className="text-validText text-3xl font-medium text-left w-full">
              How do you like to Style your sunglasses?
            </h1>

            <p className="font-light text-xl text-slate-500 text-left">
              Our latest collection, where classic and{" "}
              <span className="text-xl text-validText font-light">
                contemporary styles{" "}
              </span>{" "}
              converge in perfect harmony.
            </p>

            <Link
              href="#"
              className="flex flex-row space-x-0.5 items-center self-end"
            >
              <p className="text-validPurple font-extralight text-lg text-center underline">
                view more
              </p>

              <ArrowUpRight className="text-validText" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col space-y-2.5 items-center border-0 justify-center w-full">
          <div className=" flex flex-col justify-center border-0 max-sm:w-full space-y-2.5">
            <Image
              src={feature2}
              alt="blog-img"
              priority
              className="object-cover border-0 max-sm:w-full max-sm:block lg:hidden"
            />

            <Image
              src={feature2}
              alt="blog-img"
              className="object-cover border-0 max-sm:w-full md:hidden lg:block sm:hidden max-sm:hidden"
            />

            <div className="flex flex-row space-x-2 text-sm font-normal text-slate-500">
              <span className="text-slate-500 font-normal text-sm">{date}</span>
              <p>By Valid Panel</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2.5 border-0">
            <h1 className="text-validText text-3xl font-medium text-left w-full">
              How do you like to Style your sunglasses?
            </h1>

            <p className="font-light text-xl text-slate-500 text-left">
              Our latest collection, where classic and{" "}
              <span className="text-xl text-validText font-light">
                contemporary styles{" "}
              </span>{" "}
              converge in perfect harmony.
            </p>

            <Link
              href="#"
              className="flex flex-row space-x-0.5 items-center self-end"
            >
              <p className="text-validPurple font-extralight text-lg text-center underline">
                view more
              </p>

              <ArrowUpRight className="text-validText" />
            </Link>
          </div>
        </div>

        <TopStories />
        <WishList />
      </div>
    </div>
  );
}
