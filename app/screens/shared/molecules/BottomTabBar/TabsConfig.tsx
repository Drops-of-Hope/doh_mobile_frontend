import React from "react";
import {
  DropIcon,
  SearchIcon,
  HomeIcon,
  HeartIcon,
  PersonIcon,
} from "../../atoms/BottomTabBar/TabIcons";
import { useRoleBasedAccess } from "../../../../hooks/useRoleBasedAccess";
import { useLanguage } from "../../../../context/LanguageContext";

interface TabsConfigProps {
  activeTab: string;
}

export function useTabsConfig({ activeTab }: TabsConfigProps) {
  const {
    getRoleColors,
    canDonate,
    canVolunteer,
    canManageCampaigns,
  } = useRoleBasedAccess();
  const { t } = useLanguage();
  const roleColors = getRoleColors();

  const getTabsForRole = () => {
    // For debugging: Let's show all tabs for now and see what role data we have
    const allTabs = [
      {
        id: "Home",
        label: t("navigation.home"),
        isActive: activeTab === "home",
        icon: (
          <HomeIcon
            isActive={activeTab === "home"}
            color={roleColors.primary}
          />
        ),
      },
      {
        id: "Donate",
        label: t("navigation.donate"),
        isActive: activeTab === "donate",
        icon: (
          <DropIcon
            isActive={activeTab === "donate"}
            color={roleColors.primary}
          />
        ),
      },
      {
        id: "Explore",
        label: t("navigation.explore"),
        isActive: activeTab === "explore",
        icon: (
          <SearchIcon
            isActive={activeTab === "explore"}
            color={roleColors.primary}
          />
        ),
      },
      {
        id: "Activities",
        label: t("navigation.activities"),
        isActive: activeTab === "activities",
        icon: (
          <HeartIcon
            isActive={activeTab === "activities"}
            color={roleColors.primary}
          />
        ),
      },
      {
        id: "Profile",
        label: t("navigation.profile"),
        isActive: activeTab === "account",
        icon: (
          <PersonIcon
            isActive={activeTab === "account"}
            color={roleColors.primary}
          />
        ),
      },
    ];

    return allTabs;
  };

  return { tabs: getTabsForRole(), roleColors };
}
