import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./types";

import HomeScreen from "../screens/HomeScreen/screen";
import NotificationsScreen from "../screens/NotificationsScreen/screen";
import AllEmergenciesScreen from "../screens/AllEmergenciesScreen/screen";
import AllCampaignsScreen from "../screens/AllCampaignsScreen/screen";
import UpcomingAppointmentScreen from "../screens/UpcomingAppointmentScreen/screen";
import CampaignDetailsScreen from "../screens/CampaignDetailsScreen/screen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="AllEmergencies" component={AllEmergenciesScreen} />
      <Stack.Screen name="AllCampaigns" component={AllCampaignsScreen} />
      <Stack.Screen name="UpcomingAppointment" component={UpcomingAppointmentScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}
