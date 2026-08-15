import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Heart, LucideIcon } from "lucide-react-native";
import { useTheme, Text, Icon, SectionHeader, EmptyState } from "../../../design";

export interface TimelineEntry {
  id: string;
  title: string;
  meta: string[];
  date: Date;
  icon: LucideIcon;
  tone?: "crimson" | "info" | "ink";
  onPress?: () => void;
}

interface ActivitiesTimelineProps {
  entries: TimelineEntry[];
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyBody?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function ActivitiesTimeline({
  entries,
  emptyIcon = Heart,
  emptyTitle = "No activity yet",
  emptyBody = "Your donation history will appear here.",
  emptyActionLabel,
  onEmptyAction,
}: ActivitiesTimelineProps) {
  const theme = useTheme();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        body={emptyBody}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  const groups: { label: string; items: TimelineEntry[] }[] = [];
  entries.forEach((entry) => {
    const label = monthLabel(entry.date);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(entry);
    } else {
      groups.push({ label, items: [entry] });
    }
  });

  return (
    <View>
      {groups.map((group, gi) => (
        <View key={group.label} style={{ marginBottom: theme.space.lg }}>
          <SectionHeader title={group.label} />
          {group.items.map((entry, i) => {
            const isLast = gi === groups.length - 1 && i === group.items.length - 1;
            const Wrapper = entry.onPress ? Pressable : View;
            return (
              <Wrapper
                key={entry.id}
                onPress={entry.onPress}
                style={({ pressed }: any) => [
                  styles.row,
                  { opacity: pressed ? 0.65 : 1 },
                ]}
              >
                <View style={styles.rail}>
                  <View
                    style={[
                      styles.dot,
                      {
                        borderColor: theme.color.ink,
                        backgroundColor: theme.color.paper,
                      },
                    ]}
                  />
                  {!isLast ? (
                    <View style={[styles.line, { backgroundColor: theme.color.hairline }]} />
                  ) : null}
                </View>
                <View style={styles.content}>
                  <View style={styles.titleRow}>
                    <Icon icon={entry.icon} size={16} color={theme.color[entry.tone ?? "ink"] as string} />
                    <Text variant="bodyBold" style={styles.titleText}>
                      {entry.title}
                    </Text>
                  </View>
                  {entry.meta.map((line, li) => (
                    <Text key={li} variant="caption" tone="inkMuted" style={styles.metaLine}>
                      {line}
                    </Text>
                  ))}
                </View>
              </Wrapper>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row" },
  rail: { width: 20, alignItems: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.75, marginTop: 4 },
  line: { flex: 1, width: 1.5, marginTop: 2, marginBottom: -8 },
  content: { flex: 1, paddingBottom: 20 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  titleText: { flex: 1 },
  metaLine: { marginLeft: 24, marginTop: 2 },
});
