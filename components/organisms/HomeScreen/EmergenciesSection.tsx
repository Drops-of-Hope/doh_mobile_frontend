import React from "react";
import { View, StyleSheet } from "react-native";
import SectionHeader from "../../molecules/HomeScreen/SectionHeader";
import EmergencyCard, {
  Emergency,
} from "../../molecules/HomeScreen/EmergencyCard";

interface EmergenciesSectionProps {
  emergencies: Emergency[];
  onDonate: (emergency: Emergency) => void;
  onViewDetails?: (emergency: Emergency) => void;
  onViewAll?: () => void;
}

export default function EmergenciesSection({
  emergencies,
  onDonate,
  onViewDetails,
  onViewAll,
}: EmergenciesSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Emergency" onViewAll={onViewAll} />

      <View style={styles.emergenciesContainer}>
        {emergencies.map((emergency) => (
          <EmergencyCard
            key={emergency.id}
            emergency={emergency}
            onDonate={onDonate}
            onViewDetails={onViewDetails}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  emergenciesContainer: {
    gap: 12,
  },
});
