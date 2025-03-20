import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <>
      <div>
        <h2>404 | Not Found</h2>
        <button
          className="bg-validGreen rounded-md px-3 py-1"
          onClick={() => navigate("/shop")}
        >
          Go to shop
        </button>
      </div>
    </>
  );
};

export default NotFound;
