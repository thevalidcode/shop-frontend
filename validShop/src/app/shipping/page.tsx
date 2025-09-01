"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ShippingPage = () => {
  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5 border-b">
        <Link href="/checkout">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Shipping Information
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-5 py-6">
        <h3 className="text-gray-800 font-medium text-lg mb-6">
          Shipping Information
        </h3>

        <div className="flex flex-col gap-y-6">
          {/* Shipping Address */}
          <label
            htmlFor="shippingAddress"
            className="text-gray-800 font-medium"
          >
            Shipping Address
            <Input
              id="shippingAddress"
              type="text"
              placeholder="Shipping Address"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>

          {/* Phone Number/Email Address */}
          <label htmlFor="phoneEmail" className="text-gray-800 font-medium">
            Phone Number/Email Address
            <Input
              id="phoneEmail"
              type="text"
              placeholder="Phone number/Email Address"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-5 border-t bg-white">
        <Link href="/checkout-with-shipping">
          <Button className="w-full bg-validPurple py-5 rounded-full text-lg text-white font-medium">
            Save and Continue
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ShippingPage;
