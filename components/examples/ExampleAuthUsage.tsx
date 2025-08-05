// Example: How to use the auth user system in your app
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useAuthUser, EnhancedUserInfo } from '../../app/hooks/useAuthUser';

// This is the auth data you're receiving from your auth provider
const exampleAuthData = {
  "birthdate": "1982-12-02",
  "email": "dohmobilecamp@atomicmail.io",
  "family_name": "Wuwa",
  "given_name": "Shorekeeper",
  "roles": ["Internal/CampaignOrg", "Internal/selfsignup", "Internal/everyone"],
  "sub": "d00ae083-6dab-44c0-b9e6-d35c7e9c34c0",
  "updated_at": 1752068960,
  "username": "dohmobilecamp@atomicmail.io"
};

const ExampleAuthUsage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<EnhancedUserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { 
    processAuthUser, 
    completeUserProfile,
    getStoredUserData,
    clearStoredUserData,
    isProcessing, 
    error 
  } = useAuthUser();

  useEffect(() => {
    // Check if user is already logged in
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    const storedUser = await getStoredUserData();
    if (storedUser) {
      setUserInfo(storedUser);
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async () => {
    try {
      // Process the auth data from your auth provider
      const user = await processAuthUser(exampleAuthData);
      
      if (user) {
        setUserInfo(user);
        setIsLoggedIn(true);
        
        if (user.needsProfileCompletion) {
          Alert.alert(
            'Profile Incomplete',
            'Please complete your profile to continue',
            [
              { text: 'Complete Now', onPress: () => handleCompleteProfile(user.id) },
              { text: 'Skip', onPress: () => console.log('User skipped profile completion') }
            ]
          );
        } else {
          Alert.alert('Success', `Welcome ${user.name}!`);
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleCompleteProfile = async (userId: string) => {
    try {
      // Example profile completion data
      const profileData = {
        nic: '123456789V',
        bloodGroup: 'A_POSITIVE',
        address: '123 Main Street, Colombo',
        city: 'Colombo',
        district: 'COLOMBO',
        phoneNumber: '+94123456789',
        emergencyContact: '+94987654321'
      };

      const updatedUser = await completeUserProfile(userId, profileData);
      
      if (updatedUser) {
        setUserInfo(updatedUser);
        Alert.alert('Success', 'Profile completed successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = async () => {
    await clearStoredUserData();
    setUserInfo(null);
    setIsLoggedIn(false);
    Alert.alert('Success', 'Logged out successfully');
  };

  const getUserDataForDonation = () => {
    if (userInfo) {
      // This is the data you can use in donation forms, QR codes, etc.
      return {
        userId: userInfo.id, // This is the 'sub' from auth provider
        userName: userInfo.name,
        userEmail: userInfo.email,
        bloodGroup: userInfo.bloodGroup,
        userRole: userInfo.userRole,
        totalDonations: userInfo.totalDonations,
        isProfileComplete: userInfo.isProfileComplete
      };
    }
    return null;
  };

  if (isProcessing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Processing authentication...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        Auth User Example
      </Text>

      {error && (
        <Text style={{ color: 'red', marginBottom: 20 }}>
          Error: {error}
        </Text>
      )}

      {!isLoggedIn ? (
        <View>
          <Text style={{ marginBottom: 20 }}>
            This simulates receiving auth data from your auth provider
          </Text>
          <Button title="Login with Auth Provider Data" onPress={handleLogin} />
        </View>
      ) : (
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Welcome, {userInfo?.name}!
          </Text>
          
          <Text>User ID: {userInfo?.id}</Text>
          <Text>Email: {userInfo?.email}</Text>
          <Text>Role: {userInfo?.userRole}</Text>
          <Text>Blood Group: {userInfo?.bloodGroup || 'Not set'}</Text>
          <Text>Profile Complete: {userInfo?.isProfileComplete ? 'Yes' : 'No'}</Text>
          <Text>Total Donations: {userInfo?.totalDonations}</Text>
          <Text>Points: {userInfo?.totalPoints}</Text>
          
          <View style={{ marginTop: 20 }}>
            {userInfo?.needsProfileCompletion && (
              <Button 
                title="Complete Profile" 
                onPress={() => handleCompleteProfile(userInfo.id)}
                color="#FF6B6B"
              />
            )}
            
            <View style={{ marginTop: 10 }}>
              <Button 
                title="Get Data for Donation Form"
                onPress={() => {
                  const donationData = getUserDataForDonation();
                  Alert.alert('Donation Data', JSON.stringify(donationData, null, 2));
                }}
              />
            </View>
            
            <View style={{ marginTop: 10 }}>
              <Button title="Logout" onPress={handleLogout} color="#666" />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ExampleAuthUsage;
