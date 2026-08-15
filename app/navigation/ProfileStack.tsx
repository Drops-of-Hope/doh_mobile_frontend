import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "./types";

import ProfileScreen from "../screens/ProfileScreen/screen";
import EditProfileScreen from "../screens/EditProfileScreen/screen";
import FAQsScreen from "../screens/FAQsScreen/screen";
import LanguageSelectionScreen from "../screens/LanguageSelectionScreen/screen";
import AvatarPickerScreen from "../screens/AvatarPickerScreen/screen";
import CampaignDashboardScreen from "../screens/CampaignDashboardScreen/screen";
import CampaignManagementScreen from "../screens/CampaignManagementScreen/screen";
import CampaignAnalyticsScreen from "../screens/CampaignAnalyticsScreen/screen";
import CreateCampaignScreen from "../screens/CreateCampaignScreen/screen";
import EditCampaignScreen from "../screens/EditCampaignScreen/screen";
import CampaignDetailsScreen from "../screens/CampaignDetailsScreen/screen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="FAQs" component={FAQsScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="AvatarPicker" component={AvatarPickerScreen} />
      <Stack.Screen name="CampaignDashboard" component={CampaignDashboardScreen} />
      <Stack.Screen name="CampaignManagement" component={CampaignManagementScreen} />
      <Stack.Screen name="CampaignAnalytics" component={CampaignAnalyticsScreen} />
      <Stack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
      <Stack.Screen name="EditCampaign" component={EditCampaignScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}
