import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";

interface ProgressTrackProps {
  progress: number; // 0..1
  color?: string;
  height?: number;
}

export const ProgressTrack: React.FC<ProgressTrackProps> = ({ progress, color, height = 8 }) => {
  const theme = useTheme();
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View
      style={[
        styles.track,
        { backgroundColor: theme.color.surfaceSunken, height, borderRadius: height / 2 },
      ]}
    >
      <View
        style={{
          width: `${clamped * 100}%`,
          height,
          borderRadius: height / 2,
          backgroundColor: color ?? theme.color.crimson,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: "100%", overflow: "hidden" },
});

export default ProgressTrack;
