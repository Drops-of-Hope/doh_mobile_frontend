import React from "react";
import { FlatList, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import CampaignCard from "../atoms/CampaignCard";
import { Campaign } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignPress: (campaign: Campaign) => void;
  loading?: boolean;
  hasMore?: boolean;
  onViewMore?: () => void;
}

export default function CampaignList({
  campaigns,
  onCampaignPress,
  loading = false,
  hasMore = false,
  onViewMore,
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
    <>
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
        ListFooterComponent={
          hasMore && onViewMore ? (
            <View style={styles.viewMoreContainer}>
              <TouchableOpacity 
                style={styles.viewMoreButton}
                onPress={onViewMore}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </>
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
    color: COLORS.TEXT_SECONDARY,
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
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  listContainer: {
    paddingBottom: 100,
    paddingHorizontal: SPACING.MD,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  viewMoreContainer: {
    alignItems: "center",
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.MD,
  },
  viewMoreButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.SM + 4,
    paddingHorizontal: SPACING.LG * 2,
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BACKGROUND,
  },
});
