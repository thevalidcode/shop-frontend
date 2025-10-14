"use client";

import Image from "next/image";
import featuredProducts, {
  type FeaturedProducts,
} from "@/components/product/product";
import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@heroui/input";
import { Button, ButtonGroup } from "@heroui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Minus, MoveLeft, Plus, Search } from "lucide-react";
import SimilarProduct from "@/components/product/SimilarProduct";
import Link from "next/link";
import ProdDetails from "@/components/product/ProdDetails";

export default function ProductDetails() {
  const router = useRouter();

  const params = useSearchParams();

  const prodId = params.get("id");

  return (
    <div className="flex flex-col items-center w-full px-5 py-5 space-y-6">
      <div className="flex flex-row space-x-3 items-center min-w-80 max-sm:w-full border-0">
        <Button variant="bordered" className="border-0 rounded-full">
          <MoveLeft strokeWidth={2} onClick={() => router.back()} />
        </Button>

        <div className="flex flex-row space-x-1 border rounded-full items-center px-2.5 w-full">
          <Search size={25} color="#5F0DB3" />
          <Input
            type="text"
            value=""
            placeholder="search by category, price..."
            variant="underlined"
            className="!border-none flex !shadow-none !ring-none rounded-full !outline-none text-base font-light"
          />
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ProdDetails prodId={prodId} />
      </Suspense>

      <SimilarProduct />
    </div>
  );
}
