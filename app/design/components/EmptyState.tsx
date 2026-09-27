import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, body, actionLabel, onAction }) => {
  const theme = useTheme();
  return (
    <View style={[styles.wrap, { paddingVertical: theme.space.xxl }]}>
      <View
        style={[
          styles.iconWrap,
          { borderColor: theme.color.hairlineStrong, borderRadius: theme.radius.pill },
        ]}
      >
        <Icon icon={icon} size={30} color={theme.color.inkFaint} />
      </View>
      <Text variant="h3" align="center" style={styles.title}>
        {title}
      </Text>
      {body ? (
        <Text variant="body" tone="inkMuted" align="center" style={styles.body}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button title={actionLabel} variant="outline" size="sm" fullWidth={false} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: "center", paddingHorizontal: 24 },
  iconWrap: { width: 64, height: 64, alignItems: "center", justifyContent: "center", borderWidth: 1.5, marginBottom: 16 },
  title: { marginBottom: 4 },
  body: { maxWidth: 280 },
  action: { marginTop: 16 },
});

export default EmptyState;
