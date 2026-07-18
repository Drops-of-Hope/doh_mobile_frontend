import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

import { logger } from "../../../utils/logger";
interface NextDonationCardProps {
  lastDonationDate?: string;
  nextEligibleDate?: string;
  eligibleToDonate?: boolean;
}

export default function NextDonationCard({
  lastDonationDate,
  nextEligibleDate,
  eligibleToDonate,
}: NextDonationCardProps) {
  // Safety rule: never show "you can donate" unless eligibility is positively
  // known. Unknown states must read as unknown, not as a green light.
  const UNKNOWN_INFO = {
    text: "Eligibility unavailable — check your connection",
    canDonate: false,
  };

  const formatNextDate = (
    date: Date
  ): { text: string; canDonate: boolean } | null => {
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    if (date <= now) {
      return { text: "You can donate now!", canDonate: true };
    }

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const daysUntil = Math.ceil(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { text: `${formattedDate} (${daysUntil} days)`, canDonate: false };
  };

  const calculateNextDonationInfo = (): {
    text: string;
    canDonate: boolean;
  } => {
    // Use API data for eligibility if available
    if (eligibleToDonate === true) {
      return { text: "You can donate now!", canDonate: true };
    }

    if (eligibleToDonate === false) {
      if (nextEligibleDate) {
        const fromServer = formatNextDate(new Date(nextEligibleDate));
        if (fromServer) return fromServer;
      }
      return { text: "Not eligible to donate yet", canDonate: false };
    }

    // Eligibility unknown: derive from last donation date if we have one
    return calculateFallbackDonationInfo();
  };

  const calculateFallbackDonationInfo = (): {
    text: string;
    canDonate: boolean;
  } => {
    if (!lastDonationDate) {
      return UNKNOWN_INFO;
    }

    try {
      const last = new Date(lastDonationDate);
      if (isNaN(last.getTime())) {
        return UNKNOWN_INFO;
      }

      const nextDate = new Date(last);
      nextDate.setMonth(nextDate.getMonth() + 4); // Add 4 months

      return formatNextDate(nextDate) ?? UNKNOWN_INFO;
    } catch (error) {
      logger.error("❌ Error in fallback calculation:", error);
      return UNKNOWN_INFO;
    }
  };

  const { text: nextDonationText, canDonate: canDonateNow } =
    calculateNextDonationInfo();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={canDonateNow ? "heart" : "calendar-outline"}
          size={24}
          color={COLORS.PRIMARY} // Always red to maintain blood donation theme
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
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.PRIMARY, // Red accent
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: `${COLORS.PRIMARY}15`, // Light red background
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
