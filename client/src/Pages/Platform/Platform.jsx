import React from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Box,
  CheckCircle2,
  Clock3,
  Copy,
  KeyRound,
  Gauge,
  LayoutDashboard,
  MessageCircleWarning,
  MonitorCheck,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  TerminalSquare,
  UserPlus,
  UsersRound,
} from "lucide-react";

const navItems = [
  { label: "Telemetry", active: false },
  { label: "Sources", active: false },
  { label: "Collectors", active: false },
  { label: "Services", active: false },
  { label: "Logs & traces", active: true },
  { label: "Dashboards", active: false },
  { label: "Alerts", active: false },
];

const logs = [
  ["16:04:08", "Acme", "INFO", "server:web-01 heartbeat received"],
  ["16:04:08", "Acme", "INFO", "thread_id:217220 script finished"],
  ["16:04:08", "Acme", "DEBUG", "pid:1 node probe completed"],
  ["16:04:08", "Acme", "INFO", "host:worker-5 docker task online"],
  ["16:04:08", "Acme", "INFO", "uptime check passed in 82ms"],
];

const bars = [34, 58, 25, 74, 42, 66, 31, 52, 80, 45, 68, 29, 61, 38, 56, 72];

const featureSections = [
  {
    eyebrow: "Team workspace",
    title: "Create a team and bring the right people into the work.",
    text: "Anyone can start a PulseTask team, invite members, and keep servers, scripts, and monitoring history organized around the people responsible for them.",
    icon: UsersRound,
    accent: "text-sky-300",
    preview: "team",
    points: ["Invite teammates", "Share server access", "Keep activity visible"],
  },
  {
    eyebrow: "CLI control",
    title: "Generate SSH keys and operate servers from your terminal.",
    text: "Create an SSH key, attach it to the servers you manage, and run trusted commands from the CLI without losing the central audit trail.",
    icon: KeyRound,
    accent: "text-violet-300",
    preview: "cli",
    points: ["SSH key generation", "Script execution", "Command history"],
  },
  {
    eyebrow: "Uptime checks",
    title: "Automatically ping stored websites and apps.",
    text: "PulseTask checks the websites and apps you save, tracks response logs over time, and helps you understand when a service starts getting slow or goes offline.",
    icon: MonitorCheck,
    accent: "text-emerald-300",
    preview: "uptime",
    points: ["Scheduled pings", "Response logs", "Status history"],
  },
  {
    eyebrow: "Discord alerts",
    title: "Send danger signals straight to your Discord channel.",
    text: "Connect a Discord channel so dangerous server events, failed checks, and urgent warnings reach your team immediately.",
    icon: MessageCircleWarning,
    accent: "text-rose-300",
    preview: "discord",
    points: ["Channel webhooks", "Immediate alerts", "Incident context"],
  },
];

const teamMembers = ["Younes", "Meriem", "Omar"];

const uptimeRows = [
  ["pulsetask.app", "200 OK", "82ms"],
  ["api.client.dev", "200 OK", "118ms"],
  ["admin.panel.io", "Timeout", "5.2s"],
];

const renderFeaturePreview = (type) => {
  if (type === "team") {
    return (
      <div className="space-y-3">
        {teamMembers.map((member, index) => (
          <div
            key={member}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5b5bf5]/20 text-xs font-semibold text-blue-100">
                {member.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{member}</p>
                <p className="text-xs text-gray-500">
                  {index === 0 ? "Owner" : "Team member"}
                </p>
              </div>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
          </div>
        ))}
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 px-4 py-3 text-sm font-semibold text-gray-300">
          <UserPlus className="h-4 w-4" />
          Add member
        </button>
      </div>
    );
  }

  if (type === "cli") {
    return (
      <div className="rounded-lg border border-white/10 bg-[#070a12] p-4 font-mono text-xs text-gray-300">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-gray-500">pulsetask cli</span>
          <Copy className="h-4 w-4 text-gray-500" />
        </div>
        <p>
          <span className="text-emerald-300">$</span> pulsetask ssh:key
          generate
        </p>
        <p className="mt-2 text-blue-300">Key created: pt_acme_prod</p>
        <p className="mt-4">
          <span className="text-emerald-300">$</span> pulsetask run web-01
          deploy.sh
        </p>
        <p className="mt-2 text-gray-500">script queued, logs streaming...</p>
      </div>
    );
  }

  if (type === "uptime") {
    return (
      <div className="space-y-3">
        {uptimeRows.map(([target, status, latency]) => (
          <div
            key={target}
            className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-3"
          >
            <div>
              <p className="text-sm font-semibold text-white">{target}</p>
              <p
                className={`mt-1 text-xs ${
                  status === "Timeout" ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {status}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock3 className="h-4 w-4" />
              {latency}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-4">
      <div className="mb-4 flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-rose-300" />
        <div>
          <p className="text-sm font-semibold text-white">Danger detected</p>
          <p className="text-xs text-rose-200">Sent to #server-alerts</p>
        </div>
      </div>
      <div className="rounded-lg bg-[#0b0e14] p-4 text-sm leading-6 text-gray-300">
        web-01 failed health check after 3 retries. CPU spike and timeout logs
        attached.
      </div>
    </div>
  );
};

export const Platform = () => {
  return (
    <main className="min-h-screen bg-[#0b0e14] px-4 pb-14 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-7xl items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-3 py-1 text-sm font-medium text-blue-200">
            <Activity className="h-4 w-4" aria-hidden="true" />
            Platform overview
          </div>

          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Control every server from one focused workspace.
          </h1>

          <p className="mt-6 text-base leading-7 text-gray-300 sm:text-lg">
            PulseTask gives teams a clean place to monitor servers, review
            activity, run scripts, and keep client infrastructure organized
            without jumping between tools.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b5bf5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4a4af0] focus:outline-none focus:ring-2 focus:ring-[#5b5bf5] focus:ring-offset-2 focus:ring-offset-[#0b0e14]"
            >
              Start now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="/open-source"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#111827] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-white/20 hover:text-white"
            >
              Explore open source
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              ["Servers", "128"],
              ["Checks", "99.9%"],
              ["Scripts", "42"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-[#111827] p-4"
              >
                <p className="text-2xl font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-white/10 bg-[#070a12] shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_40%,rgba(91,91,245,0.24),transparent_28%),linear-gradient(135deg,rgba(17,24,39,0.95),rgba(7,10,18,0.98))]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:36px_36px]" />

          <div className="relative grid h-full min-h-[430px] grid-cols-[190px_1fr]">
            <aside className="border-r border-white/10 bg-[#111827]/70 p-5">
              <div className="mb-7 flex items-center gap-2 text-gray-300">
                <LayoutDashboard className="h-4 w-4 text-blue-300" />
                <span className="text-sm font-semibold">Telemetry</span>
              </div>
              <div className="space-y-2">
                {navItems.map(({ label, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
                      active
                        ? "bg-[#5b5bf5]/15 text-white"
                        : "text-gray-500"
                    }`}
                  >
                    <Box className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </div>
                ))}
              </div>
            </aside>

            <section className="p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-xs text-gray-400">
                  <Server className="h-4 w-4 text-blue-300" />
                  Acme
                </div>
                <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-xs text-gray-500">
                  <Search className="h-4 w-4" />
                  Search for logs & traces
                </div>
                <div className="rounded-lg border border-white/10 bg-[#111827] p-2 text-gray-400">
                  <Bell className="h-4 w-4" />
                </div>
              </div>

              <div className="mb-6 flex h-24 items-end gap-2 border-b border-white/10 pb-3">
                {bars.map((height, index) => (
                  <div key={index} className="flex flex-1 items-end gap-1">
                    <span
                      className="w-full rounded-t bg-[#5b5bf5]"
                      style={{ height: `${height}%` }}
                    />
                    <span
                      className="w-full rounded-t bg-blue-300/45"
                      style={{ height: `${Math.max(16, height - 18)}%` }}
                    />
                    <span
                      className="w-full rounded-t bg-rose-400/70"
                      style={{ height: `${Math.max(8, height / 4)}%` }}
                    />
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b0e14]/80">
                <div className="grid grid-cols-[110px_90px_80px_1fr] border-b border-white/10 px-4 py-3 text-xs font-medium text-gray-500">
                  <span>Time</span>
                  <span>Source</span>
                  <span>Level</span>
                  <span>Message</span>
                </div>
                {logs.map(([time, source, level, message]) => (
                  <div
                    key={`${time}-${message}`}
                    className="grid grid-cols-[110px_90px_80px_1fr] border-b border-white/5 px-4 py-3 text-xs text-gray-400 last:border-0"
                  >
                    <span>{time}</span>
                    <span>{source}</span>
                    <span className="text-blue-300">{level}</span>
                    <span className="truncate text-gray-300">{message}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="absolute bottom-5 right-5 hidden w-52 rounded-lg border border-white/10 bg-[#111827]/95 p-4 shadow-xl shadow-black/30 md:block">
            <div className="mb-3 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-emerald-300" />
              <p className="text-sm font-semibold">Health</p>
            </div>
            <p className="text-3xl font-semibold text-white">99.9%</p>
            <p className="mt-1 text-xs text-gray-500">All core checks online</p>
          </div>

          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#070a12] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#070a12] to-transparent" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl border-t border-white/10 py-16">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-3 py-1 text-sm font-medium text-blue-200">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Built for server operations
            </div>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
              One workspace for the people, servers, checks, and alerts that
              keep your apps alive.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-gray-400">
            Inspired by modern observability tools, PulseTask keeps the UI dense,
            readable, and focused on the actions your team needs during real
            infrastructure work.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {featureSections.map(
            ({ eyebrow, title, text, icon: Icon, accent, preview, points }) => (
              <article
                key={title}
                className="grid gap-6 rounded-lg border border-white/10 bg-[#111827] p-5 shadow-xl shadow-black/20 md:grid-cols-[1fr_0.95fr]"
              >
                <div>
                  <div
                    className={`mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-[#0b0e14] ${accent}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    {eyebrow}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {points.map((point) => (
                      <span
                        key={point}
                        className="rounded-full border border-white/10 bg-[#0b0e14] px-3 py-1 text-xs font-medium text-gray-300"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#070a12] p-3">
                  {renderFeaturePreview(preview)}
                </div>
              </article>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 rounded-lg border border-white/10 bg-[#111827] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-200">
            <TerminalSquare className="h-4 w-4" aria-hidden="true" />
            From alert to action
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white">
            See the problem, notify the team, then fix the server from the same
            workflow.
          </h2>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            PulseTask connects the operational loop: teams own servers, uptime
            checks create logs, Discord receives urgent alerts, and the CLI gives
            you a fast path back to the machine.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["1", "Store website or app", "Add the target you want PulseTask to watch."],
            ["2", "Track automatic pings", "Every check records status and response time."],
            ["3", "Alert Discord fast", "Dangerous events are sent to your channel."],
            ["4", "Run the fix", "Use SSH keys and CLI commands to respond."],
          ].map(([step, title, text]) => (
            <div
              key={step}
              className="rounded-lg border border-white/10 bg-[#0b0e14] p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5b5bf5] text-sm font-semibold text-white">
                {step}
              </span>
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
