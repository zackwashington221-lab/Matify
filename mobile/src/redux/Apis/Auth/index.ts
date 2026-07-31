import { createApi } from "@reduxjs/toolkit/query/react";
import { mockUser } from "../../../mocks/user.mock";
import type { User } from "../../../helpers/types";
import { baseQuery } from "../baseQuery";
import { USE_MOCK_DATA } from "../../../helpers/data";

type Credentials = { email: string; password: string };
type Registration = Credentials & { name: string };
type AuthResponse = { token: string; user: User };

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, Credentials>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA)
          return {
            data: {
              token: "mock-session-token",
              user: { ...mockUser, email: body.email || mockUser.email },
            },
          };
        return baseQuery(
          { url: "/auth/login", method: "POST", body },
          api,
          extraOptions,
        ) as Promise<{ data: AuthResponse }>;
      },
    }),
    register: builder.mutation<AuthResponse, Registration>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA)
          return {
            data: {
              token: "mock-session-token",
              user: {
                ...mockUser,
                name: body.name || mockUser.name,
                email: body.email || mockUser.email,
              },
            },
          };
        return baseQuery(
          { url: "/auth/register", method: "POST", body },
          api,
          extraOptions,
        ) as Promise<{ data: AuthResponse }>;
      },
    }),
    getMe: builder.query<User, void>({
      queryFn: async (_body, api, extraOptions) => {
        if (USE_MOCK_DATA) return { data: mockUser };
        const response = await baseQuery({ url: "/auth/me" }, api, extraOptions);
        if ("error" in response) return { error: response.error! };
        const data = response.data as { user?: User };
        return data.user ? { data: data.user } : { error: { status: "CUSTOM_ERROR", error: "Invalid session response" } };
      },
    }),
    updateProfile: builder.mutation<User, Partial<Pick<User, "name">> & { avatarUrl?: string }>({
      queryFn: async (body, api, extraOptions) => {
        if (USE_MOCK_DATA) return { data: { ...mockUser, ...body } };
        const response = await baseQuery({ url: "/auth/me", method: "PATCH", body }, api, extraOptions);
        if ("error" in response) return { error: response.error! };
        const data = response.data as { user?: User };
        return data.user ? { data: data.user } : { error: { status: "CUSTOM_ERROR", error: "Invalid profile response" } };
      },
    }),
    changePassword: builder.mutation<{ ok: boolean }, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({
      queryFn: async (_body, api, extraOptions) => {
        if (USE_MOCK_DATA) return { data: undefined };
        return baseQuery({ url: "/auth/logout", method: "POST" }, api, extraOptions) as Promise<{
          data: undefined;
        }>;
      },
    }),
  }),
});

export const { useChangePasswordMutation, useGetMeQuery, useLazyGetMeQuery, useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateProfileMutation } = authApi;
