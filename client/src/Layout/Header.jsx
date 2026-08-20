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
        <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    ) : (
      <a href={href} onClick={closeMenu} className={className}>
        <LinkIcon className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{label}</span>
      </a>
    );

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-[#07090e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img className="w-6 h-6" src={Icon} alt="PulseTask Logo" />
          <span className="text-white font-extrabold tracking-wider text-base uppercase">
            Pulse<span className="text-blue-500">Task</span>
          </span>
        </Link>

        {/* Center nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((navLink) => (
            <React.Fragment key={navLink.label}>
              {renderNavLink(
                navLink,
                "flex items-center gap-2 text-xs uppercase tracking-wider font-medium text-gray-300 hover:text-white transition-colors"
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right side auth */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to={"/signin"}
            className="text-xs uppercase tracking-wider font-semibold text-gray-300 hover:text-white transition-colors px-2 py-1"
          >
            Sign in
          </Link>
          <Link
            to={"/signup"}
            className="bg-white hover:bg-gray-200 text-black text-xs uppercase tracking-wider font-bold px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-200 transition-colors hover:bg-white/10 hover:text-white md:hidden"
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

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#07090e] px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map((navLink) => (
              <li key={navLink.label}>
                {renderNavLink(
                  navLink,
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-xs uppercase tracking-wider font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
            <Link
              to={"/signin"}
              onClick={closeMenu}
              className="rounded-md px-3 py-2 text-center text-xs uppercase tracking-wider font-semibold text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              to={"/signup"}
              onClick={closeMenu}
              className="rounded-full bg-white px-4 py-2.5 text-center text-xs uppercase tracking-wider font-bold text-black transition-colors hover:bg-gray-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

