import React from "react";
import Icon from "../assets/pulsetask-icon.svg";
export const Header = () => {
  return (
    <nav className="w-full bg-[#0b0e14] px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img className="w-6 h-6" viewBox="0 0 24 24" src={Icon}></img>
        <span className="text-white font-semibold text-lg">
          Pluse<span className="text-blue-400">Task</span>
        </span>
      </div>
      {/* Center nav links */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#"
          className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium"
        >
          Platform
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white text-sm font-medium"
        >
          Documentation
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white text-sm font-medium"
        >
          Pricing
        </a>
        <a
          href="#"
          className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium"
        >
          Community
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
        <a
          href="#"
          className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium"
        >
          Company
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </a>
        <a
          href="#"
          className="text-gray-300 hover:text-white text-sm font-medium"
        >
          Enterprise
        </a>
      </div>

      {/* Right side auth */}
      <div className="flex items-center gap-6">
        <a
          href="#"
          className="text-gray-300 hover:text-white text-sm font-medium"
        >
          Sign in
        </a>
        <button className="bg-[#5b5bf5] hover:bg-[#4a4af0] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          Sign up
        </button>
      </div>
    </nav>
  );
};
