import React from "react";
import { View, ViewProps, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Tokens } from "../tokens";

interface SurfaceProps extends ViewProps {
  padding?: keyof Tokens["space"] | number;
  radius?: keyof Tokens["radius"];
  bordered?: boolean;
  tone?: "surface" | "sunken" | "crimsonSoft" | "successSoft" | "warningSoft" | "infoSoft" | "dangerSoft";
  children: React.ReactNode;
}

// The one card primitive in the app. No shadows — surfaces are defined by a
// 1px hairline border against the paper background, never elevation.
export const Surface: React.FC<SurfaceProps> = ({
  padding = "lg",
  radius = "lg",
  bordered = true,
  tone = "surface",
  style,
  children,
  ...rest
}) => {
  const theme = useTheme();
  const pad = typeof padding === "number" ? padding : theme.space[padding];

  const bg =
    tone === "surface"
      ? theme.color.surface
      : tone === "sunken"
      ? theme.color.surfaceSunken
      : tone === "crimsonSoft"
      ? theme.color.crimsonSoft
      : tone === "successSoft"
      ? theme.color.successSoft
      : tone === "warningSoft"
      ? theme.color.warningSoft
      : tone === "infoSoft"
      ? theme.color.infoSoft
      : theme.color.dangerSoft;

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: theme.radius[radius],
          padding: pad,
          borderWidth: bordered ? StyleSheet.hairlineWidth * 1.5 : 0,
          borderColor: theme.color.hairline,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

export default Surface;
