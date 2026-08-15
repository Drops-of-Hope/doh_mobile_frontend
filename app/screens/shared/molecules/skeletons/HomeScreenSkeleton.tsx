import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Skeleton, useTheme } from "../../../../design";

// Mirrors HomeScreen's current layout: one hero card (greeting + eligibility
// callout), a stat row, and a closing card — so loading doesn't jump.
export default function HomeScreenSkeleton() {
  const theme = useTheme();

  return (
    <View style={{ padding: theme.space.xl }}>
      <Surface style={styles.section}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Skeleton height={28} width="70%" />
            <Skeleton height={20} width="50%" style={styles.marginTop} />
          </View>
          <Skeleton width={48} height={48} borderRadius={24} />
        </View>

        <View style={[styles.divider, { backgroundColor: theme.color.hairline }]} />

        <Skeleton height={14} width="40%" style={styles.marginBottom} />
        <Skeleton height={40} width="30%" style={styles.marginBottom} />
        <Skeleton height={16} width="60%" style={styles.marginBottom} />
        <Skeleton height={48} borderRadius={theme.radius.md} />
      </Surface>

      <View style={[styles.section, styles.statRow]}>
        <Skeleton height={72} style={styles.statTile} />
        <Skeleton height={72} style={styles.statTile} />
        <Skeleton height={72} style={styles.statTile} />
      </View>

      <Surface tone="crimsonSoft" style={styles.thankYou}>
        <Skeleton width={56} height={56} borderRadius={28} style={styles.marginBottom} />
        <Skeleton height={20} width="60%" style={styles.marginBottom} />
        <Skeleton height={14} width="80%" />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerText: { flex: 1, paddingRight: 16 },
  divider: { height: 1.5, marginVertical: 16 },
  statRow: { flexDirection: "row", gap: 10 },
  statTile: { flex: 1, borderRadius: 16 },
  thankYou: { alignItems: "center", paddingVertical: 28 },
  marginTop: { marginTop: 8 },
  marginBottom: { marginBottom: 12 },
});
