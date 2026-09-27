import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onHide?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ visible, message, type = "success", duration = 3000, onHide }) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => hideToast(), duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(translateAnim, { toValue: 50, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide?.());
  };

  const bg =
    type === "success" ? theme.color.success : type === "error" ? theme.color.danger : theme.color.info;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
          backgroundColor: bg,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.space.lg,
          paddingVertical: theme.space.md,
          bottom: 110,
          left: theme.space.lg,
          right: theme.space.lg,
        } as ViewStyle,
      ]}
    >
      <Text variant="bodyBold" tone="inverse" align="center">
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default Toast;
