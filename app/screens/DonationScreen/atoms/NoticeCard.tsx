import React from "react";
import { View, StyleSheet } from "react-native";
import { TriangleAlert, Info, CheckCircle2, CircleAlert, LucideIcon } from "lucide-react-native";
import { Text, Icon, useTheme } from "../../../design";

interface NoticeCardProps {
  title: string;
  message: string;
  type?: "warning" | "info" | "success" | "error";
}

const TYPE_META: Record<
  NonNullable<NoticeCardProps["type"]>,
  { icon: LucideIcon; tone: "warning" | "info" | "success" | "danger" }
> = {
  warning: { icon: TriangleAlert, tone: "warning" },
  info: { icon: Info, tone: "info" },
  success: { icon: CheckCircle2, tone: "success" },
  error: { icon: CircleAlert, tone: "danger" },
};

export default function NoticeCard({ title, message, type = "warning" }: NoticeCardProps) {
  const theme = useTheme();
  const meta = TYPE_META[type];
  const color = theme.color[meta.tone];
  const softColor = theme.color[`${meta.tone}Soft`];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: softColor, borderColor: color, borderRadius: theme.radius.md },
      ]}
    >
      <View style={styles.header}>
        <Icon icon={meta.icon} size={18} color={color} />
        <Text variant="bodyBold" style={{ color }}>
          {title}
        </Text>
      </View>
      <Text variant="caption" style={{ color, lineHeight: 18 }}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
});
