import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

export default function ThankYouCard() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginHorizontal: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: `${COLORS.PRIMARY}15`, // 15% opacity
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.MD,
  },
  textContainer: {
    flex: 1,
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
