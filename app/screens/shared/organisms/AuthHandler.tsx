// Auth Handler Component - Process auth provider response and handle user creation/login
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useAuthUser, EnhancedUserInfo } from '../../../hooks/useAuthUser';
import { AuthUserData } from '../../../services/authUserService';

interface AuthHandlerProps {
  authData: AuthUserData | null;
  onAuthComplete: (user: EnhancedUserInfo) => void;
  onAuthError: (error: string) => void;
  onProfileCompletion: (userId: string) => void;
}

export const AuthHandler: React.FC<AuthHandlerProps> = ({
  authData,
  onAuthComplete,
  onAuthError,
  onProfileCompletion,
}) => {
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  const { processAuthUser, isProcessing, error } = useAuthUser();

  useEffect(() => {
    if (authData && !isProcessingAuth) {
      handleAuthData();
    }
  }, [authData]);

  useEffect(() => {
    if (error) {
      onAuthError(error);
    }
  }, [error, onAuthError]);

  const handleAuthData = async () => {
    if (!authData) return;

    setIsProcessingAuth(true);
    
    try {
      console.log('Processing auth data for user:', authData.email);
      
      const userInfo = await processAuthUser(authData);
      
      if (userInfo) {
        if (userInfo.needsProfileCompletion) {
          console.log('User needs profile completion');
          onProfileCompletion(userInfo.id);
        } else {
          console.log('User auth completed successfully');
          onAuthComplete(userInfo);
        }
      } else {
        onAuthError('Failed to process authentication data');
      }
    } catch (error: any) {
      console.error('Auth handler error:', error);
      onAuthError(error.message || 'Authentication failed');
    } finally {
      setIsProcessingAuth(false);
    }
  };

  if (isProcessing || isProcessingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Processing authentication...</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default AuthHandler;
