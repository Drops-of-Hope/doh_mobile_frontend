// API configuration and base setup
// IMPORTANT: Replace 'YOUR_LOCAL_IP' with your laptop's actual local IP address on your network
export const API_BASE_URL = "http://192.168.1.102:5000/api";
// Example: const API_BASE_URL = "http://192.168.1.10:5000/api";
// 'localhost' will NOT work on a real device; use your laptop's IP address instead.

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

  // Donation endpoints
  DONATION_FORM: "/donations/form",
  DONATION_HISTORY: "/donations/history",

  // Campaign endpoints
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAILS: "/campaigns/:id",
  JOIN_CAMPAIGN: "/campaigns/:id/join",
  CAMPAIGN_PARTICIPANTS: "/campaigns/:id/participants",
  MY_CAMPAIGNS: "/campaigns/my-campaigns",
  UPCOMING_CAMPAIGNS: "/campaigns/upcoming",

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

  // Home screen data
  HOME_DATA: "/home/dashboard",
  EXPLORE_DATA: "/explore/data",
} as const;

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;

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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
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
    return await SecureStore.getItemAsync("accessToken");
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
