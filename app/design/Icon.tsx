import React from "react";
import { LucideIcon } from "lucide-react-native";
import { useTheme } from "./ThemeProvider";

interface IconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

// Thin wrapper so every icon in the app gets the same stroke weight and
// defaults to ink unless a token color is passed explicitly.
export const Icon: React.FC<IconProps> = ({ icon: LucideIconComponent, size = 22, color, strokeWidth }) => {
  const theme = useTheme();
  return (
    <LucideIconComponent
      size={size}
      color={color ?? theme.color.ink}
      strokeWidth={strokeWidth ?? theme.stroke}
    />
  );
};

export default Icon;
