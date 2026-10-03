import { useEffect, useState } from "react";
import { Check, Copy, Eye, KeyRound, LoaderCircle, Plus, Server, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateServerMutation,
  useDestroyServerMutation,
  useGenerateTokenForServerMutation,
  useGetServersQuery,
  useShowServerQuery,
} from "../../features/servers/serversApiSlice";

const emptyForm = { name: "", ip_address: "", ssh_user: "root", ssh_private_key: "", status: "offline" };
const getError = (error, fallback) => error?.data?.message || Object.values(error?.data?.errors || {}).flat().join(" ") || fallback;

const Field = ({ label, children, className = "" }) => (
  <label className={`grid gap-1.5 text-sm text-gray-300 ${className}`}><span>{label}</span>{children}</label>
);

export const ServersPage = () => {
  const { data, isLoading, isError, error, refetch } = useGetServersQuery();
  const [createServer, { isLoading: isCreating }] = useCreateServerMutation();
  const [destroyServer, { isLoading: isDeleting }] = useDestroyServerMutation();
  const [generateToken, { isLoading: isGeneratingToken }] = useGenerateTokenForServerMutation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedServerId, setSelectedServerId] = useState(null);
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const { data: serverResponse, isFetching: isServerLoading } = useShowServerQuery(selectedServerId, { skip: !selectedServerId });
  const servers = data?.servers?.data || data?.servers || [];
  const selectedServer = serverResponse?.server;

  useEffect(() => { if (!isFormOpen) setForm(emptyForm); }, [isFormOpen]);

  const handleCreate = async (event) => {
    event.preventDefault();
    try { await createServer(form).unwrap(); toast.success("Server added successfully."); setIsFormOpen(false); }
    catch (requestError) { toast.error(getError(requestError, "Unable to add the server.")); }
  };
  const handleDelete = async (server) => {
    if (!window.confirm(`Delete ${server.name}? This cannot be undone.`)) return;
    try { await destroyServer(server.id).unwrap(); if (selectedServerId === server.id) setSelectedServerId(null); toast.success(`${server.name} deleted.`); }
    catch (requestError) { toast.error(getError(requestError, "Unable to delete the server.")); }
  };
  const handleGenerateToken = async () => {
    try { const response = await generateToken(`server-agent-${new Date().toISOString().slice(0, 10)}`).unwrap(); setToken(response?.plain_text_token || ""); setCopied(false); toast.success("Token generated. Copy it now—it will not be shown again."); }
    catch (requestError) { toast.error(getError(requestError, "Unable to generate a token.")); }
  };
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(token); setCopied(true); toast.success("Token copied."); }
    catch { toast.error("Could not copy the token."); }
  };

  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7169ff]">Infrastructure</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Servers</h1><p className="mt-1 text-sm text-gray-400">Manage the servers available to your team.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={handleGenerateToken} disabled={isGeneratingToken} className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm font-semibold text-gray-200 hover:bg-white/5 disabled:opacity-50">{isGeneratingToken ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}Generate token</button><button type="button" onClick={() => setIsFormOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-[#6b6bff]"><Plus className="h-4 w-4" />Add server</button></div>
    </div>
    {token && <div className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-sm font-semibold text-amber-200">Save this token now</p><p className="mt-1 break-all font-mono text-xs text-amber-100/80">{token}</p></div><button type="button" onClick={handleCopy} className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-amber-300/30 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-300/10 sm:self-auto">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? "Copied" : "Copy token"}</button></div></div>}
    <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111827]">
      {isLoading ? <div className="grid min-h-64 place-items-center text-sm text-gray-400"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading servers…</div> : isError ? <div className="p-6 text-sm text-rose-300">{getError(error, "Could not load servers.")} <button type="button" onClick={refetch} className="ml-2 underline">Try again</button></div> : servers.length === 0 ? <div className="grid min-h-64 place-items-center px-6 text-center"><div><div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5b5bf5]/15"><Server className="h-6 w-6 text-[#9b9bff]" /></div><h2 className="mt-4 font-semibold text-white">No servers yet</h2><p className="mt-1 text-sm text-gray-400">Add your first server to start running scripts.</p></div></div> : <div className="overflow-x-auto"><table className="w-full text-left"><thead className="border-b border-white/10 bg-black/10 text-xs uppercase tracking-wider text-gray-500"><tr><th className="px-5 py-3.5 font-medium">Server</th><th className="px-5 py-3.5 font-medium">Address</th><th className="px-5 py-3.5 font-medium">SSH user</th><th className="px-5 py-3.5 font-medium">Status</th><th className="px-5 py-3.5 text-right font-medium">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{servers.map((server) => <tr key={server.id} className="hover:bg-white/[0.025]"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-[#0b0e14]"><Server className="h-4 w-4 text-gray-400" /></span><span className="font-medium text-white">{server.name}</span></div></td><td className="px-5 py-4 font-mono text-sm text-gray-400">{server.ip_address}</td><td className="px-5 py-4 text-sm text-gray-300">{server.ssh_user}</td><td className="px-5 py-4"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${server.status === "online" ? "text-emerald-400" : "text-gray-400"}`}><span className={`h-2 w-2 rounded-full ${server.status === "online" ? "bg-emerald-400" : "bg-gray-500"}`} />{server.status || "unknown"}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button type="button" onClick={() => setSelectedServerId(server.id)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white" title={`View ${server.name}`}><Eye className="h-4 w-4" /></button><button type="button" onClick={() => handleDelete(server)} disabled={isDeleting} className="rounded-lg p-2 text-gray-400 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50" title={`Delete ${server.name}`}><Trash2 className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div>}
    </section>
    {isFormOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><form onSubmit={handleCreate} className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold text-white">Add server</h2><p className="mt-1 text-xs text-gray-400">Your SSH private key is stored securely.</p></div><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5"><X className="h-4 w-4" /></button></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><input required minLength="3" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="production-api" /></Field><Field label="IP address"><input required value={form.ip_address} onChange={(e) => setForm({ ...form, ip_address: e.target.value })} placeholder="203.0.113.10" /></Field><Field label="SSH user"><input required value={form.ssh_user} onChange={(e) => setForm({ ...form, ssh_user: e.target.value })} /></Field><Field label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="offline">Offline</option><option value="online">Online</option></select></Field><Field label="SSH private key" className="sm:col-span-2"><textarea required rows="5" value={form.ssh_private_key} onChange={(e) => setForm({ ...form, ssh_private_key: e.target.value })} placeholder="-----BEGIN OPENSSH PRIVATE KEY-----" /></Field></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setIsFormOpen(false)} className="rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-white/5">Cancel</button><button type="submit" disabled={isCreating} className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-3.5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{isCreating && <LoaderCircle className="h-4 w-4 animate-spin" />}Add server</button></div></form></div>}
    {selectedServerId && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111827] p-5 shadow-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold text-white">Server details</h2><button type="button" onClick={() => setSelectedServerId(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/5"><X className="h-4 w-4" /></button></div>{isServerLoading ? <div className="grid min-h-40 place-items-center"><LoaderCircle className="h-5 w-5 animate-spin text-gray-400" /></div> : selectedServer && <dl className="mt-5 divide-y divide-white/5 text-sm">{[["Name", selectedServer.name], ["IP address", selectedServer.ip_address], ["SSH user", selectedServer.ssh_user], ["Status", selectedServer.status]].map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 py-3"><dt className="text-gray-400">{label}</dt><dd className="text-right text-white">{value || "—"}</dd></div>)}</dl>}</div></div>}
  </div>;
};

export default ServersPage;
