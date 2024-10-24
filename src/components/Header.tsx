import React from "react";

type Props = {};

function Header({}: Props) {
  return (
    <header className="bg-teal-500 py-4 px-8 flex items-center justify-between mb-[30px]">
      <div className="flex items-center">
        <h1 className="text-white text-2xl font-bold">HomeoCare</h1>
      </div>
      <nav className="flex items-center">
        <a
          href=""
          className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
        >
          Home
        </a>
        <a
          href=""
          className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
        >
          About
        </a>
      </nav>
    </header>
  );
}

export default Header;
