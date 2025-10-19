import React from "react";
import { FlatList, Text, StyleSheet, View, TouchableOpacity } from "react-native";
import CampaignCard from "../atoms/CampaignCard";
import Skeleton from "../../shared/atoms/Skeleton";
import { Campaign } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignPress: (campaign: Campaign) => void;
  loading?: boolean;
  hasMore?: boolean;
  onViewMore?: () => void;
}

// Skeleton card component
const SkeletonCampaignCard = () => (
  <View style={styles.skeletonCard}>
    <Skeleton height={120} borderRadius={12} style={styles.skeletonImage} />
    <View style={styles.skeletonContent}>
      <Skeleton height={16} width="90%" />
      <Skeleton height={12} width="60%" style={styles.skeletonMargin} />
      <Skeleton height={12} width="40%" style={styles.skeletonMargin} />
    </View>
  </View>
);

export default function CampaignList({
  campaigns,
  onCampaignPress,
  loading = false,
  hasMore = false,
  onViewMore,
}: CampaignListProps) {
  // Show skeleton cards while loading (but not on first load)
  if (loading && campaigns.length === 0) {
    return (
      <View style={styles.skeletonContainer}>
        <View style={styles.row}>
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
        </View>
        <View style={styles.row}>
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
        </View>
        <View style={styles.row}>
          <SkeletonCampaignCard />
          <SkeletonCampaignCard />
        </View>
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
          <>
            {loading && campaigns.length > 0 && (
              <View style={styles.loadingMoreContainer}>
                <View style={styles.row}>
                  <SkeletonCampaignCard />
                  <SkeletonCampaignCard />
                </View>
              </View>
            )}
            {!loading && hasMore && onViewMore && (
              <View style={styles.viewMoreContainer}>
                <TouchableOpacity 
                  style={styles.viewMoreButton}
                  onPress={onViewMore}
                >
                  <Text style={styles.viewMoreText}>View More</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.SM,
  },
  skeletonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: SPACING.MD,
  },
  skeletonImage: {
    marginBottom: 12,
  },
  skeletonContent: {
    paddingVertical: 4,
  },
  skeletonMargin: {
    marginTop: 6,
  },
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
  loadingMoreContainer: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
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
    marginBottom: SPACING.SM,
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
