import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Import auth functions individually to avoid circular dependencies
import secureStorage from "../utils/secureStorage";
import {
  clearAllUserData,
  debugUserIds,
  validateUserDataConsistency,
} from "../utils/userDataUtils";

import { logger } from "../utils/logger";
interface UserInfo {
  sub: string;
  email: string;
  name: string;
  roles?: string[];
  userType?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  userType: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthState: () => Promise<void>;
  hasRole: (role: string) => boolean;
  getFirstName: () => string;
  getFullName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get auth state from secure store
  const getAuthState = async () => {
    try {
      const authState = await secureStorage.getItemAsync("authState");
      return authState ? JSON.parse(authState) : null;
    } catch (error) {
      logger.error("Failed to retrieve auth state:", error);
      return null;
    }
  };

  // Helper function to clear auth state
  const clearAuthState = async () => {
    try {
      await secureStorage.deleteItemAsync("authState");
    } catch (error) {
      logger.error("Failed to clear auth state:", error);
    }
  };

  const refreshAuthState = async () => {
    try {
      setIsLoading(true);

      // Wrap everything in an additional safety layer
      try {
        // Import the enhanced auth check
        const { ensureValidAuth, getCurrentUser } = await import(
          "../services/auth"
        );

        // Use the enhanced validation that handles token refresh
        const isValid = await ensureValidAuth();

        if (isValid) {
          const currentUser = await getCurrentUser();

          // Debug current user data consistency
          await debugUserIds();
          const isConsistent = await validateUserDataConsistency();

          if (!isConsistent) {
            await clearAllUserData();
          }

          // Clear any stored user data from previous sessions if the user ID has changed
          if (user && currentUser && user.sub !== currentUser.sub) {
            await clearAllUserData();
          }

          setIsAuthenticatedState(true);
          setUser(currentUser);
        } else {
          setIsAuthenticatedState(false);
          setUser(null);

          // Also clear stored user data when auth is invalid
          await clearAllUserData();
        }
      } catch (authError: any) {
        logger.error(
          "AuthContext: Auth operation failed silently:",
          authError?.message
        );
        // Always clear state on any auth error to prevent undefined behavior
        setIsAuthenticatedState(false);
        setUser(null);
        await clearAllUserData();
      }
    } catch (error: any) {
      logger.error("AuthContext: Critical error in refresh process:", error);
      // Absolutely ensure we clear state on any error
      setIsAuthenticatedState(false);
      setUser(null);
      await clearAllUserData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuthState();
  }, []);

  const login = async () => {
    await refreshAuthState();
  };

  const logout = async () => {
    try {
      // Import the enhanced logout function from auth service
      const { logout: authLogout } = await import("../services/auth");

      // Call the enhanced logout that handles Asgardeo session termination
      await authLogout();

      // Clear stored user data
      await clearAllUserData();

      // Update local state
      setUser(null);
      setIsAuthenticatedState(false);
    } catch (error) {
      logger.error("Logout error:", error);

      // Even if logout fails, clear local state to ensure user is logged out locally
      setUser(null);
      setIsAuthenticatedState(false);

      // Also clear stored data on logout error
      await clearAllUserData();
    }
  };

  const getUserRole = (): string | null => {
    const role =
      user?.roles && user.roles.length > 0
        ? user.roles[0]
        : user?.userType || null;
    return role;
  };

  const getUserType = (): string | null => {
    return user?.userType || getUserRole();
  };

  const hasRole = (role: string): boolean => {
    if (user?.roles) {
      return user.roles.includes(role);
    }

    return getUserType() === role;
  };

  const getFirstName = (): string => {
    if (!user) return "User";

    // Try to get first name from various possible fields
    if (user.given_name) return user.given_name;
    if (user.first_name) return user.first_name;
    if (user.name) {
      // Split full name and get first part
      const nameParts = user.name.split(" ");
      return nameParts[0];
    }

    return "User";
  };

  const getFullName = (): string => {
    if (!user) return "User";

    // Try to get full name from various possible fields
    if (user.name) return user.name;
    if (user.given_name && user.family_name) {
      return `${user.given_name} ${user.family_name}`;
    }
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user.given_name) return user.given_name;

    return "User";
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    userRole: getUserRole(),
    userType: getUserType(),
    login,
    logout,
    refreshAuthState,
    hasRole,
    getFirstName,
    getFullName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Role constants that can be used throughout the app
export const USER_ROLES = {
  ADMIN: "admin",
  DONOR: "donor",
  SELFSIGNUP: "Internal/selfsignup",
  CAMP_ORGANIZER: "Internal/CampaignOrg",
  VOLUNTEER: "volunteer",
  BENEFICIARY: "beneficiary",
  ORGANIZATION: "organization",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Helper function to check if a role is donor-type
export const isDonorType = (role: string | null): boolean => {
  return role === USER_ROLES.DONOR || role === USER_ROLES.SELFSIGNUP;
};

// Helper function to check if a role has donor privileges (including camp organizers)
export const hasDonorPrivileges = (role: string | null): boolean => {
  return isDonorType(role) || role === USER_ROLES.CAMP_ORGANIZER;
};
