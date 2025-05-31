import React, { useEffect, useState } from "react";

import { toast } from "sonner";

("use client");
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  StyleButtons,
} from "../../../components/ui/animated-modal";

// import { motion } from "motion/react";

const themes = [
  {
    name: "Sunset Orange",
    icon: "bx bx-sun",
    colorChange: "#F97316",
  },
  {
    name: "Ocean Blue",
    icon: "bx bx-water",
    colorChange: "#3B82F6",
  },
  {
    name: "Royal Purple",
    icon: "bx bx-crown",
    colorChange: "#7C3AED",
  },
  {
    name: "Default",
    icon: "bx bx-reset",
    colorChange: "#0cdd08",
  },
];

const themeNames = {
  "#F97316": "SunsetOrange",
  "#3B82F6": "OceanBlue",
  "#7C3AED": "RoyalPurple",
  "#0cdd08": "Default",
};

const themeColorClasses = {
  "#F97316": "text-[#F97316]",
  "#3B82F6": "text-[#3B82F6]",
  "#7C3AED": "text-[#7C3AED]",
  "#0cdd08": "text-[#0cdd08]",
};
const themeBgClasses = {
  "#F97316": "bg-[#F97316]",
  "#3B82F6": "bg-[#3B82F6]",
  "#7C3AED": "bg-[#7C3AED]",
  "#0cdd08": "bg-[#0cdd08]",
};

export const Branding = () => {
  const [themeColor, setThemeColor] = useState("#0cdd08");
  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor") || "#0cdd08";
    if (savedColor) {
      document.documentElement.style.setProperty(
        "--color-validGreen",
        savedColor,
      );
    }
  }, []);

  const handleColorChange = (color) => {
    setThemeColor(color);
    document.documentElement.style.setProperty("--color-validGreen", color);
  };
  return (
    <div className="flex items-center justify-center py-40">
      <Modal>
        <ModalTrigger className="group/modal-btn bg-validGreen flex justify-center text-white dark:bg-white dark:text-black">
          <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-40">
            Branding
          </span>
          <div className="absolute inset-0 z-20 flex -translate-x-40 items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
            🎨
          </div>
        </ModalTrigger>
        <ModalBody>
          <ModalContent>
            <h4 className="before:via-validGreen relative mb-2 text-center text-lg font-semibold text-neutral-600 before:absolute before:top-[50%] before:left-0 before:h-[2px] before:w-27 before:bg-gradient-to-l before:from-orange-500 before:to-purple-600 after:absolute after:top-[50%] after:right-0 after:h-[2px] after:w-27 after:bg-gradient-to-l after:from-green-400 after:via-orange-500 after:to-blue-600 md:text-2xl">
              Store Branding 🎨
            </h4>

            <div>
              <p className="primaryText my-3 text-xl font-semibold">
                Predefined Themes
              </p>
              <div className="grid grid-cols-2 gap-3">
                {themes.map((themeColor, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      handleColorChange(` ${themeColor.colorChange} `)
                    }
                    style={{ backgroundColor: themeColor.colorChange }}
                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-lg font-semibold text-white`}
                  >
                    <i className={` ${themeColor.icon} `}></i> {themeColor.name}
                  </button>
                ))}
              </div>
            </div>

            {/*  */}
            <div>
              <p className="primaryText mt-7 flex items-center gap-2 text-xl font-semibold">
                Custom Theme <span className="text-sm">(color picker)</span>
              </p>
              <div>
                <input
                  type="color"
                  name=""
                  id=""
                  value={themeColor}
                  className="h-10 w-[50%] rounded-xl"
                  onChange={(e) => handleColorChange(e.target.value)}
                />
                <p className="animate-pulse pt-8 text-center text-sm md:pt-10">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Pick
                  </span>{" "}
                  <span className="bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
                    a
                  </span>{" "}
                  <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    color
                  </span>{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    that
                  </span>{" "}
                  <span className="bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent">
                    represents
                  </span>{" "}
                  <span className="bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
                    your
                  </span>{" "}
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                    brand
                  </span>
                  .
                </p>
              </div>
            </div>
          </ModalContent>
          <ModalFooter className="gap-4">
            <StyleButtons color={themeColor} />
            {/* <button className="w-28 rounded-md border border-gray-300 bg-gray-200 px-2 py-1 text-sm text-black dark:border-black dark:bg-black dark:text-white">
              Cancel
            </button>
            <button className="w-28 rounded-md border border-black bg-black px-2 py-1 text-sm text-white dark:bg-white dark:text-black">
              Save
            </button> */}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

export const QuickBranding = () => {
  const [themeColor, setThemeColor] = useState("#0cdd08");
  const textColorClass = themeColorClasses[themeColor] || "text-validGreen";
  const textBgClass = themeBgClasses[themeColor] || "bg-validGreen";

  const handleColorChange = (color) => {
    setThemeColor(color);
    document.documentElement.style.setProperty("--color-validGreen", color);
  };

  const activeTheme = localStorage.getItem("themeColor");

  const saveColorBrand = () => {
    localStorage.setItem("themeColor", themeColor) || "#0cdd08";
    toast(
      <div>
        {" "}
        Theme has been changed to{" "}
        <span className={` ${textColorClass} `}>
          {themeNames[themeColor]}
        </span>{" "}
      </div>,
      {
        // description: "You can always come back herte to change it",
        action: {
          label: (
            <p className={`${textBgClass} w-full rounded px-2 py-1 text-white`}>
              Got it{" "}
            </p>
          ),
        },
      },
    );
  };

  return (
    <>
      <select
        name=""
        id=""
        onChange={(e) => handleColorChange(e.target.value)}
        className="mt-1 w-full rounded border-gray-300 bg-gray-100 p-2 shadow-sm"
      >
        <option value="" className="hidden">
          {themeNames[activeTheme]}
        </option>
        {themes && themes.length > 0
          ? themes.map((themeColor, i) => (
              <option value={themeColor.colorChange} key={i}>
                {themeColor.name}
              </option>
            ))
          : ""}
      </select>

      <p className="animate-pulse text-sm md:pt-2">
        <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Pick
        </span>{" "}
        <span className="bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent">
          a
        </span>{" "}
        <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          color
        </span>{" "}
        <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          that
        </span>{" "}
        <span className="bg-gradient-to-r from-indigo-500 to-pink-600 bg-clip-text text-transparent">
          represents
        </span>{" "}
        <span className="bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
          your
        </span>{" "}
        <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          brand
        </span>
        .
      </p>

      <div className="flex w-full justify-end">
        <button
          onClick={() => saveColorBrand()}
          className="bg-validGreen mt-5 cursor-pointer rounded px-4 py-2 text-gray-50"
        >
          Save Changes
        </button>
      </div>
    </>
  );
};
