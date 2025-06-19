import React from "react";
import { Animated, StyleSheet } from "react-native";

type LoadingDotProps = {
  animValue: Animated.Value;
  color: string;
};

export default function LoadingDot({ animValue, color }: LoadingDotProps) {
  return (
    <Animated.View style={[styles.dot, { opacity: animValue, backgroundColor: color }]} />
  );
}

const styles = StyleSheet.create({
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
});
