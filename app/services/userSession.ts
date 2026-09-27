// Central place that reconciles the backend's view of the user with the local cache.
// AuthContext is the only caller — it owns the onboarding/profile-completion decision,
// so every screen reads `profile`/`profileStatus` from context instead of re-deriving it
// from SecureStore itself (which is what let a missing cache on a new device look like a
// new user, see the plan this file was introduced for).
import { UserInfo } from "./auth";
import authUserService, { AuthUserData } from "./authUserService";
import { userService } from "./userService";
import secureStorage from "../utils/secureStorage";
import { logger } from "../utils/logger";

export type ProfileStatus = "unknown" | "complete" | "incomplete";

// The cached/contextual shape of a user's profile. Written to SecureStore's `userData` key
// and mirrored in AuthContext's `profile` state.
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

export interface BootstrapResult {
  profile: EnhancedUserInfo | null;
  status: ProfileStatus;
}

const toAuthUserData = (user: UserInfo): AuthUserData => ({
  sub: user.sub,
  email: user.email,
  given_name: user.given_name || user.name?.split(" ")[0] || "User",
  family_name: user.family_name || user.name?.split(" ").slice(1).join(" ") || "",
  roles: user.roles || [],
  birthdate: user.birthdate || "",
  username: user.username || user.email,
  updated_at:
    typeof user.updated_at === "number" ? user.updated_at : Math.floor(Date.now() / 1000),
});

const readCachedProfile = async (): Promise<EnhancedUserInfo | null> => {
  try {
    const raw = await secureStorage.getItemAsync("userData");
    return raw ? (JSON.parse(raw) as EnhancedUserInfo) : null;
  } catch (error) {
    logger.error("userSession: failed to read cached profile:", error);
    return null;
  }
};

const writeCachedProfile = async (profile: EnhancedUserInfo, authData: AuthUserData) => {
  await secureStorage.setItemAsync("userData", JSON.stringify(profile));
  await secureStorage.setItemAsync("userAuthData", JSON.stringify(authData));
};

/**
 * Resolves whether `user` has a complete backend profile. Always asks the server
 * (`POST /users/create-or-login`, idempotent) rather than trusting an empty/missing
 * local cache — an empty cache is the normal state on a new device for a returning user.
 *
 * Falls back to a cached copy only when it matches this user's id, and only on network
 * failure; a failure never resolves to "incomplete", since that would re-trigger onboarding
 * for an existing user whenever the network hiccups.
 */
export const bootstrapUserSession = async (user: UserInfo): Promise<BootstrapResult> => {
  const authData = toAuthUserData(user);

  try {
    const userResponse = await authUserService.createOrLoginUser(authData);
    const profile = authUserService.transformAuthDataForContext(authData, userResponse);
    await writeCachedProfile(profile, authData);
    return { profile, status: profile.isProfileComplete ? "complete" : "incomplete" };
  } catch (error) {
    logger.error("userSession: bootstrap failed, falling back to cache:", error);
    const cached = await readCachedProfile();
    if (cached && cached.id === user.sub) {
      return { profile: cached, status: cached.isProfileComplete ? "complete" : "incomplete" };
    }
    return { profile: null, status: "unknown" };
  }
};

/**
 * Re-checks profile status against the server (e.g. after editing the profile or avatar,
 * or after completing onboarding). Uses GET /users/profile — cheaper than re-running
 * create-or-login — and refreshes the cache from the response.
 */
export const refreshUserSession = async (user: UserInfo): Promise<BootstrapResult> => {
  try {
    const data = await userService.getUserProfile();

    const cached = await readCachedProfile();
    const profile: EnhancedUserInfo = {
      id: data.id,
      email: data.email,
      name: data.name,
      firstName: cached?.firstName || user.given_name || data.name?.split(" ")[0] || "",
      lastName: cached?.lastName || user.family_name || "",
      roles: cached?.roles || user.roles || [],
      userRole: cached?.userRole || authUserService.getUserRole(user.roles || []),
      bloodGroup: data.bloodGroup,
      nic: data.nic,
      isProfileComplete: data.isProfileComplete,
      totalDonations: data.totalDonations,
      totalPoints: data.totalPoints,
      donationBadge: data.donationBadge || "BRONZE",
      isActive: data.isActive,
      needsProfileCompletion: !data.isProfileComplete,
      isNewUser: false,
    };

    const authData = toAuthUserData(user);
    await writeCachedProfile(profile, authData);
    return { profile, status: profile.isProfileComplete ? "complete" : "incomplete" };
  } catch (error) {
    logger.error("userSession: refresh failed, falling back to bootstrap:", error);
    return bootstrapUserSession(user);
  }
};
