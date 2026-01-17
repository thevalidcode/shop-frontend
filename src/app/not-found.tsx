"use client";

import React from "react";
import { Button } from "@heroui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import errorImage from "@public/errorImage.png";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full px-5 py-5 space-y-6 border-0">
      <div className="relative flex flex-row pt-10 space-x-3 items-center w-full max-sm:w-full border-0">
        <Button variant="bordered" className="absolute border-0 rounded-full">
          <MoveLeft strokeWidth={2} onClick={() => router.back()} />
        </Button>
      </div>

      <div className="flex flex-col space-y-10 border-0 items-center justify-center font-medium text-2xl w-full">
        <p className="border-0 text-center text-[#5F0DB3] font-normal text-4xl">
          ERROR 404
        </p>

        <Image
          src={errorImage}
          alt="error-image"
          quality={100}
          priority
          className="w-60 h-60 object-contain"
        />

        <p className="text-[#5F0DB3] w-60 text-center">
          Fashion Emergency Page not found
        </p>

        <Link href="/">
          <Button className="bg-[#5F0DB3] font-normal text-base text-white rounded-full">
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
