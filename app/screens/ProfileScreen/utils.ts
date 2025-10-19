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

// Get donation badge based on count using new thresholds
export const getDonationBadge = (
  donationCount: number = 0,
): UserData["donationBadge"] => {
  if (donationCount >= 100) return "DIAMOND";
  if (donationCount >= 50) return "PLATINUM";
  if (donationCount >= 25) return "GOLD";
  if (donationCount >= 10) return "SILVER";
  return "BRONZE";
};

// Get badge color
export const getBadgeColor = (badge: UserData["donationBadge"]): string => {
  switch (badge) {
    case "DIAMOND":
      return "#B23CFD";
    case "PLATINUM":
      return "#E5E7EB";
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
    case "DIAMOND":
      return "diamond";
    case "PLATINUM":
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

// Create menu items separated by sections
export const createMenuItems = (
  userRole: string | null,
  hasRole: (role: string) => boolean,
  t: (key: string) => string,
  handlers: {
    onEditProfile: () => void;
    onActivities: () => void;
    onCampaignDashboard: () => void;
    onLanguageSettings: () => void;
    onFAQs: () => void;
    onLogout: () => void;
  },
): { accountItems: MenuItem[]; settingsItems: MenuItem[] } => {
  // Account section items (always include Edit Profile and Activities)
  const accountItems: MenuItem[] = [
    {
      id: "edit-profile",
      title: t("profile.edit_profile"),
      icon: "person-outline",
      onPress: handlers.onEditProfile,
    },
    {
      id: "activities",
      title: t("activities.title"),
      icon: "list-outline",
      onPress: handlers.onActivities,
    },
  ];

  // Add Campaign Dashboard for organizers/admins (in Account section)
  if (hasRole(USER_ROLES.CAMP_ORGANIZER) || hasRole(USER_ROLES.ADMIN)) {
    accountItems.push({
      id: "campaign-dashboard",
      title: t("profile.campaign_dashboard"),
      icon: "analytics-outline",
      onPress: handlers.onCampaignDashboard,
    });
  }

  // Add FAQs to Account section
  accountItems.push({
    id: "faq",
    title: t("profile.faqs"),
    icon: "help-circle-outline",
    onPress: handlers.onFAQs,
  });

  // Settings section items (only Language)
  const settingsItems: MenuItem[] = [
    {
      id: "language",
      title: t("profile.language"),
      icon: "language-outline",
      onPress: handlers.onLanguageSettings,
    },
  ];

  return { accountItems, settingsItems };
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
