import { Button } from "@heroui/button";
import { Input } from "../ui/input";
import Link from "next/link";

export default function FooterLinks() {
  return (
    <div
      className="w-full grid grid-cols-3 max-sm:grid-cols-1 px-10 py-5 max-sm:px-4 max-sm:gap-y-10
       border-0"
    >
      <div className="flex flex-col items-center justify-center border-0">
        <h1 className="text-white font-medium text-xl leading-6 pb-5">SHOP</h1>
        <ul className="flex flex-col space-y-2 text-center text-white">
          <Link href="#" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">NEW IN</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="#" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">WOMEN</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="#" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">MEN</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="#" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">KIDS</li>
          </Link>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center border-0">
        <h1 className="text-white font-medium text-xl leading-6 pb-5">
          NAVIGATE
        </h1>
        <ul className="flex flex-col space-y-2 text-center text-xl text-white font-light">
          <Link href="#" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">MY ACCOUNT</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="/faq" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">FAQ</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="/contact-us" className="flex flex-col items-center gap-2">
            <li className="font-light text-xl leading-6">CONTACT</li>
            <div className="border-b w-18"></div>
          </Link>

          <Link href="#" className="flex flex-col items-center gap-2">
            <li>ABOUT</li>
          </Link>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 border-0">
        <h1 className="text-white font-light leading-6 text-xl pb-5">
          NEWSLETTER
        </h1>
        <p className="text-xl font-light leading-6 text-center text-white">
          Subscribe For 10% Off Your First Order
        </p>

        <div className="flex flex-row space-x-2 max-sm:flex-col max-sm:space-y-2 max-sm:w-full items-center">
          <Input
            type="email"
            name="email"
            placeholder="Your email address..."
            className="bg-white rounded-full py-6 text-slate-500 font-normal text-xl !shadow-none 
            !ring-none !border-none active:ring-none"
          />

          <Button
            variant="bordered"
            className="bg-white text-[#5F0DB3] rounded-full px-8 font-medium text-base max-sm:w-fit"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
