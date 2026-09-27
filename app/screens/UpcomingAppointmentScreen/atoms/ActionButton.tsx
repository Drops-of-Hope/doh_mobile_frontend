import React from "react";
import { View } from "react-native";
import { Button, Icon, useTheme } from "../../../design";
import { ActionButtonProps } from "../types";

export default function ActionButton({ icon, text, tone, onPress }: ActionButtonProps) {
  const theme = useTheme();
  const variant = tone === "danger" ? "danger" : "outline";
  return (
    <View style={{ flex: 1 }}>
      <Button
        title={text}
        variant={variant}
        size="sm"
        onPress={onPress}
        icon={<Icon icon={icon} size={16} color={theme.color[tone]} />}
      />
    </View>
  );
}
