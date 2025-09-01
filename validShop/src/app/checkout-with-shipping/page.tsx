"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CheckoutWithShippingPage = () => {
  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5 border-b">
        <Link href="/checkout">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Checkout
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Shipping Information */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-800 font-medium">Shipping Information</h3>
            <span className="text-validPurple underline cursor-pointer">
              Edit
            </span>
          </div>
          <div className="text-gray-700 space-y-1">
            <p>Name: Jenny</p>
            <p>Phone Number: 08035367232</p>
            <p>Address: 2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-800 font-medium">Order Summary</h3>
            <span className="text-validPurple underline cursor-pointer">
              Edit
            </span>
          </div>

          {/* Product Card */}
          <div className="bg-validPurple/10 rounded-xl p-4 flex items-center gap-4">
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
              {/* Placeholder for product image */}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h4 className="text-gray-800 font-medium">Designer Shades</h4>
              <p className="text-gray-800 font-bold">$40</p>
            </div>

            {/* Quantity */}
            <span className="text-gray-500">x1</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="p-5 border-t bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-800 font-medium">Total</span>
          <span className="text-gray-800 font-bold text-lg">$40</span>
        </div>
        <Button className="w-full bg-validPurple py-5 rounded-full text-lg text-white font-medium">
          Make Payment
        </Button>
      </div>
    </div>
  );
};

export default CheckoutWithShippingPage;
