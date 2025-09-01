"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ResetPasswordPage = () => {
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5">
        <Link href="/auth/forgot-password">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Reset Password
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-5 justify-between h-[85%]">
        <div className="flex flex-col gap-y-5">
          {/* New Password Field */}
          <label htmlFor="newPassword" className="text-gray-800 font-medium">
            Enter New Password
            <div className="relative mt-2">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new Password"
                className="border border-validPurple/30 rounded-full py-6 pr-12 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </label>

          {/* Confirm Password Field */}
          <label
            htmlFor="confirmPassword"
            className="text-gray-800 font-medium"
          >
            Confirm Password
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border border-validPurple/30 rounded-full py-6 pr-12 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </label>
        </div>

        {/* Finish and Login Button */}
        <Button className="bg-validPurple py-5 rounded-full text-lg text-white font-medium">
          Finish and Login
        </Button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-validPurple underline cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
