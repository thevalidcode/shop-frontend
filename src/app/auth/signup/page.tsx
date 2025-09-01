"use client";
import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5">
        <Link href="/auth">
          <ArrowLeft className="text-gray-800" />
        </Link>
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Sign Up
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-5 justify-between h-[85%]">
        <div className="flex flex-col gap-y-5">
          {/* Name Field */}
          <label htmlFor="name" className="text-gray-800 font-medium">
            Name
            <Input
              id="name"
              type="text"
              placeholder="Name"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>

          {/* Email Field */}
          <label htmlFor="email" className="text-gray-800 font-medium">
            Email Address
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>

          {/* Password Field */}
          <label htmlFor="password" className="text-gray-800 font-medium">
            Password
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border border-validPurple/30 rounded-full py-6 pr-12 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </label>
        </div>

        {/* Sign Up Button */}
        <Button className="bg-validPurple py-5 rounded-full text-lg text-white font-medium">
          Sign Up
        </Button>

        {/* Login Link */}
        <p className="text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/auth"
            className="text-validPurple underline cursor-pointer"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
