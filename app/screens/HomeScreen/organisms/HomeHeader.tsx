import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text, UserAvatar, Badge, BadgeTier } from "../../../design";
import { useLanguage } from "../../../context/LanguageContext";

interface HomeHeaderProps {
  firstName: string;
  donorLevel?: string;
  avatarUrl?: string | null;
  avatarSeed?: string;
  // true = eligible now, false = not yet, undefined = unknown (never render as ready).
  eligibleToDonate?: boolean;
  onAvatarPress?: () => void;
}

// Derives the tier key ("BRONZE" etc.) from the formatted "Bronze Donor"
// label produced by HomeScreen's formatBadgeName().
function tierFromLabel(label?: string): BadgeTier {
  const key = (label ?? "").replace(/\s*Donor\s*/i, "").trim().toUpperCase();
  const valid: BadgeTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"];
  return (valid as string[]).includes(key) ? (key as BadgeTier) : "BRONZE";
}

export default function HomeHeader({
  firstName,
  donorLevel,
  avatarUrl,
  avatarSeed,
  eligibleToDonate,
  onAvatarPress,
}: HomeHeaderProps) {
  const { t } = useLanguage();

  const statusLabel =
    eligibleToDonate === true
      ? t("home.status_ready")
      : eligibleToDonate === false
      ? t("home.status_not_yet")
      : t("home.status_unknown");

  return (
    <View style={styles.row}>
      <View style={styles.greeting}>
        <Text variant="h1">{t("home.greeting", { name: firstName })}</Text>
        {donorLevel ? (
          <View style={styles.metaRow}>
            <Badge tier={tierFromLabel(donorLevel)} label={donorLevel} size="sm" />
            <Text variant="label" tone="inkMuted">
              · {statusLabel}
            </Text>
          </View>
        ) : null}
      </View>
      <Pressable onPress={onAvatarPress} hitSlop={8} disabled={!onAvatarPress}>
        <UserAvatar url={avatarUrl} name={firstName} seed={avatarSeed} size={48} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  greeting: { flex: 1, paddingRight: 16 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
});
