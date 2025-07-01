import { View, TouchableOpacity, Alert, Linking, Text, StyleSheet } from "react-native";
import { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

import { authorize, refresh } from "react-native-app-auth";
import { authConfig, initiatePasswordReset } from "../../app/services/auth";

// Icons (you can replace these with actual icon components)
const EmailIcon = () => <Text style={{ fontSize: 20 }}>✉️</Text>;
const LockIcon = () => <Text style={{ fontSize: 20 }}>🔒</Text>;
const AsgardeoIcon = () => <Text style={{ fontSize: 20 }}>🚀</Text>;

export async function login() {
  try {
    const authState = await authorize(authConfig);
    console.log("Access Token:", authState.accessToken);
    console.log("ID Token:", authState.idToken);
    await SecureStore.setItemAsync("authState", JSON.stringify(authState)); // Save auth state securely
    return authState;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export async function refreshToken(refreshToken: string) {
  try {
    const newAuthState = await refresh(authConfig, { refreshToken });
    await SecureStore.setItemAsync("authState", JSON.stringify(newAuthState)); // Update auth state securely
    return newAuthState;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
}

export default function LoginForm() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authState = await login(); // This will redirect to Asgardeo login page
      console.log("Login successful:", authState);
      // Navigation will be handled automatically by AppNavigator when auth state changes
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Login Failed", "Please try again or check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const resetUrl = await initiatePasswordReset();
      
      Alert.alert(
        'Reset Password',
        'You will be redirected to Asgardeo to reset your password. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => {
              Linking.openURL(resetUrl).catch(err => {
                console.error('Failed to open password reset URL:', err);
                Alert.alert('Error', 'Could not open password reset page');
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Password reset failed:', error);
      Alert.alert('Error', 'Failed to initiate password reset');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue saving lives</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<EmailIcon />}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<LockIcon />}
          />

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title={isLoading ? "Signing In..." : "Continue with Asgardeo"}
            onPress={handleLogin}
            disabled={isLoading}
            size="lg"
            leftIcon={<AsgardeoIcon />}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Secure Authentication</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🔐 Powered by Asgardeo for maximum security
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  infoContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
