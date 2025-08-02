import React from 'react';
import { DropIcon, SearchIcon, HomeIcon, HeartIcon, PersonIcon } from '../../atoms/BottomTabBar/TabIcons';
import { useRoleBasedAccess } from '../../../app/hooks/useRoleBasedAccess';

interface TabsConfigProps {
  activeTab: string;
}

export function useTabsConfig({ activeTab }: TabsConfigProps) {
  const {
    getRoleColors,
    canDonate,
    canVolunteer,
    canManageCampaigns,
    currentRole,
  } = useRoleBasedAccess();
  const roleColors = getRoleColors();

  // Debug logging to understand role-based access
  console.log("BottomTabBar Debug:", {
    currentRole,
    canDonate: canDonate(),
    canVolunteer: canVolunteer(),
    canManageCampaigns: canManageCampaigns(),
  });

  const getTabsForRole = () => {
    // For debugging: Let's show all tabs for now and see what role data we have
    const allTabs = [
      {
        id: "Home",
        label: "Home",
        isActive: activeTab === "home",
        icon: <HomeIcon isActive={activeTab === "home"} color={roleColors.primary} />,
      },
      {
        id: "Donate",
        label: "Donate",
        isActive: activeTab === "donate",
        icon: <DropIcon isActive={activeTab === "donate"} color={roleColors.primary} />,
      },
      {
        id: "Explore",
        label: "Explore",
        isActive: activeTab === "explore",
        icon: <SearchIcon isActive={activeTab === "explore"} color={roleColors.primary} />,
      },
      {
        id: "Activities",
        label: "Activities",
        isActive: activeTab === "activities",
        icon: <HeartIcon isActive={activeTab === "activities"} color={roleColors.primary} />,
      },
      {
        id: "Profile",
        label: "Account",
        isActive: activeTab === "account",
        icon: <PersonIcon isActive={activeTab === "account"} color={roleColors.primary} />,
      },
    ];

    // Debug what we're checking
    // console.log("BottomTabBar - Full debug info:", {
    //   currentRole,
    //   canDonate: canDonate(),
    //   canVolunteer: canVolunteer(),
    //   canManageCampaigns: canManageCampaigns(),
    //   showingAllTabs: true,
    // });

    // console.log(
    //   "Generated tabs:",
    //   allTabs.map((tab) => tab.label)
    // );
    return allTabs;
  };

  return { tabs: getTabsForRole(), roleColors };
}
