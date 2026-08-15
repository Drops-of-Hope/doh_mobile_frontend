// Utility functions for user data management
import secureStorage from './secureStorage';

import { logger } from "./logger";
const deleteKeys = async (keys: string[]): Promise<void> => {
  const deletePromises = keys.map(key =>
    secureStorage.deleteItemAsync(key).catch(error => {
      // Don't throw if key doesn't exist
      if (!error.message?.includes('not found') && !error.message?.includes('does not exist')) {
        logger.warn(`Failed to delete ${key}:`, error);
      }
    })
  );

  await Promise.all(deletePromises);
};

/**
 * Clear only the cached backend profile (not the session/tokens).
 * Use this when the *profile* cache is stale or mismatched but the auth session is still
 * valid — e.g. a consistency-check failure, or a different user's leftover cache. The
 * caller is expected to re-bootstrap the profile from the server afterwards.
 */
export const clearCachedProfile = async (): Promise<void> => {
  try {
    await deleteKeys(['userData', 'userAuthData']);
  } catch (error) {
    logger.error('Error clearing cached profile:', error);
    throw error;
  }
};

/**
 * Clear the entire session: cached profile plus auth tokens.
 * This should be called when:
 * 1. User logs out
 * 2. Auth becomes invalid (token refresh failed, etc.)
 *
 * Do NOT call this for a stale/mismatched profile cache alone — that would force a
 * re-login for what's really just a local caching bug. Use clearCachedProfile for that.
 */
export const clearSession = async (): Promise<void> => {
  try {
    await deleteKeys([
      'userData',         // Stored user profile data
      'userAuthData',     // Stored auth provider data
      'authState',        // Auth tokens and state
      'accessToken',      // Legacy auth token
    ]);
  } catch (error) {
    logger.error('Error clearing session:', error);
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
