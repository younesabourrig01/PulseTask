import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#05070a] px-4 pt-16 pb-8 text-white sm:px-6 lg:px-8">
      {/* Background Watermark Text */}
      <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 select-none text-[8rem] font-black uppercase tracking-widest text-white/[0.03] sm:text-[12rem] lg:text-[16rem]">
        PULSETASK
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12 pb-16">
          {/* Column 1 - Product */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Platform
                </Link>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <Link to="/open-source" className="hover:text-white transition-colors">
                  Open Source
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Company */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Resources */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 PulseTask. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

