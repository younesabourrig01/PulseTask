import React from "react";
import { Activity, ArrowUpRight, BookOpen, Layers3 } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import Icon from "../assets/pulsetask-icon.svg";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#0b0e14] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2">
            <img className="h-7 w-7" src={Icon} alt="" />
            <span className="text-lg font-semibold">
              Pluse<span className="text-blue-400">Task</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
            A focused workspace for teams that monitor servers, run scripts,
            track uptime, and react fast when something dangerous happens.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
            Server operations in one place
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Product</h2>
          <div className="mt-4 grid gap-3 text-sm text-gray-400">
            <Link
              to="/"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              Platform
            </Link>
            <a
              href="#"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Documentation
            </a>
            <Link
              to="/open-source"
              className="inline-flex items-center gap-2 transition hover:text-white"
            >
              <FaGithub className="h-4 w-4" aria-hidden="true" />
              Open source
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">Get started</h2>
          <div className="mt-4 grid gap-3 text-sm text-gray-400">
            <Link to="/signin" className="transition hover:text-white">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4a4af0]"
            >
              Create account
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 PulseTask. All rights reserved.</p>
        <p>Built for freelancers, small teams, and server operators.</p>
      </div>
    </footer>
  );
};
