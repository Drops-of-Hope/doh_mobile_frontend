import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActionButton from "../atoms/ActionButton";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  hospital: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface ExpandableAppointmentCardProps {
  appointment: Appointment;
  title?: string;
  onReschedule?: (appointment: Appointment) => void;
}

export default function ExpandableAppointmentCard({
  appointment,
  title = "Blood Donation",
  onReschedule,
}: ExpandableAppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const toggleExpansion = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const expandedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Increased to fit all instructions clearly
  });

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.appointmentCard}>
      <TouchableOpacity onPress={toggleExpansion} activeOpacity={0.8}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentIcon}>
            <Ionicons name="heart" size={20} color="white" />
          </View>
          <View style={styles.appointmentContent}>
            <Text style={styles.appointmentTitle}>{title}</Text>
            <Text style={styles.appointmentDateTime}>
              {appointment.date} {/* at {appointment.time} */}
            </Text>
            <Text style={styles.appointmentLocation}>{appointment.hospital}</Text>
            {/* <Text style={styles.confirmedText}>
              {appointment.status === "upcoming"
                ? "Confirmed"
                : appointment.status}
            </Text> */}
          </View>
          <Animated.View style={[styles.expandIcon, { transform: [{ rotate: rotateIcon }] }]}>
            <Ionicons name="chevron-down" size={24} color="#6B7280" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Animated.View style={[styles.expandedContent, { height: expandedHeight }]}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{appointment.location}</Text>
          </View>
          
          {/* <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Time:</Text>
            <Text style={styles.detailValue}>{appointment.time}</Text>
          </View> */}
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{appointment.date}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="medical-outline" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Hospital:</Text>
            <Text style={styles.detailValue}>{appointment.hospital}</Text>
          </View>

          {/* <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, styles.statusConfirmed]}>
              {appointment.status === "upcoming" ? "Confirmed" : appointment.status}
            </Text>
          </View> */}

          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Important Instructions:</Text>
            <Text style={styles.instructionsText}>
              • Please arrive 15 minutes before your appointment time
            </Text>
            <Text style={styles.instructionsText}>
              • Bring your ID card and any relevant medical documents
            </Text>
            <Text style={styles.instructionsText}>
              • Eat a healthy meal 2-3 hours before donation
            </Text>
            <Text style={styles.instructionsText}>
              • Stay hydrated throughout the day
            </Text>
          </View>

          {appointment.status === "upcoming" && onReschedule && (
            <View style={styles.actionButtonContainer}>
              <ActionButton
                title="Reschedule Appointment"
                onPress={() => onReschedule(appointment)}
                variant="secondary"
                style={styles.rescheduleButton}
              />
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  appointmentIcon: {
    backgroundColor: "#FF4757",
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },
  appointmentLocation: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  confirmedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  expandIcon: {
    marginLeft: 8,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  detailsContainer: {
    paddingTop: 16,
    paddingHorizontal: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 8,
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    marginLeft: 8,
  },
  statusConfirmed: {
    color: "#10B981",
    fontWeight: "600",
  },
  instructionsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 16,
  },
  actionButtonContainer: {
    marginTop: 16,
  },
  rescheduleButton: {
    width: "100%",
  },
});