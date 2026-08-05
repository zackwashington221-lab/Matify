import { useGetNotificationsQuery } from "../../../redux/Apis/Notification";

export default function useNotificationsController() {
  const { data } = useGetNotificationsQuery();
  return { values: { title: "Notifications", description: "Updates about your delivery, saved items, and offers.", items: (data?.data || []).map((notification) => ({ title: notification.title, detail: notification.body || "Martify update" })) }, functions: {} };
}
