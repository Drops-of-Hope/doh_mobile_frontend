// Authentication User Service - Handle user creation and login from auth provider
import { API_BASE_URL, API_ENDPOINTS } from './api';

// Types for auth provider response
export interface AuthUserData {
  birthdate: string;
  email: string;
  family_name: string;
  given_name: string;
  roles: string[];
  sub: string; // This will be our User.id
  updated_at: number;
  username: string;
}

// Response from our backend
export interface UserCreateResponse {
  user: {
    id: string;
    email: string;
    name: string;
    bloodGroup?: string;
    isProfileComplete: boolean;
    createdAt: string;
    updatedAt: string;
    totalDonations: number;
    totalPoints: number;
    donationBadge: string;
    isActive: boolean;
  };
  isNewUser: boolean;
  needsProfileCompletion: boolean;
}

// Profile completion data
export interface ProfileCompletionData {
  nic: string;
  bloodGroup: string;
  address: string;
  city: string;
  district: string;
  phoneNumber?: string;
  emergencyContact?: string;
}

class AuthUserService {
  /**
   * Create user if not exists, or return existing user
   * Uses the 'sub' from auth provider as the User.id
   */
  async createOrLoginUser(authData: AuthUserData): Promise<UserCreateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_OR_LOGIN_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: authData.sub, // Use sub as the primary key
          email: authData.email,
          name: `${authData.given_name} ${authData.family_name}`.trim(),
          authProvider: 'auth0', // or whatever provider you're using
          authProviderId: authData.sub,
          roles: authData.roles,
          birthdate: authData.birthdate,
          username: authData.username,
          lastAuthUpdate: new Date(authData.updated_at * 1000).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create/login user: ${response.statusText}`);
      }

      const result: UserCreateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error in createOrLoginUser:', error);
      throw error;
    }
  }

  /**
   * Complete user profile after initial auth registration
   */
  async completeProfile(userId: string, profileData: ProfileCompletionData): Promise<UserCreateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMPLETE_PROFILE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...profileData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete profile: ${response.statusText}`);
      }

      const result: UserCreateResponse = await response.json();
      return result;
    } catch (error) {
      console.error('Error in completeProfile:', error);
      throw error;
    }
  }

  /**
   * Check if user exists by ID (sub from auth provider)
   */
  async checkUserExists(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/exists/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return false;
      }

      if (!response.ok) {
        throw new Error(`Failed to check user existence: ${response.statusText}`);
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get user profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Determine user role from auth provider roles
   */
  getUserRole(roles: string[]): string {
    if (roles.includes('Internal/CampaignOrg')) {
      return 'CAMP_ORGANIZER';
    }
    if (roles.includes('Internal/Admin')) {
      return 'ADMIN';
    }
    if (roles.includes('Internal/Staff')) {
      return 'STAFF';
    }
    return 'DONOR'; // Default role
  }

  /**
   * Transform auth data for frontend use
   */
  transformAuthDataForContext(authData: AuthUserData, userResponse: UserCreateResponse) {
    return {
      id: authData.sub,
      email: authData.email,
      name: `${authData.given_name} ${authData.family_name}`.trim(),
      firstName: authData.given_name,
      lastName: authData.family_name,
      roles: authData.roles,
      userRole: this.getUserRole(authData.roles),
      bloodGroup: userResponse.user.bloodGroup,
      isProfileComplete: userResponse.user.isProfileComplete,
      totalDonations: userResponse.user.totalDonations,
      totalPoints: userResponse.user.totalPoints,
      donationBadge: userResponse.user.donationBadge,
      isActive: userResponse.user.isActive,
      needsProfileCompletion: userResponse.needsProfileCompletion,
      isNewUser: userResponse.isNewUser,
    };
  }
}

export const authUserService = new AuthUserService();
export default authUserService;
