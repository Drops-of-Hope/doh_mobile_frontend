import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface DonationTimerScreenProps {
  onBack: () => void;
  onEmergency: () => void;
}

export default function DonationTimerScreen({ onBack, onEmergency }: DonationTimerScreenProps) {
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const totalTime = 40 * 60;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert(
            "Donation Time Complete",
            "The 40-minute donation process time has ended. Please proceed to post-donation care.",
            [{ text: "OK", onPress: onBack }]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onBack]);

  const progress = (totalTime - timeLeft) / totalTime;
  const strokeDasharray = 2 * Math.PI * 140; // Circumference for radius 140
  const strokeDashoffset = strokeDasharray - (progress * strokeDasharray);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmergency = () => {
    Alert.alert(
      "Emergency Alert",
      "Emergency assistance will be notified immediately. Are you sure you need emergency help?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Yes, Emergency!", 
          style: "destructive",
          onPress: onEmergency 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.TEXT_PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation in Progress</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Timer */}
      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <Svg width="320" height="320" viewBox="0 0 320 320">
            {/* Background circle */}
            <Circle
              cx="160"
              cy="160"
              r="140"
              stroke={COLORS.BORDER}
              strokeWidth="20"
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx="160"
              cy="160"
              r="140"
              stroke={COLORS.PRIMARY}
              strokeWidth="20"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 160 160)"
            />
          </Svg>
          
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>remaining</Text>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {Math.round(progress * 100)}% Complete
              </Text>
            </View>
          </View>
        </View>

        {/* Status Information */}
        <View style={styles.statusSection}>
          <View style={styles.statusItem}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.SUCCESS} />
            <Text style={styles.statusText}>QR Code Scanned</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="medical" size={24} color={COLORS.INFO} />
            <Text style={styles.statusText}>Medical Screening</Text>
          </View>
          <View style={styles.statusItem}>
            <Ionicons name="water" size={24} color={COLORS.PRIMARY} />
            <Text style={styles.statusText}>Donation Process</Text>
          </View>
        </View>
      </View>

      {/* Emergency Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
          <Ionicons name="warning" size={24} color={COLORS.BACKGROUND} />
          <Text style={styles.emergencyButtonText}>Press For Emergency</Text>
        </TouchableOpacity>
        
        <Text style={styles.emergencyNote}>
          Press the emergency button if you feel unwell or need immediate assistance
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  backButton: {
    padding: SPACING.SM,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.LG,
  },
  timerContainer: {
    position: "relative",
    marginBottom: SPACING.XXL,
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
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  timerLabel: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
  },
  progressInfo: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
  },
  progressText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  statusSection: {
    gap: SPACING.MD,
    alignItems: "center",
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    minWidth: 200,
  },
  statusText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "500",
  },
  footer: {
    paddingHorizontal: SPACING.LG,
    paddingBottom: SPACING.LG,
    alignItems: "center",
  },
  emergencyButton: {
    backgroundColor: COLORS.ERROR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.XXL,
    borderRadius: BORDER_RADIUS.LG,
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
    shadowColor: COLORS.ERROR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 18,
    fontWeight: "bold",
  },
  emergencyNote: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 16,
  },
});