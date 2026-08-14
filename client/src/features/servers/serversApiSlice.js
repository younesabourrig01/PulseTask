import { apiSlice } from "../../app/api/apiSlice";

export const serversApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServers: builder.query({
      query: () => "/servers",
    }),
    createServer: builder.mutation({
      query: (credentials) => ({
        url: "/servers",
        method: "POST",
        body: credentials,
      }),
    }),
    showServer: builder.query({
      query: (serverId) => `/servers/${serverId}`,
    }),
    destroyServer: builder.mutation({
      query: (serverId) => ({
        url: `/servers/${serverId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Server"],
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
      query: () => ({
        url: "/generate-token",
        method: "POST",
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
