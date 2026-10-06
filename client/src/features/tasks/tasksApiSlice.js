import { apiSlice } from "../../app/api/apiSlice";

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    trigger: builder.mutation({
      query: ({ scriptId, serverId }) => ({
        url: `/run/${scriptId}/on/${serverId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "ScriptRun", id: "LIST" }, "Dashboard"],
    }),
    triggerFromCli: builder.mutation({
      query: (body) => ({
        url: "/cli/run-script",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ScriptRun", id: "LIST" }, "Dashboard"],
    }),
    getStatusFromCli: builder.query({
      query: (scriptRunId) => `/cli/run-status/${scriptRunId}`,
    }),
    getScriptRuns: builder.query({
      query: () => "/script-runs",
      providesTags: (result) => [
        { type: "ScriptRun", id: "LIST" },
        ...(result?.runs?.data || []).map(({ id }) => ({ type: "ScriptRun", id })),
      ],
    }),
    getScriptRun: builder.query({
      query: (runId) => `/script-runs/${runId}`,
      providesTags: (result, error, runId) => [{ type: "ScriptRun", id: runId }],
    }),
    getScriptHistory: builder.query({
      query: (scriptId) => `/scripts/${scriptId}/runs`,
    }),
    getServerRuns: builder.query({
      query: (serverId) => `/servers/${serverId}/runs`,
    }),
    getDashboardSummary: builder.query({
      query: () => "/dashboard/summary",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useTriggerMutation,
  useTriggerFromCliMutation,
  useGetStatusFromCliQuery,
  useGetScriptRunsQuery,
  useGetScriptRunQuery,
  useGetScriptHistoryQuery,
  useGetServerRunsQuery,
  useGetDashboardSummaryQuery,
} = tasksApiSlice;
