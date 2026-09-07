import { apiSlice } from "../../app/api/apiSlice";

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    teamInfo: builder.query({
      query: () => `/team/about`,
      providesTags: ["Team"],
    }),
    createTeam: builder.mutation({
      query: (credentials) => ({
        url: "/team/create",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Team"],
    }),
    joinTeam: builder.mutation({
      query: (credentials) => ({
        url: "/team/join",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Team"],
    }),
    generateInvCode: builder.mutation({
      query: () => ({
        url: "/team/generate-inv-code",
        method: "POST",
      }),
      invalidatesTags: ["Team"],
    }),
    leavTeam: builder.mutation({
      query: () => ({
        url: "/team/leave",
        method: "POST",
      }),
      invalidatesTags: ["Team"],
    }),
    deleteTeam: builder.mutation({
      query: () => ({
        url: "/team/delete-team",
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeamInfo: builder.mutation({
      query: ({ teamId, credentials }) => ({
        url: `/team/update/${teamId}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useTeamInfoQuery,
  useCreateTeamMutation,
  useJoinTeamMutation,
  useGenerateInvCodeMutation,
  useLeavTeamMutation,
  useDeleteTeamMutation,
  useUpdateTeamInfoMutation,
} = teamApiSlice;
