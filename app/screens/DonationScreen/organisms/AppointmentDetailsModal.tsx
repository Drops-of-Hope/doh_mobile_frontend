import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
import { Appointment } from "../types";

interface AppointmentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCancel?: (appointment: Appointment) => void;
  onRebook?: (appointment: Appointment) => void;
}

export default function AppointmentDetailsModal({
  visible,
  onClose,
  appointment,
  onCancel,
  onRebook,
}: AppointmentDetailsModalProps) {
  if (!appointment) return null;

  const isUpcoming = appointment.status === "upcoming";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Appointment Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hospital */}
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Hospital</Text>
                <Text style={styles.detailValue}>{appointment.hospital}</Text>
              </View>
            </View>

            {/* Location */}
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{appointment.location}</Text>
              </View>
            </View>

            {/* Date */}
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{appointment.date}</Text>
              </View>
            </View>

            {/* Time */}
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={COLORS.PRIMARY} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{appointment.time}</Text>
              </View>
            </View>

            {/* Status */}
            <View style={styles.detailRow}>
              <Ionicons 
                name={
                  appointment.status === "upcoming" ? "hourglass-outline" :
                  appointment.status === "completed" ? "checkmark-circle-outline" :
                  "close-circle-outline"
                } 
                size={20} 
                color={COLORS.PRIMARY} 
              />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={[
                  styles.detailValue,
                  styles.statusText,
                  appointment.status === "completed" && styles.statusCompleted,
                  appointment.status === "cancelled" && styles.statusCancelled,
                ]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons - Only show for upcoming appointments */}
          {isUpcoming && (onCancel || onRebook) && (
            <View style={styles.actionButtons}>
              {onRebook && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.rebookButton]}
                  onPress={() => onRebook(appointment)}
                >
                  <Ionicons name="calendar" size={20} color={COLORS.INFO} />
                  <Text style={[styles.actionButtonText, styles.rebookText]}>Rebook</Text>
                </TouchableOpacity>
              )}
              {onCancel && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => onCancel(appointment)}
                >
                  <Ionicons name="trash-outline" size={20} color={COLORS.ERROR} />
                  <Text style={[styles.actionButtonText, styles.cancelText]}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.MD,
  },
  modalContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    padding: SPACING.XS,
  },
  content: {
    padding: SPACING.MD,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.MD,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  detailTextContainer: {
    marginLeft: SPACING.SM,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "500",
  },
  statusText: {
    fontWeight: "700",
  },
  statusCompleted: {
    color: COLORS.SUCCESS,
  },
  statusCancelled: {
    color: COLORS.ERROR,
  },
  actionButtons: {
    flexDirection: "row",
    padding: SPACING.MD,
    gap: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    gap: SPACING.XS,
  },
  rebookButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.INFO,
  },
  cancelButton: {
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.ERROR,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  rebookText: {
    color: COLORS.INFO,
  },
  cancelText: {
    color: COLORS.ERROR,
  },
});
