import React from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  Box,
  Gauge,
  LayoutDashboard,
  Search,
  Server,
  TerminalSquare,
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
    </main>
  );
};
