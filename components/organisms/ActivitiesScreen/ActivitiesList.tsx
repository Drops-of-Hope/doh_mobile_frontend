import React from "react";
import { View, StyleSheet } from "react-native";
import ActivityCard, {
  DonationActivity,
} from "../../molecules/ActivitiesScreen/ActivityCard";
import SummaryCard from "../../molecules/ActivitiesScreen/SummaryCard";
import EmptyStateCard from "../../molecules/ActivitiesScreen/EmptyStateCard";

interface ActivitiesListProps {
  activities: DonationActivity[];
  onViewDetails: (activity: DonationActivity) => void;
}

export default function ActivitiesList({
  activities,
  onViewDetails,
}: ActivitiesListProps) {
  if (activities.length === 0) {
    return <EmptyStateCard />;
  }

  return (
    <View style={styles.activitiesContainer}>
      <SummaryCard activities={activities} />

      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onViewDetails={onViewDetails}
        />
      ))}

      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesContainer: {
    paddingVertical: 8,
  },
  bottomPadding: {
    height: 100,
  },
});
