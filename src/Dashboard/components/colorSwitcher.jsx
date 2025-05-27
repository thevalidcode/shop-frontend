import React, { useEffect, useState } from "react";

("use client");
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  StyleButtons,
} from "../../components/ui/animated-modal";

import { motion } from "motion/react";

const ColorSwitch = () => {
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
                <button
                  onClick={() => handleColorChange("#F97316")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-500 py-2 text-lg font-semibold text-white"
                >
                  <i class="bx bx-sun"></i> Sunset Orange
                </button>
                <button
                  onClick={() => handleColorChange("#3B82F6")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-500 py-2 text-lg font-semibold text-white"
                >
                  <i class="bx bx-water"></i> Ocean Blue
                </button>

                <button
                  onClick={() => handleColorChange("#7C3AED")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-purple-600 py-2 text-lg font-semibold text-white"
                >
                  <i class="bx bx-crown"></i> Royal Purple
                </button>
                <button
                  onClick={() => handleColorChange("#0cdd08")}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#0cdd08] py-2 text-lg font-semibold text-white"
                >
                  <i class="bx bx-reset"></i> Reset
                </button>
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

export default ColorSwitch;
