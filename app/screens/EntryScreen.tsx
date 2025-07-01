// app/screens/EntryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/atoms/Button';
import TitlePage from '../../components/molecules/TitlePage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Entry: undefined;
  Auth: undefined;
};

export default function EntryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="flex-1 bg-white">

      {/* Main content */}
      <View className="flex-1 px-6 relative z-10">
        {/* Top section - Logo, Title, Subtitle */}
        <View className="flex-1 justify-center items-center">
          <TitlePage showWelcomeMessage={true} />
        </View>
        
        {/* Bottom section - Buttons and Terms */}
        <View className="pb-12">
          {/* Get Started button */}
          <View className="w-full mb-8">
            <Button 
              title="Get Started" 
              onPress={() => navigation.navigate('Auth')} 
            />
          </View>
          
          {/* Terms and Privacy */}
          <Text className="text-sm text-gray-500 text-center px-8 leading-5">
            By continuing, you agree to our{' '}
            <Text className="text-red-600">Terms of Service</Text>
            {'\n'}and{' '}
            <Text className="text-red-600">Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}