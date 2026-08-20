import React, { useState } from "react";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  Globe,
  HardDrive,
  LayoutDashboard,
  Search,
  Server,
  Sparkles,
  Terminal,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Platform = () => {
  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does server authentication work?",
      a: "PulseTask uses secure SSH key generation and localized agent keys. You store your public keys on your host, and PulseTask connects safely over SSH without storing private credentials on public nodes.",
    },
    {
      q: "Can I connect custom webhooks like Discord or Slack?",
      a: "Yes! PulseTask supports native Discord webhooks out of the box, as well as generic HTTP endpoints for custom internal alerting systems.",
    },
    {
      q: "Is there a self-hosted or open-source version?",
      a: "PulseTask core components are open source. You can run the light collector agent on your own servers or use our hosted control plane.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#06080d] text-white font-sans selection:bg-blue-600 selection:text-white">
      {/* BACKGROUND GRID OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-32 sm:space-y-40">
        
        {/* ================= HERO SECTION ================= */}
        <section className="flex flex-col items-center text-center pt-8 sm:pt-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Introducing PulseTask</span>
          </div>

          {/* Main Title */}
          <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[1.02] max-w-5xl">
            A Singular <br className="hidden sm:inline" />
            Control Plane <br className="hidden sm:inline" />
            For Distributed <br className="hidden sm:inline" />
            Teams.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-3xl text-xs sm:text-sm md:text-base font-medium uppercase tracking-wider text-gray-400 leading-relaxed">
            PulseTask gives teams a clean, fast way to monitor, run scripts, and distribute heavy workloads across their infrastructure without a verbose, complex setup built for developers.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-blue-600 px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all duration-200"
            >
              <span>Request Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#documentation"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>Explore Documentation</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Dashboard Preview Window */}
          <div className="mt-16 w-full rounded-2xl border border-white/15 bg-[#090c14]/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-[#0c0f1a]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-4 text-xs font-mono text-gray-400">pulsetask-control-plane v2.4.0</span>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-gray-400 font-mono">
                <span className="text-blue-400">● Live telemetry</span>
                <span>Region: us-east-1</span>
                <span>Latency: 12ms</span>
              </div>
            </div>

            {/* Dashboard Workspace Mockup */}
            <div className="grid lg:grid-cols-[220px_1fr] min-h-[440px] text-left">
              {/* Sidebar */}
              <div className="hidden lg:block border-r border-white/10 bg-[#070a12] p-4 space-y-6">
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-gray-400">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Telemetry</span>
                </div>
                <nav className="space-y-1.5">
                  {[
                    "Telemetry",
                    "Sources",
                    "Collectors",
                    "Services",
                    "Logs & Traces",
                    "Dashboards",
                    "Alerts",
                  ].map((item, idx) => (
                    <div
                      key={item}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium ${
                        idx === 4
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                      }`}
                    >
                      <span>{item}</span>
                      {idx === 4 && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    </div>
                  ))}
                </nav>
              </div>

              {/* Main Panel */}
              <div className="p-4 sm:p-6 space-y-6 bg-[#090d16]">
                {/* Search & Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[#101524] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-300">
                      <Server className="w-3.5 h-3.5 text-blue-400" />
                      <span>Cluster: Acme-Prod-01</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#101524] border border-white/10 px-3 py-1.5 rounded-lg text-xs text-gray-400">
                      <Search className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Filter logs & traces...</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    <span>System Operational (99.99%)</span>
                  </div>
                </div>

                {/* Histogram Visual Bars */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span>Task Execution Rate (Ops / sec)</span>
                    <span className="text-blue-400">4,820 req/s</span>
                  </div>
                  <div className="h-28 flex items-end gap-1.5 border-b border-white/10 pb-2">
                    {[40, 65, 30, 85, 45, 90, 75, 50, 95, 60, 80, 42, 70, 88, 55, 78, 92, 64, 82, 98].map(
                      (h, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                          <div
                            style={{ height: `${h}%` }}
                            className={`w-full rounded-t transition-all ${
                              h > 90
                                ? "bg-rose-500"
                                : h > 70
                                ? "bg-blue-500"
                                : "bg-blue-600/40"
                            }`}
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Log Table Stream */}
                <div className="rounded-xl border border-white/10 bg-[#06080e] overflow-hidden text-xs font-mono">
                  <div className="grid grid-cols-[100px_90px_80px_1fr] bg-[#0c101b] border-b border-white/10 px-4 py-2.5 text-gray-400 font-bold">
                    <span>TIME</span>
                    <span>SOURCE</span>
                    <span>LEVEL</span>
                    <span>MESSAGE</span>
                  </div>
                  <div className="divide-y divide-white/5 text-gray-300">
                    {[
                      ["18:37:01", "web-01", "INFO", "Deploying build release #8491..."],
                      ["18:37:02", "worker-4", "DEBUG", "Parallel script execution thread #201 started"],
                      ["18:37:03", "db-master", "INFO", "Database query pool optimized in 14ms"],
                      ["18:37:04", "edge-node", "WARN", "High memory load handled by auto-scaler"],
                    ].map(([t, s, l, msg], idx) => (
                      <div key={idx} className="grid grid-cols-[100px_90px_80px_1fr] px-4 py-2.5 hover:bg-white/5 transition-colors">
                        <span className="text-gray-500">{t}</span>
                        <span className="text-gray-400">{s}</span>
                        <span className={l === "WARN" ? "text-amber-400" : "text-blue-400"}>{l}</span>
                        <span className="truncate text-gray-200">{msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Central Processor Chip Watermark */}
                <div className="flex justify-center pt-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-mono text-blue-400">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>Neural Control Core Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ================= SECTION 1: Orchestrate your entire fleet ================= */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Orchestrate your <br />
              entire fleet.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Deploy and monitor heavy computing workloads across servers. Enable your team to run scripts in parallel and inspect outputs with single-click remote execution.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Native Multi-cloud & On-prem Support",
                "Zero-downtime Task Execution Queue",
                "Real-time Command Stream Logs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual Stacked Cards */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-[#0a0d16] p-4 hover:border-blue-500/40 transition-colors shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="font-mono">Cluster-A</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">48</p>
              <p className="text-xs text-gray-500 mt-1">Active Nodes</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0a0d16] p-4 hover:border-blue-500/40 transition-colors shadow-lg">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="font-mono">Queue</span>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">1,240</p>
              <p className="text-xs text-gray-500 mt-1">Tasks Executing</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0a0d16] p-4 hover:border-blue-500/40 transition-colors shadow-lg sm:col-span-1">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                <span className="font-mono">Uptime</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-white">99.99%</p>
              <p className="text-xs text-gray-500 mt-1">SLA Metric</p>
            </div>
          </div>
        </section>


        {/* ================= SECTION 2: See everything, instantly ================= */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Visual Cards */}
          <div className="order-2 lg:order-1 grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#0c101c] p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                <Activity className="w-4 h-4" />
                <span>Telemetry</span>
              </div>
              <div className="h-16 flex items-end gap-1">
                {[30, 50, 40, 80, 60, 90, 70, 100].map((h, idx) => (
                  <div key={idx} style={{ height: `${h}%` }} className="flex-1 bg-blue-500 rounded-t" />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0c101c] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Uptime</span>
                <Clock className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-3xl font-mono font-bold text-white">12:40</p>
              <p className="text-xs text-emerald-400">0 dropped packets</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0c101c] p-4 space-y-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-400 border-b border-white/10 pb-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Log stream</span>
              </div>
              <p className="text-emerald-400">$ pulsetask check</p>
              <p className="text-gray-400 truncate">OK: 12 targets</p>
            </div>
          </div>

          {/* Right Text */}
          <div className="order-1 lg:order-2 space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              See everything, <br />
              instantly.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Stream logs instantly without latency. Search and filter across every microservice and host from one central dashboard.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Instant Uptime & Latency Telemetry",
                "Automated Discord & Webhook Alerts",
                "Deep Context Incident Tracking",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>


        {/* ================= SECTION 3: Collaborate without friction ================= */}
        <section className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="space-y-6 text-left">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Collaborate <br />
              without friction.
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Share server access, delegate permissions to team members, and trace every command run across your workspace with full transparency.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                "Role-based Workspace Controls",
                "Shared Server SSH Key Access",
                "Real-time Audit Trail",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-gray-200">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0a0d16] p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-sm text-white">Team Access Control</span>
              </div>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-mono border border-blue-500/30">
                3 Active Members
              </span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Alex Chen", role: "DevOps Lead", status: "Active" },
                { name: "Sarah Kim", role: "Infra Engineer", status: "Active" },
                { name: "Marcus Vance", role: "VP Engineering", status: "Owner" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between p-3 rounded-lg bg-[#0e1220] border border-white/5 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center border border-blue-500/30">
                      {m.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{m.name}</p>
                      <p className="text-gray-400 text-[11px]">{m.role}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-medium">{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ================= SECTION 4: Built for the edge ================= */}
        <section className="space-y-12 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Built for the edge.
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Distributed Datacenters", desc: "Low-latency regional edge node deployment", icon: Server },
              { title: "High-Bandwidth Cabling", desc: "Direct fiber interconnect channels", icon: HardDrive },
              { title: "Constellation Mesh", desc: "Peer-to-peer task distribution network", icon: Globe },
              { title: "Edge Terminal", desc: "Remote command line interface for operators", icon: Terminal },
            ].map((card, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#090c14] p-6 text-left hover:border-blue-500/50 transition-all duration-300 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ================= SECTION 5: Testimonials ================= */}
        <section className="space-y-12 text-center">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Why teams ship faster.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-gray-400 uppercase tracking-wider max-w-xl mx-auto">
              PulseTask replaced 5 fragmented internal scripts with one unified dashboard for our entire infrastructure team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                quote: "PulseTask cut our server management overhead by half. The team setup took less than 5 minutes.",
                name: "Alex Chen",
                role: "Lead DevOps Engineer",
              },
              {
                quote: "The Discord alerts saved us from a major outage twice this month. You cannot build fast without this.",
                name: "Marcus Vance",
                role: "VP of Engineering",
              },
              {
                quote: "Finally a tool built for teams that actually manage real servers without bloated enterprise complexity.",
                name: "Sarah Kim",
                role: "Infrastructure Lead",
              },
            ].map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-[#090c14] p-6 flex flex-col justify-between space-y-6 shadow-xl">
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs border border-blue-500/30">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= SECTION 6: FAQ Accordion ================= */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Frequently asked questions.
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              Have questions about PulseTask? Find answers below.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-[#090c14] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      openFaq === idx ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* ================= SECTION 7: Pricing ================= */}
        <section id="pricing" className="space-y-12 text-center pt-8">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Pricing.
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-gray-400 uppercase tracking-wider">
              Transparent plans that scale seamlessly with your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto items-stretch">
            {/* Starter */}
            <div className="rounded-2xl border border-white/10 bg-[#090c14] p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Starter</h3>
                <div className="text-4xl font-extrabold text-white">
                  $0 <span className="text-xs font-normal text-gray-500">/ mo</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Up to 3 servers & 1 team member for individuals testing small scripts.
                </p>
              </div>
              <Link
                to="/signup"
                className="w-full text-center rounded-full border border-white/20 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div className="relative rounded-2xl border-2 border-blue-500 bg-[#0c101c] p-8 flex flex-col justify-between space-y-8 shadow-2xl shadow-blue-600/20 scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">Pro</h3>
                <div className="text-4xl font-extrabold text-white">
                  $49 <span className="text-xs font-normal text-gray-500">/ mo</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Unlimited servers, up to 10 team members & Discord alert integration.
                </p>
              </div>
              <Link
                to="/signup"
                className="w-full text-center rounded-full bg-blue-600 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-blue-500 shadow-lg shadow-blue-600/40 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border border-white/10 bg-[#090c14] p-8 flex flex-col justify-between space-y-8">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Enterprise</h3>
                <div className="text-4xl font-extrabold text-white">
                  Custom
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Unlimited team members, dedicated support & custom integrations.
                </p>
              </div>
              <a
                href="#contact"
                className="w-full text-center rounded-full border border-white/20 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

