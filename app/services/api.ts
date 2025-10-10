// API configuration and base setup
// Choose the correct host depending on platform/emulator and allow override.
import { Platform } from "react-native";

const ANDROID_EMULATOR_HOST = "http://192.168.1.171:5000/api";
const DEFAULT_LOCALHOST = "http://localhost:5000/api";

// Allow an environment or runtime override (set EXPO_PUBLIC_API_URL in your .env or app config)
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL || (global as any)?.EXPO_PUBLIC_API_URL;

export const API_BASE_URL =
  ENV_API_URL || (Platform.OS === "android" ? ANDROID_EMULATOR_HOST : DEFAULT_LOCALHOST);

// NOTE: If you're testing on a physical device, set EXPO_PUBLIC_API_URL to
// `http://<YOUR_MACHINE_IP>:5000/api` and ensure your backend listens on 0.0.0.0
// and that firewall allows incoming connections on port 5000.

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
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
} as const;

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("API Request:", { url, options });
  
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

    console.log("API Response status:", response.status);
    console.log("API Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log("API Response data:", data);
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    console.error("URL attempted:", url);
    throw error;
  }
};

import * as SecureStore from "expo-secure-store";

// Auth token management using SecureStore instead of memory
export const setAuthToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync("accessToken", token);
  } catch (error) {
    console.error("Failed to save auth token:", error);
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    // First try to get from accessToken (legacy)
    let token = await SecureStore.getItemAsync("accessToken");
    
    if (!token) {
      // If not found, get from authState (current auth system)
      const authState = await SecureStore.getItemAsync("authState");
      if (authState) {
        const parsedAuthState = JSON.parse(authState);
        token = parsedAuthState.accessToken;
      }
    }
    
    return token;
  } catch (error) {
    console.error("Failed to retrieve auth token:", error);
    return null;
  }
};

export const clearAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync("accessToken");
  } catch (error) {
    console.error("Failed to clear auth token:", error);
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
