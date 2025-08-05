import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";

interface EligibilityCheck {
  id: string;
  category: string;
  question: string;
  status: "eligible" | "ineligible" | "review";
  description: string;
}

interface DonationEligibilityScreenProps {
  navigation?: any;
}

export default function DonationEligibilityScreen({
  navigation,
}: DonationEligibilityScreenProps) {
  const [eligibilityChecks] = useState<EligibilityCheck[]>([
    {
      id: "1",
      category: "Age Requirement",
      question: "Are you between 18-65 years old?",
      status: "eligible",
      description: "Donors must be between 18 and 65 years of age.",
    },
    {
      id: "2",
      category: "Weight Requirement",
      question: "Do you weigh at least 50kg (110 lbs)?",
      status: "eligible",
      description:
        "Minimum weight requirement ensures donor safety during donation.",
    },
    {
      id: "3",
      category: "Health Status",
      question: "Are you currently in good health?",
      status: "review",
      description: "Must be free from cold, flu, or other illnesses.",
    },
    {
      id: "4",
      category: "Recent Donations",
      question: "Has it been at least 56 days since your last donation?",
      status: "eligible",
      description: "Required waiting period between blood donations.",
    },
    {
      id: "5",
      category: "Medical History",
      question: "Are you taking any medications?",
      status: "review",
      description: "Some medications may affect donation eligibility.",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "eligible":
        return "#10B981";
      case "ineligible":
        return "#EF4444";
      case "review":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "eligible":
        return "checkmark-circle";
      case "ineligible":
        return "close-circle";
      case "review":
        return "help-circle";
      default:
        return "help-circle";
    }
  };

  const handleBack = () => navigation?.goBack();

  const eligibleCount = eligibilityChecks.filter(
    (check) => check.status === "eligible",
  ).length;
  const totalCount = eligibilityChecks.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <DashboardHeader
        title="Donation Eligibility"
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Eligibility Check</Text>
          <Text style={styles.summaryText}>
            {eligibleCount} of {totalCount} checks passed
          </Text>
        </View>

        {/* Eligibility Items */}
        {eligibilityChecks.map((check) => (
          <View key={check.id} style={styles.checkItem}>
            <View style={styles.checkHeader}>
              <View style={styles.checkInfo}>
                <Text style={styles.checkCategory}>{check.category}</Text>
                <Text style={styles.checkQuestion}>{check.question}</Text>
                <Text style={styles.checkDescription}>{check.description}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(check.status) },
                ]}
              >
                <Ionicons
                  name={getStatusIcon(check.status) as any}
                  size={16}
                  color="white"
                />
              </View>
            </View>
          </View>
        ))}

        {/* Action Button */}
        <TouchableOpacity style={styles.proceedButton}>
          <Text style={styles.proceedButtonText}>Proceed to Donation</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: "#6B7280",
  },
  checkItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  checkInfo: {
    flex: 1,
    marginRight: 12,
  },
  checkCategory: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  checkQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  checkDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  proceedButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomPadding: {
    height: 24,
  },
});
