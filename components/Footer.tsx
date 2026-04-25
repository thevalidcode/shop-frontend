"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useAppContext } from "@/context/appContext";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Country } from "country-state-city";

export function Footer() {
  const { generalSetting, shopInfo } = useAppContext();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const apiAccessAllowed = shopInfo?.features?.api_access ?? false;
  const showBranding = generalSetting?.showBanner ?? false;

  const handleSubscription = () => {
    if (!email) {
      toast.error("Invalid email");
      return;
    }
    toast.warning("Coming soon...");
  };

  // Format address for display
  const hasAddress =
    generalSetting?.shopStreet ||
    generalSetting?.shopCity ||
    generalSetting?.shopState ||
    generalSetting?.shopPostalCode ||
    generalSetting?.shopCountry;

  const getCountryName = (isoCode?: string) => {
    if (!isoCode) return "";
    const country = Country.getCountryByCode(isoCode);
    return country?.name || isoCode;
  };

  const formatAddress = () => {
    const parts = [];
    if (generalSetting?.shopStreet) parts.push(generalSetting.shopStreet);
    if (generalSetting?.shopCity) parts.push(generalSetting.shopCity);
    if (generalSetting?.shopState) parts.push(generalSetting.shopState);
    if (generalSetting?.shopPostalCode)
      parts.push(generalSetting.shopPostalCode);
    if (generalSetting?.shopCountry)
      parts.push(getCountryName(generalSetting.shopCountry));
    return parts.join(", ");
  };

  return (
    <footer className="bg-muted/10 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              {generalSetting?.logoUrl && (
                <Image
                  src={generalSetting.logoUrl}
                  alt={generalSetting.shopName || "Shop"}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              )}
              <span className="font-bold text-lg">
                {generalSetting?.shopName || "Shop"}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {generalSetting?.shopDescription ||
                "Your trusted shop for quality products and exceptional service."}
            </p>
            {hasAddress && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatAddress())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {formatAddress()}
                </Link>
              </div>
            )}
            {generalSetting?.shopPhone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <Link
                  href={`tel:${generalSetting.shopPhone}`}
                  className="hover:text-primary transition-colors"
                >
                  {generalSetting.shopPhone}
                </Link>
              </div>
            )}
            <div className="flex gap-3">
              {generalSetting && generalSetting.facebookUrl && (
                <Link
                  target="_blank"
                  href={generalSetting?.facebookUrl}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
              )}
              {generalSetting && generalSetting.xUrl && (
                <Link
                  target="_blank"
                  href={generalSetting?.xUrl}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaXTwitter className="w-4 h-4" />
                </Link>
              )}
              {generalSetting && generalSetting.instagramUrl && (
                <Link
                  target="_blank"
                  href={generalSetting?.instagramUrl}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
              )}
              {generalSetting && generalSetting.youtubeUrl && (
                <Link
                  href={generalSetting?.youtubeUrl}
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </Link>
              )}
              {generalSetting && generalSetting.tiktokUrl && (
                <Link
                  target="_blank"
                  href={generalSetting?.tiktokUrl}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <FaTiktok className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/client/products"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/client/blog"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/client/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/client/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support
                </Link>
              </li>
              {apiAccessAllowed && (
                <li>
                  <Link
                    href="/client/api-docs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    API Docs
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/client/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/client/support"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Support Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers and updates.
            </p>
            <form onSubmit={handleSubscription} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                title="mail"
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 shrink-0"
              >
                <Mail className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} {generalSetting?.shopName || "Shop"}. All rights
            reserved.
          </p>
          {showBranding && (
            <Link
              href="https://validpanel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 self-center rounded-full border border-border/70 bg-background/80 px-4 py-2 text-sm shadow-sm backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/5 sm:self-auto"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Built with
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
                  <Image
                    src="/images/validpanel.jpeg"
                    alt="ValidPanel"
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
                  ValidPanel
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
