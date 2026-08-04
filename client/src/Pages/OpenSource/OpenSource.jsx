import React from "react";
import {
  ArrowUpRight,
  Cloud,
  Code2,
  GitBranch,
  ServerCog,
  ShieldCheck,
  Users,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

const githubUrl = "https://github.com/younesabourrig01/PulseTask";

const painPoints = [
  {
    title: "Many providers, one workflow",
    text: "Clients rarely live on the same stack. One may pay for Oracle Cloud, another may run on AWS, and the next one may already have a VPS somewhere else.",
    icon: Cloud,
  },
  {
    title: "Built for freelancer reality",
    text: "PulseTask is designed for people who inherit different servers, different access patterns, and different expectations from every client.",
    icon: Users,
  },
  {
    title: "Open by design",
    text: "The project is open source so developers can inspect it, improve it, adapt it, and help shape a practical tool for server operations.",
    icon: GitBranch,
  },
];

const principles = [
  "Centralize server visibility without forcing every client onto one provider.",
  "Keep the interface focused on monitoring, scripts, teams, and real operational work.",
  "Make the codebase approachable for contributors who want to extend PulseTask.",
  "Listen to user notes and keep improving the platform around what server managers actually need.",
];

export const OpenSource = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0e14] px-4 pb-16 pt-24 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#5b5bf5]/30 bg-[#5b5bf5]/10 px-3 py-1 text-sm font-medium text-blue-200">
            <Code2 className="h-4 w-4" aria-hidden="true" />
            Open source server operations
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            PulseTask brings scattered servers into one calm workspace.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            I created PulseTask especially for people who manage many servers
            across many clients. Freelancers and small technical teams often do
            not get to choose one single company or cloud provider for everyone:
            one client has already paid for Oracle Cloud, another uses Amazon
            VPS, and another arrives with a completely different setup. The work
            becomes harder because the infrastructure is spread everywhere.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            PulseTask is my answer to that problem: a place to assemble those
            servers, monitor their health, organize access, and run the daily
            operational tasks from one focused interface.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            I am also open to notes, ideas, and real feedback from users. The
            goal is to keep upgrading PulseTask based on what people actually
            need while managing servers every day.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5b5bf5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4a4af0] focus:outline-none focus:ring-2 focus:ring-[#5b5bf5] focus:ring-offset-2 focus:ring-offset-[#0b0e14]"
            >
              <FaGithub className="h-5 w-5" aria-hidden="true" />
              View on GitHub
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#why-open-source"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-[#111827] px-5 py-3 text-sm font-semibold text-gray-200 transition hover:border-white/20 hover:text-white"
            >
              Why it exists
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-lg border border-white/10 bg-[#111827] p-5 shadow-2xl shadow-black/30">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-gray-400">PulseTask</p>
                <h2 className="text-xl font-semibold">Provider overview</h2>
              </div>
              <ServerCog className="h-7 w-7 text-blue-300" aria-hidden="true" />
            </div>

            <div className="space-y-3">
              {["Oracle Cloud", "Amazon VPS", "Client VPS", "Private Server"].map(
                (provider, index) => (
                  <div
                    key={provider}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0b0e14] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {provider}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Managed inside one workspace
                      </p>
                    </div>
                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                      Online
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="mt-5 rounded-lg border border-[#5b5bf5]/25 bg-[#5b5bf5]/10 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-200" aria-hidden="true" />
                <p className="text-sm font-medium text-blue-100">
                  One place to watch, organize, and operate client servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-open-source"
        className="mx-auto grid w-full max-w-6xl gap-4 py-8 md:grid-cols-3"
      >
        {painPoints.map(({ title, text, icon: Icon }) => (
          <article
            key={title}
            className="rounded-lg border border-white/10 bg-[#111827] p-5"
          >
            <Icon className="mb-4 h-6 w-6 text-blue-300" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl rounded-lg border border-white/10 bg-[#111827] p-6 md:p-8">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Project direction
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              A practical tool, shaped in public.
            </h2>
          </div>
          <div className="space-y-4">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-[#5b5bf5]" />
                <p className="text-sm leading-6 text-gray-300">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
