import React from "react";
import { StyleSheet, View } from "react-native";
import { IdCard } from "lucide-react-native";
import { Surface, Text, Icon, useTheme } from "../../../design";

interface NICCardProps {
  nicNumber?: string;
}

export default function NICCard({ nicNumber }: NICCardProps) {
  const theme = useTheme();
  return (
    <Surface style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon icon={IdCard} size={40} color={theme.color.crimson} strokeWidth={1.5} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        Show Your NIC
      </Text>
      <Text variant="body" tone="inkMuted" align="center">
        Present your National Identity Card to the camp organizer for verification
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center" },
  iconContainer: { marginBottom: 12 },
  title: { marginBottom: 6 },
});
