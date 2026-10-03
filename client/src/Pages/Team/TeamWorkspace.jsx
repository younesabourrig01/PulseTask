import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Copy,
  Check,
  RefreshCw,
  Crown,
  User,
  Shield,
  Trash2,
  LogOut,
  AlertTriangle,
  MessageSquare,
  Clock,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";
import { selectCurrentUser, updateTeamId } from "../../features/auth/authSlice";
import {
  useTeamInfoQuery,
  useGenerateInvCodeMutation,
  useUpdateTeamInfoMutation,
  useLeavTeamMutation,
  useDeleteTeamMutation,
} from "../../features/team/teamApiSlice";
import { apiSlice } from "../../app/api/apiSlice";

import { getAvatarUrl, getInitials } from "../../utils/avatar";
import { toast } from "sonner";

const MemberAvatar = ({ member, isMemberOwner }) => {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = getAvatarUrl(member?.avatar);
  const initials = getInitials(member?.name);

  useEffect(() => {
    setImgError(false);
  }, [member?.avatar]);

  if (avatarUrl && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={member.name || "Member"}
        onError={() => setImgError(true)}
        className="h-9 w-9 rounded-xl border border-white/10 object-cover"
      />
    );
  }

  return (
    <div
      className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-bold text-white shadow-sm ${
        isMemberOwner
          ? "bg-gradient-to-tr from-amber-500 to-amber-600"
          : "bg-gradient-to-tr from-[#5b5bf5] to-[#8b5cf6]"
      }`}
    >
      {initials}
    </div>
  );
};

export const TeamWorkspace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);


  // Team API Query
  const {
    data: teamResponse,
    isLoading: isTeamLoading,
    isFetching: isTeamFetching,
    refetch,
  } = useTeamInfoQuery();

  // Team API Mutations
  const [generateInvCode, { isLoading: isGeneratingCode }] =
    useGenerateInvCodeMutation();
  const [updateTeamInfo, { isLoading: isUpdatingTeam }] =
    useUpdateTeamInfoMutation();
  const [leaveTeam, { isLoading: isLeavingTeam }] = useLeavTeamMutation();
  const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();

  const team = teamResponse?.data;
  const isOwner = currentUser?.id && team?.owner_id === currentUser.id;
  const members = team?.members || [];

  // Local state for copy feedback
  const [copiedCode, setCopiedCode] = useState(false);

  // Settings form state (for owner)
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    discord_webhook_url: "",
  });

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");

  // Sync settings form with fetched team data
  useEffect(() => {
    if (team) {
      setSettingsForm({
        name: team.name || "",
        discord_webhook_url: team.discord_webhook_url || "",
      });
    }
  }, [team]);

  // Handle invite code generation
  const handleGenerateInviteCode = async () => {
    try {
      const res = await generateInvCode().unwrap();
      toast.success(res?.message || "New invite code generated!");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to generate invite code."
      );
    }
  };

  // Handle copy invite code
  const handleCopyCode = async (codeToCopy) => {
    const code = codeToCopy || team?.invite_code;
    if (!code) {
      if (isOwner) {
        handleGenerateInviteCode();
      } else {
        toast.info("Ask your team owner to generate an invite code.");
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      toast.success(`Invite code copied: ${code}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy invite code to clipboard.");
    }
  };

  // Handle saving team settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!team?.id) return;
    if (!settingsForm.name.trim()) {
      toast.error("Team name is required.");
      return;
    }

    try {
      const res = await updateTeamInfo({
        teamId: team.id,
        credentials: {
          name: settingsForm.name.trim(),
          discord_webhook_url: settingsForm.discord_webhook_url.trim() || null,
        },
      }).unwrap();

      toast.success(res?.message || "Team information updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to update team info."
      );
    }
  };

  // Handle leave team
  const handleLeaveTeamConfirm = async () => {
    try {
      const res = await leaveTeam().unwrap();
      toast.success(res?.message || "You have left the team.");
      dispatch(updateTeamId(null));
      dispatch(apiSlice.util.invalidateTags(["Team"]));
      setShowLeaveModal(false);
      navigate("/onboarding");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to leave team."
      );
    }
  };

  // Handle delete team
  const handleDeleteTeamConfirm = async (e) => {
    e.preventDefault();
    if (deleteConfirmInput !== team?.name) {
      toast.error("Team name confirmation does not match.");
      return;
    }

    try {
      const res = await deleteTeam().unwrap();
      toast.success(res?.message || "Team deleted successfully.");
      dispatch(updateTeamId(null));
      dispatch(apiSlice.util.invalidateTags(["Team"]));
      setShowDeleteModal(false);
      navigate("/onboarding");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to delete team."
      );
    }
  };

  // Expiration helper for invite code
  const getInviteCodeExpiryInfo = () => {
    if (!team?.invite_code_expires_at) return null;
    const expiry = new Date(team.invite_code_expires_at);
    const now = new Date();
    const diffHours = Math.round((expiry - now) / (1000 * 60 * 60));
    if (diffHours <= 0) {
      return { expired: true, text: "Code expired" };
    }
    return {
      expired: false,
      text: `Expires in ~${diffHours} hour${diffHours > 1 ? "s" : ""}`,
    };
  };

  const expiryInfo = getInviteCodeExpiryInfo();

  return (
    <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
            {/* Loading State */}
            {isTeamLoading ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#111827]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5b5bf5] border-t-transparent"></div>
                <p className="mt-4 text-sm font-medium text-gray-400">
                  Loading team workspace...
                </p>
              </div>
            ) : !team ? (
              /* No Team Found */
              <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/5 text-gray-400">
                  <Users size={28} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-white">
                  No Team Found
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  You are not currently part of any team workspace.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/onboarding")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#4a4af0]"
                >
                  <Sparkles size={15} />
                  Join or Create a Team
                </button>
              </div>
            ) : (
              <>
                {/* ── 1. Team Banner / Overview Card ─────────────────────────── */}
                <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl shadow-black/40 sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4 sm:items-center">
                      {/* Team Logo / Initial Badge */}
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5b5bf5] to-[#8b5cf6] text-2xl font-black text-white shadow-lg shadow-[#5b5bf5]/25 sm:h-20 sm:w-20 sm:text-3xl">
                        {team.name ? team.name.charAt(0).toUpperCase() : "T"}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-md border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#a5a0ff]">
                            <Shield size={12} />
                            Workspace
                          </span>
                          {isOwner ? (
                            <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                              <Crown size={12} />
                              You are Owner
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-gray-300">
                              <User size={12} />
                              Team Member
                            </span>
                          )}
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                          {team.name}
                        </h1>

                        <p className="text-xs text-gray-400">
                          Created on{" "}
                          {team.created_at
                            ? new Date(team.created_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "—"}{" "}
                          &middot; {members.length} member
                          {members.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>

                    {/* Banner Quick Stats & Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      {isOwner ? (
                        <button
                          type="button"
                          onClick={handleGenerateInviteCode}
                          disabled={isGeneratingCode}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#5b5bf5]/40 bg-[#5b5bf5]/15 px-4 py-2.5 text-xs font-semibold text-blue-300 transition hover:bg-[#5b5bf5]/25 active:scale-95 disabled:opacity-50"
                        >
                          <RefreshCw
                            size={14}
                            className={isGeneratingCode ? "animate-spin" : ""}
                          />
                          {isGeneratingCode
                            ? "Generating Code..."
                            : team.invite_code
                            ? "Regenerate Invite Code"
                            : "Generate Invite Code"}
                        </button>
                      ) : null}

                      {team.invite_code && (
                        <button
                          type="button"
                          onClick={() => handleCopyCode(team.invite_code)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#4a4af0] active:scale-95"
                        >
                          {copiedCode ? (
                            <>
                              <Check size={14} className="text-emerald-300" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy Invite Code
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── 2. Grid: Invite Code & Discord Integration Status ─────────── */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Invite Code Card */}
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
                          <Copy size={16} />
                        </span>
                        <div>
                          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                            Invitation Code
                          </h2>
                          <p className="text-xs text-gray-400">
                            Teammates use this to join your workspace
                          </p>
                        </div>
                      </div>

                      {expiryInfo && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                            expiryInfo.expired
                              ? "border-rose-500/30 bg-rose-500/10 text-rose-300"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          <Clock size={11} />
                          {expiryInfo.text}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0c1118] p-3.5 sm:p-4">
                      {team.invite_code ? (
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              Active Code
                            </span>
                            <p className="font-mono text-xl font-extrabold tracking-widest text-[#a5a0ff] sm:text-2xl">
                              {team.invite_code}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleCopyCode(team.invite_code)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                            >
                              {copiedCode ? (
                                <Check
                                  size={14}
                                  className="text-emerald-400"
                                />
                              ) : (
                                <Copy size={14} />
                              )}
                              {copiedCode ? "Copied" : "Copy"}
                            </button>

                            {isOwner && (
                              <button
                                type="button"
                                onClick={handleGenerateInviteCode}
                                disabled={isGeneratingCode}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 p-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                title="Generate a fresh invite code"
                              >
                                <RefreshCw
                                  size={14}
                                  className={
                                    isGeneratingCode ? "animate-spin" : ""
                                  }
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4 text-center">
                          <p className="text-xs text-gray-400">
                            No active invitation code exists.
                          </p>
                          {isOwner ? (
                            <button
                              type="button"
                              onClick={handleGenerateInviteCode}
                              disabled={isGeneratingCode}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#5b5bf5] px-3.5 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-[#4a4af0] disabled:opacity-60"
                            >
                              <Sparkles size={13} />
                              Generate Code Now
                            </button>
                          ) : (
                            <p className="mt-1 text-[11px] text-gray-500">
                              Ask the team owner to generate a code.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Discord Alerts Integration Card */}
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-6">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5865F2]/20 text-[#5865F2]">
                        <MessageSquare size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                          Discord Alert Webhook
                        </h2>
                        <p className="text-xs text-gray-400">
                          Automated activity notifications
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0c1118] p-4">
                      {team.discord_webhook_url ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">
                              Connected to Discord
                            </span>
                          </div>
                          <p className="truncate font-mono text-xs text-gray-400">
                            {team.discord_webhook_url}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Channel alerts will be dispatched when members join
                            or leave the team.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-gray-300">
                            Webhook Not Configured
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Add a Discord channel webhook URL in Team Settings
                            below to broadcast member events and alerts.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── 3. Team Members Directory ─────────────────────────────────── */}
                <div className="rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
                        <Users size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                          Team Members
                        </h2>
                        <p className="text-xs text-gray-400">
                          Everyone currently collaborating in this workspace
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-300">
                      <span>Total Members:</span>
                      <span className="text-[#a5a0ff] font-extrabold">
                        {members.length}
                      </span>
                    </span>
                  </div>

                  {/* Members Table / Grid */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          <th className="px-4 py-3">Member</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {members.map((member) => {
                          const isMemberOwner = member.id === team.owner_id;
                          const isCurrent = member.id === currentUser?.id;
                          const avatarUrl = getAvatarUrl(member.avatar);
                          const initials = getInitials(member.name);

                          return (
                            <tr
                              key={member.id}
                              className="transition hover:bg-white/[0.02]"
                            >
                              {/* Member Name + Avatar */}
                              <td className="px-4 py-3.5">
                                <div className="flex items-center gap-3">
                                  <MemberAvatar
                                    member={member}
                                    isMemberOwner={isMemberOwner}
                                  />

                                  <div>
                                    <p className="flex items-center gap-1.5 font-bold text-white">
                                      {member.name}
                                      {isCurrent && (
                                        <span className="rounded bg-[#5b5bf5]/20 px-1.5 py-0.5 text-[10px] font-medium text-[#a5a0ff]">
                                          You
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                      ID: #{member.id}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Email */}
                              <td className="px-4 py-3.5 font-mono text-xs text-gray-300">
                                {member.email}
                              </td>

                              {/* Role */}
                              <td className="px-4 py-3.5">
                                {isMemberOwner ? (
                                  <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-300">
                                    <Crown size={12} />
                                    Owner
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-semibold text-gray-300">
                                    <User size={12} />
                                    Member
                                  </span>
                                )}
                              </td>

                              {/* Joined Date */}
                              <td className="px-4 py-3.5 text-xs text-gray-400">
                                {member.created_at
                                  ? new Date(
                                      member.created_at
                                    ).toLocaleDateString()
                                  : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── 4. Team Settings (Owner Only) ───────────────────────────── */}
                {isOwner && (
                  <div className="rounded-xl border border-white/10 bg-[#111827] p-5 sm:p-6">
                    <div className="mb-5 flex items-center gap-2.5 border-b border-white/10 pb-4">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
                        <Shield size={16} />
                      </span>
                      <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-200">
                          Team Workspace Settings
                        </h2>
                        <p className="text-xs text-gray-400">
                          Manage your team profile and integrations
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSaveSettings} className="space-y-4">
                      <div>
                        <label
                          htmlFor="team-name-input"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400"
                        >
                          Team Name *
                        </label>
                        <input
                          id="team-name-input"
                          type="text"
                          required
                          value={settingsForm.name}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="e.g. Acme DevOps"
                          className="h-11 w-full rounded-lg border border-white/12 bg-[#0c1118] px-4 text-sm text-white outline-none transition focus:border-[#7169ff] focus:ring-2 focus:ring-[#7169ff]/20 placeholder:text-gray-600"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="team-discord-webhook"
                          className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400"
                        >
                          Discord Webhook URL{" "}
                          <span className="font-normal text-gray-500">
                            (Optional)
                          </span>
                        </label>
                        <input
                          id="team-discord-webhook"
                          type="url"
                          value={settingsForm.discord_webhook_url}
                          onChange={(e) =>
                            setSettingsForm((prev) => ({
                              ...prev,
                              discord_webhook_url: e.target.value,
                            }))
                          }
                          placeholder="https://discord.com/api/webhooks/..."
                          className="h-11 w-full rounded-lg border border-white/12 bg-[#0c1118] px-4 text-sm text-white outline-none transition focus:border-[#7169ff] focus:ring-2 focus:ring-[#7169ff]/20 placeholder:text-gray-600"
                        />
                        <p className="mt-1.5 text-[11px] text-gray-500">
                          Incoming webhook URL generated from your Discord
                          channel settings.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isUpdatingTeam}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#4a4af0] active:scale-95 disabled:opacity-60"
                        >
                          <Save size={14} />
                          {isUpdatingTeam
                            ? "Saving Changes..."
                            : "Save Team Settings"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* ── 5. Danger Zone ───────────────────────────────────────────── */}
                <div className="rounded-xl border border-rose-500/20 bg-[#111827] p-5 sm:p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/15 text-rose-400">
                      <AlertTriangle size={16} />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-rose-300">
                        Danger Zone
                      </h2>
                      <p className="text-xs text-gray-400">
                        Irreversible workspace actions
                      </p>
                    </div>
                  </div>

                  {isOwner ? (
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 sm:flex sm:items-center sm:justify-between">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-xs font-bold text-white">
                          Delete Team Workspace
                        </p>
                        <p className="text-xs text-gray-400">
                          Permanently delete this team and unassign all members.
                          This cannot be undone.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmInput("");
                          setShowDeleteModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
                      >
                        <Trash2 size={14} />
                        Delete Team
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 sm:flex sm:items-center sm:justify-between">
                      <div className="mb-3 sm:mb-0">
                        <p className="text-xs font-bold text-white">
                          Leave Team Workspace
                        </p>
                        <p className="text-xs text-gray-400">
                          Leave {team.name}. You will lose access to team
                          servers and scripts.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowLeaveModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 active:scale-95"
                      >
                        <LogOut size={14} />
                        Leave Team
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

      {/* ── Modal: Leave Team Confirmation ─────────────────────────────────── */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15">
                <LogOut size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Leave Team Workspace?
                </h3>
                <p className="text-xs text-gray-400">Confirm your departure</p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-300">
              Are you sure you want to leave{" "}
              <strong className="text-white">{team?.name}</strong>? You will no
              longer be able to view team servers or trigger scripts until you
              are re-invited.
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                disabled={isLeavingTeam}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeaveTeamConfirm}
                disabled={isLeavingTeam}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:opacity-60"
              >
                <LogOut size={14} />
                {isLeavingTeam ? "Leaving..." : "Yes, Leave Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Delete Team Confirmation (Owner) ────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/20 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Permanently Delete Team?
                </h3>
                <p className="text-xs text-gray-400">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-gray-300">
              This will permanently delete the workspace{" "}
              <strong className="text-white">{team?.name}</strong> and remove
              all members. To confirm, please type the team name{" "}
              <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-rose-300">
                {team?.name}
              </code>{" "}
              below:
            </p>

            <form onSubmit={handleDeleteTeamConfirm} className="mt-4 space-y-4">
              <input
                type="text"
                autoFocus
                placeholder={team?.name}
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                className="h-10 w-full rounded-lg border border-white/12 bg-[#0c1118] px-3 text-xs text-white outline-none transition focus:border-rose-500 focus:ring-1 focus:ring-rose-500 placeholder:text-gray-600"
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeletingTeam}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isDeletingTeam || deleteConfirmInput !== team?.name
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-rose-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {isDeletingTeam ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkspace;
