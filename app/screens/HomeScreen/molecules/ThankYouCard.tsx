import React from "react";
import { View, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Surface, Text, Icon, useTheme } from "../../../design";
import { useLanguage } from "../../../context/LanguageContext";

interface ThankYouCardProps {
  totalDonations: number;
  firstName: string;
}

export default function ThankYouCard({ totalDonations, firstName }: ThankYouCardProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  const hasDonated = totalDonations > 0;
  const title = hasDonated ? t("home.thank_you_title", { name: firstName }) : t("home.first_donation_title");
  const body = hasDonated
    ? t("home.thank_you_body", { count: totalDonations, lives: totalDonations * 3 })
    : t("home.first_donation_body");

  return (
    <Surface tone="crimsonSoft" style={styles.container}>
      <View style={[styles.iconWrap, { borderColor: theme.color.crimson }]}>
        <Icon icon={Heart} size={26} color={theme.color.crimson} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="caption" tone="inkMuted" align="center" style={styles.subtitle}>
        {body}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingVertical: 28 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { marginBottom: 4 },
  subtitle: { maxWidth: 240 },
});
