import { apiSlice } from "../../app/api/apiSlice";

export const scriptApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScripts: builder.query({
      query: () => "/scripts",
      providesTags: (result) => [
        { type: "Script", id: "LIST" },
        ...(result?.scripts?.data || result?.scripts || []).map(({ id }) => ({
          type: "Script",
          id,
        })),
      ],
    }),
    showScript: builder.query({
      query: (scriptId) => `/scripts/${scriptId}`,
      providesTags: (result, error, scriptId) => [
        { type: "Script", id: scriptId },
      ],
    }),
    createScript: builder.mutation({
      query: (credentials) => ({
        url: "/scripts",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: "Script", id: "LIST" }],
    }),
    updateScript: builder.mutation({
      query: ({ scriptId, credentials }) => ({
        url: `/scripts/${scriptId}`,
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: (result, error, { scriptId }) => [
        { type: "Script", id: scriptId },
        { type: "Script", id: "LIST" },
      ],
    }),
    destroyScript: builder.mutation({
      query: (scriptId) => ({
        url: `/scripts/${scriptId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Script", id: "LIST" }],
    }),
  }),
});

export const {
  useGetScriptsQuery,
  useShowScriptQuery,
  useCreateScriptMutation,
  useUpdateScriptMutation,
  useDestroyScriptMutation,
} = scriptApiSlice;
