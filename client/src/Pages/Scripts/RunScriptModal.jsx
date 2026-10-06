import { useState, useEffect } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  LoaderCircle,
  Play,
  Server as ServerIcon,
  Terminal,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useGetServersQuery } from "../../features/servers/serversApiSlice";
import {
  useGetScriptRunQuery,
  useTriggerMutation,
} from "../../features/tasks/tasksApiSlice";

export const RunScriptModal = ({ script, onClose }) => {
  const [activeTab, setActiveTab] = useState("web"); // 'web' | 'cli'
  const [selectedServerId, setSelectedServerId] = useState("");
  const [activeRunId, setActiveRunId] = useState(null);
  const [copiedCli, setCopiedCli] = useState(false);

  // Fetch servers for selection
  const { data: serversData, isLoading: isServersLoading } = useGetServersQuery();
  const servers = serversData?.servers?.data || serversData?.servers || [];

  // Script Trigger Mutation
  const [triggerRun, { isLoading: isStartingRun }] = useTriggerMutation();

  // Polling run status once activeRunId is set
  const {
    data: runData,
    isLoading: isRunDataLoading,
  } = useGetScriptRunQuery(activeRunId, {
    skip: !activeRunId,
    pollingInterval: activeRunId ? 1500 : 0,
  });

  const run = runData?.run;
  const isFinished = run?.status === "success" || run?.status === "failed";

  // Pre-select first server when loaded
  useEffect(() => {
    if (servers.length > 0 && !selectedServerId) {
      setSelectedServerId(servers[0].id);
    }
  }, [servers, selectedServerId]);

  const selectedServer = servers.find(
    (s) => String(s.id) === String(selectedServerId)
  );

  const handleExecute = async () => {
    if (!selectedServerId) {
      toast.error("Please select a target server.");
      return;
    }

    try {
      const res = await triggerRun({
        scriptId: script.id,
        serverId: selectedServerId,
      }).unwrap();

      toast.success("Script execution queued!");
      setActiveRunId(res.run_id);
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to start script execution on server."
      );
    }
  };

  // Generate CLI Command
  const serverIp = selectedServer?.ip_address || "<SERVER_IP>";
  const cliCurlCommand = `curl -X POST http://localhost:8000/api/cli/run-script \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"ip_address": "${serverIp}", "script_slug": "${script.script_slug}"}'`;

  const cliStatusCommand = `curl http://localhost:8000/api/cli/run-status/<RUN_ID> \\
  -H "Authorization: Bearer <YOUR_API_TOKEN>"`;

  const handleCopyCli = async () => {
    try {
      await navigator.clipboard.writeText(cliCurlCommand);
      setCopiedCli(true);
      toast.success("CLI command copied to clipboard!");
      setTimeout(() => setCopiedCli(false), 2000);
    } catch {
      toast.error("Failed to copy command.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-[#111827] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">
                Execute Script: {script.title}
              </h2>
              <p className="font-mono text-xs text-purple-300">
                slug: {script.script_slug}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        {!activeRunId && (
          <div className="flex border-b border-white/10 px-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("web")}
              className={`border-b-2 py-3 transition ${
                activeTab === "web"
                  ? "border-[#7169ff] text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Interactive Terminal
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cli")}
              className={`ml-6 border-b-2 py-3 transition ${
                activeTab === "cli"
                  ? "border-[#7169ff] text-white"
                  : "border-transparent text-gray-400 hover:text-gray-200"
              }`}
            >
              Run from CLI / Terminal
            </button>
          </div>
        )}

        <div className="overflow-y-auto p-5">
          {/* ── MODE 1: Interactive Run ── */}
          {activeTab === "web" && (
            <div>
              {!activeRunId ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Select Target Server *
                    </label>
                    {isServersLoading ? (
                      <div className="flex items-center gap-2 py-2 text-xs text-gray-400">
                        <LoaderCircle className="h-4 w-4 animate-spin text-[#7169ff]" />
                        Loading servers...
                      </div>
                    ) : servers.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-rose-500/20 bg-rose-500/5 p-4 text-xs text-rose-300">
                        <AlertCircle className="mb-1 inline h-4 w-4" /> No servers
                        available. Please add a server in the Servers page first.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {servers.map((s) => (
                          <label
                            key={s.id}
                            className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                              String(selectedServerId) === String(s.id)
                                ? "border-[#7169ff] bg-[#7169ff]/10"
                                : "border-white/10 bg-[#0b0e14] hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="server_select"
                                value={s.id}
                                checked={String(selectedServerId) === String(s.id)}
                                onChange={() => setSelectedServerId(s.id)}
                                className="accent-[#7169ff]"
                              />
                              <div>
                                <span className="block text-xs font-bold text-white">
                                  {s.name}
                                </span>
                                <span className="block font-mono text-[11px] text-gray-400">
                                  {s.ssh_user}@{s.ip_address}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                s.status === "online"
                                  ? "bg-emerald-500/15 text-emerald-300"
                                  : "bg-gray-500/15 text-gray-400"
                              }`}
                            >
                              {s.status}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary preview */}
                  <div className="rounded-xl border border-white/5 bg-[#0b0e14] p-3 text-xs text-gray-400">
                    <p className="font-semibold text-gray-300">Execution Plan:</p>
                    <p className="mt-1">
                      PulseTask will connect via SSH to the server using its stored
                      private key, execute the script lines sequentially, and capture
                      standard output and errors.
                    </p>
                  </div>
                </div>
              ) : (
                /* Active Execution Terminal Output */
                <div className="space-y-3">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0b0e14] px-4 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      {run?.status === "pending" && (
                        <Clock className="h-4 w-4 text-orange-400" />
                      )}
                      {run?.status === "running" && (
                        <LoaderCircle className="h-4 w-4 animate-spin text-[#7169ff]" />
                      )}
                      {run?.status === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      {run?.status === "failed" && (
                        <XCircle className="h-4 w-4 text-rose-400" />
                      )}
                      <span className="font-semibold capitalize text-white">
                        Status: {run?.status || "Pending..."}
                      </span>
                    </div>

                    <div className="font-mono text-gray-400">
                      Run #{activeRunId} · Server: {selectedServer?.name}
                    </div>
                  </div>

                  {/* Terminal Window */}
                  <div className="rounded-xl border border-white/10 bg-[#060809] p-4 font-mono text-xs">
                    <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2 text-[11px] text-gray-500">
                      <div className="flex gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        <span className="ml-2 text-gray-400">
                          ssh-session ({selectedServer?.ip_address})
                        </span>
                      </div>
                      <span>bash</span>
                    </div>

                    <div className="max-h-64 overflow-y-auto leading-relaxed text-emerald-300 whitespace-pre-wrap">
                      <p className="text-gray-500">
                        $ connecting to {selectedServer?.ssh_user}@
                        {selectedServer?.ip_address}...
                      </p>
                      {run?.status === "pending" && (
                        <p className="text-orange-300">
                          &gt; Job queued in database, worker executing...
                        </p>
                      )}
                      {run?.output && (
                        <div className="mt-2 text-gray-200">{run.output}</div>
                      )}
                      {run?.error_output && (
                        <div className="mt-2 text-rose-400">
                          {run.error_output}
                        </div>
                      )}
                      {!isFinished && (
                        <span className="animate-pulse text-[#7169ff]">█</span>
                      )}
                    </div>
                  </div>

                  {isFinished && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setActiveRunId(null)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                      >
                        Run Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── MODE 2: Run via CLI ── */}
          {activeTab === "cli" && (
            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-white/10 bg-[#0b0e14] p-4 text-gray-300">
                <p className="font-semibold text-white">How to execute from CLI:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-4 text-gray-400">
                  <li>Generate an API Token in the Servers page.</li>
                  <li>
                    Replace <code className="text-purple-300">&lt;YOUR_API_TOKEN&gt;</code> with your token.
                  </li>
                  <li>
                    Send a POST request to <code className="text-purple-300">/api/cli/run-script</code>.
                  </li>
                </ol>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    CLI Trigger Command:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCli}
                    className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-1 text-[11px] text-gray-300 transition hover:bg-white/10"
                  >
                    {copiedCli ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Command
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#060809] p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
                  <code>{cliCurlCommand}</code>
                </pre>
              </div>

              <div>
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  Poll Execution Status Command:
                </span>
                <pre className="overflow-x-auto rounded-xl border border-white/10 bg-[#060809] p-3 font-mono text-[11px] leading-relaxed text-purple-300">
                  <code>{cliStatusCommand}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            {activeRunId && !isFinished ? "Close (Runs in Background)" : "Close"}
          </button>

          {!activeRunId && activeTab === "web" && (
            <button
              type="button"
              onClick={handleExecute}
              disabled={isStartingRun || servers.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#5b5bf5] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#6b6bff] disabled:opacity-50"
            >
              {isStartingRun ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-current" />
              )}
              Execute on {selectedServer?.name || "Server"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
