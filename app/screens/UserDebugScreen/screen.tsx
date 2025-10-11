import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../context/AuthContext';
import { debugUserIds, validateUserDataConsistency, clearAllUserData } from '../../utils/userDataUtils';

export default function UserDebugScreen() {
  const [debugData, setDebugData] = useState<any>(null);
  const { user, refreshAuthState } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loadDebugData = async () => {
    setIsLoading(true);
    try {
      const data: any = {};

      // Get AuthContext user
      data.authContextUser = user;

      // Get authState
      const authState = await SecureStore.getItemAsync('authState');
      data.authState = authState ? JSON.parse(authState) : null;

      // Get userData
      const userData = await SecureStore.getItemAsync('userData');
      data.userData = userData ? JSON.parse(userData) : null;

      // Get userAuthData
      const userAuthData = await SecureStore.getItemAsync('userAuthData');
      data.userAuthData = userAuthData ? JSON.parse(userAuthData) : null;

      // Check consistency
      data.isConsistent = await validateUserDataConsistency();

      setDebugData(data);
    } catch (error) {
      console.error('Error loading debug data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDebugData();
  }, [user]);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will clear all stored user data. You will need to log in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllUserData();
              await refreshAuthState();
              await loadDebugData();
              Alert.alert('Success', 'All user data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data: ' + error);
            }
          },
        },
      ]
    );
  };

  const handleRefreshAuth = async () => {
    setIsLoading(true);
    try {
      await refreshAuthState();
      await loadDebugData();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh auth: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading debug data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Debug Screen</Text>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.blueButton}
          onPress={loadDebugData}
        >
          <Text style={styles.buttonText}>Reload Debug Data</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.greenButton}
          onPress={handleRefreshAuth}
        >
          <Text style={styles.buttonText}>Refresh Auth State</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.redButton}
          onPress={handleClearAllData}
        >
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      {/* Data Consistency */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Consistency</Text>
        <Text style={debugData?.isConsistent ? styles.successText : styles.errorText}>
          {debugData?.isConsistent ? '✅ Consistent' : '❌ Inconsistent'}
        </Text>
      </View>

      {/* AuthContext User */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AuthContext User</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>
            {JSON.stringify(debugData?.authContextUser, null, 2)}
          </Text>
        </View>
      </View>

      {/* AuthState */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AuthState (SecureStore)</Text>
        <View style={styles.dataContainer}>
          <Text style={styles.dataText}>
            User ID: {debugData?.authState?.userInfo?.sub || 'None'}
          </Text>
          <Text style={styles.dataText}>
            Email: {debugData?.authState?.userInfo?.email || 'None'}
          </Text>
          <Text style={styles.dataText}>
            Has Token: {debugData?.authState?.accessToken ? 'Yes' : 'No'}
          </Text>
        </View>
      </View>

      {/* UserData */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UserData (SecureStore)</Text>
        <View style={styles.dataContainer}>
          {debugData?.userData ? (
            <>
              <Text style={styles.dataText}>
                User ID: {debugData.userData.id || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Name: {debugData.userData.name || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Email: {debugData.userData.email || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Profile Complete: {debugData.userData.isProfileComplete ? 'Yes' : 'No'}
              </Text>
            </>
          ) : (
            <Text style={styles.dataText}>No userData found</Text>
          )}
        </View>
      </View>

      {/* UserAuthData */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UserAuthData (SecureStore)</Text>
        <View style={styles.dataContainer}>
          {debugData?.userAuthData ? (
            <>
              <Text style={styles.dataText}>
                User ID (sub): {debugData.userAuthData.sub || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Email: {debugData.userAuthData.email || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Given Name: {debugData.userAuthData.given_name || 'None'}
              </Text>
              <Text style={styles.dataText}>
                Family Name: {debugData.userAuthData.family_name || 'None'}
              </Text>
            </>
          ) : (
            <Text style={styles.dataText}>No userAuthData found</Text>
          )}
        </View>
      </View>

      {/* Raw Data Dump */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Raw Data Dump</Text>
        <View style={styles.dataContainer}>
          <ScrollView horizontal>
            <Text style={styles.rawDataText}>
              {JSON.stringify(debugData, null, 2)}
            </Text>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  blueButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  greenButton: {
    backgroundColor: '#10B981',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  redButton: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  dataContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  dataText: {
    fontFamily: 'monospace',
    fontSize: 12,
  },
  rawDataText: {
    fontFamily: 'monospace',
    fontSize: 10,
  },
  successText: {
    color: '#059669',
  },
  errorText: {
    color: '#DC2626',
  },
});
