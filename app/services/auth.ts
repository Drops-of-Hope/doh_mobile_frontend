import secureStorage from "../utils/secureStorage";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

import { logger } from "../utils/logger";
// Ensure auth sessions are properly completed on iOS (and generally safe to call once in module scope)
WebBrowser.maybeCompleteAuthSession();

const authConfig = {
  issuer:
    process.env.EXPO_PUBLIC_ASGARDEO_ISSUER ||
    "https://api.asgardeo.io/t/dropsofhope",
  clientId: process.env.EXPO_PUBLIC_ASGARDEO_CLIENT_ID || "",
  scopes: ["openid", "NIC", "profile", "email", "roles"],
};

// Determine environment to select correct redirect behavior
// Expo Go -> proxy redirect (https://auth.expo.io/...)
// Dev/Prod native build (including expo-dev-client) -> custom scheme redirect
const appOwnership = Constants.appOwnership; // 'expo' | 'standalone' | 'guest'
const isExpoGo = appOwnership === "expo"; // treat 'guest' (dev client) and 'standalone' as native

// Create proper redirect URI for current runtime
const redirectUri = isExpoGo
  ? AuthSession.makeRedirectUri({
      // In Expo Go, omit scheme to use the Expo AuthSession proxy URL
      path: "auth",
    })
  : AuthSession.makeRedirectUri({
      // In native/dev builds, use the app scheme for deep linking
      scheme: process.env.EXPO_PUBLIC_APP_SCHEME || "com.dropsofhope",
      path: "auth",
    });

// On web, expo-linking ignores the `scheme` above and resolves this from
// window.location.origin instead — log it so a redirect-URI mismatch against
// Asgardeo's allowed list is visible instead of failing silently.
logger.debug("Auth redirectUri:", redirectUri);

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
    await secureStorage.setItemAsync("authState", JSON.stringify(authState));
  } catch (error) {
    logger.error("Failed to save auth state:", error);
  }
};

const getAuthState = async (): Promise<AuthState | null> => {
  try {
    const authState = await secureStorage.getItemAsync("authState");
    return authState ? JSON.parse(authState) : null;
  } catch (error) {
    logger.error("Failed to retrieve auth state:", error);
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
      return userInfo;
    } else {
      logger.error("Failed to fetch user info:", response.status);
      return null;
    }
  } catch (error) {
    logger.error("Error fetching user info:", error);
    return null;
  }
};

const clearAuthState = async () => {
  try {
    await secureStorage.deleteItemAsync("authState");
  } catch (error) {
    logger.error("Failed to clear auth state:", error);
  }
};

// Unified login and signup logic
export const authenticate = async (
  isSignup = false,
): Promise<AuthState | null> => {
  try {
    // Create proper AuthRequest with PKCE (required by Asgardeo)
    const authRequest = new AuthSession.AuthRequest({
      clientId: authConfig.clientId,
      scopes: authConfig.scopes,
      redirectUri: redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: isSignup ? { signup: "true" } : {},
      // PKCE configuration - let AuthRequest generate the challenge
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    });

    const discovery = {
      authorizationEndpoint: `${authConfig.issuer}/oauth2/authorize`,
      tokenEndpoint: `${authConfig.issuer}/oauth2/token`,
      revocationEndpoint: `${authConfig.issuer}/oauth2/revoke`,
    };

  const result = await authRequest.promptAsync(discovery);

    if (result.type === "success") {
      // Exchange authorization code for tokens with PKCE
      if (result.params.code && authRequest.codeVerifier) {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: authConfig.clientId,
            code: result.params.code,
            redirectUri: redirectUri,
            extraParams: {
              code_verifier: authRequest.codeVerifier, // PKCE code verifier
            },
          },
          discovery,
        );

        // Create AuthState object
        const authState: AuthState = {
          accessToken: tokenResult.accessToken,
          refreshToken: tokenResult.refreshToken,
          idToken: tokenResult.idToken,
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
      }
    } else if (result.type === "error") {
      logger.error("Auth error:", result.error);
      throw new Error(
        `Authentication error: ${result.error?.message || "Unknown error"}`,
      );
    } else {
      throw new Error("Authentication was cancelled");
    }

    throw new Error("Authentication failed");
  } catch (error) {
    logger.error(`${isSignup ? "Signup" : "Login"} failed:`, error);
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
    logger.error("Password reset initiation failed", error);
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
      { tokenEndpoint: `${authConfig.issuer}/oauth2/token` },
    );
    await saveAuthState(tokenResult);
    return tokenResult;
  } catch (error) {
    logger.error("Token refresh failed", error);
    throw error;
  }
};

// Logout function - Enhanced to properly revoke Asgardeo session
export const logout = async () => {
  try {
    const authState = await getAuthState();

    if (authState) {
      // Step 1: Revoke access token if available
      if (authState.accessToken) {
        try {
          const revokeUrl = `${authConfig.issuer}/oauth2/revoke`;
          await fetch(revokeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `token=${authState.accessToken}&client_id=${authConfig.clientId}&token_type_hint=access_token`,
          });
        } catch (error) {
          logger.error("Failed to revoke access token:", error);
          // Continue with logout even if token revocation fails
        }
      }

      // Step 2: Revoke refresh token if available
      if (authState.refreshToken) {
        try {
          const revokeUrl = `${authConfig.issuer}/oauth2/revoke`;
          await fetch(revokeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `token=${authState.refreshToken}&client_id=${authConfig.clientId}&token_type_hint=refresh_token`,
          });
        } catch (error) {
          logger.error("Failed to revoke refresh token:", error);
          // Continue with logout even if token revocation fails
        }
      }

      // Step 3: Clear Asgardeo session by opening logout URL
      if (authState.idToken) {
        try {
          // Construct the logout URL with proper parameters
          const logoutUrl = `${authConfig.issuer}/oidc/logout`;
          const logoutParams = new URLSearchParams({
            id_token_hint: authState.idToken,
            post_logout_redirect_uri: redirectUri,
          });

          const fullLogoutUrl = `${logoutUrl}?${logoutParams.toString()}`;

          // Use WebBrowser to open logout URL which will clear Asgardeo session
          // Open logout URL in a browser session to clear server-side session
          const result = await WebBrowser.openAuthSessionAsync(
            fullLogoutUrl,
            redirectUri,
          );
        } catch (error) {
          logger.error("Failed to clear Asgardeo session:", error);
          // Continue with logout even if session clear fails
        }
      }
    }

    // Step 4: Always clear local auth state
    await clearAuthState();
  } catch (error) {
    logger.error("Logout failed:", error);
    // Even if logout fails, clear local state to ensure user is logged out locally
    await clearAuthState();
    throw error;
  }
};

// Helper functions for authentication status and user info
export const isAuthenticated = async (): Promise<boolean> => {
  return await ensureValidAuth();
};

export const getCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const authState = await getAuthState();
    return authState?.userInfo || null;
  } catch (error) {
    logger.error("Error getting current user:", error);
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
    logger.error("Error getting user role:", error);
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
    logger.error("Error checking user role:", error);
    return false;
  }
};

// Enhanced authentication check with automatic refresh
export const ensureValidAuth = async (): Promise<boolean> => {
  try {
    const authState = await getAuthState();

    if (!authState || !authState.accessToken) {
      return false;
    }

    // Check if the current token is valid
    const isValid = await isTokenValid(authState.accessToken);
    if (isValid) {
      return true;
    }

    // If access token is invalid, try refresh
    if (authState.refreshToken) {
      try {
        const refreshResult = await AuthSession.refreshAsync(
          {
            clientId: authConfig.clientId,
            refreshToken: authState.refreshToken,
          },
          { tokenEndpoint: `${authConfig.issuer}/oauth2/token` },
        );

        // Update auth state with new tokens
        const newAuthState: AuthState = {
          accessToken: refreshResult.accessToken,
          refreshToken: refreshResult.refreshToken || authState.refreshToken,
          idToken: refreshResult.idToken || authState.idToken,
          userInfo: authState.userInfo, // Keep existing user info
        };

        // Verify the refreshed token works
        const userInfo = await getUserInfo(newAuthState.accessToken);
        if (userInfo) {
          newAuthState.userInfo = userInfo;
          await saveAuthState(newAuthState);
          return true;
        } else {
          await handleExpiredToken();
          return false;
        }
      } catch (refreshError) {
        logger.error("Token refresh failed:", refreshError);
        await handleExpiredToken();
        return false;
      }
    }

    await handleExpiredToken();
    return false;
  } catch (error) {
    logger.error("Error ensuring valid auth:", error);
    await handleExpiredToken();
    return false;
  }
};

// Check if token is expired by trying to use it
const isTokenValid = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await fetch(`${authConfig.issuer}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    logger.error("Error validating token:", error);
    return false;
  }
};

// Handle expired/invalid tokens by clearing state
export const handleExpiredToken = async (): Promise<void> => {
  await clearAuthState();
};

// Global auth error handler for API calls
export const handleAuthError = async (error: any): Promise<boolean> => {
  if (error?.status === 401 || error?.message?.includes("unauthorized")) {
    // Try to refresh the token
    const isValid = await ensureValidAuth();

    if (!isValid) {
      // This will trigger the AuthContext to update and show EntryScreen
      return false;
    }

    return true; // Indicate that the caller should retry the request
  }

  return false; // Not an auth error, don't retry
};

// Wrapper for API calls that automatically handles auth errors
export const apiCallWithAuth = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 1,
): Promise<T> => {
  let attempts = 0;

  while (attempts <= maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      attempts++;

      if (attempts <= maxRetries) {
        const shouldRetry = await handleAuthError(error);
        if (shouldRetry) {
          continue;
        }
      }

      // If we get here, either it's not an auth error or we've exhausted retries
      throw error;
    }
  }

  throw new Error("Maximum retry attempts exceeded");
};
