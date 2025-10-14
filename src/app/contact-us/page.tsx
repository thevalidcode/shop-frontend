"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@heroui/button";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@heroui/input";

export default function ContactUs() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full px-5 py-5 space-y-6 border-0">
      <div className="relative flex flex-row pt-8 space-x-3 items-center w-full max-sm:w-full border-0">
        <Button variant="bordered" className="absolute border-0 rounded-full">
          <MoveLeft strokeWidth={2} onClick={() => router.back()} />
        </Button>

        <div className="flex flex-row space-x-1 border-0 items-center justify-center font-medium text-2xl w-full">
          <p className="border-0 text-center">Contact Us</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 py-8 px-8 max-sm:px-0 max-sm:border-0 border rounded-2xl max-sm:mx-auto max-sm:my-auto">
        <p className="font-normal text-2xl text-[#5F0DB3]">
          We would love to hear from you!
        </p>

        <label
          htmlFor="name"
          className="flex flex-col gap-0.5 text-gray-800 text-sm font-extralight"
        >
          Name
          <Input
            type="text"
            id="name"
            placeholder="Name"
            className="bg-white border border-validPurple/30 rounded-full py-5"
          />
        </label>

        <label
          htmlFor="email"
          className="flex flex-col gap-0.5 text-gray-800 text-sm font-extralight"
        >
          Email Address
          <Input
            type="email"
            id="email"
            placeholder="Email address"
            className="bg-white border border-validPurple/30 rounded-full py-5"
          />
        </label>

        <label
          htmlFor="message"
          className="flex flex-col gap-0.5 text-gray-800 text-sm font-extralight"
        >
          Message
          <textarea
            id="message"
            placeholder="Type your mesaage here..."
            className="bg-white border border-validPurple/30 rounded-xl py-5 px-2 focus:outline-none"
          />
        </label>

        <Button
          variant="bordered"
          type="submit"
          className="bg-[#5F0DB3] rounded-full py-6 text-white text-base mt-5"
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}
