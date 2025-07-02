import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";

const authConfig = {
  issuer: "https://api.asgardeo.io/t/dropsofhope",
  clientId: "cvkLW1k579ozp8tp7tRx7vGqvssa",
  redirectUri: "doh_mobile://redirect", // Explicitly set to a registered URI
  scopes: ["openid", "profile", "email", "roles"],
};

console.log("Redirect URI:", authConfig.redirectUri);

// Types for user information
export interface UserInfo {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
  userType?: string;
  [key: string]: any;
}

export interface AuthState {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  userInfo?: UserInfo;
  [key: string]: any;
}

// Helper functions for SecureStore
const saveAuthState = async (authState: AuthState) => {
  try {
    await SecureStore.setItemAsync("authState", JSON.stringify(authState));
  } catch (error) {
    console.error("Failed to save auth state:", error);
  }
};

const getAuthState = async (): Promise<AuthState | null> => {
  try {
    const authState = await SecureStore.getItemAsync("authState");
    return authState ? JSON.parse(authState) : null;
  } catch (error) {
    console.error("Failed to retrieve auth state:", error);
    return null;
  }
};

// Get user info from token
const getUserInfo = async (accessToken: string): Promise<UserInfo | null> => {
  try {
    const response = await fetch(`${authConfig.issuer}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log("User info retrieved:", userInfo);
      return userInfo;
    } else {
      console.error("Failed to fetch user info:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};

const clearAuthState = async () => {
  try {
    await SecureStore.deleteItemAsync("authState");
  } catch (error) {
    console.error("Failed to clear auth state:", error);
  }
};

// Unified login and signup logic
export const authenticate = async (isSignup = false): Promise<AuthState | null> => {
  try {
    const config = isSignup
      ? { ...authConfig, extraParams: { signup: "true" } }
      : authConfig;

    const authRequest = new AuthSession.AuthRequest(config);
    const discovery = {
      authorizationEndpoint: `${authConfig.issuer}/oauth2/authorize`,
      tokenEndpoint: `${authConfig.issuer}/oauth2/token`,
      revocationEndpoint: `${authConfig.issuer}/oauth2/revoke`,
    };
    const result = await authRequest.promptAsync(discovery);

    if (result.type === "success") {
      console.log(
        `${isSignup ? "Signup" : "Login"} successful:`,
        result.params
      );
      
      // Create AuthState object
      const authState: AuthState = {
        accessToken: result.params.access_token,
        refreshToken: result.params.refresh_token,
        idToken: result.params.id_token,
        ...result.params
      };

      // Fetch user info
      if (authState.accessToken) {
        const userInfo = await getUserInfo(authState.accessToken);
        if (userInfo) {
          authState.userInfo = userInfo;
        }
      }

      await saveAuthState(authState);
      return authState;
    } else {
      throw new Error("Authentication canceled or failed.");
    }
  } catch (error) {
    console.error(`${isSignup ? "Signup" : "Login"} failed:`, error);
    throw error;
  }
};

// Password reset function - opens Asgardeo password reset page
export const initiatePasswordReset = async (email?: string) => {
  try {
    // Construct password reset URL
    const resetUrl = `https://api.asgardeo.io/t/dropsofhope/accountrecoveryendpoint/recoverpassword.do${
      email ? `?username=${encodeURIComponent(email)}` : ""
    }`;

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
    const tokenResult = await AuthSession.refreshAsync(
      {
        clientId: authConfig.clientId,
        refreshToken,
      },
      { tokenEndpoint: `${authConfig.issuer}/oauth2/token` }
    );
    await saveAuthState(tokenResult);
    return tokenResult;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const authState = await getAuthState();
    if (authState && authState.accessToken) {
      const revokeUrl = `${authConfig.issuer}/oauth2/revoke`;
      await fetch(revokeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `token=${authState.accessToken}&client_id=${authConfig.clientId}`,
      });
    }
    await clearAuthState();
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

// Helper functions for authentication status and user info
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const authState = await getAuthState();
    return !!(authState && authState.accessToken);
  } catch (error) {
    console.error("Error checking authentication status:", error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const authState = await getAuthState();
    return authState?.userInfo || null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const getUserRole = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    if (user && user.roles && user.roles.length > 0) {
      return user.roles[0]; // Return first role
    }
    return user?.userType || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export const hasRole = async (roleName: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (user && user.roles) {
      return user.roles.includes(roleName);
    }
    return user?.userType === roleName;
  } catch (error) {
    console.error("Error checking user role:", error);
    return false;
  }
};