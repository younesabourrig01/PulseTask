import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectCurrentUser, updateTeamId } from "../../features/auth/authSlice";
import {
  useCreateTeamMutation,
  useJoinTeamMutation,
} from "../../features/team/teamApiSlice";
import Icon from "../../assets/pulsetask-icon.svg";
import { toast } from "sonner";
import { PlusCircle, UserPlus, KeyRound, Users, ArrowRight } from "lucide-react";

export const TeamLobby = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("create"); 
  const [createData, setCreateData] = useState({
    name: "",
    discord_webhook_url: "",
  });
  const [joinCode, setJoinCode] = useState("");

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [joinTeam, { isLoading: isJoining }] = useJoinTeamMutation();

  if (user?.team_id) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createData.name.trim()) {
      toast.error("Please enter a team name.");
      return;
    }

    try {
      const res = await createTeam(createData).unwrap();
      toast.success(res.message || "Team created successfully!");
      if (res.team?.id) {
        dispatch(updateTeamId(res.team.id));
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to create team."
      );
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Please enter an invite code.");
      return;
    }

    try {
      const res = await joinTeam({ invite_code: joinCode.trim() }).unwrap();
      toast.success(res.message || "Joined team successfully!");
      if (res.team?.id) {
        dispatch(updateTeamId(res.team.id));
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.data?.message || err?.error || "Failed to join team. Check code."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0d18] px-4 py-8 text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-3">
            <img src={Icon} alt="PulseTask" className="h-10 w-10" />
            <span className="text-2xl font-bold tracking-tight">PulseTask</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-100">
            Welcome, <span className="text-[#7169ff]">{user?.name || "Developer"}</span>!
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            To get started with PulseTask, create a new team or join an existing one.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-xl bg-[#141922] p-1.5 border border-indigo-400/10 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition ${
              activeTab === "create"
                ? "bg-[#5c50f5] text-white shadow-lg shadow-[#5c50f5]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <PlusCircle size={18} />
            Create a New Team
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition ${
              activeTab === "join"
                ? "bg-[#5c50f5] text-white shadow-lg shadow-[#5c50f5]/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserPlus size={18} />
            Join with Code
          </button>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-indigo-400/10 bg-[#141922] p-6 sm:p-8 shadow-2xl shadow-black/40">
          {activeTab === "create" ? (
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Users size={18} className="text-[#7169ff]" />
                  <h2 className="text-lg font-bold text-gray-100">
                    Create Your Team
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Start your own workspace and invite your teammates to collaborate.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme DevOps Team"
                  value={createData.name}
                  onChange={(e) =>
                    setCreateData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full h-11 rounded-lg border border-white/12 bg-[#0c1118] px-4 text-sm text-white outline-none transition focus:border-[#7169ff] focus:ring-2 focus:ring-[#7169ff]/20 placeholder:text-gray-500"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Discord Webhook URL <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://discord.com/api/webhooks/..."
                  value={createData.discord_webhook_url}
                  onChange={(e) =>
                    setCreateData((prev) => ({
                      ...prev,
                      discord_webhook_url: e.target.value,
                    }))
                  }
                  className="w-full h-11 rounded-lg border border-white/12 bg-[#0c1118] px-4 text-sm text-white outline-none transition focus:border-[#7169ff] focus:ring-2 focus:ring-[#7169ff]/20 placeholder:text-gray-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#5c50f5] px-4 text-sm font-bold text-white shadow-lg shadow-[#5c50f5]/20 transition hover:bg-[#6d63ff] focus:outline-none focus:ring-2 focus:ring-[#7169ff] focus:ring-offset-2 focus:ring-offset-[#141922] disabled:cursor-not-allowed disabled:opacity-70 mt-6"
              >
                {isCreating ? "Creating Team..." : "Create Team & Continue"}
                {!isCreating && <ArrowRight size={18} />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound size={18} className="text-[#7169ff]" />
                  <h2 className="text-lg font-bold text-gray-100">
                    Join Existing Team
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Ask your team admin for an invitation code to join their workspace.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Invitation Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT-AB12CD"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full h-11 rounded-lg border border-white/12 bg-[#0c1118] px-4 text-sm font-mono tracking-wider text-white outline-none transition focus:border-[#7169ff] focus:ring-2 focus:ring-[#7169ff]/20 placeholder:text-gray-500 uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={isJoining}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#5c50f5] px-4 text-sm font-bold text-white shadow-lg shadow-[#5c50f5]/20 transition hover:bg-[#6d63ff] focus:outline-none focus:ring-2 focus:ring-[#7169ff] focus:ring-offset-2 focus:ring-offset-[#141922] disabled:cursor-not-allowed disabled:opacity-70 mt-6"
              >
                {isJoining ? "Joining Team..." : "Join Team & Continue"}
                {!isJoining && <ArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};

export default TeamLobby;
