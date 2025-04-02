import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const footerLinks = [
    {
      id: 1,
      title: "About Valid Shop",
      links: [
        {
          menu: "About Us",
          slug: "/about-us",
        },
        {
          menu: "Delivery Information",
          slug: "/delivery-information",
        },
        {
          menu: "Privacy Policy",
          slug: "/privacy-policy",
        },
        {
          menu: "Contact Us",
          slug: "/contact-us",
        },
        {
          menu: "Brands",
          slug: "/brands",
        },
      ],
    },
    {
      id: 2,
      title: "Customer Information",
      links: [
        {
          menu: "My Account",
          slug: "/my-account",
        },
        {
          menu: "Order History",
          slug: "/order-history",
        },
        {
          menu: "Wishlist",
          slug: "/wishlist",
        },
        {
          menu: "Returns",
          slug: "/returns",
        },
        {
          menu: "Site Map",
          slug: "/site-map",
        },
      ],
    },
    {
      id: 3,
      title: " Help & Support ",
      links: [
        {
          menu: "Order Tracking",
          slug: "/order-tracking",
        },
        {
          menu: "Terms & Conditions",
          slug: "/terms-and-conditions",
        },

        {
          menu: "Privacy Policy",
          slug: "/privacy-policy",
        },
        {
          menu: "Contact Us",
          slug: "/contact-us",
        },
        {
          menu: "FAQ",
          slug: "/frequently-asked-questions",
        },
      ],
    },
    {
      id: 4,
      title: "Payment Methods",
      links: [
        {
          menu: "Paypal",
          slug: "/paypal",
        },
        {
          menu: "Stripe",
          slug: "/stripe",
        },

        {
          menu: "Bank Transfer",
          slug: "/bank-transfer",
        },
        {
          menu: "Credit Card",
          slug: "/credit-card",
        },
        {
          menu: "Bitcoin",
          slug: "/bitcoin",
        },
      ],
    },
  ];

  const mobileStickyFooters = [
    {
      id: 1,
      menu: "Home",
      slug: "/",
      icon: <i class="bx bx-home"></i>,
    },
    {
      id: 2,
      menu: "Shop",
      slug: "/shop",
      icon: <i class="bx bx-store"></i>,
    },
    {
      id: 3,
      menu: "Cart",
      slug: "/cart",
      icon: <i class="bx bx-cart"></i>,
    },
    {
      id: 4,
      menu: "Wishlist",
      slug: "/wishlist",
      icon: <i class="bx bx-heart"></i>,
    },
    {
      id: 5,
      menu: "My Account",
      slug: "/my-account",
      icon: <i class="bx bx-user"></i>,
    },
  ];
  return (
    <>
      <div className="mt-20 grid grid-cols-2 gap-y-5 border-t border-gray-200 px-5 pt-3 md:grid-cols-4 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          {footerLinks.slice(0, 1).map((aboutFooterLink) => (
            <div key={aboutFooterLink.id}>
              <h3 className="mb-2 text-lg font-medium">
                {" "}
                {aboutFooterLink.title}{" "}
              </h3>
              <div className="flex flex-col gap-2">
                {aboutFooterLink.links.map((aboutFooterMenus) => (
                  <NavLink
                    to={`${aboutFooterMenus.slug}`}
                    className="text-gray-600"
                  >
                    {aboutFooterMenus.menu}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {footerLinks.slice(1, 2).map((customerInfoFooterLink) => (
            <div key={customerInfoFooterLink.id}>
              <h3 className="mb-2 text-lg font-medium">
                {customerInfoFooterLink.title}{" "}
              </h3>
              <div className="flex flex-col gap-2">
                {customerInfoFooterLink.links.map((customerInfoFooterMenus) => (
                  <NavLink
                    to={`${customerInfoFooterMenus.slug}`}
                    className="text-gray-600"
                  >
                    {customerInfoFooterMenus.menu}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {footerLinks.slice(2, 3).map((helpSupportFooterLink) => (
            <div key={helpSupportFooterLink.id}>
              <h3 className="mb-2 text-lg font-medium">
                {helpSupportFooterLink.title}{" "}
              </h3>
              <div className="flex flex-col gap-2">
                {helpSupportFooterLink.links.map((helpSupportFooterMenus) => (
                  <NavLink
                    to={`${helpSupportFooterMenus.slug}`}
                    className="text-gray-600"
                  >
                    {helpSupportFooterMenus.menu}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {footerLinks.slice(3, 4).map((paymentMethodsFooterLink) => (
            <div key={paymentMethodsFooterLink.id}>
              <h3 className="mb-2 text-lg font-medium">
                {paymentMethodsFooterLink.title}{" "}
              </h3>
              <div className="flex flex-col gap-2">
                {paymentMethodsFooterLink.links.map(
                  (paymentMethodsFooterMenus) => (
                    <NavLink
                      to={`${paymentMethodsFooterMenus.slug}`}
                      className="text-gray-600"
                    >
                      {paymentMethodsFooterMenus.menu}
                    </NavLink>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium"> Newsletter</h3>
          <input
            type="email"
            className="mb-2 h-10 w-full rounded border border-gray-300 px-2"
            placeholder="Enter your email"
          />
          <button className="w-full bg-black py-2 text-center text-white">
            Subscribe
          </button>
          <input type="checkbox" name="checkbox" id="checkbox" />
          <label htmlFor="checkbox" className="mx-2">
            I have read and agree to the
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          </label>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed right-0 bottom-0 left-0 z-40 bg-white p-5 shadow-md md:hidden">
        <div className="flex justify-between">
          {mobileStickyFooters.map((mobileStickyFooter) => (
            <NavLink
              to={`${mobileStickyFooter.slug}`}
              className="flex flex-col items-center"
            >
              {mobileStickyFooter.icon}
              {mobileStickyFooter.menu}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Footer;
