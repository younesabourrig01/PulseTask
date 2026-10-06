import { apiSlice } from "../../app/api/apiSlice";

export const serversApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServers: builder.query({
      query: (params) => {
        if (!params) return "/servers";
        if (typeof params === "string") {
          return `/servers?search=${encodeURIComponent(params)}`;
        }
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            searchParams.append(key, val);
          }
        });
        const qs = searchParams.toString();
        return qs ? `/servers?${qs}` : "/servers";
      },
      providesTags: (result) => [
        { type: "Server", id: "LIST" },
        ...(result?.servers?.data || []).map(({ id }) => ({ type: "Server", id })),
      ],
    }),
    createServer: builder.mutation({
      query: (credentials) => ({
        url: "/servers",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Server", id: "LIST" }, "Dashboard"],
    }),
    showServer: builder.query({
      query: (serverId) => `/servers/${serverId}`,
      providesTags: (result, error, serverId) => [{ type: "Server", id: serverId }],
    }),
    destroyServer: builder.mutation({
      query: (serverId) => ({
        url: `/servers/${serverId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Server", id: "LIST" }, "Dashboard"],
    }),
    updateServer: builder.mutation({
      query: ({ serverId, credentials }) => ({
        url: `/servers/${serverId}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "Server", id: serverId },
        { type: "Server", id: "LIST" },
        "Dashboard",
      ],
    }),
    generateTokenForServer: builder.mutation({
      query: (tokenName) => ({
        url: "/generate-token",
        method: "POST",
        body: { token_name: tokenName },
      }),
    }),

    // ── Uptime Checks & Ping Endpoints ────────────────────────────────
    getUptimeChecks: builder.query({
      query: (serverId) => `/servers/${serverId}/uptime-checks`,
      providesTags: (result, error, serverId) => [
        { type: "UptimeCheck", id: serverId },
      ],
    }),
    createUptimeCheck: builder.mutation({
      query: ({ serverId, ...body }) => ({
        url: `/servers/${serverId}/uptime-checks`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "UptimeCheck", id: serverId },
        { type: "Server", id: serverId },
        { type: "Server", id: "LIST" },
        "Dashboard",
      ],
    }),
    updateUptimeCheck: builder.mutation({
      query: ({ checkId, ...body }) => ({
        url: `/uptime-checks/${checkId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "UptimeCheck", id: serverId },
        { type: "Server", id: serverId },
        { type: "Server", id: "LIST" },
        "Dashboard",
      ],
    }),
    destroyUptimeCheck: builder.mutation({
      query: ({ checkId }) => ({
        url: `/uptime-checks/${checkId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "UptimeCheck", id: serverId },
        { type: "Server", id: serverId },
        { type: "Server", id: "LIST" },
        "Dashboard",
      ],
    }),
    pingUptimeCheck: builder.mutation({
      query: ({ checkId }) => ({
        url: `/uptime-checks/${checkId}/ping`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "UptimeCheck", id: serverId },
        { type: "Server", id: serverId },
        { type: "Server", id: "LIST" },
        "Dashboard",
      ],
    }),
    getPingHistory: builder.query({
      query: (serverId) => `/servers/${serverId}/ping-history`,
    }),
  }),
});

export const {
  useGetServersQuery,
  useCreateServerMutation,
  useShowServerQuery,
  useDestroyServerMutation,
  useUpdateServerMutation,
  useGenerateTokenForServerMutation,
  useGetUptimeChecksQuery,
  useCreateUptimeCheckMutation,
  useUpdateUptimeCheckMutation,
  useDestroyUptimeCheckMutation,
  usePingUptimeCheckMutation,
  useGetPingHistoryQuery,
} = serversApiSlice;
