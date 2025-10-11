import React from "react";
import DropIcon from "../atoms/DropIcon";
import EligibilityIcon from "../atoms/EligibilityIcon";
import CalendarIcon from "../atoms/CalendarIcon";
import GlobeIcon from "../atoms/GlobeIcon";
import BellIcon from "../atoms/BellIcon";
import QuestionIcon from "../atoms/QuestionIcon";
import CampOrganizerIcon from "../atoms/CampOrganizerIcon";
import { useLanguage } from "../../../context/LanguageContext";
import { useAuth, USER_ROLES } from "../../../context/AuthContext";

interface MenuItemsConfigProps {
  onMyDonations?: () => void;
  onDonationEligibility?: () => void;
  onUpcomingAppointment?: () => void;
  onLanguage?: () => void;
  onNotifications?: () => void;
  onBecomeCampOrganizer?: () => void;
  onFAQs?: () => void;
}

export function useMenuItemsConfig({
  onMyDonations,
  onDonationEligibility,
  onUpcomingAppointment,
  onLanguage,
  onNotifications,
  onBecomeCampOrganizer,
  onFAQs,
}: MenuItemsConfigProps) {
  const { t } = useLanguage();
  const { hasRole } = useAuth();

  // Debug: Log the user's roles to help verify the conditional logic
  const isCampOrganizer = hasRole(USER_ROLES.CAMP_ORGANIZER);
  const isDonor = hasRole(USER_ROLES.DONOR);
  const isSelfSignup = hasRole(USER_ROLES.SELFSIGNUP);

  console.log("MenuItemsConfig: User roles check:", {
    isCampOrganizer,
    isDonor,
    isSelfSignup,
    campOrganizerRole: USER_ROLES.CAMP_ORGANIZER,
  });

  console.log("MenuItemsConfig: Conditional logic result:", {
    showCampaignDashboard: isCampOrganizer,
    showBecomeOrganizer: !isCampOrganizer && (isDonor || isSelfSignup),
    showNotifications: !isCampOrganizer && !(isDonor || isSelfSignup),
  });

  const mainMenuItems = [
    {
      id: "donations",
      icon: <DropIcon />,
      title: t("profile.my_donations"),
      onPress: onMyDonations,
    },
    {
      id: "eligibility",
      icon: <EligibilityIcon />,
      title: t("profile.donation_eligibility"),
      onPress: onDonationEligibility,
    },
    {
      id: "appointment",
      icon: <CalendarIcon />,
      title: t("profile.upcoming_appointment"),
      onPress: onUpcomingAppointment,
    },
  ];

  const settingsMenuItems = [
    {
      id: "language",
      icon: <GlobeIcon />,
      title: t("profile.language"),
      onPress: onLanguage,
    },
    {
      id: "notifications",
      icon: <BellIcon />,
      title: t("profile.notifications"),
      onPress: onNotifications,
    },
    // Role-based button: Show Campaign Dashboard for camp organizers,
    // Show Become Camp Organizer for donors/selfsignup users
    ...(isCampOrganizer
      ? [
          {
            id: "campaign_dashboard",
            icon: <CampOrganizerIcon />,
            title: t("profile.campaign_dashboard"),
            onPress: onBecomeCampOrganizer, // Reusing the same handler but it will handle dashboard navigation
          },
        ]
      : isDonor || isSelfSignup
        ? [
            {
              id: "become_organizer",
              icon: <CampOrganizerIcon />,
              title: t("profile.become_camp_organizer"),
              onPress: onBecomeCampOrganizer,
            },
          ]
        : []),
  ];

  return { mainMenuItems, settingsMenuItems };
}
