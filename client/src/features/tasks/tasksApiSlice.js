import { apiSlice } from "../../app/api/apiSlice";

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    trigger: builder.mutation({
      query: ({ scriptId, serverId }) => ({
        url: `/run/${scriptId}/on/${serverId}`,
        methode: "POST",
      }),
    }),
    triggerFromCli: builder.mutation({
      query: () => ({
        url: "/cli/run-script",
        method: "POST",
      }),
    }),
    getStatusFromCli: builder.query({
      query: (scriptRun) => `/cli/run-status/${scriptRun}`,
    }),
  }),
});

export const {
  useTriggerMutation,
  useTriggerFromCliMutation,
  useGetStatusFromCliQuery,
} = tasksApiSlice;
