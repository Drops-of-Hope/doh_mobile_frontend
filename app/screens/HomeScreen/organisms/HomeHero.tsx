import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, useTheme } from "../../../design";
import HomeHeader from "./HomeHeader";
import EligibilityHero from "../molecules/EligibilityHero";

interface HomeHeroProps {
  firstName: string;
  donorLevel?: string;
  avatarUrl?: string | null;
  avatarSeed?: string;
  onAvatarPress?: () => void;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  eligibleToDonate?: boolean;
  onDonatePress: () => void;
  onShowIdPress?: () => void;
}

// The single dominant card at the top of Home — greeting + status meta line,
// then the eligibility callout and its actions. Two previously-separate
// blocks (HomeHeader, EligibilityHero) rendered as one Surface so the page
// opens with one visual unit instead of five stacked, unrelated text runs.
export default function HomeHero(props: HomeHeroProps) {
  const theme = useTheme();

  return (
    <Surface style={styles.card}>
      <HomeHeader
        firstName={props.firstName}
        donorLevel={props.donorLevel}
        avatarUrl={props.avatarUrl}
        avatarSeed={props.avatarSeed}
        eligibleToDonate={props.eligibleToDonate}
        onAvatarPress={props.onAvatarPress}
      />

      <View style={[styles.divider, { backgroundColor: theme.color.hairline, marginVertical: theme.space.lg }]} />

      <EligibilityHero
        lastDonationDate={props.lastDonationDate}
        nextEligibleDate={props.nextEligibleDate}
        eligibleToDonate={props.eligibleToDonate}
        onDonatePress={props.onDonatePress}
        onShowIdPress={props.onShowIdPress}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {},
  divider: { height: 1.5 },
});
