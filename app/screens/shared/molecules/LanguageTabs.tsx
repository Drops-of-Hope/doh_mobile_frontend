import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text, useTheme } from "../../../design";

interface LanguageTabsProps {
  currentLanguage: "en" | "si" | "ta";
  onLanguageChange: (language: "en" | "si" | "ta") => void;
}

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "si", label: "සිංහල", short: "සි" },
  { code: "ta", label: "தமிழ்", short: "TA" },
] as const;

const LanguageTabs: React.FC<LanguageTabsProps> = ({ currentLanguage, onLanguageChange }) => {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.color.surfaceSunken, borderRadius: theme.radius.md }]}>
      {languages.map((language) => {
        const active = currentLanguage === language.code;
        return (
          <Pressable
            key={language.code}
            style={[
              styles.tab,
              { backgroundColor: active ? theme.color.crimson : "transparent", borderRadius: theme.radius.sm },
            ]}
            onPress={() => onLanguageChange(language.code)}
          >
            <Text variant="label" tone={active ? "inverse" : "inkMuted"}>
              {language.short}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, alignItems: "center" },
});

export default LanguageTabs;
