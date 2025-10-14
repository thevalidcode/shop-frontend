"use client";

import { Button, ButtonGroup } from "@heroui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LegalPage() {
  const router = useRouter();

  const terms = [
    {
      id: 1,
      text: "Please read these terms and conditions carefully. Please read these terms and conditions carefully Please read these terms and conditions carefully Please read these terms and conditions carefully",
    },
    {
      id: 2,
      text: "Please read these terms and conditions carefully. Please read these terms and conditions carefully Please read these terms and conditions carefully Please read these terms and conditions carefully",
    },
    {
      id: 3,
      text: "Please read these terms and conditions carefully. Please read these terms and conditions carefully Please read these terms and conditions carefully Please read these terms and conditions carefully",
    },
    {
      id: 4,
      text: "Please read these terms and conditions carefully. Please read these terms and conditions carefully Please read these terms and conditions carefully Please read these terms and conditions carefully",
    },
    {
      id: 5,
      text: "Please read these terms and conditions carefully. Please read these terms and conditions carefully Please read these terms and conditions carefully Please read these terms and conditions carefully",
    },
  ];
  return (
    <div className="flex flex-col items-center w-full px-5 py-5 space-y-6 border-0">
      <div className="relative flex flex-col pt-8 space-y-8 items-center w-full max-sm:w-full border-0">
        <Button
          variant="bordered"
          className="absolute border-0 rounded-full left-0 top-5"
        >
          <MoveLeft strokeWidth={2} onClick={() => router.back()} />
        </Button>

        <Link href="#" className="absolute right-0 top-5 underline">
          <p className="text-validPurple font-extralight text-lg text-center">
            Help
          </p>
        </Link>

        <div className="flex flex-col space-y-1 border-0 items-center justify-center font-medium text-2xl w-full">
          <h1 className="border-0 text-center font-normal text-2xl">
            Terms & Conditions
          </h1>

          <div
            className="bg-[#FAEFFF] px-4 py-4 mt-8 rounded-2xl space-y-4 w-3xl max-sm:w-full
            max-sm:text-left border"
          >
            {terms.map((t) => (
              <div className="flex flex-row space-x-2" key={t.id}>
                <p className="text-base font-light">{t.id}.</p>
                <p className="text-base font-light">{t.text}&&</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-1 border-0 items-center justify-center font-medium text-2xl w-full">
          <h1 className="border-0 text-center font-normal text-2xl">
            Shipping & Return Policy
          </h1>

          <div
            className="bg-[#FAEFFF] px-4 py-4 mt-8 rounded-2xl space-y-4 w-3xl max-sm:w-full
            max-sm:text-left border"
          >
            {terms.map((t) => (
              <div className="flex flex-row space-x-2" key={t.id}>
                <p className="text-base font-light">{t.id}.</p>
                <p className="text-base font-light">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-1 border-0 items-center justify-center font-medium text-2xl w-full">
          <h1 className="border-0 text-center font-normal text-2xl">
            Privacy Policy
          </h1>

          <div
            className="bg-[#FAEFFF] px-4 py-4 mt-8 rounded-2xl space-y-4 w-3xl max-sm:w-full
            max-sm:text-left border"
          >
            {terms.map((t) => (
              <div className="flex flex-row space-x-2" key={t.id}>
                <p className="text-base font-light">{t.id}.</p>
                <p className="text-base font-light">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        <ButtonGroup className="flex flex-col space-y-2 w-80 max-sm:w-full border">
          <Button className="bg-[#5f0BD3] rounded-full text-white font-medium w-full">
            Agree
          </Button>
          <Button className="bg-[#5f0BD3] rounded-full text-white font-medium w-full">
            Disagree
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
