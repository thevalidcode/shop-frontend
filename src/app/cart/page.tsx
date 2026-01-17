"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  Bookmark,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CartPage = () => {
  const [quantities, setQuantities] = useState([1, 1, 1]);
  const [selectedItems, setSelectedItems] = useState([false, false, true]);

  const updateQuantity = (index: number, change: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = Math.max(1, newQuantities[index] + change);
    setQuantities(newQuantities);
  };

  const toggleSelection = (index: number) => {
    const newSelectedItems = [...selectedItems];
    newSelectedItems[index] = !newSelectedItems[index];
    setSelectedItems(newSelectedItems);
  };

  return (
    <div className="w-full h-screen space-y-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <Link href="/">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-lg font-bold text-center text-gray-800">My Cart</h2>
        <Trash2 className="text-gray-800" />
      </div>

      {/* Cart Items */}
      <div className="flex flex-row max-w-6xl gap-4 mx-auto border-0 max-sm:flex-col">
        <div className="flex-1 px-5 py-4 overflow-y-auto border rounded-md">
          {[1, 2, 3].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 mb-4 bg-validPurple/10 rounded-xl"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg">
                {/* Placeholder for product image */}
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">Designer Shades</h3>
                <p className="font-bold text-gray-800">$40</p>
                <Bookmark className="mt-1 text-gray-600" size={16} />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center px-2 py-1 rounded-full bg-validPurple">
                <button
                  onClick={() => updateQuantity(index, -1)}
                  className="p-1 text-white"
                >
                  <Minus size={16} />
                </button>
                <span className="px-2 font-medium text-white">
                  {quantities[index]}
                </span>
                <button
                  onClick={() => updateQuantity(index, 1)}
                  className="p-1 text-white"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Selection Radio */}
              <button
                onClick={() => toggleSelection(index)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedItems[index]
                    ? "bg-validPurple border-validPurple"
                    : "border-gray-300"
                }`}
              >
                {selectedItems[index] && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="px-5 space-y-4 border rounded-md w-80 max-sm:w-full">
          <div className="flex flex-col gap-2 mt-6">
            <div>
              <h1>Order summary</h1>
            </div>

            <div className="flex flex-row justify-between">
              <p className="text-sm text-slate-500">Products</p>
              <p className="text-sm text-slate-500">$8343</p>
            </div>

            <div className="flex flex-row justify-between">
              <p className="text-sm text-slate-500">Discount</p>
              <p className="text-sm text-slate-500">$993</p>
            </div>

            <div className="flex gap-2">
              {/* Discount Code */}
              <Input
                placeholder="Discount code"
                className="flex-1 py-4 bg-white border rounded-full border-validPurple/30"
              />
              <Button className="p-4 rounded-full bg-validPurple">
                <ArrowUpRight className="text-white" size={20} />
              </Button>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="p-5 bg-white border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium text-gray-800">Total(1)</span>
              <span className="text-lg font-bold text-gray-800">$40</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full py-5 text-lg font-medium text-white rounded-full bg-validPurple">
                Proceed To Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
