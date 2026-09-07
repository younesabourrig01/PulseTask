import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
} from "lucide-react";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useLogoutMutation } from "../features/auth/authApiSlice";
import { getAvatarUrl, getInitials } from "../utils/avatar";
import Icon from "../assets/pulsetask-icon.svg";
import { toast } from "sonner";

export const DashboardSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const avatarUrl = getAvatarUrl(currentUser?.avatar);
  const initials = getInitials(currentUser?.name);

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response?.message || "Logged out successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || err?.error || err?.message || "Logout failed."
      );
    } finally {
      navigate("/");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard",
    },
    {
      name: "Profile",
      to: "/profile",
      icon: User,
      active: location.pathname === "/profile",
    },
    {
      name: "Team Workspace",
      to: "/team",
      icon: Users,
      active: location.pathname === "/team",
    },
  ];

  return (
    <>
      {/* Backdrop overlay on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: slides in and out smoothly on ANY device */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0e131f] border-r border-white/10 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top branding - clean logo without outside padding */}
        <div className="flex h-14 items-center border-b border-white/10 px-5">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5 transition hover:opacity-90"
          >
            <img src={Icon} alt="PulseTask Logo" className="h-6 w-6 object-contain" />
            <span className="text-base font-extrabold tracking-wider uppercase text-white">
              Pulse<span className="text-[#5b5bf5]">Task</span>
            </span>
          </Link>
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            Navigation
          </div>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={onClose}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                    item.active
                      ? "bg-[#5b5bf5] text-white shadow-lg shadow-[#5b5bf5]/25"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp
                      size={18}
                      className={item.active ? "text-white" : "text-gray-400 group-hover:text-white"}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Account Info & Logout */}
        <div className="border-t border-white/10 p-3.5">
          <div className="rounded-xl border border-white/5 bg-[#080b11] p-3">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={currentUser?.name || "Profile"}
                    className="h-9 w-9 rounded-xl border border-[#5b5bf5]/40 object-cover shadow-sm"
                  />
                ) : (
                  <div className="grid h-9 w-9 place-items-center rounded-xl border border-[#5b5bf5]/40 bg-gradient-to-tr from-[#5b5bf5] to-[#8b5cf6] text-xs font-bold text-white shadow-sm">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0e131f] bg-emerald-400" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {currentUser?.name || "User"}
                </p>
                <p className="truncate text-[11px] text-gray-400">
                  {currentUser?.email || "user@pulsetask.io"}
                </p>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
