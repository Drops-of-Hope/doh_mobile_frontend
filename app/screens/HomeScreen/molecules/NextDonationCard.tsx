import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface NextDonationCardProps {
  lastDonationDate?: string;
}

export default function NextDonationCard({
  lastDonationDate,
}: NextDonationCardProps) {
  const calculateNextDonationDate = (lastDate?: string): string => {
    if (!lastDate) {
      return "You can donate now!";
    }

    const last = new Date(lastDate);
    const nextDate = new Date(last);
    nextDate.setMonth(nextDate.getMonth() + 4); // Add 4 months

    const now = new Date();
    if (nextDate <= now) {
      return "You can donate now!";
    }

    return nextDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextDonationText = calculateNextDonationDate(lastDonationDate);
  const canDonateNow = nextDonationText === "You can donate now!";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={canDonateNow ? "heart" : "calendar-outline"}
          size={24}
          color={canDonateNow ? COLORS.SUCCESS : COLORS.PRIMARY}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Next Donation Date</Text>
        <Text style={[styles.dateText, canDonateNow && styles.availableText]}>
          {nextDonationText}
        </Text>
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
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
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
  dateText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: "500",
  },
  availableText: {
    color: COLORS.SUCCESS,
    fontWeight: "600",
  },
});
