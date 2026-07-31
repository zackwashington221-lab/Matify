import * as Notifications from "expo-notifications";

export async function configureNotificationService() {
  const permissions = await Notifications.getPermissionsAsync();
  if (!permissions.granted) await Notifications.requestPermissionsAsync();
}
