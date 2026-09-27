import React from "react";
import { View, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { Screen, AppBar, Text, ListSection, ListRow, Icon, useTheme } from "../../design";
import { useLanguage } from "../../context/LanguageContext";

interface LanguageOption {
  code: "en" | "si" | "ta";
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "si", name: "Sinhala", nativeName: "සිංහල" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
];

interface LanguageSelectionScreenProps {
  navigation?: any;
  onClose?: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ navigation, onClose }) => {
  const theme = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigation?.goBack();
    }
  };

  const handleLanguageSelect = async (languageCode: "en" | "si" | "ta") => {
    await setLanguage(languageCode);
    handleBack();
  };

  return (
    <Screen>
      <AppBar title={t("profile.language_selection")} onBack={handleBack} />
      <View style={styles.content}>
        <Text variant="body" tone="inkMuted" style={styles.subtitle}>
          {t("profile.select_language")}
        </Text>

        <ListSection>
          {languages.map((language) => {
            const selected = currentLanguage === language.code;
            return (
              <ListRow
                key={language.code}
                title={language.nativeName}
                subtitle={language.name}
                showChevron={false}
                onPress={() => handleLanguageSelect(language.code)}
                accessory={selected ? <Icon icon={Check} size={18} color={theme.color.crimson} /> : null}
              />
            );
          })}
        </ListSection>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
});

export default LanguageSelectionScreen;
