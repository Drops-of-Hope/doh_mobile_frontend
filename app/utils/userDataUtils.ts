// Utility functions for user data management
import secureStorage from './secureStorage';

import { logger } from "./logger";
/**
 * Clear all user-related stored data
 * This should be called when:
 * 1. User logs out
 * 2. User ID changes (different user logs in)
 * 3. Auth becomes invalid
 */
export const clearAllUserData = async (): Promise<void> => {
  try {
    const keysToDelete = [
      'userData',         // Stored user profile data
      'userAuthData',     // Stored auth provider data
      'authState',        // Auth tokens and state
      'accessToken',      // Legacy auth token
    ];

    const deletePromises = keysToDelete.map(key => 
      secureStorage.deleteItemAsync(key).catch(error => {
        // Don't throw if key doesn't exist
        if (!error.message?.includes('not found') && !error.message?.includes('does not exist')) {
          logger.warn(`Failed to delete ${key}:`, error);
        }
      })
    );

    await Promise.all(deletePromises);
  } catch (error) {
    logger.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Get user ID from various sources
 * Helps debug which user ID is being used where
 */
export const debugUserIds = async (): Promise<void> => {
  try {
    await secureStorage.getItemAsync('authState');
    await secureStorage.getItemAsync('userData');
    await secureStorage.getItemAsync('userAuthData');
  } catch (error) {
    logger.error('Error debugging user IDs:', error);
  }
};

/**
 * Validate that all stored user data has consistent user IDs
 * Returns true if consistent or no data exists, false if inconsistent
 */
export const validateUserDataConsistency = async (): Promise<boolean> => {
  try {
    const userIds = [];

    // Get user ID from authState
    const authState = await secureStorage.getItemAsync('authState');
    if (authState) {
      const parsed = JSON.parse(authState);
      if (parsed.userInfo?.sub) {
        userIds.push({ source: 'authState', id: parsed.userInfo.sub });
      }
    }

    // Get user ID from userData
    const userData = await secureStorage.getItemAsync('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      if (parsed.id) {
        userIds.push({ source: 'userData', id: parsed.id });
      }
    }

    // Get user ID from userAuthData
    const userAuthData = await secureStorage.getItemAsync('userAuthData');
    if (userAuthData) {
      const parsed = JSON.parse(userAuthData);
      if (parsed.sub) {
        userIds.push({ source: 'userAuthData', id: parsed.sub });
      }
    }

    if (userIds.length === 0) {
      return true;
    }

    // Check if all IDs are the same
    const firstId = userIds[0].id;
    const isConsistent = userIds.every(item => item.id === firstId);

    if (!isConsistent) {
      logger.error('User data inconsistency detected:');
      userIds.forEach(item => {
        logger.error(`- ${item.source}: ${item.id}`);
      });
    }

    return isConsistent;
  } catch (error) {
    logger.error('Error validating user data consistency:', error);
    return false;
  }
};

/**
 * Extract time from ISO datetime string without timezone conversion
 * @param isoString - ISO datetime string like "2025-07-05T09:30:00" or "2025-07-05T09:30:00.000Z"
 * @returns Time string in "HH:MM" format, or original string if parsing fails
 */
export const extractTimeFromISO = (isoString: string | undefined | null): string => {
  if (!isoString) return "";
  // Strip timezone suffix (.000Z) to prevent UTC conversion
  const cleanString = isoString.replace(/\.000Z$/, '');
  // Extract "HH:MM" from ISO string without timezone conversion
  const timePart = cleanString.split('T')[1]?.substring(0, 5);
  return timePart || isoString;
};
