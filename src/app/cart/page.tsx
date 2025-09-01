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
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <Link href="/">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center text-gray-800 font-bold text-lg">My Cart</h2>
        <Trash2 className="text-gray-800" />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {[1, 2, 3].map((item, index) => (
          <div
            key={index}
            className="bg-validPurple/10 rounded-xl p-4 mb-4 flex items-center gap-4"
          >
            {/* Product Image */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
              {/* Placeholder for product image */}
            </div>

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="text-gray-800 font-medium">Designer Shades</h3>
              <p className="text-gray-800 font-bold">$40</p>
              <Bookmark className="text-gray-600 mt-1" size={16} />
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center bg-validPurple rounded-full px-2 py-1">
              <button
                onClick={() => updateQuantity(index, -1)}
                className="text-white p-1"
              >
                <Minus size={16} />
              </button>
              <span className="text-white px-2 font-medium">
                {quantities[index]}
              </span>
              <button
                onClick={() => updateQuantity(index, 1)}
                className="text-white p-1"
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

        {/* Discount Code */}
        <div className="flex gap-2 mt-6">
          <Input
            placeholder="Discount code"
            className="flex-1 border border-validPurple/30 rounded-full py-4 bg-white"
          />
          <Button className="bg-validPurple p-4 rounded-full">
            <ArrowUpRight className="text-white" size={20} />
          </Button>
        </div>
      </div>

      {/* Checkout Section */}
      <div className="p-5 border-t bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-800 font-medium">Total(1)</span>
          <span className="text-gray-800 font-bold text-lg">$40</span>
        </div>
        <Link href="/checkout">
          <Button className="w-full bg-validPurple py-5 rounded-full text-lg text-white font-medium">
            Proceed To Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
