import React from "react";
import {
  ScrollView,
  View,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../ThemeProvider";
import { useTabBarHeight } from "../useTabBarHeight";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  contentStyle?: ViewStyle;
  edges?: ("top" | "bottom" | "left" | "right")[];
  keyboardAvoiding?: boolean;
}

// Replaces the per-screen SafeAreaView + StatusBar + paddingTop hacks that
// existed in every old screen.
export const Screen: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  refreshing = false,
  onRefresh,
  contentStyle,
  edges = ["top"],
  keyboardAvoiding = false,
}) => {
  const theme = useTheme();
  const tabBarHeight = useTabBarHeight();

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        { padding: theme.space.xl, paddingBottom: tabBarHeight + theme.space.xxl },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.color.crimson} /> : undefined}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: theme.color.paper }]} edges={edges}>
      <StatusBar style="dark" />
      {keyboardAvoiding ? (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {body}
        </KeyboardAvoidingView>
      ) : (
        body
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

export default Screen;
