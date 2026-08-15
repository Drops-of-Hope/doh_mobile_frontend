// Utility to get the actual database user ID
import secureStorage from "./secureStorage";
import { apiRequestWithAuth, API_ENDPOINTS } from "../services/api";

import { logger } from "./logger";
export const testBackendEndpoints = async (): Promise<void> => {
  try {
    const endpointsToTest = [
      { name: 'CAMPAIGNS', url: API_ENDPOINTS.CAMPAIGNS },
      { name: 'MY_CAMPAIGNS', url: API_ENDPOINTS.MY_CAMPAIGNS },
      { name: 'UPCOMING_CAMPAIGNS', url: API_ENDPOINTS.UPCOMING_CAMPAIGNS },
    ];

    for (const endpoint of endpointsToTest) {
      try {
        await apiRequestWithAuth(endpoint.url, { method: "GET" });
      } catch {
        // Ignore and continue testing other endpoints
      }
    }
  } catch (error) {
    logger.error('Error testing endpoints:', error);
  }
};

export const debugAllUserIds = async (): Promise<void> => {
  try {
    await secureStorage.getItemAsync('userData');
    await secureStorage.getItemAsync('authState');
    await secureStorage.getItemAsync('userAuthData');
  } catch (error) {
    logger.error('Error debugging user IDs:', error);
  }
};

export const getDatabaseUserId = async (): Promise<string | null> => {
  try {
    // Always debug when this function is called
    await debugAllUserIds();

    // First try to get from userData (which contains the database user ID)
    const userData = await secureStorage.getItemAsync('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.id) {
        return parsed.id;
      }
    }

    // Fallback to authState sub if userData is not available
    const authState = await secureStorage.getItemAsync('authState');
    if (authState) {
      const parsed = JSON.parse(authState);
      if (parsed.userInfo?.sub) {
        return parsed.userInfo.sub;
      }
    }

    logger.error('❌ No user ID found in stored data');
    return null;
  } catch (error) {
    logger.error('Error getting database user ID:', error);
    return null;
  }
};