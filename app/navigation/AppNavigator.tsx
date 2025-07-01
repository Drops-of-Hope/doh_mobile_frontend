// app/navigation/AppNavigator.tsx
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SecureStore from "expo-secure-store";

import SplashScreen from "../screens/SplashScreen";
import EntryScreen from "../screens/EntryScreen";
import AuthScreen from "../screens/AuthScreen";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DonationScreen from "../screens/DonationScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";

type RootStackParamList = {
  Splash: undefined; //undefined means no parameters are expected
  Entry: undefined;
  Auth: undefined; // Unified auth screen
  Home: undefined;
  Profile: undefined;
  Donate: undefined;
  Explore: undefined;
  Activities: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const authState = await SecureStore.getItemAsync("authState");
        setIsAuthenticated(!!authState);
      } catch (error) {
        console.error("Failed to retrieve auth state:", error);
      }
    }
    checkAuth();
  }, []);

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
          // Screens for unauthenticated users
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
