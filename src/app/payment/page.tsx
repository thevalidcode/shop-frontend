"use client";
import React, { useState } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: "paypal",
      name: "PayPal",
      icon: "💳", // PayPal icon placeholder
      description: "Paypal",
    },
    {
      id: "applepay",
      name: "Apple Pay",
      icon: "🍎", // Apple icon placeholder
      description: "Apple Pay",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "📱", // Google Pay icon placeholder
      description: "Google Pay",
    },
    {
      id: "card",
      name: "Credit Card",
      icon: <CreditCard className="text-gray-800" size={24} />,
      description: "**** **** **** 4353",
    },
  ];

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5 border-b">
        <Link href="/checkout">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Payment Method
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {/* Payment Options */}
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-validPurple/10 rounded-xl p-4 flex items-center justify-between cursor-pointer"
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{method.icon}</div>
                <span className="text-gray-800 font-medium">
                  {method.description}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === method.id
                    ? "bg-validPurple border-validPurple"
                    : "border-gray-300"
                }`}
              >
                {selectedPayment === method.id && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add New Card Link */}
        <div className="text-right mb-6">
          <span className="text-validPurple underline cursor-pointer">
            Add New Card
          </span>
        </div>
      </div>

      {/* Payment Section */}
      <div className="p-5 border-t bg-white">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-800 font-medium">Total</span>
          <span className="text-gray-800 font-bold text-lg">$40</span>
        </div>
        <Link href="/order-tracking-details">
          <Button className="w-full bg-validPurple py-5 rounded-full text-lg text-white font-medium">
            Make Payment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentPage;
