// This file consist of hero section too

import { NavLink } from "react-router-dom";

function Navbar() {
  const menuItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Shop",
      link: "shop",
    },
    {
      name: "Categories",
      link: "categories",
    },
    {
      name: "Vendors",
      link: "vendors",
    },
    {
      name: "Contact",
      link: "contact",
    },
  ];

  return (
    <>
      {/* ========== HEADER ========== */}
      <div className="">
        <header className="z-50 flex w-full flex-wrap py-7 lg:flex-nowrap lg:justify-start">
          <nav className="relative mx-auto flex w-full max-w-7xl basis-full flex-wrap items-center px-4 md:px-6 lg:grid lg:grid-cols-12 lg:px-8">
            <div className="flex items-center lg:col-span-3">
              {/* Logo */}
              <a
                className="from-validGreen inline-block flex-none bg-gradient-to-r to-green-900 bg-clip-text text-xl font-bold text-transparent uppercase focus:opacity-80 focus:outline-hidden"
                href="../templates/creative-agency/index.html"
                aria-label="Preline"
              >
                Valid Shop
              </a>
              {/* End Logo */}

              <div className="ms-1 sm:ms-2"></div>
            </div>

            {/* Button Group */}
            <div className="ms-auto flex items-center gap-x-1 py-1 lg:order-3 lg:col-span-3 lg:gap-x-2 lg:ps-6">
              <button
                type="button"
                className="inline-flex items-center gap-x-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-nowrap text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              >
                Sign in
              </button>
              <button
                type="button"
                className="bg-validGreen inline-flex items-center gap-x-2 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-nowrap text-black text-white transition hover:bg-lime-500 focus:bg-lime-500 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              >
                Get started
              </button>

              <div className="lg:hidden">
                <button
                  type="button"
                  className="hs-collapse-toggle flex size-9.5 items-center justify-center rounded-xl border border-gray-200 text-sm font-semibold text-black hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                  id="hs-navbar-hcail-collapse"
                  aria-expanded="false"
                  aria-controls="hs-navbar-hcail"
                  aria-label="Toggle navigation"
                  data-hs-collapse="#hs-navbar-hcail"
                >
                  <svg
                    className="hs-collapse-open:hidden size-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                  <svg
                    className="hs-collapse-open:block hidden size-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* End Button Group */}

            {/* Collapse */}
            <div
              id="hs-navbar-hcail"
              className="hs-collapse hidden grow basis-full overflow-hidden transition-all duration-300 lg:order-2 lg:col-span-6 lg:block lg:w-auto lg:basis-auto"
              aria-labelledby="hs-navbar-hcail-collapse"
            >
              <div className="mt-5 flex flex-col gap-x-0 gap-y-4 lg:mt-0 lg:flex-row lg:items-center lg:justify-center lg:gap-x-7 lg:gap-y-0">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    <ul>
                      <li>
                        <NavLink
                          className={({ isActive }) =>
                            `relative inline-block text-black ${isActive ? "w-full rounded-md bg-gray-200 px-2 py-1" : ""}`
                          }
                          to={item.link}
                          aria-current={item.name}
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            {/* End Collapse */}
          </nav>
        </header>
      </div>

      {/* ========== END HEADER ========== */}
    </>
  );
}

export default Navbar;
