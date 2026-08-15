import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Play, Timer } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { Surface, Text, Button, Icon, useTheme } from "../../../design";

interface DonationTimerCardProps {
  onStartTimer: () => void;
  isTimerStarted: boolean;
}

export default function DonationTimerCard({ onStartTimer, isTimerStarted }: DonationTimerCardProps) {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const totalTime = 40 * 60;

  useEffect(() => {
    if (!isTimerStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerStarted]);

  const progress = (totalTime - timeLeft) / totalTime;
  const strokeDasharray = 2 * Math.PI * 45; // Circumference for radius 45
  const strokeDashoffset = strokeDasharray - progress * strokeDasharray;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Surface style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon icon={Timer} size={36} color={theme.color.warning} strokeWidth={1.5} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        Donation Process Timer
      </Text>
      <Text variant="body" tone="inkMuted" align="center" style={styles.subtitle}>
        40 minutes allocated for the complete donation process
      </Text>

      {/* Circular Progress Timer */}
      <View style={styles.timerContainer}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          <Circle cx="60" cy="60" r="45" stroke={theme.color.hairline} strokeWidth="6" fill="transparent" />
          <Circle
            cx="60"
            cy="60"
            r="45"
            stroke={theme.color.crimson}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Text variant="h2">{formatTime(timeLeft)}</Text>
          <Text variant="caption" tone="inkMuted">
            remaining
          </Text>
        </View>
      </View>

      {!isTimerStarted ? (
        <Button
          title="Click to Start"
          onPress={onStartTimer}
          fullWidth={false}
          icon={<Icon icon={Play} size={16} color={theme.color.inverse} />}
        />
      ) : (
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: theme.color.success }]} />
          <Text variant="label" tone="success">
            Timer Active
          </Text>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center" },
  iconContainer: { marginBottom: 12 },
  title: { marginBottom: 6 },
  subtitle: { marginBottom: 16 },
  timerContainer: { position: "relative", marginBottom: 16 },
  timerTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
});
