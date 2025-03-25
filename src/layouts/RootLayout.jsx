import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const [themeColor, setThemeColor] = useState("#0cdd08");

  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor");
    if (savedColor) {
      setThemeColor(savedColor);
    }
  }, []);
  const handleChangeColor = (color) => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color);
  };
  return (
    <>
      <div style={{ "--color-validGreen": themeColor }}>
        <h1 className="text-validGreen">Multivendor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleChangeColor("#ff5733")}
            className="rounded-md bg-red-500 px-4 py-2 text-white"
          >
            Red
          </button>
          <button
            onClick={() => handleChangeColor("#0cdd08")}
            className="rounded-md bg-[#0cdd08] px-4 py-2 text-white"
          >
            Default Color
          </button>
          <input
            type="color"
            value={themeColor}
            className=""
            onChange={(e) => handleChangeColor(e.target.value)}
          />
        </div>
        <Navbar />
        <Outlet />
      </div>
    </>
  );
};

export default RootLayout;
