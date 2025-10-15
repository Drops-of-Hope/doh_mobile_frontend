import React from "react";
import { FlatList, Text, StyleSheet, View } from "react-native";
import CampaignCard from "../atoms/CampaignCard";
import { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignPress: (campaign: Campaign) => void;
  loading?: boolean;
}

export default function CampaignList({
  campaigns,
  onCampaignPress,
  loading = false,
}: CampaignListProps) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading campaigns...</Text>
      </View>
    );
  }

  if (campaigns.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No campaigns found</Text>
        <Text style={styles.emptySubtext}>
          Try adjusting your search or filters
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={campaigns}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      renderItem={({ item }) => (
        <CampaignCard
          title={item.title}
          description={item.description}
          participants={item.participants}
          location={item.location}
          date={item.date}
          time={item.time}
          onPress={() => onCampaignPress(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
  },
  listContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
});
