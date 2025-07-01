import * as SecureStore from "expo-secure-store";
import { authorize, refresh } from "react-native-app-auth";

const BASE_URL = "http://10.148.210.116:8081"; // Replace with your local IP or server URL

// Helper functions for SecureStore
export const getAuthState = async () => {
  try {
    const authState = await SecureStore.getItemAsync("authState");
    return authState ? JSON.parse(authState) : null;
  } catch (error) {
    console.error("Failed to retrieve auth state:", error);
    return null;
  }
};

export const clearAuthState = async () => {
  try {
    await SecureStore.deleteItemAsync("authState");
  } catch (error) {
    console.error("Failed to clear auth state:", error);
  }
};

export const saveAuthState = async (authState: any) => {
  try {
    await SecureStore.setItemAsync("authState", JSON.stringify(authState));
  } catch (error) {
    console.error("Failed to save auth state:", error);
  }
};

// Asgardeo configuration - Fixed based on their documentation
export const authConfig = {
  issuer: "https://api.asgardeo.io/t/dropsofhope", // Base issuer URL
  clientId: "cvkLW1k579ozp8tp7tRx7vGqvssa",
  redirectUrl: "com.dropsofhope://oauthredirect", // Must match app.json scheme
  scopes: ["openid", "profile", "email"],
  serviceConfiguration: {
    authorizationEndpoint: "https://api.asgardeo.io/t/dropsofhope/oauth2/authorize",
    tokenEndpoint: "https://api.asgardeo.io/t/dropsofhope/oauth2/token",
    revocationEndpoint: "https://api.asgardeo.io/t/dropsofhope/oauth2/revoke",
    endSessionEndpoint: "https://api.asgardeo.io/t/dropsofhope/oidc/logout",
  },
  customHeaders: {},
  additionalHeaders: {},
  skipCodeExchange: false,
  useNonce: true,
  usePKCE: true, // Enable PKCE for mobile security - Required by Asgardeo
};

// Login function using Asgardeo - redirects to Asgardeo hosted login page
export const login = async () => {
  try {
    const authState = await authorize(authConfig);
    console.log("Access Token:", authState.accessToken);
    console.log("ID Token:", authState.idToken);
    await saveAuthState(authState);
    return authState;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

// Signup function - same as login, Asgardeo handles registration on their hosted page
export const signup = async () => {
  try {
    // Add signup parameter to redirect to registration page
    const signupConfig = {
      ...authConfig,
      additionalParameters: {
        'signup': 'true', // Custom parameter to indicate signup intent
      },
    };
    
    const authState = await authorize(signupConfig);
    console.log("Signup successful - Access Token:", authState.accessToken);
    console.log("Signup successful - ID Token:", authState.idToken);
    await saveAuthState(authState);
    return authState;
  } catch (error) {
    console.error("Signup failed", error);
    throw error;
  }
};

// Password reset function - opens Asgardeo password reset page
export const initiatePasswordReset = async (email?: string) => {
  try {
    // Construct password reset URL
    const resetUrl = `https://api.asgardeo.io/t/dropsofhope/accountrecoveryendpoint/recoverpassword.do${email ? `?username=${encodeURIComponent(email)}` : ''}`;
    
    // In a real implementation, you might want to open this in a browser
    // For now, we'll return the URL so the app can handle it
    return resetUrl;
  } catch (error) {
    console.error("Password reset initiation failed", error);
    throw error;
  }
};

// Refresh token function
export const refreshToken = async (refreshToken: string) => {
  try {
    const newAuthState = await refresh(authConfig, { refreshToken });
    await saveAuthState(newAuthState);
    return newAuthState;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await clearAuthState();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};
