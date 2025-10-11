// app/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/SplashScreen/screen";
import EntryScreen from "../screens/EntryScreen/screen";

import HomeScreen from "../screens/HomeScreen/screen";
import ProfileScreen from "../screens/ProfileScreen/screen";
import DonationScreen from "../screens/DonationScreen/screen";
import ExploreScreen from "../screens/ExploreScreen/screen";
import ActivitiesScreen from "../screens/ActivitiesScreen/screen";
import MyDonationsScreen from "../screens/MyDonationsScreen/screen";
import DonationEligibilityScreen from "../screens/DonationEligibilityScreen/screen";
import UpcomingAppointmentScreen from "../screens/UpcomingAppointmentScreen/screen";
import NotificationsScreen from "../screens/NotificationsScreen/screen";
import AllEmergenciesScreen from "../screens/AllEmergenciesScreen/screen";
import AllCampaignsScreen from "../screens/AllCampaignsScreen/screen";
import CampaignDashboardScreen from "../screens/CampaignDashboardScreen/screen";
import QRScannerScreen from "../screens/QRScannerScreen/screen";
import CreateCampaignScreen from "../screens/CreateCampaignScreen/screen";
import ManualSearchScreen from "../screens/ManualSearchScreen/screen";
import CampaignManagementScreen from "../screens/CampaignManagementScreen/screen";
import CampaignAnalyticsScreen from "../screens/CampaignAnalyticsScreen/screen";
import EditCampaignScreen from "../screens/EditCampaignScreen/screen";
import CampaignDetailsScreen from "../screens/CampaignDetailsScreen/screen";

type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  Home: undefined;
  Profile: undefined;
  Donate: undefined;
  Explore: undefined;
  Activities: undefined;
  MyDonations: undefined;
  DonationEligibility: undefined;
  UpcomingAppointment: undefined;
  Notifications: undefined;
  AllEmergencies: undefined;
  AllCampaigns: undefined;
  CampaignDashboard: undefined;
  QRScanner: { campaignId: string };
  CreateCampaign: undefined;
  ManualSearch: { campaignId: string };
  CampaignManagement: undefined;
  CampaignAnalytics: { campaignId: string };
  EditCampaign: { campaignId: string };
  CampaignDetails: { campaignId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers for all screens
        }}
      >
        {isAuthenticated ? (
          // Screens for authenticated users
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Donate" component={DonationScreen} />
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="Activities" component={ActivitiesScreen} />
            <Stack.Screen name="MyDonations" component={MyDonationsScreen} />
            <Stack.Screen
              name="DonationEligibility"
              component={DonationEligibilityScreen}
            />
            <Stack.Screen
              name="UpcomingAppointment"
              component={UpcomingAppointmentScreen}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
            <Stack.Screen
              name="AllEmergencies"
              component={AllEmergenciesScreen}
            />
            <Stack.Screen name="AllCampaigns" component={AllCampaignsScreen} />
            <Stack.Screen
              name="CampaignDashboard"
              component={CampaignDashboardScreen}
            />
            <Stack.Screen name="QRScanner" component={QRScannerScreen} />
            <Stack.Screen
              name="CreateCampaign"
              component={CreateCampaignScreen}
            />
            <Stack.Screen
              name="ManualSearch"
              component={ManualSearchScreen}
            />
            <Stack.Screen
              name="CampaignManagement"
              component={CampaignManagementScreen}
            />
            <Stack.Screen
              name="CampaignAnalytics"
              component={CampaignAnalyticsScreen}
            />
            <Stack.Screen
              name="EditCampaign"
              component={EditCampaignScreen}
            />
            <Stack.Screen
              name="CampaignDetails"
              component={CampaignDetailsScreen}
            />
          </>
        ) : (
          // Screens for unauthenticated users - simplified flow
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Entry" component={EntryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
