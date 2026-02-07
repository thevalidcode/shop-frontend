import { ProductsGridHome } from "./components/products-grid-home";
import { FaqSection } from "./components/faq";
import { BannerSection } from "./components/banner-section";
import { HomeOnboarding } from "./components/home-onboarding";
import { ProductsShowcase } from "./components/products-showcase";
import { CartDrawer } from "../client/products/components/CartDrawer";

export default function Home() {
  return (
    <div className="pt-10 md:pt-20">
      <HomeOnboarding />
      <ProductsGridHome />
      <BannerSection />
      <ProductsShowcase />
      <FaqSection />
      <CartDrawer />
    </div>
  );
}
