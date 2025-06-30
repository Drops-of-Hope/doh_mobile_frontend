import React from "react";
import {
  DropIcon,
  SearchIcon,
  HomeIcon,
  HeartIcon,
  PersonIcon,
} from "./tabIcons";

export interface TabItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

// Base tab configuration without onPress handlers
// These can be used to create tab items with custom onPress handlers
export const TAB_CONFIG = {
  DONATE: {
    id: "donate",
    label: "Donate",
    getIcon: (isActive = false) => <DropIcon isActive={isActive} />,
  },
  EXPLORE: {
    id: "explore",
    label: "Explore",
    getIcon: (isActive = false) => <SearchIcon isActive={isActive} />,
  },
  HOME: {
    id: "home",
    label: "Home",
    getIcon: (isActive = false) => <HomeIcon isActive={isActive} />,
  },
  ACTIVITIES: {
    id: "activities",
    label: "Activities",
    getIcon: (isActive = false) => <HeartIcon isActive={isActive} />,
  },
  ACCOUNT: {
    id: "account",
    label: "Account",
    getIcon: (isActive = false) => <PersonIcon isActive={isActive} />,
  },
} as const;

// Helper function to create tab items with onPress handlers
export const createTabItem = (
  tabConfig: (typeof TAB_CONFIG)[keyof typeof TAB_CONFIG],
  onPress?: () => void,
  isActive = false
): TabItem => ({
  id: tabConfig.id,
  icon: tabConfig.getIcon(isActive),
  label: tabConfig.label,
  isActive,
  onPress,
});

// Common tab combinations for different screens
export const createProfileScreenTabs = (handlers: {
  onDonate?: () => void;
  onExplore?: () => void;
  onHome?: () => void;
  onActivities?: () => void;
  onAccount?: () => void;
}): TabItem[] => [
  createTabItem(TAB_CONFIG.DONATE, handlers.onDonate),
  createTabItem(TAB_CONFIG.EXPLORE, handlers.onExplore),
  createTabItem(TAB_CONFIG.HOME, handlers.onHome),
  createTabItem(TAB_CONFIG.ACTIVITIES, handlers.onActivities),
  createTabItem(TAB_CONFIG.ACCOUNT, handlers.onAccount, true), // Active for profile screen
];

export const createHomeScreenTabs = (handlers: {
  onDonate?: () => void;
  onExplore?: () => void;
  onHome?: () => void;
  onActivities?: () => void;
  onAccount?: () => void;
}): TabItem[] => [
  createTabItem(TAB_CONFIG.DONATE, handlers.onDonate),
  createTabItem(TAB_CONFIG.EXPLORE, handlers.onExplore),
  createTabItem(TAB_CONFIG.HOME, handlers.onHome, true), // Active for home screen
  createTabItem(TAB_CONFIG.ACTIVITIES, handlers.onActivities),
  createTabItem(TAB_CONFIG.ACCOUNT, handlers.onAccount),
];
