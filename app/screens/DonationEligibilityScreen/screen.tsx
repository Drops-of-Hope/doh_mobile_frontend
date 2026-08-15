import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react-native";
import { Screen, AppBar, Surface, Text, Button, Icon, useTheme } from "../../design";

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

const STATUS_META = {
  eligible: { icon: CheckCircle2, tone: "success" as const },
  ineligible: { icon: XCircle, tone: "danger" as const },
  review: { icon: HelpCircle, tone: "warning" as const },
};

export default function DonationEligibilityScreen({ navigation }: DonationEligibilityScreenProps) {
  const theme = useTheme();
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
      description: "Minimum weight requirement ensures donor safety during donation.",
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

  const eligibleCount = eligibilityChecks.filter((c) => c.status === "eligible").length;
  const totalCount = eligibilityChecks.length;

  return (
    <Screen scroll>
      <AppBar title="Donation Eligibility" onBack={() => navigation?.goBack()} />

      <Surface style={styles.summary}>
        <Text variant="h3">Eligibility Check</Text>
        <Text variant="body" tone="inkMuted">
          {eligibleCount} of {totalCount} checks passed
        </Text>
      </Surface>

      <View style={styles.list}>
        {eligibilityChecks.map((check) => {
          const meta = STATUS_META[check.status];
          return (
            <Surface key={check.id} style={styles.checkItem}>
              <View style={styles.checkRow}>
                <View style={styles.checkInfo}>
                  <Text variant="overline" tone="inkMuted">
                    {check.category}
                  </Text>
                  <Text variant="bodyBold" style={styles.question}>
                    {check.question}
                  </Text>
                  <Text variant="caption" tone="inkMuted">
                    {check.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: theme.color[`${meta.tone}Soft`], borderRadius: theme.radius.pill },
                  ]}
                >
                  <Icon icon={meta.icon} size={18} color={theme.color[meta.tone]} />
                </View>
              </View>
            </Surface>
          );
        })}
      </View>

      <Pressable>
        <Button title="Proceed to Donation" onPress={() => navigation?.navigate("Donate")} />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: { marginBottom: 20 },
  list: { gap: 12, marginBottom: 24 },
  checkItem: {},
  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  checkInfo: { flex: 1, gap: 4 },
  question: { marginTop: 2 },
  statusBadge: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
});
