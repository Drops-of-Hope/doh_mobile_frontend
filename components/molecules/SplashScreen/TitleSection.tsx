import React from "react";
import { Animated, Text, StyleSheet } from "react-native";

type TitleSectionProps = {
  titleFadeAnim: Animated.Value;
  titleSlideAnim: Animated.Value;
};

export default function TitleSection({
  titleFadeAnim,
  titleSlideAnim,
}: TitleSectionProps) {
  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: titleFadeAnim, transform: [{ translateY: titleSlideAnim }] },
      ]}
    >
      <Text style={styles.mainTitle}>DROPS OF</Text>
      <Text style={styles.subTitle}>HOPE</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 60 },
  mainTitle: {
    fontSize: 32,
    fontWeight: "300",
    color: "#374151",
    letterSpacing: 6,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 4,
  },
});
