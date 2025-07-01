// API configuration and base setup
const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your Node.js backend URL
// For production: 'https://your-backend-domain.com/api'
// For local development with real device: 'http://YOUR_LOCAL_IP:3000/api'

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Donation endpoints
  DONATION_FORM: '/donations/form',
  JOIN_CAMPAIGN: '/donations/join-campaign',
  USER_PROFILE: '/users/profile',
  
  // Campaign endpoints
  CAMPAIGNS: '/campaigns',
} as const;

// Generic API request function
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
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
    console.error('API request failed:', error);
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
