import {
  USER_ROLES,
  UserRole,
  isDonorType,
  hasDonorPrivileges,
} from "../context/AuthContext";

// Role-based navigation and feature access utilities
export const RoleBasedAccess = {
  // Features available to each role
  features: {
    [USER_ROLES.ADMIN]: [
      "user_management",
      "system_analytics",
      "content_moderation",
      "all_donations",
      "all_campaigns",
      "system_settings",
    ],
    [USER_ROLES.DONOR]: [
      "make_donation",
      "donation_history",
      "impact_tracking",
      "tax_receipts",
      "explore_campaigns",
      "volunteer_opportunities",
    ],
    [USER_ROLES.SELFSIGNUP]: [
      "make_donation",
      "donation_history",
      "impact_tracking",
      "tax_receipts",
      "explore_campaigns",
      "volunteer_opportunities",
    ],
    [USER_ROLES.CAMP_ORGANIZER]: [
      "make_donation",
      "donation_history",
      "impact_tracking",
      "tax_receipts",
      "explore_campaigns",
      "volunteer_opportunities",
      "campaign_management",
      "donor_analytics",
      "volunteer_coordination",
    ],
    [USER_ROLES.VOLUNTEER]: [
      "volunteer_opportunities",
      "volunteer_hours",
      "community_events",
      "impact_stories",
      "explore_campaigns",
    ],
    [USER_ROLES.BENEFICIARY]: [
      "available_resources",
      "support_services",
      "application_status",
      "community_events",
    ],
    [USER_ROLES.ORGANIZATION]: [
      "campaign_management",
      "donor_analytics",
      "fund_distribution",
      "volunteer_coordination",
      "impact_reporting",
    ],
  },

  // Navigation items based on role
  navigationItems: {
    [USER_ROLES.ADMIN]: [
      { name: "Dashboard", route: "Home", icon: "home" },
      { name: "Users", route: "Users", icon: "users" },
      { name: "Analytics", route: "Analytics", icon: "chart" },
      { name: "Settings", route: "Settings", icon: "settings" },
    ],
    [USER_ROLES.DONOR]: [
      { name: "Home", route: "Home", icon: "home" },
      { name: "Donate", route: "Donate", icon: "heart" },
      { name: "History", route: "History", icon: "history" },
      { name: "Explore", route: "Explore", icon: "search" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
    [USER_ROLES.SELFSIGNUP]: [
      { name: "Home", route: "Home", icon: "home" },
      { name: "Donate", route: "Donate", icon: "heart" },
      { name: "History", route: "History", icon: "history" },
      { name: "Explore", route: "Explore", icon: "search" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
    [USER_ROLES.CAMP_ORGANIZER]: [
      { name: "Home", route: "Home", icon: "home" },
      { name: "Donate", route: "Donate", icon: "heart" },
      { name: "Campaigns", route: "Campaigns", icon: "megaphone" },
      { name: "History", route: "History", icon: "history" },
      { name: "Explore", route: "Explore", icon: "search" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
    [USER_ROLES.VOLUNTEER]: [
      { name: "Home", route: "Home", icon: "home" },
      { name: "Opportunities", route: "Opportunities", icon: "calendar" },
      { name: "My Hours", route: "Hours", icon: "clock" },
      { name: "Events", route: "Events", icon: "event" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
    [USER_ROLES.BENEFICIARY]: [
      { name: "Home", route: "Home", icon: "home" },
      { name: "Resources", route: "Resources", icon: "book" },
      { name: "Support", route: "Support", icon: "help" },
      { name: "Applications", route: "Applications", icon: "file" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
    [USER_ROLES.ORGANIZATION]: [
      { name: "Dashboard", route: "Home", icon: "home" },
      { name: "Campaigns", route: "Campaigns", icon: "megaphone" },
      { name: "Donations", route: "Donations", icon: "dollar" },
      { name: "Analytics", route: "Analytics", icon: "chart" },
      { name: "Profile", route: "Profile", icon: "user" },
    ],
  },

  // Check if user has access to a specific feature
  hasFeatureAccess: (userRole: string | null, feature: string): boolean => {
    if (!userRole || !RoleBasedAccess.features[userRole as UserRole]) {
      return false;
    }
    return RoleBasedAccess.features[userRole as UserRole].includes(feature);
  },

  // Get navigation items for a specific role
  getNavigationItems: (userRole: string | null) => {
    if (!userRole || !RoleBasedAccess.navigationItems[userRole as UserRole]) {
      // Default navigation for unknown roles or donor-type roles
      if (isDonorType(userRole)) {
        return RoleBasedAccess.navigationItems[USER_ROLES.DONOR];
      }

      // Fallback for completely unknown roles
      return [
        { name: "Home", route: "Home", icon: "home" },
        { name: "Profile", route: "Profile", icon: "user" },
      ];
    }
    return RoleBasedAccess.navigationItems[userRole as UserRole];
  },

  // Get role-specific colors
  // Role is communicated by labels and badges, not hue — every role shares the
  // single "Ink & Paper" brand palette. (Previously each role had its own color,
  // which made a donor's tab bar green in an otherwise-red app.)
  getRoleColors: (_userRole: string | null) => {
    return {
      primary: "#C0362C", // crimson
      secondary: "#F5E4E1", // crimsonSoft
      accent: "#1A1917", // ink
    };
  },

  // Check if user has camp organizer privileges
  hasCampOrganizerPrivileges: (userRole: string | null): boolean => {
    return userRole === USER_ROLES.CAMP_ORGANIZER;
  },
};

// Helper functions for role-based UI customization
export const roleBasedStyles = (userRole: string | null) => {
  const colors = RoleBasedAccess.getRoleColors(userRole);

  return {
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.secondary,
      borderColor: colors.primary,
    },
    accentText: {
      color: colors.accent,
    },
    primaryText: {
      color: colors.primary,
    },
  };
};

// Export specific role checking functions for easier usage
export const isDonorTypeRole = isDonorType;
export const hasDonorPrivilegesRole = hasDonorPrivileges;
