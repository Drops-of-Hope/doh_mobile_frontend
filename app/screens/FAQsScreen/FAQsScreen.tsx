import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { FAQItem, getFAQsByCategory } from "../../../data/faqData";

interface FAQItemComponentProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({
  faq,
  isExpanded,
  onToggle,
}) => {
  return (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={onToggle} style={styles.questionContainer}>
        <Text style={styles.question}>{faq.question}</Text>
        <Text style={styles.expandIcon}>{isExpanded ? "−" : "+"}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );
};

interface FAQsScreenProps {
  onBack?: () => void;
}

const FAQsScreen: React.FC<FAQsScreenProps> = ({ onBack }) => {
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

  const currentFAQs = getFAQsByCategory(activeTab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("faqs.title")}</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "donor" && styles.activeTab]}
          onPress={() => setActiveTab("donor")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "donor" && styles.activeTabText,
            ]}
          >
            {t("faqs.donor_info")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "organizer" && styles.activeTab]}
          onPress={() => setActiveTab("organizer")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "organizer" && styles.activeTabText,
            ]}
          >
            {t("faqs.camp_organizer_info")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* FAQ Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentFAQs.map((faq) => (
          <FAQItemComponent
            key={faq.id}
            faq={faq}
            isExpanded={expandedItems.has(faq.id)}
            onToggle={() => toggleExpanded(faq.id)}
          />
        ))}
      </ScrollView>

      {onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{t("common.close")}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    marginHorizontal: 4,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  faqItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  question: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EF4444",
    width: 24,
    textAlign: "center",
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    marginTop: 12,
  },
  backButton: {
    margin: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  backButtonText: {
    textAlign: "center",
    color: "#374151",
    fontWeight: "600",
  },
});

export default FAQsScreen;
