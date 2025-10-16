import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface NICCardProps {
  nicNumber?: string;
}

export default function NICCard({ nicNumber }: NICCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="card-outline" size={48} color={COLORS.PRIMARY} />
      </View>
      <Text style={styles.title}>Show Your NIC</Text>
      <Text style={styles.subtitle}>
        Present your National Identity Card to the camp organizer for verification
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.XL,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    alignItems: "center",
    marginBottom: SPACING.MD,
    shadowColor: COLORS.PRIMARY,
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
    marginBottom: SPACING.MD,
  },
  nicContainer: {
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: "center",
  },
  nicLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
  nicNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    letterSpacing: 1,
  },
});