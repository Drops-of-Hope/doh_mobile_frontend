import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ExploreStackParamList } from "./types";

import ExploreScreen from "../screens/ExploreScreen/screen";
import CampaignDetailsScreen from "../screens/CampaignDetailsScreen/screen";

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export default function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="CampaignDetails" component={CampaignDetailsScreen} />
    </Stack.Navigator>
  );
}
