import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { SearchX } from "lucide-react-native";
import CampaignCard from "../atoms/CampaignCard";
import { Skeleton, Surface, Button, EmptyState } from "../../../design";
import { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignPress: (campaign: Campaign) => void;
  loading?: boolean;
  hasMore?: boolean;
  onViewMore?: () => void;
}

const SkeletonCampaignCard = () => (
  <Surface style={styles.skeletonCard}>
    <Skeleton height={18} width="70%" />
    <Skeleton height={14} width="90%" style={styles.skeletonGap} />
    <Skeleton height={14} width="50%" style={styles.skeletonGap} />
    <Skeleton height={8} width="100%" style={styles.skeletonGap} />
  </Surface>
);

export default function CampaignList({
  campaigns,
  onCampaignPress,
  loading = false,
  hasMore = false,
  onViewMore,
}: CampaignListProps) {
  if (loading && campaigns.length === 0) {
    return (
      <View style={styles.listContainer}>
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
        <SkeletonCampaignCard />
      </View>
    );
  }

  if (campaigns.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No campaigns found"
        body="Try adjusting your search or filters."
      />
    );
  }

  return (
    <FlatList
      data={campaigns}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CampaignCard
          title={item.title}
          description={item.description}
          participants={item.participants}
          expectedDonors={item.expectedDonors}
          location={item.location}
          date={item.date}
          time={item.time}
          isRegistered={item.isRegistered}
          onPress={() => onCampaignPress(item)}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ListFooterComponent={
        <>
          {loading && campaigns.length > 0 ? <SkeletonCampaignCard /> : null}
          {!loading && hasMore && onViewMore ? (
            <View style={styles.viewMoreContainer}>
              <Button title="View More" variant="outline" size="md" onPress={onViewMore} />
            </View>
          ) : null}
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  skeletonCard: {
    marginBottom: 12,
  },
  skeletonGap: {
    marginTop: 8,
  },
  viewMoreContainer: {
    paddingVertical: 16,
  },
});
