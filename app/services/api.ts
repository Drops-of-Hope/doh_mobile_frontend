// API configuration and base setup
// Choose the correct host depending on platform/emulator and allow override.
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
import secureStorage from "../utils/secureStorage";
import { logger } from "../utils/logger";

// 10.0.2.2 is the Android emulator's loopback to the host machine. Physical
// devices and production builds must set EXPO_PUBLIC_API_URL (see .env.example).
const ANDROID_EMULATOR_HOST = "http://10.0.2.2:5000/api";
const DEFAULT_LOCALHOST = "http://localhost:5000/api";

// Allow an environment or runtime override (set EXPO_PUBLIC_API_URL in your .env or app config)
const ENV_API_URL =
  process.env.EXPO_PUBLIC_API_URL || (globalThis as any)?.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  ENV_API_URL ||
  (Platform.OS === "android" ? ANDROID_EMULATOR_HOST : DEFAULT_LOCALHOST);

// NOTE: If you're testing on a physical device, set EXPO_PUBLIC_API_URL to
// `http://<YOUR_MACHINE_IP>:5000/api` and ensure your backend listens on 0.0.0.0
// and that firewall allows incoming connections on port 5000.

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout", // Revokes tokens + terminates the Asgardeo session server-side
  AUTH_CALLBACK: "/auth/callback", // Handle auth provider callback
  CREATE_OR_LOGIN_USER: "/users/create-or-login", // Create user if not exists, login if exists
  COMPLETE_PROFILE: "/users/complete-profile", // Complete user profile after initial auth

  // User endpoints
  USER_PROFILE: "/users/profile",
  USER_STATS: "/users/stats",
  USER_ACTIVITIES: "/users/activities",
  USER_NOTIFICATIONS: "/users/notifications",
  UPDATE_PROFILE: "/users/profile",
  USER_DONATION_HISTORY: "/users/donation-history",
  USER_ELIGIBILITY: "/users/eligibility",
  USERS: "/users", // For searching users/donors

  // Donation endpoints
  DONATION_FORM: "/donations/form",
  DONATION_HISTORY: "/donations/history",
  DONATION_COUNT: "/donations/count",
  LAST_DONATION: "/donations/last",

  // Campaign endpoints
  CAMPAIGNS: "/campaigns",
  MY_CAMPAIGNS: "/campaigns/organizer/:organizerId", // User's own campaigns
  CAMPAIGN_DETAILS: "/campaigns/:id",
  JOIN_CAMPAIGN: "/campaigns/:id/join",
  LEAVE_CAMPAIGN: "/campaigns/:id/leave",
  CAMPAIGN_PARTICIPATION_STATUS: "/campaigns/:id/participation-status",
  CAMPAIGN_PARTICIPANTS: "/campaigns/:id/participants",
  UPCOMING_CAMPAIGNS: "/campaigns/upcoming",
  CAMPAIGN_ANALYTICS: "/campaigns/:id/analytics",
  CAMPAIGN_PERMISSIONS: "/campaigns/:id/permissions",

  // Emergency endpoints
  EMERGENCIES: "/emergencies",
  EMERGENCY_DETAILS: "/emergencies/:id",
  RESPOND_EMERGENCY: "/emergencies/:id/respond",

  // QR Code endpoints
  QR_SCAN: "/qr/scan",
  MARK_ATTENDANCE: "/qr/mark-attendance",
  GENERATE_QR: "/qr/generate",

  // Appointment endpoints
  APPOINTMENTS: "/appointments",
  MEDICAL_ESTABLISHMENTS: "/medical-establishments",
  APPOINTMENT_SLOTS: "/slots",
  UPCOMING_APPOINTMENTS: "/appointments/upcoming",
  CREATE_APPOINTMENT: "/appointments/create",
  USER_APPOINTMENTS: "/appointments/user",

  // Home screen data
  HOME_DATA: "/home/dashboard",
  HOME_STATS: "/home/stats",
  EXPLORE_DATA: "/explore/data",

  // Notification endpoints
  NOTIFICATIONS: "/notifications",
  // Device push token registration
  PUSH_TOKEN: "/devices/push-token",

  // Role management endpoints
  REQUEST_CAMPAIGN_ORGANIZER_ROLE: "/users/request-campaign-organizer-role",
} as const;

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Breadcrumb only records the endpoint path (no host, no query payloads)
  Sentry.addBreadcrumb({
    category: "http",
    message: `${options.method || "GET"} ${endpoint}`,
    level: "info",
  });

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");

    // Check if response is HTML (common error scenario)
    if (contentType && contentType.includes("text/html")) {
      const htmlText = await response.text();
      logger.error("❌ API returned HTML instead of JSON!");
      logger.error("❌ URL:", url);
      logger.error("❌ Status:", response.status);
      logger.error(
        "❌ HTML preview (first 500 chars):",
        htmlText.substring(0, 500)
      );

      throw new Error(
        `API returned HTML instead of JSON. This usually means:\n` +
          `1. The backend URL is incorrect (${API_BASE_URL})\n` +
          `2. The endpoint doesn't exist (${endpoint})\n` +
          `3. The backend server is down or not responding\n` +
          `4. CORS or authentication issues\n` +
          `Status: ${response.status}`
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("❌ API Error Response:", errorText);

      // Prefer the backend's own error/message field so Alerts show a
      // human-readable string instead of a raw JSON dump.
      let message = `HTTP error! status: ${response.status}, message: ${errorText}`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed?.message || parsed?.error) {
          message = parsed.message || parsed.error;
        }
      } catch {
        // errorText wasn't JSON; keep the default message
      }

      throw new Error(message);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    logger.error("❌ API request failed!");
    logger.error("❌ URL attempted:", url);
    logger.error("❌ Error type:", error?.name);
    logger.error("❌ Error message:", error?.message);

    // Check if it's a JSON parsing error
    if (error?.message?.includes("JSON")) {
      logger.error(
        "❌ JSON parsing failed - backend likely returned HTML or invalid JSON"
      );
    }

    throw error;
  }
};

// Auth token management using SecureStore instead of memory
export const setAuthToken = async (token: string) => {
  try {
    await secureStorage.setItemAsync("accessToken", token);
  } catch (error) {
    logger.error("Failed to save auth token:", error);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    // First try to get from accessToken (legacy)
    let token = await secureStorage.getItemAsync("accessToken");

    if (!token) {
      // If not found, get from authState (current auth system)
      const authState = await secureStorage.getItemAsync("authState");

      if (authState) {
        const parsedAuthState = JSON.parse(authState);
        token = parsedAuthState.accessToken;
      }
    }

    if (!token) {
      logger.warn("⚠️ NO AUTH TOKEN FOUND! User might not be authenticated.");
    }

    return token;
  } catch (error) {
    logger.error("Failed to retrieve auth token:", error);
    return null;
  }
};

export const clearAuthToken = async () => {
  try {
    await secureStorage.deleteItemAsync("accessToken");
  } catch (error) {
    logger.error("Failed to clear auth token:", error);
  }
};

export const apiRequestWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getAuthToken();
  const headers = {
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  return apiRequest(endpoint, { ...options, headers });
};
