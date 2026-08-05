import React, { useState } from "react";
import { BookOpen, Layers3, Menu, Newspaper, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import Icon from "../assets/pulsetask-icon.svg";

const navLinks = [
  { label: "Platform", to: "/", icon: Layers3 },
  { label: "Documentation", href: "#", icon: BookOpen },
  { label: "Open Source", to: "/open-source", icon: FaGithub },
  { label: "Blog", href: "#", icon: Newspaper },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const renderNavLink = ({ label, href, to, icon: LinkIcon }, className) =>
    to ? (
      <Link to={to} onClick={closeMenu} className={className}>
        <LinkIcon className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    ) : (
      <a href={href} onClick={closeMenu} className={className}>
        <LinkIcon className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </a>
    );

  return (
    <nav className="fixed left-0 top-0 z-50 w-full bg-[#0b0e14] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img className="w-6 h-6" viewBox="0 0 24 24" src={Icon}></img>
          <span className="text-white font-semibold text-lg">
            Pluse<span className="text-blue-400">Task</span>
          </span>
        </div>
        {/* Center nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((navLink) => (
            <li key={navLink.label}>
              {renderNavLink(
                navLink,
                "flex items-center gap-2 text-gray-300 hover:text-white text-sm font-medium transition-colors",
              )}
            </li>
          ))}
        </ul>

        {/* Right side auth */}
        <div className="hidden md:flex items-center gap-6">
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

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-200 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mt-4 rounded-lg border border-white/10 bg-[#111622] p-3 shadow-2xl md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((navLink) => (
              <li key={navLink.label}>
                {renderNavLink(
                  navLink,
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white",
                )}
              </li>
            ))}
          </ul>

          <div className="mt-3 grid gap-2 border-t border-white/10 pt-3">
            <Link
              to={"/signin"}
              onClick={closeMenu}
              className="rounded-md px-3 py-2.5 text-center text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to={"/signup"}
              onClick={closeMenu}
              className="rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#4a4af0]"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
