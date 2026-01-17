"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AuthPage = () => {
  return (
    <div className="w-full h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-5">
        <ArrowLeft className="text-gray-800" />
        <h2 className="text-center w-full text-gray-800 font-bold text-lg">
          Login
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-5 justify-between h-[85%]">
        <div className="flex flex-col gap-y-5">
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
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="border border-validPurple/30 rounded-full py-6 mt-2 bg-white"
            />
          </label>

          {/* Forgot Password Link */}
          <Link
            href="/auth/forgot-password"
            className="text-validPurple text-right block"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button className="bg-validPurple py-5 rounded-full text-lg text-white font-medium">
          Login
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

export default AuthPage;
