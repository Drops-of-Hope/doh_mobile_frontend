// app/screens/EntryScreen.tsx
import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Button from '../../components/atoms/Button';
import TitlePage from '../../components/molecules/TitlePage';
import { useAuth } from '../context/AuthContext';
import { authenticate } from '../services/auth';

export default function EntryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshAuthState } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log('Starting authentication...');
      
      // Asgardeo handles both login and signup on the same page
      // We don't need to specify isSignup parameter - user chooses on Asgardeo
      const authResult = await authenticate(false);
      if (authResult) {
        console.log('Authentication successful, refreshing state...');
        await refreshAuthState();
        // Navigation will be handled automatically by AppNavigator
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      Alert.alert(
        'Authentication Failed',
        'Unable to authenticate with Asgardeo. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main content */}
      <View className="flex-1 px-6 relative z-10">
        {/* Top section - Logo, Title, Subtitle */}
        <View className="flex-1 justify-center items-center">
          <TitlePage showWelcomeMessage={true} />
        </View>
        
        {/* Bottom section - Login Button and Terms */}
        <View className="pb-12">
          {/* Login button */}
          <View className="w-full mb-8">
            <Button 
              title={isLoading ? "Connecting to your account..." : "Let's Save a Life"} 
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>
          
          {/* Info text */}
          <Text className="text-sm text-gray-600 text-center px-8 leading-5 mb-4">
            New user? Don't worry! You can create an account during the login process.
          </Text>
          
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