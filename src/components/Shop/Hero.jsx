import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const categoryMenus = [
    {
      id: 1,
      item: "Computer and Laptop",
      icon: <i class="bx bx-laptop"></i>,
    },
    {
      id: 2,
      item: "Camera and Videos",
      icon: <i class="bx bx-camera"></i>,
    },
    {
      id: 3,
      item: "Television",
      icon: <i class="bx bx-tv"></i>,
    },
    {
      id: 4,
      item: "Smartwatches",
      icon: <i class="bx bxs-watch"></i>,
    },
    {
      id: 5,
      item: "Gaming",
      icon: <i class="bx bx-game"></i>,
    },
    {
      id: 6,
      item: "Mobile and Tablets",
      icon: <i class="bx bx-tab"></i>,
    },
    {
      id: 7,
      item: "Headphone",
      icon: <i class="bx bx-headphone"></i>,
    },
    {
      id: 8,
      item: "Accessories",
      icon: <i class="bx bx-mouse-alt"></i>,
    },
    {
      id: 9,
      item: "Best Sellers",
      icon: <i class="bx bx-trending-up"></i>,
    },
    {
      id: 10,
      item: "Top 100 Offers",
      icon: <i class="bx bx-bookmark"></i>,
    },
    {
      id: 10,
      item: "Top 100 Offers",
      icon: <i class="bx bx-bookmark"></i>,
    },
  ];

  const heroCarousel = [
    {
      id: 1,
      img: "/src/assets/homeShop-carousel.jpg",
      title: "Product Title 1",
      des: "Product Description 1",
    },
    {
      id: 2,
      img: "https://images.pexels.com/photos/19803079/pexels-photo-19803079/free-photo-of-woman-drinking-coffee-with-milk.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
      title: "Product Title 2",
      des: "Product Description 2",
    },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  });

  return (
    <>
      <div className="mb-1 flex h-13 w-full bg-black">
        <div className="mx-5 flex gap-2 text-white">
          {isMobile ? (
            <div className="flex cursor-pointer items-center bg-[#333333] px-5 select-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                id="Dashboard-3--Streamline-Core"
                height={20}
                width={20}
              >
                <desc>
                  {"Dashboard 3 Streamline Icon: https://streamlinehq.com"}
                </desc>
                <g id="dashboard-3--app-application-dashboard-home-layout-vertical">
                  <path
                    id="Vector"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 6.5H9c-0.27614 0 -0.5 0.22386 -0.5 0.5v6c0 0.2761 0.22386 0.5 0.5 0.5h4c0.2761 0 0.5 -0.2239 0.5 -0.5V7c0 -0.27614 -0.2239 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_2"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 0.5H9c-0.27614 0 -0.5 0.223858 -0.5 0.5v2.01c0 0.27614 0.22386 0.5 0.5 0.5h4c0.2761 0 0.5 -0.22386 0.5 -0.5V1c0 -0.276142 -0.2239 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_3"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 0.5H1C0.723858 0.5 0.5 0.723858 0.5 1v6c0 0.27614 0.223858 0.5 0.5 0.5h4c0.27614 0 0.5 -0.22386 0.5 -0.5V1c0 -0.276142 -0.22386 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_4"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10.49H1c-0.276142 0 -0.5 0.2238 -0.5 0.5V13c0 0.2761 0.223858 0.5 0.5 0.5h4c0.27614 0 0.5 -0.2239 0.5 -0.5v-2.01c0 -0.2762 -0.22386 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                </g>
              </svg>
              <NavLink to="/categories" className="ms-2 me-1">
                Categories
              </NavLink>
            </div>
          ) : (
            <div
              className="flex cursor-pointer items-center bg-[#333333] px-5 select-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
                id="Dashboard-3--Streamline-Core"
                height={20}
                width={20}
              >
                <desc>
                  {"Dashboard 3 Streamline Icon: https://streamlinehq.com"}
                </desc>
                <g id="dashboard-3--app-application-dashboard-home-layout-vertical">
                  <path
                    id="Vector"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 6.5H9c-0.27614 0 -0.5 0.22386 -0.5 0.5v6c0 0.2761 0.22386 0.5 0.5 0.5h4c0.2761 0 0.5 -0.2239 0.5 -0.5V7c0 -0.27614 -0.2239 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_2"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 0.5H9c-0.27614 0 -0.5 0.223858 -0.5 0.5v2.01c0 0.27614 0.22386 0.5 0.5 0.5h4c0.2761 0 0.5 -0.22386 0.5 -0.5V1c0 -0.276142 -0.2239 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_3"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 0.5H1C0.723858 0.5 0.5 0.723858 0.5 1v6c0 0.27614 0.223858 0.5 0.5 0.5h4c0.27614 0 0.5 -0.22386 0.5 -0.5V1c0 -0.276142 -0.22386 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                  <path
                    id="Vector_4"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10.49H1c-0.276142 0 -0.5 0.2238 -0.5 0.5V13c0 0.2761 0.223858 0.5 0.5 0.5h4c0.27614 0 0.5 -0.2239 0.5 -0.5v-2.01c0 -0.2762 -0.22386 -0.5 -0.5 -0.5Z"
                    strokeWidth={1}
                  />
                </g>
              </svg>
              <p className="ms-2 me-1">Categories</p>
            </div>
          )}

          <div className="flex items-center bg-[#333333] px-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
              id="Tag--Streamline-Core"
              className="-rotate-90"
              height="20"
              width="20"
            >
              <desc>Tag Streamline Icon: https://streamlinehq.com</desc>
              <g id="tag--tags-bookmark-favorite">
                <path
                  id="Vector"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m0.71901 9.39099 3.89 3.89001c0.14063 0.1404 0.33125 0.2193 0.53 0.2193 0.19875 0 0.38938 -0.0789 0.53 -0.2193L13.389 5.56099c0.0388 -0.03708 0.0688 -0.08237 0.0878 -0.13255 0.0191 -0.05017 0.0266 -0.10397 0.0222 -0.15745l-0.59 -3.83c-0.0048 -0.09127 -0.0432 -0.17752 -0.1078 -0.24214 -0.0647 -0.06463 -0.1509 -0.10305 -0.2422 -0.10786l-3.82999 -0.59c-0.05348 -0.004439 -0.10728 0.003134 -0.15745 0.022167 -0.05018 0.019032 -0.09547 0.049042 -0.13255 0.087833l-7.72 7.72c-0.14045 0.14062 -0.21934 0.33125 -0.21934 0.53 0 0.19875 0.07889 0.38937 0.21934 0.53v0Z"
                  stroke-width="1"
                ></path>
                <path
                  id="Vector_2"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9.88904 4.61096c-0.27614 0 -0.5 -0.22386 -0.5 -0.5s0.22386 -0.5 0.5 -0.5c0.27616 0 0.49996 0.22386 0.49996 0.5s-0.2238 0.5 -0.49996 0.5Z"
                  stroke-width="1"
                ></path>
              </g>
            </svg>
            <NavLink to="/brand" className="ms-2 me-1">
              Brand{" "}
            </NavLink>
          </div>
        </div>
      </div>
      <div className="mx-5 flex h-[calc(100vh-110px)] gap-5 overflow-hidden">
        <div
          className={`hidden w-[40%] bg-white px-3 pt-5 transition-all duration-700 sm:block ${
            isOpen
              ? "h-full overflow-hidden opacity-100"
              : "hidden h-0 overflow-hidden opacity-0"
          }`}
        >
          <ul className="flex h-full flex-col gap-5">
            {categoryMenus.map((catItem) => (
              <li
                key={catItem.id}
                className="flex items-center gap-2 rounded-md border-b border-gray-200 text-lg"
              >
                <span className="">{catItem.icon}</span>
                <div className="flex w-full justify-between gap-10">
                  <p>{catItem.item}</p>
                  <i class="bx bx-chevron-right text-2xl"></i>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={`bg-red-300 transition-all duration-500 ${isOpen ? "w-full" : "w-full"}`}
        >
          <Splide aria-label="My Favorite Images">
            {heroCarousel.map((eachSlide) => (
              <SplideSlide key={eachSlide.id} className="relative">
                <img
                  src={eachSlide.img}
                  className="h-[calc(100vh)] w-full object-cover"
                  alt="Image 1"
                />
                <div className="bg-validGreen/10 absolute bottom-[15%] h-full w-full">
                  <p className="absolute bottom-40 ms-15 text-6xl font-medium text-red-500">
                    {eachSlide.title}
                  </p>
                  <p className="absolute bottom-20 ms-15 text-6xl font-medium text-red-500">
                    {eachSlide.des}
                  </p>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>
    </>
  );
};

export default Hero;
