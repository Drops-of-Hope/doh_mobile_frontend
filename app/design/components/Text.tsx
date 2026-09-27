import React from "react";
import { Text as RNText, TextProps as RNTextProps, TextStyle } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Tokens } from "../tokens";

type Variant = keyof Tokens["type"];
type Tone = "ink" | "inkMuted" | "inkFaint" | "crimson" | "inverse" | "success" | "warning" | "info" | "danger";

interface TextProps extends RNTextProps {
  variant?: Variant;
  tone?: Tone;
  align?: TextStyle["textAlign"];
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ variant = "body", tone = "ink", align, style, children, ...rest }) => {
  const theme = useTheme();
  const toneColor = theme.color[tone as keyof typeof theme.color];
  return (
    <RNText
      style={[
        theme.type[variant],
        { color: typeof toneColor === "string" ? toneColor : theme.color.ink, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default Text;
