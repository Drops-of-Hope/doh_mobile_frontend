import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  const projectId = (Constants as any)?.expoConfig?.extra?.eas?.projectId || (Constants as any)?.easConfig?.projectId;
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return token;
}

export async function registerPushTokenWithBackend(token: string) {
  try {
    await apiRequestWithAuth(API_ENDPOINTS.PUSH_TOKEN, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  } catch (e) {
    console.error("Failed to register push token with backend", e);
  }
}

// Central handler for foreground notifications
export function setupNotificationHandlers(onAttendance?: (payload: any) => void) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const subscription = Notifications.addNotificationReceivedListener((notification: any) => {
    const data = (notification?.request?.content?.data || {}) as any;
    if (data?.type === "CAMPAIGN_ATTENDANCE" && onAttendance) {
      onAttendance(data);
    }
  });

  return () => subscription.remove();
}
