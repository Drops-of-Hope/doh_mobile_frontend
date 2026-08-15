import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";

interface ListRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  accessory?: React.ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
  tone?: "ink" | "danger";
}

export const ListRow: React.FC<ListRowProps> = ({
  title,
  subtitle,
  icon,
  accessory,
  onPress,
  showChevron = true,
  tone = "ink",
}) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.text}>
        <Text variant="body" tone={tone}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="inkMuted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {accessory}
      {onPress && showChevron ? <Icon icon={ChevronRight} size={18} color={theme.color.inkFaint} /> : null}
    </Pressable>
  );
};

interface ListSectionProps {
  children: React.ReactNode;
}

// Groups ListRows into one hairline-divided Surface.
export const ListSection: React.FC<ListSectionProps> = ({ children }) => {
  const theme = useTheme();
  const rows = React.Children.toArray(children);
  return (
    <View
      style={[
        styles.section,
        { borderColor: theme.color.hairline, borderRadius: theme.radius.lg, backgroundColor: theme.color.surface },
      ]}
    >
      {rows.map((row, i) => (
        <React.Fragment key={i}>
          {row}
          {i < rows.length - 1 ? (
            <View style={[styles.divider, { backgroundColor: theme.color.hairline }]} />
          ) : null}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, gap: 12 },
  icon: { width: 24, alignItems: "center" },
  text: { flex: 1 },
  section: { borderWidth: 1.5, overflow: "hidden" },
  divider: { height: 1.5 },
});

export default ListRow;
