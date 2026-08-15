import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivitiesStackParamList } from "./types";

import ActivitiesScreen from "../screens/ActivitiesScreen/screen";
import MyDonationsScreen from "../screens/MyDonationsScreen/screen";

const Stack = createNativeStackNavigator<ActivitiesStackParamList>();

export default function ActivitiesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="MyDonations" component={MyDonationsScreen} />
    </Stack.Navigator>
  );
}
