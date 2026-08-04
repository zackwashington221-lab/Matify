import { createApi } from "@reduxjs/toolkit/query/react";
import type { UserNotification } from "../../../helpers/types";
import { USE_MOCK_DATA } from "../../../helpers/data";
import { baseQuery } from "../baseQuery";
import { mockNotifications } from "../../../mocks/user.mock";

let notifications: UserNotification[] = mockNotifications;

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery,
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    getNotifications: builder.query<{ data: UserNotification[]; unread: number }, void>({
      queryFn: async (_arg, api, extraOptions) => {
        if (USE_MOCK_DATA) return { data: { data: notifications, unread: notifications.filter((item) => !item.readAt).length } };
        return baseQuery("/notifications/mine", api, extraOptions) as Promise<{ data: { data: UserNotification[]; unread: number } }>;
      },
      providesTags: ["Notifications"],
    }),
    markNotificationRead: builder.mutation<UserNotification, string>({
      queryFn: async (id, api, extraOptions) => {
        if (USE_MOCK_DATA) {
          notifications = notifications.map((item) => item._id === id ? { ...item, readAt: new Date().toISOString() } : item);
          return { data: notifications.find((item) => item._id === id)! };
        }
        return baseQuery({ url: "/notifications/mine/" + id + "/read", method: "PATCH" }, api, extraOptions) as Promise<{ data: UserNotification }>;
      },
      invalidatesTags: ["Notifications"],
    }),
    registerDeviceToken: builder.mutation<{ ok: boolean }, { token: string; platform: "ios" | "android" | "web" }>({
      queryFn: async (body, api, extraOptions) => USE_MOCK_DATA ? { data: { ok: true } } : baseQuery({ url: "/notifications/device-token", method: "POST", body }, api, extraOptions) as Promise<{ data: { ok: boolean } }>,
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation, useRegisterDeviceTokenMutation } = notificationApi;
