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
  
  // Debug logging
  console.log("🎯 NextDonationCard props:", {
    lastDonationDate,
    nextEligibleDate,
    eligibleToDonate
  });

  const calculateNextDonationInfo = (): { text: string; canDonate: boolean } => {
    // Use API data for eligibility if available
    if (eligibleToDonate !== undefined) {
      console.log("📊 Using API eligibility data:", { eligibleToDonate, nextEligibleDate });
      
      if (eligibleToDonate) {
        return { text: "You can donate now!", canDonate: true };
      }
      
      // If not eligible, show next eligible date from API
      if (nextEligibleDate) {
        try {
          const nextDate = new Date(nextEligibleDate);
          
          // Validate the date
          if (isNaN(nextDate.getTime())) {
            console.warn("⚠️ Invalid nextEligibleDate from API:", nextEligibleDate);
            // Fallback to calculation
            return calculateFallbackDonationInfo();
          }
          
          // Check if the date is in the future
          const now = new Date();
          if (nextDate <= now) {
            console.log("📅 Next eligible date has passed, user can donate now");
            return { text: "You can donate now!", canDonate: true };
          }
          
          const formattedDate = nextDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long", 
            day: "numeric",
          });
          
          const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          console.log("🗓️ Next donation date:", {
            formattedDate,
            daysUntil,
            rawDate: nextEligibleDate
          });
          
          return { 
            text: `${formattedDate} (${daysUntil} days)`, 
            canDonate: false 
          };
        } catch (error) {
          console.error("❌ Error parsing nextEligibleDate:", error);
          return calculateFallbackDonationInfo();
        }
      }
    }

    // Fallback calculation if API data is not available
    return calculateFallbackDonationInfo();
  };

  const calculateFallbackDonationInfo = (): { text: string; canDonate: boolean } => {
    console.log("🔄 Using fallback calculation with lastDonationDate:", lastDonationDate);
    
    if (!lastDonationDate) {
      console.log("🆕 No last donation date, user can donate");
      return { text: "You can donate now!", canDonate: true };
    }

    try {
      const last = new Date(lastDonationDate);
      
      // Validate the date
      if (isNaN(last.getTime())) {
        console.warn("⚠️ Invalid lastDonationDate:", lastDonationDate);
        return { text: "You can donate now!", canDonate: true };
      }
      
      const nextDate = new Date(last);
      nextDate.setMonth(nextDate.getMonth() + 4); // Add 4 months

      const now = new Date();
      const daysSinceLastDonation = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      
      console.log("📊 Fallback calculation:", {
        lastDonation: last.toISOString(),
        nextEligible: nextDate.toISOString(),
        daysSince: daysSinceLastDonation,
        canDonate: nextDate <= now
      });
      
      if (nextDate <= now) {
        return { text: "You can donate now!", canDonate: true };
      }

      const formattedDate = nextDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return { 
        text: `${formattedDate} (${daysUntil} days)`, 
        canDonate: false 
      };
    } catch (error) {
      console.error("❌ Error in fallback calculation:", error);
      return { text: "You can donate now!", canDonate: true };
    }
  };

  const { text: nextDonationText, canDonate: canDonateNow } = calculateNextDonationInfo();
  
  console.log("🎯 Final result:", { nextDonationText, canDonateNow });

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
