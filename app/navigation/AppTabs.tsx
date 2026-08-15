import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppTabsParamList } from "./types";
import InkTabBar from "./InkTabBar";

import HomeStack from "./HomeStack";
import ExploreStack from "./ExploreStack";
import ActivitiesStack from "./ActivitiesStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator<AppTabsParamList>();

// Each tab owns its own native-stack, so scroll position and history are
// preserved when switching tabs and the Android back button pops within
// the active tab instead of leaving the app.
export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <InkTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} />
      <Tab.Screen name="ActivitiesTab" component={ActivitiesStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
}
