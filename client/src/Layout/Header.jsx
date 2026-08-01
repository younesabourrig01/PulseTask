import React from "react";
import { BookOpen, Newspaper } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import Icon from "../assets/pulsetask-icon.svg";

const navLinks = [
  { label: "Documentation", href: "#", icon: BookOpen },
  { label: "Open Source", href: "#", icon: FaGithub },
  { label: "Blog", href: "#", icon: Newspaper },
];

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
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, href, icon: LinkIcon }) => (
          <li key={label}>
            <a
              href={href}
              className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              <LinkIcon className="w-4 h-4" aria-hidden="true" />
              <span>{label}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Right side auth */}
      <div className="flex items-center gap-6">
        <Link
          to={"/signin"}
          className="text-gray-300 hover:text-white text-sm font-medium"
        >
          Sign in
        </Link>
        <Link
          to={"/signup"}
          className="bg-[#5b5bf5] hover:bg-[#4a4af0] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};
