// Enhanced Auth Hook - Handles user creation/login from auth provider data
import { useState, useCallback } from 'react';
import { authUserService, AuthUserData, UserCreateResponse } from '../services/authUserService';
import * as SecureStore from 'expo-secure-store';

export interface EnhancedUserInfo {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  roles: string[];
  userRole: string;
  bloodGroup?: string;
  nic?: string;
  isProfileComplete: boolean;
  totalDonations: number;
  totalPoints: number;
  donationBadge: string;
  isActive: boolean;
  needsProfileCompletion: boolean;
  isNewUser: boolean;
}

export const useAuthUser = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Process auth provider data and create/login user
   */
  const processAuthUser = useCallback(async (authData: AuthUserData): Promise<EnhancedUserInfo | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create or login user using the auth service
      const userResponse: UserCreateResponse = await authUserService.createOrLoginUser(authData);
      
      // Transform the data for frontend use
      const enhancedUserInfo = authUserService.transformAuthDataForContext(authData, userResponse);

      // Store user data in secure storage
      await SecureStore.setItemAsync('userData', JSON.stringify(enhancedUserInfo));
      await SecureStore.setItemAsync('userAuthData', JSON.stringify(authData));

      // Log the process for debugging
      console.log('User processing completed:', {
        isNewUser: userResponse.isNewUser,
        needsProfileCompletion: userResponse.needsProfileCompletion,
        userId: authData.sub,
      });

      return enhancedUserInfo;
    } catch (error: any) {
      console.error('Error processing auth user:', error);
      setError(error.message || 'Failed to process user authentication');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Complete user profile with additional required information
   */
  const completeUserProfile = useCallback(async (
    userId: string,
    profileData: {
      nic: string;
      bloodGroup: string;
      address: string;
      city: string;
      district: string;
      phoneNumber?: string;
      emergencyContact?: string;
    }
  ): Promise<EnhancedUserInfo | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const userResponse = await authUserService.completeProfile(userId, profileData);
      
      // Get the original auth data to transform the response
      const storedAuthData = await SecureStore.getItemAsync('userAuthData');
      if (!storedAuthData) {
        throw new Error('Original auth data not found');
      }

      const authData: AuthUserData = JSON.parse(storedAuthData);
      const enhancedUserInfo = authUserService.transformAuthDataForContext(authData, userResponse);

      // Update stored user data
      await SecureStore.setItemAsync('userData', JSON.stringify(enhancedUserInfo));

      console.log('Profile completion successful for user:', userId);
      return enhancedUserInfo;
    } catch (error: any) {
      console.error('Error completing user profile:', error);
      setError(error.message || 'Failed to complete user profile');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Get stored user data
   */
  const getStoredUserData = useCallback(async (): Promise<EnhancedUserInfo | null> => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user data:', error);
      return null;
    }
  }, []);

  /**
   * Clear stored user data
   */
  const clearStoredUserData = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync('userData');
      await SecureStore.deleteItemAsync('userAuthData');
    } catch (error) {
      console.error('Error clearing stored user data:', error);
    }
  }, []);

  /**
   * Check if user needs profile completion
   */
  const checkProfileCompletion = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const userData = await getStoredUserData();
      return userData ? !userData.isProfileComplete : true;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return true;
    }
  }, [getStoredUserData]);

  return {
    processAuthUser,
    completeUserProfile,
    getStoredUserData,
    clearStoredUserData,
    checkProfileCompletion,
    isProcessing,
    error,
  };
};

// Helper function to extract user info for components
export const getUserInfoForComponent = (user: EnhancedUserInfo) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    bloodGroup: user.bloodGroup,
    totalDonations: user.totalDonations,
    totalPoints: user.totalPoints,
    donationBadge: user.donationBadge,
    userRole: user.userRole,
    isProfileComplete: user.isProfileComplete,
  };
};

export default useAuthUser;
