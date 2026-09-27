import React from "react";
import { CalendarClock } from "lucide-react-native";
import { StatRow, StatTile, Icon, useTheme } from "../../../design";
import { useLanguage } from "../../../context/LanguageContext";

interface ComponentRowProps {
  lastDonationDays: number;
}

// Only rendered by the caller when a real lastDonationDate exists — a donor
// with zero donations should never see "0 days ago".
export default function ComponentRow({ lastDonationDays }: ComponentRowProps) {
  const { t } = useLanguage();
  const theme = useTheme();

  return (
    <StatRow>
      <StatTile
        icon={<Icon icon={CalendarClock} size={20} color={theme.color.crimson} />}
        value={t("home.days_ago", { days: lastDonationDays })}
        label={t("home.last_donation")}
      />
    </StatRow>
  );
}
