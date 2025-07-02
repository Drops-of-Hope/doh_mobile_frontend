import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
      const authState = await getAuthState();
      
      if (authState && authState.accessToken) {
        setIsAuthenticatedState(true);
        setUser(authState.userInfo || null);
      } else {
        setIsAuthenticatedState(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing auth state:', error);
      setIsAuthenticatedState(false);
      setUser(null);
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
      await clearAuthState();
      setUser(null);
      setIsAuthenticatedState(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserRole = (): string | null => {
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0];
    }
    return user?.userType || null;
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role constants that can be used throughout the app
export const USER_ROLES = {
  ADMIN: 'admin',
  DONOR: 'donor',
  VOLUNTEER: 'volunteer',
  BENEFICIARY: 'beneficiary',
  ORGANIZATION: 'organization',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
