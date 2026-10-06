import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Activity, Clock, LoaderCircle, Server, Terminal } from "lucide-react";
import { useGetDashboardSummaryQuery } from "../../features/tasks/tasksApiSlice";

const resourceDonut = [
  { name: "Healthy", value: 85, color: "#22c55e" },
  { name: "Degraded", value: 10, color: "#f97316" },
  { name: "Down", value: 5, color: "#ef4444" },
];

const StatusDot = ({ status }) => (
  <span
    className={`inline-block h-2 w-2 rounded-full ${
      status === "online" ? "bg-emerald-400" : "bg-rose-500"
    }`}
  />
);

const StatusBadge = ({ status }) => {
  const map = {
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    running: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    pending: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    failed: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  };
  return (
    <span
      className={`rounded px-2 py-0.5 text-[10px] font-semibold capitalize ${
        map[status] ?? "bg-gray-500/15 text-gray-300 border border-gray-500/30"
      }`}
    >
      {status}
    </span>
  );
};

const UptimeBar = ({ recentPings = [], status }) => {
  if (recentPings.length === 0) {
    return (
      <div className="flex gap-[2px]">
        {Array.from({ length: 15 }).map((_, i) => (
          <span
            key={i}
            className={`h-3 w-[3px] rounded-sm ${
              status === "online" ? "bg-emerald-400/80" : "bg-rose-500/80"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-[2px]">
      {recentPings.slice(-15).map((p, i) => (
        <span
          key={i}
          className={`h-3 w-[3px] rounded-sm ${
            p.is_up ? "bg-emerald-400" : "bg-rose-500"
          }`}
          title={`${p.response_time_ms}ms at ${p.time}`}
        />
      ))}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-gray-300">{label}</p>
      <p className="text-purple-300">Avg Latency: {payload[0]?.value} ms</p>
    </div>
  );
};

export const Dashboard = () => {
  const [blink, setBlink] = useState(true);

  // Poll dashboard summary every 10 seconds
  const { data, isLoading } = useGetDashboardSummaryQuery(undefined, {
    pollingInterval: 10000,
  });

  const summary = data?.summary;

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 700);
    return () => clearInterval(id);
  }, []);

  const statStrip = [
    {
      label: "Total Servers",
      value: summary?.total_servers ?? 0,
      sub: `${summary?.online_servers ?? 0} Online, ${
        summary?.offline_servers ?? 0
      } Offline`,
    },
    {
      label: "Average Latency",
      value: summary?.average_latency ?? "—",
      sub: "last 24 hours",
    },
    {
      label: "Uptime",
      value: summary?.uptime_percentage ?? "100%",
      sub: "cluster average",
    },
    {
      label: "Recent Script Runs",
      value: summary?.runs_last_24h ?? 0,
      sub: "last 24 hours",
    },
  ];

  const serversList = summary?.servers || [];
  const recentRuns = summary?.recent_runs || [];
  const latencyChartData = summary?.latency_chart || [];
  const latestRun = recentRuns[0];

  return (
    <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* ── Top Grid: Latency Chart + Quick Stats ─────────────────────── */}
      <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
        {/* Latency History Chart */}
        <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Cluster Average Latency (ms)
              </p>
              <p className="text-xs text-gray-500">
                HTTP Ping monitors response time · last 24 hours
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-purple-400">
              <Activity className="h-3.5 w-3.5" />
              <span>Real-time Metrics</span>
            </div>
          </div>
          <div className="mt-4 h-52">
            {isLoading ? (
              <div className="grid h-full place-items-center text-xs text-gray-400">
                <LoaderCircle className="h-5 w-5 animate-spin text-[#7169ff]" />
              </div>
            ) : latencyChartData.length === 0 ||
              latencyChartData.every((d) => d.latency === 0) ? (
              <div className="grid h-full place-items-center rounded-lg border border-dashed border-white/5 text-xs text-gray-500">
                No latency history recorded yet. Configure server uptime checks to see live metrics.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latencyChartData} barGap={3}>
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}ms`}
                    width={40}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="latency"
                    fill="#7169ff"
                    radius={[3, 3, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right stat cards */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-gray-400">Active Monitors</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {summary?.online_servers ?? 0}
              <span className="text-sm font-normal text-gray-400">
                {" "}
                / {summary?.total_servers ?? 0} servers
              </span>
            </p>
            <p className="mt-1 text-xs text-emerald-400">
              {summary?.uptime_percentage ?? "100%"} operational
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-gray-400">Average Latency</p>
            <p className="mt-1 text-3xl font-bold text-white">
              {summary?.average_latency ?? "—"}
            </p>
            <p className="mt-1 text-xs text-gray-400">HTTP endpoint pings</p>
          </div>
          <div className="flex-1 rounded-xl border border-white/10 bg-[#111827] p-4">
            <p className="text-xs text-gray-400">Executions</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {summary?.runs_last_24h ?? 0}{" "}
              <span className="text-xs font-normal text-gray-400">
                runs today
              </span>
            </p>
            <p className="mt-1 text-xs text-purple-300">
              CLI &amp; Dashboard Automations
            </p>
          </div>
        </div>

        {/* ── Stat Strip ────────────────────────────────────────────────── */}
        <div className="col-span-full grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statStrip.map(({ label, value, sub }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#111827] p-5"
            >
              <p className="text-xs font-medium text-gray-400">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
              {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
            </div>
          ))}
        </div>

        {/* ── Server Health + Resource / Log Panel ──────────────────────── */}
        <div className="col-span-full grid gap-4 xl:grid-cols-[1fr_320px]">
          {/* Server Health Table */}
          <div className="rounded-xl border border-white/10 bg-[#111827]">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <p className="font-semibold text-white">Server Health &amp; Status</p>
              <span className="text-xs text-gray-500">
                {serversList.length} configured
              </span>
            </div>
            {serversList.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500">
                No servers added yet. Add servers in the Servers tab to view live health.
              </div>
            ) : (
              <table className="w-full">
                <thead className="border-b border-white/5 bg-black/20 text-xs text-gray-400">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-medium">Server</th>
                    <th className="px-5 py-2.5 text-left font-medium">IP Address</th>
                    <th className="px-5 py-2.5 text-left font-medium">Status</th>
                    <th className="px-5 py-2.5 text-left font-medium">Latency</th>
                    <th className="px-5 py-2.5 text-right font-medium">Recent Pings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {serversList.map((s) => (
                    <tr
                      key={s.id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-[#0b0e14]">
                            <Server className="h-3 w-3 text-gray-400" />
                          </span>
                          <span className="font-mono text-xs text-white">
                            {s.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                        {s.ip}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`flex items-center gap-1.5 text-xs font-semibold ${
                            s.status === "online"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }`}
                        >
                          <StatusDot status={s.status} />
                          {s.status === "online" ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-300">
                        {s.latency}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-block">
                          <UptimeBar
                            recentPings={s.recent_pings}
                            status={s.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Live Execution Log & Terminal */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 rounded-xl border border-white/10 bg-[#111827] p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-white">Live Execution Log</p>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{" "}
                  Auto-sync
                </span>
              </div>

              {recentRuns.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-500">
                  No script runs recorded yet. Run a script from the Scripts tab or via CLI!
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRuns.slice(0, 5).map((item) => {
                    const dotColor =
                      item.status === "success"
                        ? "#22c55e"
                        : item.status === "running"
                        ? "#3b82f6"
                        : item.status === "pending"
                        ? "#f97316"
                        : "#ef4444";

                    return (
                      <div key={item.id} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
                          style={{ background: dotColor }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-mono text-xs font-semibold text-white">
                              {item.script?.title || "Automation Script"}
                            </p>
                            <StatusBadge status={item.status} />
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-gray-500">
                            {item.server?.name || "Server"} · by{" "}
                            {item.user?.name || "User"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Terminal View */}
              <div className="mt-4 rounded-lg bg-[#060809] p-3 font-mono">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-[10px] text-gray-500">
                      latest-execution
                    </span>
                  </div>
                  <Terminal className="h-3 w-3 text-gray-600" />
                </div>
                {latestRun ? (
                  <div className="space-y-1 text-[10px] text-gray-300">
                    <p className="text-emerald-400">
                      $ pulsetask run {latestRun.script?.script_slug} --on{" "}
                      {latestRun.server?.name}
                    </p>
                    <p className="text-gray-500">
                      status: [{latestRun.status}]
                    </p>
                    {latestRun.output && (
                      <p className="line-clamp-3 text-gray-400">
                        {latestRun.output}
                      </p>
                    )}
                    {latestRun.error_output && (
                      <p className="line-clamp-2 text-rose-400">
                        {latestRun.error_output}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] leading-5 text-gray-600">
                    $ awaiting script execution...
                  </p>
                )}
                <p className="mt-1 text-[10px] text-emerald-400">
                  {blink ? "█" : " "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
