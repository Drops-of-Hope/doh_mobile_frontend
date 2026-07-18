import * as Notifications from "expo-notifications";
// Deep import: the package's barrel drops these names from its star-exports
// (ambiguous re-exports), so they aren't importable from "expo-notifications".
import type {
  Notification,
  NotificationResponse,
} from "expo-notifications/build/Notifications.types";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { apiRequestWithAuth, API_ENDPOINTS } from "./api";
import { logger } from "../utils/logger";

/** Payload shape sent by the backend PushService (data.type discriminates). */
export interface PushNotificationData {
  type?: string;
  [key: string]: unknown;
}

export interface NotificationCallbacks {
  /** CAMPAIGN_ATTENDANCE — attendance marked at a campaign */
  onAttendance?: (data: PushNotificationData) => void;
  /** APPOINTMENT_REMINDER / APPOINTMENT_SCHEDULED / APPOINTMENT_CANCELLED */
  onAppointment?: (data: PushNotificationData) => void;
  /** EMERGENCY_ALERT / EMERGENCY_RESPONDED — urgent blood requests */
  onEmergency?: (data: PushNotificationData) => void;
}

const APPOINTMENT_TYPES = new Set([
  "APPOINTMENT_REMINDER",
  "APPOINTMENT_SCHEDULED",
  "APPOINTMENT_CANCELLED",
]);

const EMERGENCY_TYPES = new Set(["EMERGENCY_ALERT", "EMERGENCY_RESPONDED"]);

/**
 * Ask for notification permission (includes the Android 13+ POST_NOTIFICATIONS
 * runtime prompt) and return the Expo push token, or null if denied.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  // Android requires a channel before notifications can be displayed.
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "General",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
    await Notifications.setNotificationChannelAsync("emergency", {
      name: "Emergency blood requests",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    logger.warn("Push notification permission not granted");
    return null;
  }

  try {
    const projectId =
      (Constants as any)?.expoConfig?.extra?.eas?.projectId ||
      (Constants as any)?.easConfig?.projectId;
    const token = (await Notifications.getExpoPushTokenAsync({ projectId }))
      .data;
    return token;
  } catch (error) {
    logger.error("Failed to get Expo push token:", error);
    return null;
  }
}

/** Register the device token against the backend (POST /devices/push-token). */
export async function registerPushTokenWithBackend(token: string) {
  try {
    await apiRequestWithAuth(API_ENDPOINTS.PUSH_TOKEN, {
      method: "POST",
      body: JSON.stringify({ token, platform: Platform.OS }),
    });
  } catch (e) {
    logger.error("Failed to register push token with backend", e);
  }
}

/** Remove the device token from the backend (e.g. on logout). */
export async function unregisterPushTokenFromBackend(token: string) {
  try {
    await apiRequestWithAuth(API_ENDPOINTS.PUSH_TOKEN, {
      method: "DELETE",
      body: JSON.stringify({ token }),
    });
  } catch (e) {
    logger.error("Failed to unregister push token from backend", e);
  }
}

/**
 * Central handler for incoming notifications. Emergencies play sound;
 * everything else shows silently. Returns an unsubscribe function.
 */
export function setupNotificationHandlers(
  callbacks: NotificationCallbacks = {}
) {
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notification) => {
      const data = (notification?.request?.content?.data ||
        {}) as PushNotificationData;
      const isEmergency = EMERGENCY_TYPES.has(String(data.type));
      return {
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: isEmergency,
        shouldSetBadge: false,
      };
    },
  });

  const dispatch = (data: PushNotificationData) => {
    const type = String(data?.type ?? "");
    if (type === "CAMPAIGN_ATTENDANCE") {
      callbacks.onAttendance?.(data);
    } else if (APPOINTMENT_TYPES.has(type)) {
      callbacks.onAppointment?.(data);
    } else if (EMERGENCY_TYPES.has(type)) {
      callbacks.onEmergency?.(data);
    }
  };

  // Fired when a notification arrives while the app is foregrounded
  const receivedSub = Notifications.addNotificationReceivedListener(
    (notification: Notification) => {
      dispatch(
        (notification?.request?.content?.data || {}) as PushNotificationData
      );
    }
  );

  // Fired when the user taps a notification (foreground, background, killed)
  const responseSub = Notifications.addNotificationResponseReceivedListener(
    (response: NotificationResponse) => {
      dispatch(
        (response?.notification?.request?.content?.data ||
          {}) as PushNotificationData
      );
    }
  );

  return () => {
    receivedSub.remove();
    responseSub.remove();
  };
}
