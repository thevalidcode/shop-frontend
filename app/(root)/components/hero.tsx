"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  Package,
  Truck,
  Shield,
  Clock,
} from "lucide-react";
import { TypographyH1, TypographyP } from "@/components/typography";

export function HeroSection() {
  const features = [
    { icon: Truck, label: "Fast Shipping", desc: "Delivered within 24-48 hours" },
    { icon: Shield, label: "Secure Payment", desc: "100% encrypted transactions" },
    { icon: Star, label: "Quality Guarantee", desc: "Premium products only" },
    { icon: Clock, label: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
      />

      {/* Main Hero Content */}

      {/* Main Hero Content */}
      <div className="relative min-h-screen grid place-items-center z-10 pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit"
              >
                <Star className="w-4 h-4 fill-current" />
                Welcome to Premium Shopping
                <TrendingUp className="w-4 h-4" />
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <TypographyH1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                    Shop Quality,
                  </span>
                  <br />
                  <span className="text-primary">Not Quantity</span>
                </TypographyH1>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <TypographyP className="text-lg sm:text-xl text-muted-foreground max-w-xl">
                  Discover a curated collection of premium products handpicked for quality, value, and reliability. Shop with confidence knowing every item meets our high standards.
                </TypographyP>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/client/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full group px-8 py-6 text-base font-semibold">
                    Explore Products
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/client/faq" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full px-8 py-6 text-base font-semibold">
                    Learn More
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="grid grid-cols-2 gap-6 pt-8 border-t border-border/50"
              >
                <div>
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-sm text-muted-foreground">Authentic Products</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">Instant</p>
                  <p className="text-sm text-muted-foreground">Digital Delivery</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Large Package Icon with Animation */}
                <div className="relative w-full aspect-square">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div className="relative">
                      <div className="w-64 h-64 bg-linear-to-br from-primary/20 to-blue-500/20 rounded-3xl blur-2xl absolute inset-0" />
                      <div className="relative w-64 h-64 bg-linear-to-br from-primary to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center">
                        <Package className="w-32 h-32 text-white opacity-80" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-2xl border border-yellow-400/50 backdrop-blur-md flex items-center justify-center"
                >
                  <Zap className="w-10 h-10 text-yellow-500" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [10, -10, 10],
                    x: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-10 -left-10 w-20 h-20 bg-green-400/20 rounded-2xl border border-green-400/50 backdrop-blur-md flex items-center justify-center"
                >
                  <Shield className="w-10 h-10 text-green-500" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 20, 0],
                    x: [10, -10, 10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute top-1/2 -right-20 w-20 h-20 bg-blue-400/20 rounded-2xl border border-blue-400/50 backdrop-blur-md flex items-center justify-center"
                >
                  <Star className="w-10 h-10 text-blue-500 fill-current" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
