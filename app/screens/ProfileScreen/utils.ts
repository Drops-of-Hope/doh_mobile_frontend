import { UserData, MenuItem } from "./types";
import { USER_ROLES } from "../../context/AuthContext";

// Get role-based membership type
export const getRoleMembershipType = (userRole: string | null): string => {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return "ADMIN";
    case USER_ROLES.CAMP_ORGANIZER:
      return "ORGANIZER";
    case USER_ROLES.ORGANIZATION:
      return "ORGANIZATION";
    case USER_ROLES.VOLUNTEER:
      return "VOLUNTEER";
    case USER_ROLES.DONOR:
    default:
      return "DONOR";
  }
};

// Get donation badge based on count
export const getDonationBadge = (
  donationCount: number = 0,
): UserData["donationBadge"] => {
  if (donationCount >= 50) return "HERO";
  if (donationCount >= 25) return "GOLD";
  if (donationCount >= 10) return "SILVER";
  return "BRONZE";
};

// Get badge color
export const getBadgeColor = (badge: UserData["donationBadge"]): string => {
  switch (badge) {
    case "HERO":
      return "#DC2626";
    case "GOLD":
      return "#F59E0B";
    case "SILVER":
      return "#6B7280";
    case "BRONZE":
    default:
      return "#92400E";
  }
};

// Get badge icon
export const getBadgeIcon = (badge: UserData["donationBadge"]): string => {
  switch (badge) {
    case "HERO":
      return "trophy";
    case "GOLD":
      return "medal";
    case "SILVER":
      return "ribbon";
    case "BRONZE":
    default:
      return "star";
  }
};

// Create default menu items
export const createMenuItems = (
  userRole: string | null,
  hasRole: (role: string) => boolean,
  handlers: {
    onEditProfile: () => void;
    onMyDonations: () => void;
    onActivities: () => void;
    onCampaignDashboard: () => void;
    onLanguageSettings: () => void;
    onFAQs: () => void;
    onLogout: () => void;
  },
): MenuItem[] => {
  const baseItems: MenuItem[] = [
    {
      id: "edit-profile",
      title: "Edit Profile",
      icon: "person-outline",
      onPress: handlers.onEditProfile,
    },
    {
      id: "my-donations",
      title: "My Donations",
      icon: "heart-outline",
      onPress: handlers.onMyDonations,
    },
    {
      id: "activities",
      title: "Activities",
      icon: "list-outline",
      onPress: handlers.onActivities,
    },
  ];

  // Add role-specific items
  if (hasRole(USER_ROLES.CAMP_ORGANIZER) || hasRole(USER_ROLES.ADMIN)) {
    baseItems.push({
      id: "campaign-dashboard",
      title: "Campaign Dashboard",
      icon: "analytics-outline",
      onPress: handlers.onCampaignDashboard,
    });
  }

  // Add settings items
  baseItems.push(
    {
      id: "language",
      title: "Language Settings",
      icon: "language-outline",
      onPress: handlers.onLanguageSettings,
    },
    {
      id: "faq",
      title: "Help & FAQs",
      icon: "help-circle-outline",
      onPress: handlers.onFAQs,
    },
    {
      id: "logout",
      title: "Logout",
      icon: "log-out-outline",
      onPress: handlers.onLogout,
      showArrow: false,
    },
  );

  return baseItems;
};

// Format membership type for display
export const formatMembershipType = (membershipType: string): string => {
  return (
    membershipType.charAt(0).toUpperCase() +
    membershipType.slice(1).toLowerCase()
  );
};

// Generate mock user data
export const getMockUserData = (
  user: any,
  getFullName: () => string,
): UserData => ({
  name: getFullName(),
  email: user?.email || "user@example.com",
  bloodType: user?.bloodType || "O+",
  mobileNumber: user?.mobileNumber || "000-000-0000",
  donationBadge: getDonationBadge(user?.donationCount || 0),
  imageUri: "https://example.com/profile-image.jpg",
  membershipType: "DONOR",
});
