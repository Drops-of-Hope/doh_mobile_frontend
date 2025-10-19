import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

export default function ThankYouCard() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="heart" size={32} color={COLORS.PRIMARY} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Thank You For Your Donation</Text>
        <Text style={styles.subtitle}>
          Did you know? One donation can save up to 3 lives!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: `${COLORS.PRIMARY}15`, // 15% opacity
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    fontStyle: "italic",
    lineHeight: 18,
  },
});
