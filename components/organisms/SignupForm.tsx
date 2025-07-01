// components/organisms/SignupForm.tsx
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { signup } from '../../app/services/auth';

// Icons (you can replace these with actual icon components)
const UserIcon = () => <Text style={{ fontSize: 20 }}>👤</Text>;
const EmailIcon = () => <Text style={{ fontSize: 20 }}>✉️</Text>;
const LockIcon = () => <Text style={{ fontSize: 20 }}>🔒</Text>;
const AsgardeoIcon = () => <Text style={{ fontSize: 20 }}>🚀</Text>;

export default function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signup();
      console.log('Signup initiated - redirecting to Asgardeo...');
    } catch (error) {
      console.error('Signup failed:', error);
      Alert.alert("Signup Failed", "Please try again or check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formCard}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Join Our Mission</Text>
          <Text style={styles.subtitle}>Create an account to start saving lives</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<UserIcon />}
          />
          
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
            placeholder="Create a strong password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<LockIcon />}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title={isLoading ? "Creating Account..." : "Sign Up with Asgardeo"}
            onPress={handleSignup}
            disabled={isLoading}
            size="lg"
            leftIcon={<AsgardeoIcon />}
          />
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Secure Registration</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🔐 Your data is protected by enterprise-grade security
            </Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsTitle}>Why Join Drops of Hope?</Text>
            <View style={styles.benefitsList}>
              <Text style={styles.benefitItem}>🩸 Connect with blood donation centers</Text>
              <Text style={styles.benefitItem}>📱 Track your donation history</Text>
              <Text style={styles.benefitItem}>🏆 Earn recognition for your contributions</Text>
              <Text style={styles.benefitItem}>💝 Help save lives in your community</Text>
            </View>
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
  benefitsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});
