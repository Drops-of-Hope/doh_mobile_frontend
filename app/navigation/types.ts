// Shared param-list types for the navigator tree.
// Root (native-stack)
//  ├─ Splash / Entry           (unauthenticated)
//  └─ AppTabs (bottom-tabs)    (authenticated)
//      ├─ HomeStack
//      ├─ ExploreStack
//      ├─ ActivitiesStack
//      └─ ProfileStack
//  presented over AppTabs: Donate, DonationEligibility, QRScanner, ManualSearch, AvatarPicker

export type HomeStackParamList = {
  Home: undefined;
  Notifications: undefined;
  AllEmergencies: undefined;
  AllCampaigns: undefined;
  UpcomingAppointment: undefined;
  CampaignDetails: { campaignId: string };
};

export type ExploreStackParamList = {
  Explore: undefined;
  CampaignDetails: { campaignId: string };
};

export type ActivitiesStackParamList = {
  Activities: undefined;
  MyDonations: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  FAQs: undefined;
  LanguageSelection: undefined;
  AvatarPicker: undefined;
  CampaignDashboard: undefined;
  CampaignManagement: undefined;
  CampaignAnalytics: { campaignId: string };
  CreateCampaign: undefined;
  EditCampaign: { campaignId: string };
};

export type AppTabsParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  ActivitiesTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  AppTabs: undefined;
  Donate: undefined;
  DonationEligibility: undefined;
  QRScanner: { campaignId: string };
  ManualSearch: { campaignId: string };
};
