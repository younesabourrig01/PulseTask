import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = () => {
  const location = useLocation();

  // Initialize sidebar open state from localStorage, defaulting to true on desktop
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("pulsetask_sidebar_open");
    if (saved !== null) {
      return saved === "true";
    }
    return typeof window !== "undefined" ? window.innerWidth >= 1024 : true;
  });

  const [headerActions, setHeaderActions] = useState(null);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("pulsetask_sidebar_open", String(next));
      return next;
    });
  };

  const handleClose = () => {
    setSidebarOpen(false);
    localStorage.setItem("pulsetask_sidebar_open", "false");
  };

  // Compute breadcrumb subtitle based on pathname
  const getPageTitle = () => {
    if (location.pathname.startsWith("/team")) return "/ Team Workspace";
    if (location.pathname.startsWith("/profile")) return "/ Profile";
    return "";
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white">
      {/* Persistent Sidebar Navigation */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={handleClose} />

      {/* Main Content Container (adjusts margin on desktop when sidebar toggles) */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:pl-64" : "pl-0"
        }`}
      >
        {/* Universal Top Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-[#0b0e14]/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="rounded-lg border border-white/10 p-2 text-gray-300 transition hover:bg-white/5 hover:text-white"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
              title={sidebarOpen ? "Collapse sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <span className="text-sm font-extrabold uppercase tracking-wider text-white">
              Pulse<span className="text-[#5b5bf5]">Task</span>
              {getPageTitle() && (
                <span className="ml-2 text-xs font-normal text-gray-400">
                  {getPageTitle()}
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1">
          <Outlet context={{ setHeaderActions, sidebarOpen }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
