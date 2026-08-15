// Shown by AppNavigator when the authenticated user's backend profile couldn't be
// resolved (e.g. no network on a fresh install). Deliberately blocking — it must never
// fall through to ProfileCompletionScreen, since that would re-onboard an existing user
// whenever the network hiccups. See services/userSession.ts for the status semantics.
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CloudOff } from 'lucide-react-native';
import { Screen, Button, Text } from '../../design';
import { useAuth } from '../../context/AuthContext';

const ProfileLoadErrorScreen: React.FC = () => {
  const { refreshBackendUser, logout } = useAuth();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await refreshBackendUser();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Screen edges={["top", "bottom"]}>
      <View style={styles.body}>
        <CloudOff size={40} />
        <Text variant="h2" align="center" style={styles.title}>
          Couldn&apos;t load your profile
        </Text>
        <Text variant="body" tone="inkMuted" align="center" style={styles.subtitle}>
          Check your internet connection and try again.
        </Text>

        <View style={styles.actions}>
          <Button title="Retry" onPress={handleRetry} loading={isRetrying} disabled={isRetrying} />
          <Button title="Sign out" variant="outline" onPress={() => logout()} disabled={isRetrying} />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 8 },
  title: { marginTop: 16 },
  subtitle: { marginBottom: 16, maxWidth: 280 },
  actions: { width: '100%', gap: 12, marginTop: 8 },
});

export default ProfileLoadErrorScreen;
