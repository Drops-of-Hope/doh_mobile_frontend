import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";
import EmergencyCard from "../../HomeScreen/molecules/EmergencyCard";
import { Emergency } from "../types";

interface EmergencyListProps {
  emergencies: Emergency[];
  onDonate: (emergency: Emergency) => void;
  onViewDetails: (emergency: Emergency) => void;
}

export default function EmergencyList({
  emergencies,
  onDonate,
  onViewDetails,
}: EmergencyListProps) {
  if (emergencies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No emergencies found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Active Emergencies ({emergencies.length})
      </Text>
      <FlatList
        data={emergencies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <EmergencyCard
              emergency={item}
              onDonate={onDonate}
              onViewDetails={onViewDetails}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  cardContainer: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
