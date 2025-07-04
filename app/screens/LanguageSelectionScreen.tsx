import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

interface LanguageOption {
  code: 'en' | 'si' | 'ta';
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
];

interface LanguageSelectionScreenProps {
  onClose?: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onClose }) => {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleLanguageSelect = async (languageCode: 'en' | 'si' | 'ta') => {
    await setLanguage(languageCode);
    if (onClose) {
      onClose();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('profile.language_selection')}
        </Text>
        <Text style={styles.subtitle}>
          {t('profile.select_language')}
        </Text>

        <View style={styles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              onPress={() => handleLanguageSelect(language.code)}
              style={[
                styles.languageOption,
                currentLanguage === language.code ? styles.selectedOption : styles.unselectedOption
              ]}
            >
              <View style={styles.languageInfo}>
                <View>
                  <Text style={[
                    styles.nativeName,
                    currentLanguage === language.code ? styles.selectedText : styles.unselectedText
                  ]}>
                    {language.nativeName}
                  </Text>
                  <Text style={[
                    styles.englishName,
                    currentLanguage === language.code ? styles.selectedSubtext : styles.unselectedSubtext
                  ]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              {t('common.close')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 32,
  },
  languageList: {
    gap: 16,
  },
  languageOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
  },
  selectedOption: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  unselectedOption: {
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nativeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  selectedText: {
    color: '#DC2626',
  },
  unselectedText: {
    color: '#111827',
  },
  englishName: {
    fontSize: 14,
  },
  selectedSubtext: {
    color: '#EF4444',
  },
  unselectedSubtext: {
    color: '#6B7280',
  },
  checkmark: {
    width: 24,
    height: 24,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
  },
  closeButton: {
    marginTop: 32,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#374151',
    fontWeight: '600',
  },
});

export default LanguageSelectionScreen;
