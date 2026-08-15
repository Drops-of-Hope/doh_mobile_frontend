import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Sentry from "@sentry/react-native";
import AppNavigator from "./app/navigation/AppNavigator";
import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { LanguageProvider } from "./app/context/LanguageContext";
import { ThemeProvider } from "./app/design";
import ErrorBoundary from "./app/screens/shared/organisms/ErrorBoundary";
import {
  registerForPushNotifications,
  registerPushTokenWithBackend,
  setupNotificationHandlers,
} from "./app/services/pushService";
import { logger } from "./app/utils/logger";

// Crash reporting. The DSN is public-safe (event intake only); init is a
// no-op when it isn't configured (e.g. local dev without .env).
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
  });
}

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Registers for push notifications once auth resolves: asks permission
 * (Android 13+ prompt included), stores the Expo token with the backend, and
 * installs the foreground/tap notification handlers.
 */
function PushNotifications() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;
    const unsubscribe = setupNotificationHandlers({
      onAttendance: (data) => logger.log("Attendance notification:", data),
      onAppointment: (data) => logger.log("Appointment notification:", data),
      onEmergency: (data) => logger.log("Emergency notification:", data),
    });

    (async () => {
      const token = await registerForPushNotifications();
      if (token && !cancelled) {
        await registerPushTokenWithBackend(token);
      }
    })();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isAuthenticated, isLoading]);

  return null;
}

function App() {
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls here
        // await Font.loadAsync({...});
      } catch (e) {
        logger.warn(e);
      } finally {
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <StatusBar style="dark" />
              <PushNotifications />
              <AppNavigator />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(App);
