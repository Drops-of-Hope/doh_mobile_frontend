import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../constants/theme";

interface DonationTimerScreenProps {
  navigation?: any;
}

export default function DonationTimerScreen({ navigation }: DonationTimerScreenProps) {
  const TOTAL_TIME = 40 * 60; // 40 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            Alert.alert(
              "Time's Up!",
              "Your 40-minute donation window has ended. Please check with staff if you need more time.",
              [{ text: "OK" }]
            );
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercentage = ((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100;
  const strokeDasharray = 2 * Math.PI * 150; // radius = 150
  const strokeDashoffset = strokeDasharray - (progressPercentage / 100) * strokeDasharray;

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleEmergency = () => {
    Alert.alert(
      "Emergency Alert",
      "Emergency services have been notified. Medical staff will assist you immediately.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm Emergency",
          style: "destructive",
          onPress: () => {
            // Handle emergency logic here
            Alert.alert("Emergency Confirmed", "Help is on the way!");
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    Alert.alert(
      "Leave Timer?",
      "Are you sure you want to leave the donation timer? Your progress will be saved.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Leave",
          onPress: () => navigation?.goBack(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </Pressable>
        <Text style={styles.headerTitle}>Donation Timer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Timer */}
      <View style={styles.timerContainer}>
        <View style={styles.timerCircle}>
          <Svg width={340} height={340} style={styles.svg}>
            {/* Background circle */}
            <Circle
              cx={170}
              cy={170}
              r={150}
              stroke={COLORS.BORDER_LIGHT}
              strokeWidth={8}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={170}
              cy={170}
              r={150}
              stroke={timeLeft > 300 ? COLORS.SUCCESS : timeLeft > 60 ? COLORS.WARNING : COLORS.ERROR}
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 170 170)"
            />
          </Svg>
          
          <View style={styles.timerContent}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timeLabel}>
              {timeLeft > 0 ? "Time Remaining" : "Time's Up!"}
            </Text>
            <Text style={styles.progressText}>
              {Math.round(((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100)}% Complete
            </Text>
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlButton, styles.primaryButton]}
          onPress={handleStartPause}
        >
          <Ionicons 
            name={isRunning ? "pause" : "play"} 
            size={24} 
            color="#ffffff" 
          />
          <Text style={styles.controlButtonText}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.controlButton, styles.emergencyButton]}
          onPress={handleEmergency}
        >
          <Ionicons name="medical" size={24} color="#ffffff" />
          <Text style={styles.emergencyButtonText}>Emergency</Text>
        </Pressable>
      </View>

      {/* Status Info */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Ionicons name="information-circle" size={20} color={COLORS.TEXT_SECONDARY} />
          <Text style={styles.statusText}>
            This timer tracks your donation process. Press Emergency if you need immediate assistance.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  backButton: {
    padding: SPACING.XS,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 32,
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
  timerCircle: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  svg: {
    transform: [{ rotate: "0deg" }],
  },
  timerContent: {
    position: "absolute",
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  timeLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "500",
  },
  controls: {
    flexDirection: "row",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    gap: SPACING.MD,
  },
  controlButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    gap: SPACING.XS,
  },
  primaryButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  emergencyButton: {
    backgroundColor: COLORS.ERROR,
  },
  controlButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  emergencyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  statusContainer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.INFO + "20",
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    gap: SPACING.SM,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
});