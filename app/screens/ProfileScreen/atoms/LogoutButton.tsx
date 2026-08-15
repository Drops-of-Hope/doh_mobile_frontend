import React from "react";
import { View, StyleSheet } from "react-native";
import { LogOut } from "lucide-react-native";
import { Button, Icon, useTheme } from "../../../design";

interface LogoutButtonProps {
  onPress: () => void;
  title?: string;
}

export default function LogoutButton({ onPress, title = "Log Out" }: LogoutButtonProps) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <Button
        title={title}
        variant="danger"
        onPress={onPress}
        icon={<Icon icon={LogOut} size={16} color={theme.color.danger} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});
