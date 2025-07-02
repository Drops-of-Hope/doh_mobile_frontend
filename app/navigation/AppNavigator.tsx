// app/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import SplashScreen from "../screens/SplashScreen";
import EntryScreen from "../screens/EntryScreen";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DonationScreen from "../screens/DonationScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";

type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
  Home: undefined;
  Profile: undefined;
  Donate: undefined;
  Explore: undefined;
  Activities: undefined;
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
