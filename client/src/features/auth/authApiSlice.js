import { apiSlice } from "../../app/api/apiSlice";
import { logout } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("Logout failed", err);
        } finally {
          dispatch(logout());
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
    updatePassword: builder.mutation({
      query: (credentials) => ({
        url: "/updatePassword",
        method: "PATCH",
        body: credentials,
      }),
    }),
    deleteAccount: builder.mutation({
      query: (credentials) => ({
        url: "/delete_account",
        method: "DELETE",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    update: builder.mutation({
      query: (credentials) => ({
        url: "/update_profile_info",
        method: "PATCH",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApiSlice;
