import React from "react";
import Logo from "../bit components/Logo";

function Header() {
  return (
    <header>
      <nav className="flex justify-between">
        <Logo />
        <ul className="flex justify-between w-1/6">
          <li>services</li>
          <li>products</li>
        </ul>
        <div className="">
          <button>log in</button>
        </div>
      </nav>
    </header>
  );
}

export default Header;
