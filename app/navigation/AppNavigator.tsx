// app/navigation/AppNavigator.tsx
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../design";
import { RootStackParamList } from "./types";

import SplashScreen from "../screens/SplashScreen/screen";
import EntryScreen from "../screens/EntryScreen/screen";
import AppTabs from "./AppTabs";
import ProfileCompletionScreen from "../screens/ProfileCompletionScreen/screen";
import ProfileLoadErrorScreen from "../screens/ProfileLoadErrorScreen/screen";

import DonationScreen from "../screens/DonationScreen/screen";
import DonationEligibilityScreen from "../screens/DonationEligibilityScreen/screen";
import QRScannerScreen from "../screens/QRScannerScreen/screen";
import ManualSearchScreen from "../screens/ManualSearchScreen/screen";

const Stack = createNativeStackNavigator<RootStackParamList>();

// A bare loading gate, not the branded SplashScreen — SplashScreen owns a hard 2.4s timer
// that navigates to "Entry", which isn't a screen in this branch of the stack.
function LoadingGate() {
  const theme = useTheme();
  return (
    <View style={[styles.loadingGate, { backgroundColor: theme.color.paper }]}>
      <ActivityIndicator size="large" color={theme.color.crimson} />
    </View>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading, hasResolvedProfile, profileStatus } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Gated on hasResolvedProfile, not isLoading directly — once the profile has
            resolved once, the full stack must stay mounted so a later refreshAuthState()
            call (e.g. from a screen deep in the stack) can't collapse the navigator's
            children back down to Loading and drop whatever screen the user is on. */}
        {!hasResolvedProfile && (isLoading || isAuthenticated) ? (
          <Stack.Screen name="Loading" component={LoadingGate} />
        ) : !isAuthenticated ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Entry" component={EntryScreen} />
          </>
        ) : profileStatus === "unknown" ? (
          <Stack.Screen name="ProfileLoadError" component={ProfileLoadErrorScreen} />
        ) : profileStatus === "incomplete" ? (
          <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
        ) : (
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
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingGate: { flex: 1, alignItems: "center", justifyContent: "center" },
});
