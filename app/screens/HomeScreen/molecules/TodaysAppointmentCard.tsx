import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
import { useNavigation } from "@react-navigation/native";

interface TodaysAppointmentCardProps {
  appointment: {
    id: string;
    appointmentDateTime?: string;
    appointmentDate?: string; // Backend might use this
    medicalEstablishment: {
      name: string;
      address: string;
    };
    slot: {
      startTime: string;
      endTime: string;
    };
  };
  userName: string;
  userEmail: string;
  userUID: string;
}

export default function TodaysAppointmentCard({
  appointment,
  userName,
  userEmail,
  userUID,
}: TodaysAppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQRRevealed, setIsQRRevealed] = useState(false);
  const navigation = useNavigation();

  const formatTime = (timeString: string) => {
    // Handle both full datetime and time-only strings
    if (timeString.includes("T")) {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return timeString;
  };

  const handleFillDonationForm = () => {
    // Navigate to donation screen with appointment ID
    // This will open the blood donation form with the appointment ID pre-filled
    (navigation as any).navigate('Donate', { 
      appointmentId: appointment.id,
      openBloodDonationForm: true 
    });
  };

  // Create QR code data with appointment ID
  const qrData = JSON.stringify({
    name: userName,
    email: userEmail,
    uid: userUID,
    appointmentId: appointment.id,
    timestamp: new Date().toISOString(),
  });

  return (
    <View style={styles.container}>
      {/* Main Card */}
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar-outline" size={24} color="white" />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>Appointment Today!</Text>
            <Text style={styles.subtitle}>
              {formatTime(appointment.slot.startTime)} - {formatTime(appointment.slot.endTime)}
            </Text>
          </View>
          {/* Fill Donation Form Button */}
          <TouchableOpacity
            style={styles.fillFormButton}
            onPress={handleFillDonationForm}
          >
            <Ionicons name="document-text-outline" size={18} color={COLORS.PRIMARY} />
            <Text style={styles.fillFormText}>Fill Form</Text>
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="white" />
          <Text style={styles.infoText} numberOfLines={2}>
            {appointment.medicalEstablishment.name}
          </Text>
        </View>

        {/* Show QR Button */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => {
            setIsExpanded(!isExpanded);
            if (!isExpanded) setIsQRRevealed(false);
          }}
        >
          <Text style={styles.expandButtonText}>
            {isExpanded ? "Hide QR Code" : "Show QR Code"}
          </Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="white"
          />
        </TouchableOpacity>
      </View>

      {/* Expandable QR Section */}
      {isExpanded && (
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Your Appointment QR Code</Text>
          <Text style={styles.qrSubtitle}>
            Show this to staff at the donation center
          </Text>

          {/* QR Code Container */}
          <View style={styles.qrContainer}>
            {!isQRRevealed && (
              <Pressable
                style={styles.blurOverlay}
                onPress={() => setIsQRRevealed(true)}
              >
                <View style={styles.blur}>
                  <View style={styles.revealPrompt}>
                    <Ionicons name="eye-outline" size={32} color={COLORS.PRIMARY} />
                    <Text style={styles.revealText}>Tap to Reveal QR</Text>
                  </View>
                </View>
              </Pressable>
            )}
            
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrData}
                size={200}
                color={COLORS.TEXT_PRIMARY}
                backgroundColor="white"
              />
            </View>
          </View>

          {/* Appointment ID */}
          <View style={styles.appointmentIdBadge}>
            <Text style={styles.appointmentIdLabel}>Appointment ID</Text>
            <Text style={styles.appointmentIdValue}>{appointment.id}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  card: {
    backgroundColor: "#DC2626", // Sea green (emerald-500)
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.SM,
  },
  headerText: {
    flex: 1,
  },
  fillFormButton: {
    backgroundColor: "white",
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: SPACING.XS,
  },
  fillFormText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.PRIMARY,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
    gap: SPACING.XS,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.XS,
    gap: SPACING.XS,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  qrSection: {
    backgroundColor: COLORS.BACKGROUND,
    borderBottomLeftRadius: BORDER_RADIUS.LG,
    borderBottomRightRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: "#DC2626",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: 4,
  },
  qrSubtitle: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  qrContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.MD,
  },
  qrCodeWrapper: {
    backgroundColor: "white",
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    borderRadius: BORDER_RADIUS.MD,
    overflow: "hidden",
  },
  blur: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(240, 240, 240, 0.95)", // Simulated blur effect
  },
  revealPrompt: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    gap: SPACING.XS,
  },
  revealText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  appointmentIdBadge: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: "center",
  },
  appointmentIdLabel: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appointmentIdValue: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "700",
    fontFamily: "monospace",
  },
});
