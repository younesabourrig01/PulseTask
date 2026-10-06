import { useState } from "react";
import {
  Activity,
  CheckCircle2,
  Globe,
  LoaderCircle,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateUptimeCheckMutation,
  useDestroyUptimeCheckMutation,
  useGetUptimeChecksQuery,
  usePingUptimeCheckMutation,
  useUpdateUptimeCheckMutation,
} from "../../features/servers/serversApiSlice";

export const UptimeCheckManager = ({ serverId }) => {
  const { data, isLoading, isError, refetch } = useGetUptimeChecksQuery(serverId);
  const [createCheck, { isLoading: isCreating }] = useCreateUptimeCheckMutation();
  const [updateCheck] = useUpdateUptimeCheckMutation();
  const [destroyCheck, { isLoading: isDeleting }] = useDestroyUptimeCheckMutation();
  const [pingCheck, { isLoading: isPinging }] = usePingUptimeCheckMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activePingingId, setActivePingingId] = useState(null);
  const [form, setForm] = useState({
    url: "",
    expected_status_code: 200,
  });

  const uptimeChecks = data?.uptime_checks || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.url.trim()) return;

    try {
      await createCheck({
        serverId,
        url: form.url.trim(),
        expected_status_code: Number(form.expected_status_code) || 200,
        is_enabled: true,
      }).unwrap();

      toast.success("Uptime check monitor created!");
      setForm({ url: "", expected_status_code: 200 });
      setIsAddOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create uptime check.");
    }
  };

  const handleToggle = async (check) => {
    try {
      await updateCheck({
        checkId: check.id,
        serverId,
        is_enabled: !check.is_enabled,
      }).unwrap();
      toast.success(
        check.is_enabled ? "Monitor paused" : "Monitor activated"
      );
    } catch (err) {
      toast.error("Failed to update monitor status.");
    }
  };

  const handleDelete = async (checkId) => {
    if (!window.confirm("Remove this uptime monitor?")) return;
    try {
      await destroyCheck({ checkId, serverId }).unwrap();
      toast.success("Uptime monitor removed.");
    } catch (err) {
      toast.error("Failed to remove uptime check.");
    }
  };

  const handlePingNow = async (checkId) => {
    setActivePingingId(checkId);
    try {
      const res = await pingCheck({ checkId, serverId }).unwrap();
      const latestPing = res?.latest_ping;
      if (latestPing?.is_up) {
        toast.success(
          `Ping Successful: ${latestPing.response_time_ms}ms (HTTP ${latestPing.status_code})`
        );
      } else {
        toast.error(
          `Ping Failed: ${latestPing?.error_message || "Service offline"}`
        );
      }
      refetch();
    } catch (err) {
      toast.error("Ping execution failed.");
    } finally {
      setActivePingingId(null);
    }
  };

  return (
    <div className="mt-5 border-t border-white/10 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-[#7169ff]" />
          <h3 className="text-sm font-semibold text-white">Uptime Monitors</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-gray-300">
            {uptimeChecks.length}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
        >
          <Plus className="h-3 w-3" />
          {isAddOpen ? "Cancel" : "Add Monitor"}
        </button>
      </div>

      {/* Add Monitor Form */}
      {isAddOpen && (
        <form
          onSubmit={handleCreate}
          className="mb-4 rounded-xl border border-white/10 bg-[#0b0e14] p-3.5"
        >
          <p className="mb-2.5 text-xs font-medium text-gray-300">
            Monitor an HTTP endpoint for uptime and latency
          </p>
          <div className="grid gap-3 sm:grid-cols-[1fr_100px]">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Endpoint URL *
              </label>
              <input
                type="url"
                required
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://my-api.example.com/health"
                className="h-9 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-xs text-white placeholder-gray-600 outline-none transition focus:border-[#7169ff]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Expected HTTP
              </label>
              <input
                type="number"
                value={form.expected_status_code}
                onChange={(e) =>
                  setForm({ ...form, expected_status_code: e.target.value })
                }
                placeholder="200"
                className="h-9 w-full rounded-lg border border-white/10 bg-[#111827] px-3 text-xs text-white placeholder-gray-600 outline-none transition focus:border-[#7169ff]"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#5b5bf5] px-3 py-1.5 text-xs font-semibold text-white shadow transition hover:bg-[#6b6bff] disabled:opacity-50"
            >
              {isCreating && (
                <LoaderCircle className="h-3 w-3 animate-spin" />
              )}
              Save & Start Ping
            </button>
          </div>
        </form>
      )}

      {/* Monitors List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6 text-xs text-gray-400">
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin text-[#7169ff]" />
          Loading monitors...
        </div>
      ) : isError ? (
        <p className="py-4 text-center text-xs text-rose-400">
          Failed to load uptime monitors.
        </p>
      ) : uptimeChecks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 p-5 text-center">
          <Globe className="mx-auto h-6 w-6 text-gray-500" />
          <p className="mt-2 text-xs font-medium text-gray-300">
            No uptime checks configured
          </p>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Add a health URL to monitor response latency and server availability.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {uptimeChecks.map((check) => {
            const latestPing = check.pinglogs?.[0];
            const isUp = latestPing?.is_up;
            const isCurrentlyPinging = activePingingId === check.id;

            return (
              <div
                key={check.id}
                className="rounded-xl border border-white/5 bg-[#0b0e14] p-3 text-xs transition hover:border-white/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          !check.is_enabled
                            ? "bg-gray-500"
                            : isUp
                            ? "bg-emerald-400"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="truncate font-mono font-medium text-white">
                        {check.url}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-gray-300">
                        HTTP {check.expected_status_code}
                      </span>
                      {latestPing ? (
                        <>
                          <span
                            className={`font-semibold ${
                              isUp ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {isUp ? (
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                {latestPing.response_time_ms}ms
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Down
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-500">
                            {new Date(latestPing.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Awaiting first check</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handlePingNow(check.id)}
                      disabled={isCurrentlyPinging}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
                      title="Ping right now"
                    >
                      <RefreshCw
                        className={`h-3.5 w-3.5 ${
                          isCurrentlyPinging ? "animate-spin text-[#7169ff]" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(check)}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold transition ${
                        check.is_enabled
                          ? "bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          : "bg-gray-500/10 text-gray-400 hover:bg-gray-500/20"
                      }`}
                      title={check.is_enabled ? "Pause monitoring" : "Resume monitoring"}
                    >
                      {check.is_enabled ? "Active" : "Paused"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(check.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-1.5 text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                      title="Delete monitor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
