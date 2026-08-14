import { apiSlice } from "../../app/api/apiSlice";

export const scriptApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getScripts: builder.query({
      query: () => "scripts",
    }),
    showScript: builder.query({
      query: (scriptId) => `/scripts/${scriptId}`,
    }),
    createScript: builder.mutation({
      query: (credentials) => ({
        url: "/scripts",
        method: "POST",
        body: credentials,
      }),
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
      invalidatesTags: ["Script"],
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
