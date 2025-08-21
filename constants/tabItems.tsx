import React from "react";
import {
  DropIcon,
  SearchIcon,
  HomeIcon,
  HeartIcon,
  PersonIcon,
} from "./tabIcons";
import { useLanguage } from "../app/context/LanguageContext";

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
    getLabel: (t: (key: string) => string) => t("navigation.donate"),
    getIcon: (isActive = false) => <DropIcon isActive={isActive} />,
  },
  EXPLORE: {
    id: "explore",
    getLabel: (t: (key: string) => string) => t("navigation.explore"),
    getIcon: (isActive = false) => <SearchIcon isActive={isActive} />,
  },
  HOME: {
    id: "home",
    getLabel: (t: (key: string) => string) => t("navigation.home"),
    getIcon: (isActive = false) => <HomeIcon isActive={isActive} />,
  },
  ACTIVITIES: {
    id: "activities",
    getLabel: (t: (key: string) => string) => t("navigation.activities"),
    getIcon: (isActive = false) => <HeartIcon isActive={isActive} />,
  },
  ACCOUNT: {
    id: "account",
    getLabel: (t: (key: string) => string) => t("navigation.profile"),
    getIcon: (isActive = false) => <PersonIcon isActive={isActive} />,
  },
} as const;

// Helper function to create tab items with onPress handlers
export const createTabItem = (
  tabConfig: (typeof TAB_CONFIG)[keyof typeof TAB_CONFIG],
  t: (key: string) => string,
  onPress?: () => void,
  isActive = false,
): TabItem => ({
  id: tabConfig.id,
  icon: tabConfig.getIcon(isActive),
  label: tabConfig.getLabel(t),
  isActive,
  onPress,
});

// Common tab combinations for different screens
export const createProfileScreenTabs = (
  t: (key: string) => string,
  handlers: {
    onDonate?: () => void;
    onExplore?: () => void;
    onHome?: () => void;
    onActivities?: () => void;
    onAccount?: () => void;
  }
): TabItem[] => [
  createTabItem(TAB_CONFIG.DONATE, t, handlers.onDonate),
  createTabItem(TAB_CONFIG.EXPLORE, t, handlers.onExplore),
  createTabItem(TAB_CONFIG.HOME, t, handlers.onHome),
  createTabItem(TAB_CONFIG.ACTIVITIES, t, handlers.onActivities),
  createTabItem(TAB_CONFIG.ACCOUNT, t, handlers.onAccount, true), // Active for profile screen
];

export const createHomeScreenTabs = (
  t: (key: string) => string,
  handlers: {
    onDonate?: () => void;
    onExplore?: () => void;
    onHome?: () => void;
    onActivities?: () => void;
    onAccount?: () => void;
  }
): TabItem[] => [
  createTabItem(TAB_CONFIG.DONATE, t, handlers.onDonate),
  createTabItem(TAB_CONFIG.EXPLORE, t, handlers.onExplore),
  createTabItem(TAB_CONFIG.HOME, t, handlers.onHome, true), // Active for home screen
  createTabItem(TAB_CONFIG.ACTIVITIES, t, handlers.onActivities),
  createTabItem(TAB_CONFIG.ACCOUNT, t, handlers.onAccount),
];
