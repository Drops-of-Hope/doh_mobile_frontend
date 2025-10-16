import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LanguageTabsProps {
  currentLanguage: "en" | "si" | "ta";
  onLanguageChange: (language: "en" | "si" | "ta") => void;
}

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "si", label: "සිංහල", short: "සි" },
  { code: "ta", label: "தமிழ்", short: "TA" },
] as const;

const LanguageTabs: React.FC<LanguageTabsProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <View style={styles.container}>
      {languages.map((language) => (
        <TouchableOpacity
          key={language.code}
          style={[
            styles.tab,
            currentLanguage === language.code && styles.activeTab,
          ]}
          onPress={() => onLanguageChange(language.code)}
        >
          <Text
            style={[
              styles.tabText,
              currentLanguage === language.code && styles.activeTabText,
            ]}
          >
            {language.short}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#EF4444",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeTabText: {
    color: "white",
  },
});

export default LanguageTabs;
