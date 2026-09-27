import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, ViewStyle } from "react-native";
import { useTheme } from "../ThemeProvider";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height = 20, borderRadius = 8, style }) => {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(animatedValue, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.color.surfaceSunken, theme.color.hairline],
  });

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, borderRadius, backgroundColor } as any, style]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: { opacity: 0.8 },
});

export default Skeleton;
