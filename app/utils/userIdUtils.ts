// Utility to get the actual database user ID
import * as SecureStore from "expo-secure-store";
import { apiRequestWithAuth, API_ENDPOINTS } from "../services/api";

export const testBackendEndpoints = async (): Promise<void> => {
  try {
    console.log('=== TESTING BACKEND ENDPOINTS ===');
    
    const endpointsToTest = [
      { name: 'CAMPAIGNS', url: API_ENDPOINTS.CAMPAIGNS },
      { name: 'MY_CAMPAIGNS', url: API_ENDPOINTS.MY_CAMPAIGNS },
      { name: 'UPCOMING_CAMPAIGNS', url: API_ENDPOINTS.UPCOMING_CAMPAIGNS },
    ];
    
    for (const endpoint of endpointsToTest) {
      try {
        console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
        const response = await apiRequestWithAuth(endpoint.url, { method: "GET" });
        console.log(`✅ ${endpoint.name} works:`, response ? 'Got response' : 'No response');
      } catch (error) {
        console.log(`❌ ${endpoint.name} failed:`, error instanceof Error ? error.message : error);
      }
    }
    
    console.log('=== END ENDPOINT TESTING ===');
  } catch (error) {
    console.error('Error testing endpoints:', error);
  }
};

export const debugAllUserIds = async (): Promise<void> => {
  try {
    console.log('=== DEBUGGING ALL USER IDS ===');
    
    // Check userData
    const userData = await SecureStore.getItemAsync('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      console.log('userData contents:', parsed);
      console.log('userData.id:', parsed.id);
    } else {
      console.log('No userData found in SecureStore');
    }

    // Check authState
    const authState = await SecureStore.getItemAsync('authState');
    if (authState) {
      const parsed = JSON.parse(authState);
      console.log('authState.userInfo:', parsed.userInfo);
      console.log('authState.userInfo.sub:', parsed.userInfo?.sub);
    } else {
      console.log('No authState found in SecureStore');
    }

    // Check userAuthData
    const userAuthData = await SecureStore.getItemAsync('userAuthData');
    if (userAuthData) {
      const parsed = JSON.parse(userAuthData);
      console.log('userAuthData contents:', parsed);
    } else {
      console.log('No userAuthData found in SecureStore');
    }

    console.log('=== END USER ID DEBUGGING ===');
  } catch (error) {
    console.error('Error debugging user IDs:', error);
  }
};

export const getDatabaseUserId = async (): Promise<string | null> => {
  try {
    console.log('Getting database user ID...');
    
    // Always debug when this function is called
    await debugAllUserIds();
    
    // First try to get from userData (which contains the database user ID)
    const userData = await SecureStore.getItemAsync('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.id) {
        console.log('✅ Using database user ID from userData:', parsed.id);
        return parsed.id;
      }
    }

    // Fallback to authState sub if userData is not available
    const authState = await SecureStore.getItemAsync('authState');
    if (authState) {
      const parsed = JSON.parse(authState);
      if (parsed.userInfo?.sub) {
        console.log('⚠️ Using auth sub as fallback:', parsed.userInfo.sub);
        return parsed.userInfo.sub;
      }
    }

    console.error('❌ No user ID found in stored data');
    return null;
  } catch (error) {
    console.error('Error getting database user ID:', error);
    return null;
  }
};