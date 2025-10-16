import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface DonationTimerCardProps {
  onStartTimer: () => void;
  isTimerStarted: boolean;
}

export default function DonationTimerCard({ onStartTimer, isTimerStarted }: DonationTimerCardProps) {
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
  const strokeDashoffset = strokeDasharray - (progress * strokeDasharray);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="time-outline" size={48} color={COLORS.PRIMARY} />
      </View>
      <Text style={styles.title}>Donation Process Timer</Text>
      <Text style={styles.subtitle}>
        40 minutes allocated for the complete donation process
      </Text>
      
      {/* Circular Progress Timer */}
      <View style={styles.timerContainer}>
        <Svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background circle */}
          <Circle
            cx="60"
            cy="60"
            r="45"
            stroke={COLORS.BORDER}
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx="60"
            cy="60"
            r="45"
            stroke={COLORS.PRIMARY}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </Svg>
        <View style={styles.timerTextContainer}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>remaining</Text>
        </View>
      </View>

      {!isTimerStarted && (
        <TouchableOpacity style={styles.startButton} onPress={onStartTimer}>
          <Ionicons name="play" size={20} color={COLORS.BACKGROUND} />
          <Text style={styles.startButtonText}>Click to Start</Text>
        </TouchableOpacity>
      )}
      
      {isTimerStarted && (
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.statusText}>Timer Active</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.XL,
    borderWidth: 2,
    borderColor: COLORS.WARNING,
    alignItems: "center",
    marginBottom: SPACING.MD,
    shadowColor: COLORS.WARNING,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginBottom: SPACING.MD,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.LG,
  },
  timerContainer: {
    position: "relative",
    marginBottom: SPACING.LG,
  },
  timerTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
  },
  timerLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  startButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    gap: SPACING.SM,
  },
  startButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.SUCCESS,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.SUCCESS,
    fontWeight: "500",
  },
});