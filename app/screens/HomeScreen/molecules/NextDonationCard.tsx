import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

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
  const calculateNextDonationInfo = (): {
    text: string;
    canDonate: boolean;
  } => {
    // Use API data for eligibility if available
    if (eligibleToDonate !== undefined) {
      if (eligibleToDonate) {
        return { text: "You can donate now!", canDonate: true };
      }
    }

    // Fallback calculation if API data is not available
    return calculateFallbackDonationInfo();
  };

  const calculateFallbackDonationInfo = (): {
    text: string;
    canDonate: boolean;
  } => {
    console.log(
      "🔄 Using fallback calculation with lastDonationDate:",
      lastDonationDate
    );

    if (!lastDonationDate) {
      console.log("🆕 No last donation date, user can donate");
      return { text: "You can donate now!", canDonate: true };
    }

    try {
      const last = new Date(lastDonationDate);

      // Validate the date
      if (isNaN(last.getTime())) {
        return { text: "You can donate now!", canDonate: true };
      }

      const nextDate = new Date(last);
      nextDate.setMonth(nextDate.getMonth() + 4); // Add 4 months

      const now = new Date();
      const daysSinceLastDonation = Math.floor(
        (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (nextDate <= now) {
        return { text: "You can donate now!", canDonate: true };
      }

      const formattedDate = nextDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const daysUntil = Math.ceil(
        (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        text: `${formattedDate} (${daysUntil} days)`,
        canDonate: false,
      };
    } catch (error) {
      console.error("❌ Error in fallback calculation:", error);
      return { text: "You can donate now!", canDonate: true };
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
