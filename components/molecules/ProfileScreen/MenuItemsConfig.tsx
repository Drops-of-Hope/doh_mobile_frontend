import React from 'react';
import DropIcon from '../../atoms/ProfileScreen/DropIcon';
import EligibilityIcon from '../../atoms/ProfileScreen/EligibilityIcon';
import CalendarIcon from '../../atoms/ProfileScreen/CalendarIcon';
import GlobeIcon from '../../atoms/ProfileScreen/GlobeIcon';
import BellIcon from '../../atoms/ProfileScreen/BellIcon';
import QuestionIcon from '../../atoms/ProfileScreen/QuestionIcon';
import CampOrganizerIcon from '../../atoms/ProfileScreen/CampOrganizerIcon';
import { useLanguage } from '../../../app/context/LanguageContext';
import { useAuth, USER_ROLES } from '../../../app/context/AuthContext';

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

  const mainMenuItems = [
    {
      id: "donations",
      icon: <DropIcon />,
      title: t('profile.my_donations'),
      onPress: onMyDonations,
    },
    {
      id: "eligibility",
      icon: <EligibilityIcon />,
      title: t('profile.donation_eligibility'),
      onPress: onDonationEligibility,
    },
    {
      id: "appointment",
      icon: <CalendarIcon />,
      title: t('profile.upcoming_appointment'),
      onPress: onUpcomingAppointment,
    },
  ];

  const settingsMenuItems = [
    {
      id: "language",
      icon: <GlobeIcon />,
      title: t('profile.language'),
      onPress: onLanguage,
    },
    // Show "Become Camp Organizer" for donors (including selfsignup), "Notifications" for others
    ...(hasRole(USER_ROLES.DONOR) || hasRole(USER_ROLES.SELFSIGNUP) ? [
      {
        id: "become_organizer",
        icon: <CampOrganizerIcon />,
        title: t('profile.become_camp_organizer'),
        onPress: onBecomeCampOrganizer,
      }
    ] : [
      {
        id: "notifications",
        icon: <BellIcon />,
        title: t('profile.notifications'),
        onPress: onNotifications,
      }
    ]),
    {
      id: "faqs",
      icon: <QuestionIcon />,
      title: t('profile.faqs'),
      onPress: onFAQs,
    },
  ];

  return { mainMenuItems, settingsMenuItems };
}
