import { apiSlice } from "../../app/api/apiSlice";

export const serversApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServers: builder.query({
      query: () => "/servers",
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
      invalidatesTags: [{ type: "Server", id: "LIST" }],
    }),
    showServer: builder.query({
      query: (serverId) => `/servers/${serverId}`,
    }),
    destroyServer: builder.mutation({
      query: (serverId) => ({
        url: `/servers/${serverId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Server", id: "LIST" }],
    }),
    updateServer: builder.mutation({
      query: ({ serverId, credentials }) => ({
        url: `/servers/${serverId}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result, error, { serverId }) => [
        { type: "Server", id: serverId }, // Refetches specific server details
        { type: "Server", id: "LIST" }, // Refetches server list
      ],
    }),
    generateTokenForServer: builder.mutation({
      query: (tokenName) => ({
        url: "/generate-token",
        method: "POST",
        body: { token_name: tokenName },
      }),
    }),
  }),
});

export const {
  useGetServersQuery,
  useCreateServerMutation,
  useShowServerQuery,
  useDestroyServerMutation,
  useGenerateTokenForServerMutation,
} = serversApiSlice;
