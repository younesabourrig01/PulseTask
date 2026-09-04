import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Copy,
  Users,
  Crown,
  Check,
} from "lucide-react";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { selectCurrentUser } from "../../features/auth/authSlice";
import {
  useTeamInfoQuery,
  useGenerateInvCodeMutation,
} from "../../features/team/teamApiSlice";
import { toast } from "sonner";

export const Hero = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const { data: teamResponse, isLoading: isTeamLoading } = useTeamInfoQuery();
  const [generateInvCode, { isLoading: isGeneratingCode }] =
    useGenerateInvCodeMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [copied, setCopied] = useState(false);

  const teamInfo = teamResponse?.data;
  const members = teamInfo?.members || [];

  const handleLogout = async () => {
    try {
      const response = await logout().unwrap();
      toast.success(response?.message || "Logged out successfully!");
    } catch (err) {
      console.error("failed", err);
      toast.error(
        err?.data?.message || err?.error || err?.message || "Logout failed.",
      );
    } finally {
      navigate("/");
    }
  };

  const handleCopyInviteCode = async () => {
    try {
      let code = teamInfo?.invite_code;
      if (!code) {
        const res = await generateInvCode().unwrap();
        code = res.invite_code;
        toast.success("New invite code generated!");
      }
      if (code) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success(`Invite code copied: ${code}`);
      }
    } catch (err) {
      console.error("Invite code error", err);
      toast.error(
        err?.data?.message || err?.error || "Failed to get invite code.",
      );
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111827] p-5 sm:p-6 shadow-2xl shadow-black/40">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5b5bf5] to-[#8b5cf6] font-bold text-white shadow-lg shadow-[#5b5bf5]/25 text-xl tracking-wider">
            {teamInfo?.name ? teamInfo.name.charAt(0).toUpperCase() : "T"}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7169ff]">
                Workspace Overview
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {isTeamLoading ? (
                <span className="h-7 w-48 animate-pulse rounded bg-white/10" />
              ) : (
                teamInfo?.name || "Team Workspace"
              )}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyInviteCode}
            disabled={isGeneratingCode}
            className="inline-flex items-center gap-2 rounded-lg border border-[#5b5bf5]/40 bg-[#5b5bf5]/10 px-3.5 py-2 text-xs font-semibold text-blue-300 transition hover:bg-[#5b5bf5]/20 active:scale-95 disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-[#7169ff]" />
            )}
            {isGeneratingCode
              ? "Generating..."
              : teamInfo?.invite_code
              ? `Invite: ${teamInfo.invite_code}`
              : "Copy Invite Code"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
          >
            <Activity className="h-3.5 w-3.5" />
            {isLoggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </div>

      {/* Members Bar */}
      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#7169ff]" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Team Members
          </span>
          <span className="rounded-full bg-[#5b5bf5]/20 px-2 py-0.5 text-xs font-bold text-blue-300 border border-[#5b5bf5]/30">
            {members.length}
          </span>
        </div>

        {/* List of Member Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {isTeamLoading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-28 animate-pulse rounded-lg bg-white/5" />
              <div className="h-8 w-28 animate-pulse rounded-lg bg-white/5" />
            </div>
          ) : members.length === 0 ? (
            <p className="text-xs text-gray-500">No members found.</p>
          ) : (
            members.map((m) => {
              const isOwner = m.id === teamInfo?.owner_id;
              const isSelf = m.id === currentUser?.id;
              const initials = m.name
                ? m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "U";

              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-1.5 text-xs transition ${
                    isSelf
                      ? "border-[#5b5bf5]/40 bg-[#5b5bf5]/10 text-white shadow-sm"
                      : "border-white/10 bg-[#0b0e14] text-gray-300 hover:border-white/20"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white ${
                      isOwner
                        ? "bg-amber-500 shadow-sm shadow-amber-500/30"
                        : "bg-[#5b5bf5]"
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-white leading-none flex items-center gap-1">
                      {m.name}
                      {isSelf && (
                        <span className="text-[10px] font-normal text-indigo-300">
                          (You)
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight mt-0.5">
                      {m.email}
                    </span>
                  </div>
                  {isOwner && (
                    <span
                      className="ml-1 inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/30"
                      title="Team Owner"
                    >
                      <Crown className="h-2.5 w-2.5" /> Owner
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
