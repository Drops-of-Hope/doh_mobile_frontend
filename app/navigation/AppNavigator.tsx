// app/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { RootStackParamList } from "./types";

import SplashScreen from "../screens/SplashScreen/screen";
import EntryScreen from "../screens/EntryScreen/screen";
import AppTabs from "./AppTabs";

import DonationScreen from "../screens/DonationScreen/screen";
import DonationEligibilityScreen from "../screens/DonationEligibilityScreen/screen";
import QRScannerScreen from "../screens/QRScannerScreen/screen";
import ManualSearchScreen from "../screens/ManualSearchScreen/screen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen
              name="Donate"
              component={DonationScreen}
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="DonationEligibility"
              component={DonationEligibilityScreen}
              options={{ presentation: "modal" }}
            />
            <Stack.Screen
              name="QRScanner"
              component={QRScannerScreen}
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
              name="ManualSearch"
              component={ManualSearchScreen}
              options={{ presentation: "modal" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Entry" component={EntryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
