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
import { Server } from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────

const networkData = [
  { time: "00", ingress: 3.1, egress: 1.4 },
  { time: "02", ingress: 2.7, egress: 1.1 },
  { time: "04", ingress: 2.0, egress: 0.9 },
  { time: "06", ingress: 2.4, egress: 1.0 },
  { time: "08", ingress: 3.8, egress: 1.7 },
  { time: "10", ingress: 4.2, egress: 2.1 },
  { time: "12", ingress: 4.82, egress: 2.91 },
  { time: "14", ingress: 4.5, egress: 2.6 },
  { time: "16", ingress: 4.1, egress: 2.3 },
  { time: "18", ingress: 3.7, egress: 2.0 },
  { time: "20", ingress: 3.3, egress: 1.8 },
  { time: "22", ingress: 3.0, egress: 1.5 },
];

const connectionData = [
  { h: 9200 },
  { h: 10500 },
  { h: 11200 },
  { h: 10800 },
  { h: 11800 },
  { h: 12100 },
  { h: 12405 },
  { h: 11900 },
];

const statStrip = [
  { label: "Total Servers", value: "5", sub: "4 Online, 1 Offline" },
  { label: "Average Latency", value: "24ms", sub: null },
  { label: "Uptime", value: "99.98%", sub: null },
  { label: "Recent Script Runs", value: "12", sub: "last 24h" },
];

const servers = [
  { name: "prod-db-01", ip: "10.0.1.4", status: "online", latency: "18ms" },
  { name: "prod-api-02", ip: "10.0.2.11", status: "online", latency: "22ms" },
  { name: "staging-web-03", ip: "10.0.3.8", status: "online", latency: "31ms" },
  { name: "cache-redis-04", ip: "10.0.4.22", status: "online", latency: "12ms" },
  { name: "worker-q-05", ip: "10.0.5.7", status: "offline", latency: "—" },
];

const resourceDonut = [
  { name: "Disk", value: 82, color: "#3b82f6" },
  { name: "RAM", value: 59, color: "#f97316" },
  { name: "CPU", value: 42, color: "#eab308" },
];

const execLog = [
  { script: "db-backup.sh", target: "Completed in 4m 12s · 2 min ago", status: "success", color: "#22c55e" },
  { script: "cache-flush.sh", target: "Running on cache-redis-04 · now", status: "pending", color: "#f97316" },
  { script: "deploy-worker.sh", target: "Rolled back · 18 min ago", status: "success", color: "#22c55e" },
  { script: "health-check.sh", target: "Failed on worker-q-05 · 32 min ago", status: "failed", color: "#ef4444" },
];

const terminalLines = [
  { text: "$ pulsetask run db-backup.sh --env prod", color: "#4ade80" },
  { text: "✓ Connected to prod-db-01 (10.0.1.4)", color: "#86efac" },
  { text: "  Dumping schema ... 14.2 MB", color: "#9ca3af" },
  { text: "  Compressing archive ...", color: "#9ca3af" },
  { text: "✓ Backup saved: backup_20240012.tar.gz", color: "#86efac" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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
    pending: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    failed: "bg-rose-500/15 text-rose-300 border border-rose-500/30",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold capitalize ${map[status] ?? ""}`}>
      {status}
    </span>
  );
};

const UptimeBar = ({ status }) => (
  <div className="flex gap-[2px]">
    {Array.from({ length: 20 }).map((_, i) => (
      <span
        key={i}
        className={`h-3 w-[3px] rounded-sm ${
          status === "online"
            ? i < 18 ? "bg-emerald-400" : "bg-rose-500"
            : i < 14 ? "bg-emerald-400" : "bg-rose-500"
        }`}
      />
    ))}
  </div>
);

const MiniConnections = () => (
  <ResponsiveContainer width="100%" height={48}>
    <BarChart data={connectionData} barSize={8}>
      <Bar dataKey="h" fill="#3b82f6" radius={[2, 2, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-gray-300">{label}:00</p>
      <p className="text-blue-300">Ingress: {payload[0]?.value} Gbps</p>
      <p className="text-rose-400">Egress: {payload[1]?.value} Gbps</p>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export const Dashboard = () => {
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlink((b) => !b), 700);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
    <div className="grid gap-4 xl:grid-cols-[1fr_260px]">
      {/* Network Throughput */}
      <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Network Throughput</p>
            <p className="text-xs text-gray-500">Ingress vs. Egress · last 24 hours</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Ingress</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Egress</span>
          </div>
        </div>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={networkData} barGap={3} barCategoryGap="30%">
              <XAxis dataKey="time" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}h`} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}G`} width={32} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar dataKey="ingress" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="egress" fill="#ef4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right stat cards */}
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
          <p className="text-xs text-gray-400">Peak Ingress</p>
          <p className="mt-1 text-3xl font-bold text-white">4.82 <span className="text-sm font-normal text-gray-400">Gbps</span></p>
          <p className="mt-1 text-xs text-emerald-400">↑ +6.4% vs yesterday</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#111827] p-4">
          <p className="text-xs text-gray-400">Peak Egress</p>
          <p className="mt-1 text-3xl font-bold text-white">2.91 <span className="text-sm font-normal text-gray-400">Gbps</span></p>
          <p className="mt-1 text-xs text-rose-400">↓ −1.2% vs yesterday</p>
        </div>
        <div className="flex-1 rounded-xl border border-white/10 bg-[#111827] p-4">
          <p className="text-xs text-gray-400">Active Connections</p>
          <MiniConnections />
          <p className="text-sm text-white"><span className="font-bold text-blue-300">12,405</span> <span className="text-xs text-gray-500">concurrent</span></p>
        </div>
      </div>

      {/* Stat Strip */}
      <div className="col-span-full grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statStrip.map(({ label, value, sub }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-[#111827] p-5">
            <p className="text-xs font-medium text-gray-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Server Health + Resource panel */}
      <div className="col-span-full grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="rounded-xl border border-white/10 bg-[#111827]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <p className="font-semibold text-white">Server Health</p>
          </div>
          <table className="w-full">
            <thead className="sr-only">
              <tr><th>Server</th><th>IP</th><th>Status</th><th>Latency</th><th>Uptime</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {servers.map((s) => (
                <tr key={s.name} className="transition hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded border border-white/10 bg-[#0b0e14]">
                        <Server className="h-3 w-3 text-gray-400" />
                      </span>
                      <span className="font-mono text-xs text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-400">{s.ip}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1.5 text-xs font-semibold ${s.status === "online" ? "text-emerald-400" : "text-rose-400"}`}>
                      <StatusDot status={s.status} />{s.status === "online" ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-300">{s.latency}</td>
                  <td className="px-5 py-3.5"><UptimeBar status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4">
          {/* Resource Utilization */}
          <div className="rounded-xl border border-white/10 bg-[#111827] p-5">
            <p className="font-semibold text-white">Resource Utilization</p>
            <p className="text-xs text-gray-500">Cluster average</p>
            <div className="relative mx-auto mt-3 h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={resourceDonut} cx="50%" cy="50%" innerRadius={46} outerRadius={62} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    {resourceDonut.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-white">42%</span>
                <span className="text-[10px] text-gray-500">Avg load</span>
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-3 text-[10px] text-gray-400">
              {resourceDonut.map((r) => (
                <span key={r.name} className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ background: r.color }} />
                  {r.name} {r.value}%
                </span>
              ))}
            </div>
          </div>

          {/* Live Execution Log */}
          <div className="flex-1 rounded-xl border border-white/10 bg-[#111827] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-white">Live Execution Log</p>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
              </span>
            </div>
            <div className="space-y-3">
              {execLog.map((item) => (
                <div key={item.script} className="flex items-start gap-2.5">
                  <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: item.color }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-mono text-xs font-semibold text-white">{item.script}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-gray-500">{item.target}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-[#060809] p-3 font-mono">
              <div className="mb-2 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 text-[10px] text-gray-600">terminal — bash</span>
              </div>
              {terminalLines.map((line, i) => (
                <p key={i} className="text-[10px] leading-5" style={{ color: line.color }}>{line.text}</p>
              ))}
              <p className="text-[10px] leading-5 text-emerald-400">{blink ? "█" : " "}</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
