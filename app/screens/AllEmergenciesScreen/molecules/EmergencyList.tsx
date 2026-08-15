import React from "react";
import { View, StyleSheet } from "react-native";
import { TriangleAlert } from "lucide-react-native";
import { SectionHeader, EmptyState } from "../../../design";
import EmergencyCard from "../../HomeScreen/molecules/EmergencyCard";
import { Emergency } from "../types";

interface EmergencyListProps {
  emergencies: Emergency[];
  onDonate: (emergency: Emergency) => void;
  onViewDetails: (emergency: Emergency) => void;
}

export default function EmergencyList({ emergencies, onDonate, onViewDetails }: EmergencyListProps) {
  if (emergencies.length === 0) {
    return <EmptyState icon={TriangleAlert} title="No emergencies found" />;
  }

  return (
    <View style={styles.container}>
      <SectionHeader title={`Active Emergencies (${emergencies.length})`} />
      <View style={styles.list}>
        {emergencies.map((item) => (
          <EmergencyCard key={item.id.toString()} emergency={item} onDonate={onDonate} onViewDetails={onViewDetails} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  list: { gap: 12 },
});
