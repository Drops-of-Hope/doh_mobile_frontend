// app/navigation/AppNavigator.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import EntryScreen from "../screens/EntryScreen";
import LoginFormScreen from "../screens/LoginFormScreen";
import SignupFormScreen from "../screens/SignupFormScreen";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

type RootStackParamList = {
  Splash: undefined; //undefined means no parameters are expected
  Entry: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Profile" //"Splash"
        screenOptions={{
          headerShown: false, // Hide headers for all screens
        }}
      >
        {/* Screens related to onboarding */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Entry" component={EntryScreen} />
        <Stack.Screen name="Login" component={LoginFormScreen} />
        <Stack.Screen name="Signup" component={SignupFormScreen} />

        {/* Screens related to Users */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        {/* 
        
        <Stack.Screen name="Activities" component={ActivitiesScreen} />
        <Stack.Screen name="Explore" component={ExploreScreen} />
        <Stack.Screen name="Donate" component={DonateScreen} />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
