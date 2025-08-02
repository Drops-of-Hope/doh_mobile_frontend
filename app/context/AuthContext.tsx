import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Import auth functions individually to avoid circular dependencies
import * as SecureStore from "expo-secure-store";

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
      const authState = await SecureStore.getItemAsync("authState");
      return authState ? JSON.parse(authState) : null;
    } catch (error) {
      console.error("Failed to retrieve auth state:", error);
      return null;
    }
  };

  // Helper function to clear auth state
  const clearAuthState = async () => {
    try {
      await SecureStore.deleteItemAsync("authState");
    } catch (error) {
      console.error("Failed to clear auth state:", error);
    }
  };

  const refreshAuthState = async () => {
    try {
      setIsLoading(true);
      console.log("AuthContext: Starting auth state refresh...");

      // Wrap everything in an additional safety layer
      try {
        // Import the enhanced auth check
        const { ensureValidAuth, getCurrentUser } = await import(
          "../services/auth"
        );

        // Use the enhanced validation that handles token refresh
        console.log("AuthContext: Calling ensureValidAuth...");
        const isValid = await ensureValidAuth();
        console.log("AuthContext: ensureValidAuth result:", isValid);

        if (isValid) {
          console.log("AuthContext: Getting current user...");
          const currentUser = await getCurrentUser();
          console.log("AuthContext: Current user:", currentUser);
          
          setIsAuthenticatedState(true);
          setUser(currentUser);
          console.log("Auth state valid/refreshed successfully");
        } else {
          console.log("AuthContext: Auth invalid, clearing state...");
          setIsAuthenticatedState(false);
          setUser(null);
          console.log("Auth state invalid, user needs to re-authenticate");
        }
      } catch (authError: any) {
        console.error("AuthContext: Auth operation failed silently:", authError?.message);
        // Always clear state on any auth error to prevent undefined behavior
        setIsAuthenticatedState(false);
        setUser(null);
      }
      
    } catch (error: any) {
      console.error("AuthContext: Critical error in refresh process:", error);
      // Absolutely ensure we clear state on any error
      setIsAuthenticatedState(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("AuthContext: Auth refresh completed, loading:", false);
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

      // Update local state
      setUser(null);
      setIsAuthenticatedState(false);

      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if logout fails, clear local state to ensure user is logged out locally
      setUser(null);
      setIsAuthenticatedState(false);
    }
  };

  const getUserRole = (): string | null => {
    const role =
      user?.roles && user.roles.length > 0
        ? user.roles[0]
        : user?.userType || null;
    // console.log("AuthContext getUserRole:", {
    //   userRoles: user?.roles,
    //   userType: user?.userType,
    //   returnedRole: role,
    // });
    return role;
  };

  const getUserType = (): string | null => {
    return user?.userType || getUserRole();
  };

  const hasRole = (role: string): boolean => {
    // console.log("hasRole check:", {
    //   role,
    //   userRoles: user?.roles,
    //   userType: user?.userType,
    //   user,
    // });

    if (user?.roles) {
      const hasRoleResult = user.roles.includes(role);
      //console.log("hasRole result (from roles array):", hasRoleResult);
      return hasRoleResult;
    }

    const userTypeMatch = getUserType() === role;
    //console.log("hasRole result (from userType):", userTypeMatch);
    return userTypeMatch;
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
