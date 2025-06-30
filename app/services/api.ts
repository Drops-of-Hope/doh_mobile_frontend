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

// Auth token management (you can integrate with AsyncStorage later)
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

export const apiRequestWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const headers = {
    ...options.headers,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };

  return apiRequest(endpoint, { ...options, headers });
};
