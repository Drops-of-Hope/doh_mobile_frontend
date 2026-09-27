import React from "react";
import { View, StyleSheet } from "react-native";
import { Heart, Calendar } from "lucide-react-native";
import { Text, Icon, Button, useTheme } from "../../../design";
import { useLanguage } from "../../../context/LanguageContext";

import { logger } from "../../../utils/logger";

interface EligibilityHeroProps {
  lastDonationDate?: string;
  nextEligibleDate?: string;
  eligibleToDonate?: boolean;
  onDonatePress: () => void;
  onShowIdPress?: () => void;
}

interface EligibilityInfo {
  headline: string;
  detail: string;
  canDonate: boolean;
  daysUntil: number | null;
}

// Dominant hero element for the home screen — days-until-eligible (or the
// ready-to-donate callout) is the single most important number on the page.
//
// Safety rule preserved from the previous NextDonationCard: never present the
// user as eligible unless the state is positively known. Unknown states must
// read as unknown, not as a green light.
export default function EligibilityHero({
  lastDonationDate,
  nextEligibleDate,
  eligibleToDonate,
  onDonatePress,
  onShowIdPress,
}: EligibilityHeroProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  const unknownInfo = (): EligibilityInfo => ({
    headline: t("home.unknown"),
    detail: t("home.eligibility_unavailable"),
    canDonate: false,
    daysUntil: null,
  });

  const formatNextDate = (date: Date): EligibilityInfo | null => {
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    if (date <= now) {
      return { headline: t("home.ready"), detail: t("home.eligible_now"), canDonate: true, daysUntil: 0 };
    }

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      headline: String(daysUntil),
      detail: t("home.days_until_eligible", { days: daysUntil, date: formattedDate }),
      canDonate: false,
      daysUntil,
    };
  };

  const calculateFallbackInfo = (): EligibilityInfo => {
    if (!lastDonationDate) return unknownInfo();

    try {
      const last = new Date(lastDonationDate);
      if (isNaN(last.getTime())) return unknownInfo();

      const nextDate = new Date(last);
      nextDate.setMonth(nextDate.getMonth() + 4); // Add 4 months

      return formatNextDate(nextDate) ?? unknownInfo();
    } catch (error) {
      logger.error("❌ Error in fallback calculation:", error);
      return unknownInfo();
    }
  };

  const calculateInfo = (): EligibilityInfo => {
    if (eligibleToDonate === true) {
      return { headline: t("home.ready"), detail: t("home.eligible_now"), canDonate: true, daysUntil: 0 };
    }

    if (eligibleToDonate === false) {
      if (nextEligibleDate) {
        const fromServer = formatNextDate(new Date(nextEligibleDate));
        if (fromServer) return fromServer;
      }
      return { headline: t("home.not_yet"), detail: t("home.status_not_yet"), canDonate: false, daysUntil: null };
    }

    return calculateFallbackInfo();
  };

  const info = calculateInfo();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Icon icon={info.canDonate ? Heart : Calendar} size={20} color={theme.color.crimson} />
        <Text variant="overline" tone="crimson">
          {info.canDonate ? t("home.ready_to_donate") : t("home.next_donation")}
        </Text>
      </View>

      <Text variant="display" style={styles.headline}>
        {info.headline}
      </Text>

      <Text variant="body" tone="inkMuted" style={styles.detail}>
        {info.detail}
      </Text>

      <View style={styles.actionRow}>
        {info.canDonate ? (
          <View style={styles.actionFlex}>
            <Button title={t("home.donate_now")} variant="solid" onPress={onDonatePress} />
          </View>
        ) : null}
        {onShowIdPress ? (
          <View style={info.canDonate ? styles.actionFlex : styles.actionFull}>
            <Button title={t("home.show_id")} variant="outline" onPress={onShowIdPress} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  headline: { marginBottom: 2 },
  detail: { marginBottom: 4 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionFlex: { flex: 1 },
  actionFull: { flex: 1 },
});
