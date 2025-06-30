// app/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import BottomTabBar from '../../components/organisms/BottomTabBar';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Main content */}
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Drops of Hope
          </Text>
          <Text className="text-lg text-gray-600 text-center">
            Your home screen content goes here
          </Text>
        </View>
        
        {/* Bottom Tab Bar */}
        <BottomTabBar activeTab="home" />
      </View>
    </SafeAreaView>
  );
}