import React, { useState } from "react";
import { View, Pressable, ScrollView, StyleSheet } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { Screen, AppBar, Text, Surface, Chip, Icon, useTheme } from "../../design";
import { useLanguage } from "../../context/LanguageContext";
import { FAQItem, getFAQsByCategory } from "../../../data/faqData";

interface FAQItemComponentProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({ faq, isExpanded, onToggle }) => {
  const theme = useTheme();
  return (
    <Surface padding="lg">
      <Pressable onPress={onToggle} style={styles.questionRow}>
        <Text variant="bodyBold" style={styles.questionText}>
          {faq.question}
        </Text>
        <Icon icon={isExpanded ? ChevronUp : ChevronDown} size={18} color={theme.color.crimson} />
      </Pressable>
      {isExpanded ? (
        <View style={[styles.answerWrap, { borderTopColor: theme.color.hairline }]}>
          <Text variant="body" tone="inkMuted">
            {faq.answer}
          </Text>
        </View>
      ) : null}
    </Surface>
  );
};

interface FAQsScreenProps {
  navigation?: any;
  onBack?: () => void;
}

const FAQsScreen: React.FC<FAQsScreenProps> = ({ navigation, onBack }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"donor" | "organizer">("donor");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  const currentFAQs = getFAQsByCategory(activeTab);

  return (
    <Screen>
      <AppBar title={t("faqs.title")} onBack={handleBack} />

      <View style={styles.tabRow}>
        <Chip label={t("faqs.donor_info")} selected={activeTab === "donor"} onPress={() => setActiveTab("donor")} />
        <Chip
          label={t("faqs.camp_organizer_info")}
          selected={activeTab === "organizer"}
          onPress={() => setActiveTab("organizer")}
        />
      </View>

      <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {currentFAQs.map((faq) => (
          <FAQItemComponent
            key={faq.id}
            faq={faq}
            isExpanded={expandedItems.has(faq.id)}
            onToggle={() => toggleExpanded(faq.id)}
          />
        ))}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  questionText: {
    flex: 1,
  },
  answerWrap: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1.5,
  },
});

export default FAQsScreen;
