"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5">
        <Link href="/auth">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Forgot Password
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-5 justify-between h-[85%]">
        <div className="flex flex-col gap-y-6">
          {/* Instruction Text */}
          <p className="text-gray-700 text-left leading-relaxed">
            Kindly enter the email address registered with this account to reset
            your password
          </p>

          {/* Email Input */}
          <label htmlFor="email" className="text-gray-800 font-medium">
            Email Address
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>
        </div>

        {/* Send Code Button */}
        <Button className="bg-validPurple py-5 rounded-full text-lg text-white font-medium">
          Send Code
        </Button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
