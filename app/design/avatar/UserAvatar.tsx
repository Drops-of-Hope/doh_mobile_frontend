import React, { useMemo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";
import { useTheme } from "../ThemeProvider";
import { Text } from "../components/Text";
import { decodeAvatar, isDohAvatarUrl, defaultAvatarUrl } from "./avatarUrl";
import { generateAvatarSvg } from "./generateAvatarSvg";

interface UserAvatarProps {
  url?: string | null;
  name?: string;
  size?: number;
  // A stable per-user seed (e.g. auth `sub` or profile id) used to generate
  // a deterministic notionists avatar when the user hasn't picked one yet.
  seed?: string;
}

// Resolution order:
//  1. A DoH-encoded avatar URL -> render the generated notionists SVG
//  2. Any other http(s) URL -> plain <Image> (legacy / future upload path)
//  3. A seed -> deterministic generated notionists SVG (display-only default)
//  4. Nothing -> initials circle
export const UserAvatar: React.FC<UserAvatarProps> = ({ url, name, size = 48, seed }) => {
  const theme = useTheme();

  const effectiveUrl = url || (seed ? defaultAvatarUrl(seed) : null);

  const svg = useMemo(() => {
    if (!isDohAvatarUrl(effectiveUrl)) return null;
    const options = decodeAvatar(effectiveUrl);
    if (!options) return null;
    return generateAvatarSvg(options, effectiveUrl!);
  }, [effectiveUrl]);

  const wrapStyle = [styles.wrap, { width: size, height: size, borderRadius: size / 2 }];

  if (svg) {
    return (
      <View style={[wrapStyle, { overflow: "hidden", backgroundColor: theme.color.surfaceSunken }]}>
        <SvgXml xml={svg} width={size} height={size} />
      </View>
    );
  }

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[wrapStyle, { backgroundColor: theme.color.surfaceSunken }]}
        resizeMode="cover"
      />
    );
  }

  const initial = (name?.trim()?.charAt(0) || "?").toUpperCase();
  return (
    <View style={[wrapStyle, styles.initials, { backgroundColor: theme.color.crimson }]}>
      <Text variant="h2" tone="inverse" style={{ fontSize: size * 0.42 }}>
        {initial}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
  initials: {},
});

export default UserAvatar;
