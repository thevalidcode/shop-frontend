import Image from "next/image";
import React from "react";

import shade1 from "@public/assets/footer/shade1.png";
import shade2 from "@public/assets/footer/shade2.png";
import shade3 from "@public/assets/footer/shade3.png";
import FooterLinks from "./FooterLinks";
import storeLogo from "@public/assets/footer/storeLogo.png";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center w-full space-y-6">
      <div className="w-full flex flex-col px-5 py-5">
        <div className="flex flex-col text-center lg:hidden">
          <h1 className="text-[#5F0DB3] font-medium text-4xl">MORE TO LOVE</h1>
          <p className="text-base font-extralight">up to 30% off</p>
        </div>

        <div className="w-full flex flex-col space-y-4 border-0 items-center justify-center py-2 lg:hidden">
          <div className="border-0">
            <Image
              src={shade1}
              alt="shade-1"
              placeholder="blur"
              className="object-cover"
            />
          </div>

          <div className="border-0">
            <Image
              src={shade2}
              alt="shade-2"
              placeholder="blur"
              className="object-cover"
            />
          </div>
          <div className="border-0">
            <Image
              src={shade3}
              alt="shade-3"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center border-0">
          <Image src={storeLogo} alt="store-logo" className="w-24 h-24" />

          <p className="text-xl max-sm:w-64 font-light text-slate-500 text-center border-0">
            TIM&TOM is a place where one can feel whole,{" "}
            <span className="text-[#5F0DB3]">good and complete</span> in their
            unique and beautiful body.
          </p>
        </div>
      </div>

      <div className="w-full bg-[#5F0DB3] border-0">
        <FooterLinks />
      </div>
    </footer>
  );
}
