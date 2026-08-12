import React from "react";
import {
  Activity,
  Bell,
  CheckCircle2,
  Clock3,
  Copy,
  Gauge,
  Play,
  Plus,
  Server,
  TerminalSquare,
  UsersRound,
} from "lucide-react";
import { useLogoutMutation } from "../../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    label: "Servers",
    value: "6",
    detail: "4 online, 1 down, 1 pending",
    icon: Server,
    tone: "text-blue-300",
  },
  {
    label: "Uptime",
    value: "99.4%",
    detail: "Last 24 hours",
    icon: Gauge,
    tone: "text-emerald-300",
  },
  {
    label: "Scripts",
    value: "18",
    detail: "3 runs today",
    icon: TerminalSquare,
    tone: "text-violet-300",
  },
  {
    label: "Team",
    value: "5",
    detail: "Members in workspace",
    icon: UsersRound,
    tone: "text-amber-300",
  },
];

const servers = [
  {
    name: "Production API",
    ip: "192.168.1.10",
    user: "deploy",
    status: "online",
    response: "82ms",
    checked: "1 min ago",
  },
  {
    name: "Client Panel",
    ip: "192.168.1.24",
    user: "ubuntu",
    status: "online",
    response: "118ms",
    checked: "4 min ago",
  },
  {
    name: "Staging Worker",
    ip: "192.168.1.31",
    user: "root",
    status: "offline",
    response: "timeout",
    checked: "8 min ago",
  },
  {
    name: "Backup Node",
    ip: "192.168.1.44",
    user: "backup",
    status: "pending",
    response: "-",
    checked: "not checked",
  },
];

const scriptRuns = [
  ["Restart nginx", "Production API", "success", "2 min ago"],
  ["Clear cache", "Client Panel", "success", "23 min ago"],
  ["Deploy release", "Staging Worker", "failed", "1 hour ago"],
];

const activity = [
  "Production API passed uptime check with 200 OK.",
  "Deploy release failed on Staging Worker.",
  "Invite code generated for PulseTask Team.",
  "Discord alert sent for failed health check.",
];

const statusStyles = {
  online: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  offline: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  failed: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex min-w-20 justify-center rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${
      statusStyles[status] ?? "border-white/10 bg-white/5 text-gray-300"
    }`}
  >
    {status}
  </span>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleClick = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      console.error("failed", err);
    } finally {
      navigate("/");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0e14] px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-3 py-1 text-sm font-medium text-blue-200">
              <Activity className="h-4 w-4" aria-hidden="true" />
              User dashboard
            </div>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              PulseTask Team
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              A simple control center for servers, uptime checks, scripts, and
              team activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-white/20 hover:text-white"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Logout
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-white/20 hover:text-white"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Invite code
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4a4af0]"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add server
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, detail, icon: Icon, tone }) => (
            <article
              key={label}
              className="rounded-lg border border-white/10 bg-[#111827] p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400">
                  {label}
                </span>
                <Icon className={`h-5 w-5 ${tone}`} aria-hidden="true" />
              </div>
              <p className="text-3xl font-semibold text-white">{value}</p>
              <p className="mt-2 text-xs text-gray-500">{detail}</p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-lg border border-white/10 bg-[#111827]">
            <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Servers</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Machines linked to your team workspace.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0b0e14] px-3 py-2 text-sm font-semibold text-gray-200 transition hover:border-white/20"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run script
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="text-xs font-semibold uppercase text-gray-500">
                  <tr className="border-b border-white/10">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">IP Address</th>
                    <th className="px-5 py-3">SSH User</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Response</th>
                    <th className="px-5 py-3">Last Check</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {servers.map((server) => (
                    <tr key={server.name} className="text-gray-300">
                      <td className="px-5 py-4 font-semibold text-white">
                        {server.name}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs">
                        {server.ip}
                      </td>
                      <td className="px-5 py-4">{server.user}</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={server.status} />
                      </td>
                      <td className="px-5 py-4">{server.response}</td>
                      <td className="px-5 py-4 text-gray-500">
                        {server.checked}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Team Health
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Discord alerts enabled.
                  </p>
                </div>
                <Bell className="h-5 w-5 text-blue-300" aria-hidden="true" />
              </div>
              <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className="h-5 w-5 text-emerald-300"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Monitoring active
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/80">
                      Failed checks can notify your team.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <h2 className="text-lg font-semibold text-white">
                Recent Script Runs
              </h2>
              <div className="mt-4 space-y-3">
                {scriptRuns.map(([script, server, status, time]) => (
                  <div
                    key={`${script}-${server}`}
                    className="rounded-lg border border-white/10 bg-[#0b0e14] p-4"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {script}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">{server}</p>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    <p className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {time}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#111827] p-5">
              <h2 className="text-lg font-semibold text-white">
                Recent Activity
              </h2>
              <div className="mt-4 space-y-3">
                {activity.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-gray-300">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#5b5bf5]" />
                    <p className="leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
};
