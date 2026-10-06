import React, { useState, useEffect, useMemo } from "react";
import {
  FileCode,
  Terminal,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Play,
  Copy,
  Check,
  LoaderCircle,
  X,
  Search,
  Code2,
  Sparkles,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetScriptsQuery,
  useShowScriptQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation,
  useDestroyScriptMutation,
} from "../../features/scripts/scriptsApiSlice";
import { RunScriptModal } from "./RunScriptModal";

const emptyForm = {
  title: "",
  script_slug: "",
  content: "#!/bin/bash\n# Write your script commands here\nset -e\n\necho \"Executing automation script...\"\n",
};

const getError = (error, fallback) =>
  error?.data?.message ||
  Object.values(error?.data?.errors || {}).flat().join(" ") ||
  fallback;

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

const Field = ({ label, children, className = "" }) => (
  <label className={`grid gap-1.5 text-sm text-gray-300 ${className}`}>
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </span>
    {children}
  </label>
);

export const ScriptsPage = () => {
  // 1. Linked Hook: useGetScriptsQuery
  const { data, isLoading, isError, error, refetch } = useGetScriptsQuery();

  // 2. Linked Hook: useCreateScriptMutation
  const [createScript, { isLoading: isCreating }] = useCreateScriptMutation();

  // 3. Linked Hook: useUpdateScriptMutation
  const [updateScript, { isLoading: isUpdating }] = useUpdateScriptMutation();

  // 4. Linked Hook: useDestroyScriptMutation
  const [destroyScript, { isLoading: isDeleting }] = useDestroyScriptMutation();

  // 5. Linked Hook: useShowScriptQuery
  const [viewingScriptId, setViewingScriptId] = useState(null);
  const { data: scriptResponse, isFetching: isScriptLoading } = useShowScriptQuery(
    viewingScriptId,
    { skip: !viewingScriptId }
  );

  // Component local states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingScript, setEditingScript] = useState(null);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState({ title: "", script_slug: "", content: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [runningScript, setRunningScript] = useState(null);

  // Extract scripts array safely from paginated or array response
  const scripts = useMemo(() => {
    return data?.scripts?.data || data?.scripts || [];
  }, [data]);

  const selectedScript = scriptResponse?.script;

  // Reset create form when closed
  useEffect(() => {
    if (!isCreateOpen) {
      setCreateForm(emptyForm);
    }
  }, [isCreateOpen]);

  // Set edit form values when a script is selected for editing
  useEffect(() => {
    if (editingScript) {
      setEditForm({
        title: editingScript.title || "",
        script_slug: editingScript.script_slug || "",
        content: editingScript.content || "",
      });
    }
  }, [editingScript]);

  // Auto-generate slug on create title change if slug hasn't been manually detached
  const handleCreateTitleChange = (val) => {
    setCreateForm((prev) => ({
      ...prev,
      title: val,
      script_slug: slugify(val),
    }));
  };

  // Create script handler
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      toast.error("Please provide a title for the script.");
      return;
    }
    try {
      await createScript(createForm).unwrap();
      toast.success("Script created successfully!");
      setIsCreateOpen(false);
    } catch (err) {
      toast.error(getError(err, "Failed to create script."));
    }
  };

  // Update script handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingScript) return;
    try {
      await updateScript({
        scriptId: editingScript.id,
        credentials: editForm,
      }).unwrap();
      toast.success("Script updated successfully!");
      setEditingScript(null);
    } catch (err) {
      toast.error(getError(err, "Failed to update script."));
    }
  };

  // Delete script handler
  const handleDelete = async (script) => {
    if (!window.confirm(`Are you sure you want to delete "${script.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await destroyScript(script.id).unwrap();
      if (viewingScriptId === script.id) setViewingScriptId(null);
      if (editingScript?.id === script.id) setEditingScript(null);
      toast.success(`Script "${script.title}" deleted.`);
    } catch (err) {
      toast.error(getError(err, "Failed to delete script."));
    }
  };

  // Copy code helper
  const handleCopyCode = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      toast.success("Script copied to clipboard!");
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      toast.error("Could not copy script to clipboard.");
    }
  };

  // Filtered scripts based on search query
  const filteredScripts = useMemo(() => {
    if (!searchQuery.trim()) return scripts;
    const q = searchQuery.toLowerCase();
    return scripts.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.script_slug?.toLowerCase().includes(q) ||
        s.content?.toLowerCase().includes(q)
    );
  }, [scripts, searchQuery]);

  return (
    <div className="px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7169ff]">
            Automation
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Scripts
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Create, manage, and execute automation scripts across your servers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#6b6bff]"
          >
            <Plus className="h-4 w-4" />
            New Script
          </button>
        </div>
      </div>

      {/* ── Search & Metrics Strip ────────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scripts by title or slug..."
            className="h-10 w-full rounded-lg border border-white/10 bg-[#111827] pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#111827] px-3 py-2 font-medium">
            <Code2 className="h-3.5 w-3.5 text-[#7169ff]" />
            Total: <span className="font-semibold text-white">{scripts.length}</span>
          </span>
          {searchQuery && (
            <span className="rounded-lg border border-white/10 bg-[#111827] px-3 py-2 text-gray-300">
              Matches: <strong className="text-white">{filteredScripts.length}</strong>
            </span>
          )}
        </div>
      </div>

      {/* ── Main Scripts Table / List Section ─────────────────────────── */}
      <section className="overflow-hidden rounded-xl border border-white/10 bg-[#111827]">
        {isLoading ? (
          <div className="grid min-h-64 place-items-center text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#7169ff]" />
              Loading scripts...
            </span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-sm text-rose-300">
            <p>{getError(error, "Could not load scripts.")}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
            >
              Try again
            </button>
          </div>
        ) : filteredScripts.length === 0 ? (
          <div className="grid min-h-64 place-items-center px-6 py-12 text-center">
            <div>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#5b5bf5]/15">
                <FileCode className="h-6 w-6 text-[#9b9bff]" />
              </div>
              <h2 className="mt-4 font-semibold text-white">
                {searchQuery ? "No matching scripts" : "No scripts yet"}
              </h2>
              <p className="mt-1 max-w-sm text-sm text-gray-400">
                {searchQuery
                  ? "Try searching with different keywords."
                  : "Add your first script to start running automations on your servers."}
              </p>
              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#6b6bff]"
                >
                  <Plus className="h-4 w-4" />
                  Create script
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Script</th>
                  <th className="px-5 py-3.5 font-medium">Slug</th>
                  <th className="px-5 py-3.5 font-medium">Lines</th>
                  <th className="px-5 py-3.5 font-medium">Created</th>
                  <th className="px-5 py-3.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredScripts.map((script) => {
                  const lineCount = (script.content || "").split("\n").length;
                  return (
                    <tr
                      key={script.id}
                      className="group transition hover:bg-white/[0.025]"
                    >
                      {/* Title & Icon */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#0b0e14] text-purple-400">
                            <Terminal className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate font-medium text-white group-hover:text-[#a5a0ff]">
                              {script.title}
                            </span>
                            <span className="block truncate font-mono text-[11px] text-gray-500">
                              ID: #{script.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-purple-300">
                          {script.script_slug}
                        </span>
                      </td>

                      {/* Lines preview */}
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {lineCount} {lineCount === 1 ? "line" : "lines"}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {script.created_at
                          ? new Date(script.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          {/* Run script */}
                          <button
                            type="button"
                            onClick={() => setRunningScript(script)}
                            className="rounded-lg p-2 text-emerald-400 transition hover:bg-emerald-500/10 hover:text-emerald-300"
                            title={`Execute ${script.title}`}
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </button>

                          {/* View script detail */}
                          <button
                            type="button"
                            onClick={() => setViewingScriptId(script.id)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                            title={`View ${script.title}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit script */}
                          <button
                            type="button"
                            onClick={() => setEditingScript(script)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                            title={`Edit ${script.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          {/* Delete script */}
                          <button
                            type="button"
                            onClick={() => handleDelete(script)}
                            disabled={isDeleting}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-50"
                            title={`Delete ${script.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── CREATE SCRIPT MODAL ───────────────────────────────────────── */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Script</h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Write the command steps to run on target servers.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Script Title *">
                <input
                  required
                  minLength={3}
                  value={createForm.title}
                  onChange={(e) => handleCreateTitleChange(e.target.value)}
                  placeholder="e.g. Deploy Production Backend"
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0e14] px-3.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>

              <Field label="Script Slug *">
                <input
                  required
                  value={createForm.script_slug}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      script_slug: slugify(e.target.value),
                    })
                  }
                  placeholder="deploy-production-backend"
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0e14] px-3.5 font-mono text-sm text-purple-300 placeholder-gray-600 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>

              <Field label="Script Content (Bash / Shell / Python) *" className="sm:col-span-2">
                <textarea
                  required
                  rows={9}
                  value={createForm.content}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, content: e.target.value })
                  }
                  placeholder="#!/bin/bash&#10;echo 'Hello PulseTask'..."
                  className="w-full resize-y rounded-lg border border-white/10 bg-[#080c14] p-3.5 font-mono text-xs leading-relaxed text-emerald-300 placeholder-gray-600 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#6b6bff] disabled:opacity-50"
              >
                {isCreating && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Create Script
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── EDIT SCRIPT MODAL ─────────────────────────────────────────── */}
      {editingScript && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Edit Script</h2>
                <p className="mt-0.5 text-xs text-gray-400">
                  Update script parameters and source code.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingScript(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Script Title *">
                <input
                  required
                  minLength={3}
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0e14] px-3.5 text-sm text-white placeholder-gray-600 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>

              <Field label="Script Slug *">
                <input
                  required
                  value={editForm.script_slug}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      script_slug: slugify(e.target.value),
                    })
                  }
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#0b0e14] px-3.5 font-mono text-sm text-purple-300 placeholder-gray-600 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>

              <Field label="Script Content *" className="sm:col-span-2">
                <textarea
                  required
                  rows={9}
                  value={editForm.content}
                  onChange={(e) =>
                    setEditForm({ ...editForm, content: e.target.value })
                  }
                  className="w-full resize-y rounded-lg border border-white/10 bg-[#080c14] p-3.5 font-mono text-xs leading-relaxed text-emerald-300 outline-none transition focus:border-[#7169ff] focus:ring-1 focus:ring-[#7169ff]"
                />
              </Field>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setEditingScript(null)}
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="inline-flex items-center gap-2 rounded-lg bg-[#5b5bf5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#6b6bff] disabled:opacity-50"
              >
                {isUpdating && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── SHOW SCRIPT DETAILS MODAL (Linked to useShowScriptQuery) ───── */}
      {viewingScriptId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5b5bf5]/15 text-[#7169ff]">
                  <Terminal size={16} />
                </span>
                <div>
                  <h2 className="font-bold text-white">
                    {selectedScript?.title || "Script Details"}
                  </h2>
                  <p className="font-mono text-xs text-purple-300">
                    {selectedScript?.script_slug || "..."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedScript?.content && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(selectedScript.content)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Code
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setViewingScriptId(null)}
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {isScriptLoading ? (
              <div className="grid min-h-48 place-items-center">
                <LoaderCircle className="h-6 w-6 animate-spin text-[#7169ff]" />
              </div>
            ) : selectedScript ? (
              <div className="mt-4 space-y-4">
                {/* Meta details */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-400 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/5 bg-[#0b0e14] p-2.5">
                    <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                      ID
                    </span>
                    <span className="font-semibold text-white">#{selectedScript.id}</span>
                  </div>
                  <div className="rounded-lg border border-white/5 bg-[#0b0e14] p-2.5">
                    <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                      Created
                    </span>
                    <span className="font-semibold text-white">
                      {selectedScript.created_at
                        ? new Date(selectedScript.created_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="col-span-2 rounded-lg border border-white/5 bg-[#0b0e14] p-2.5 sm:col-span-1">
                    <span className="block text-[10px] uppercase tracking-wider text-gray-500">
                      Updated
                    </span>
                    <span className="font-semibold text-white">
                      {selectedScript.updated_at
                        ? new Date(selectedScript.updated_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Code viewer */}
                <div>
                  <div className="flex items-center justify-between px-1 py-1 text-xs text-gray-400">
                    <span className="font-semibold uppercase tracking-wider text-gray-500">
                      Source Code
                    </span>
                    <span className="font-mono text-[11px] text-gray-500">
                      {(selectedScript.content || "").split("\n").length} lines
                    </span>
                  </div>
                  <pre className="max-h-72 overflow-auto rounded-xl border border-white/10 bg-[#080c14] p-4 font-mono text-xs leading-relaxed text-emerald-300">
                    <code>{selectedScript.content}</code>
                  </pre>
                </div>

                {/* Footer action */}
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRunningScript(selectedScript);
                      setViewingScriptId(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#5b5bf5] px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-[#5b5bf5]/20 transition hover:bg-[#6b6bff]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Run Script
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingScript(selectedScript);
                      setViewingScriptId(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200 transition hover:bg-white/10 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit Script
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingScriptId(null)}
                    className="rounded-lg bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">
                Script details not found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── RUN SCRIPT MODAL ──────────────────────────────────────────── */}
      {runningScript && (
        <RunScriptModal
          script={runningScript}
          onClose={() => setRunningScript(null)}
        />
      )}
    </div>
  );
};

export default ScriptsPage;
