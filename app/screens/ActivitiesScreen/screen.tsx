import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Heart, Stethoscope, CalendarPlus, PlusCircle, Users, User, Info } from "lucide-react-native";
import { activityService } from "../../services/activityService";
import { localActivityService, LocalActivity } from "../../services/localActivityService";
import ActivityFilterBar, { FilterOption } from "./molecules/ActivityFilterBar";
import ActivitiesTimeline, { TimelineEntry } from "./organisms/ActivitiesTimeline";
import { DonationActivity } from "./types";
import { AppBar, Screen, Text, Segmented, Skeleton, useTheme } from "../../design";
import { useLanguage } from "../../context/LanguageContext";

import { logger } from "../../utils/logger";

interface ActivitiesScreenProps {
  navigation?: any;
}

const ActivitiesScreen: React.FC<ActivitiesScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [activities, setActivities] = useState<DonationActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<DonationActivity[]>([]);
  const [localActivities, setLocalActivities] = useState<LocalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeTab, setActiveTab] = useState<'recent' | 'all'>('recent');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const ITEMS_PER_PAGE = 10;

  const tabOptions = [
    { label: t("activities.tab_recent"), value: 'recent' },
    { label: t("activities.tab_all"), value: 'all' },
  ];

  const donationFilters: FilterOption[] = [
    { label: t("activities.filter_all"), value: 'all' },
    { label: t("activities.filter_donations"), value: 'donation' },
    { label: t("activities.filter_appointments"), value: 'checkup' },
  ];

  const localFilters: FilterOption[] = [
    { label: t("activities.filter_all"), value: 'all' },
    { label: t("activities.filter_today"), value: 'today' },
    { label: t("activities.filter_week"), value: 'week' },
    { label: t("activities.filter_appointments"), value: 'appointment_created' },
    { label: t("activities.filter_campaigns"), value: 'campaign_created' },
  ];

  useEffect(() => {
    loadActivities();
    loadLocalActivities();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      loadLocalActivities();
    }
  }, [selectedFilter, activeTab]);

  useEffect(() => {
    applyFilters();
  }, [activities, selectedFilter, activeTab]);

  const applyFilters = () => {
    // Only apply filters when on 'recent' tab, as 'all' tab uses localActivities
    if (activeTab !== 'recent') {
      setFilteredActivities([]);
      return;
    }

    let filtered = [...activities];

    if (selectedFilter === 'donation') {
      filtered = filtered.filter(a => a.type === 'donation');
    } else if (selectedFilter === 'checkup') {
      filtered = filtered.filter(a => a.type === 'checkup');
    }
    // 'all' -> everything currently loaded, no client-side cap.

    setFilteredActivities(filtered);
  };

  const loadLocalActivities = async () => {
    try {
      let filter: any = {};

      if (selectedFilter === 'today') {
        filter.dateRange = 'today';
      } else if (selectedFilter === 'week') {
        filter.dateRange = 'week';
      } else if (selectedFilter !== 'all') {
        filter.type = selectedFilter;
      }

      const localActivityData = await localActivityService.getActivities(filter);
      setLocalActivities(localActivityData);
    } catch (error) {
      logger.error('Failed to load local activities:', error);
    }
  };

  const loadActivities = async (page: number = 1, isRefresh: boolean = false) => {
    try {
      if (page === 1 && !isRefresh) {
        setLoading(true);
      } else if (page > 1) {
        setLoadingMore(true);
      }

      const response = await activityService.getActivities({
        page,
        limit: ITEMS_PER_PAGE,
        sortBy: "createdAt",
        sortOrder: "desc" // Most recent first
      });

      // Convert backend activities to frontend format
      const formattedActivities: DonationActivity[] = response.activities.map(activity => {
        // Map activity type to supported types
        let activityType: "donation" | "checkup" = "donation";
        if (activity.type === "APPOINTMENT_SCHEDULED" || activity.type === "APPOINTMENT_CANCELLED") {
          activityType = "checkup";
        }

        // Safely extract date, handle invalid dates
        let formattedDate = "Unknown Date";
        try {
          if (activity.createdAt) {
            formattedDate = activity.createdAt.split('T')[0];
          }
        } catch (error) {
          logger.warn('Error formatting date:', error);
        }

        return {
          id: activity.id || String(Math.random()),
          campaignTitle: String(activity.title || "Untitled Activity"),
          campaignLocation: String(activity.metadata?.location || activity.relatedData?.campaign?.location || "Unknown Location"),
          donationDate: formattedDate,
          type: activityType,
          status: "completed" as const,
          createdAt: activity.createdAt,
          details: {
            bloodType: activity.metadata?.bloodType || undefined,
            volume: activity.metadata?.volume !== undefined ? activity.metadata.volume : undefined,
            hemoglobin: activity.metadata?.hemoglobin !== undefined ? activity.metadata.hemoglobin : undefined,
            bloodPressure: activity.metadata?.bloodPressure || undefined,
            weight: activity.metadata?.weight !== undefined ? activity.metadata.weight : undefined,
            notes: activity.description || undefined,
          },
        };
      });

      if (page === 1 || isRefresh) {
        setActivities(formattedActivities);
        setCurrentPage(1);
      } else {
        setActivities(prev => [...prev, ...formattedActivities]);
        setCurrentPage(page);
      }

      setTotalItems(response.pagination.totalItems);
      setHasMore(response.pagination.hasNext);

    } catch (error) {
      logger.error("Failed to load activities:", error);
      // Set empty arrays on error - show "No activities" message
      if (page === 1 || isRefresh) {
        setActivities([]);
        setTotalItems(0);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'recent') {
        await loadActivities(1, true);
      } else {
        await loadLocalActivities();
      }
    } finally {
      setRefreshing(false);
    }
  }, [activeTab]);

  const handleLoadMore = useCallback(async () => {
    if (!loadingMore && hasMore && !loading && activeTab === 'recent') {
      await loadActivities(currentPage + 1);
    }
  }, [loadingMore, hasMore, loading, currentPage, activeTab]);

  const handleFilterChange = (filter: string) => {
    // Filtering is client-side over already-loaded pages — no refetch here,
    // a refetch would discard pages already paginated in.
    setSelectedFilter(filter);
  };

  const handleTabChange = (tab: 'recent' | 'all') => {
    setActiveTab(tab);
    setSelectedFilter('all');
    if (tab === 'all') {
      loadLocalActivities();
    }
  };

  const handleFindCampaign = () => {
    navigation?.navigate("ExploreTab");
  };

  const handleLocalActivityPress = (activity: LocalActivity) => {
    Alert.alert(
      activity.title,
      `${activity.description}\n\nTime: ${new Date(activity.timestamp).toLocaleString()}`,
      [{ text: t("common.ok") }]
    );
  };

  const handleViewDetails = (activity: DonationActivity) => {
    const typeText =
      activity.type === "donation" ? "Blood Donation" : "Appointment";
    let message = `${typeText}\n\nCampaign: ${activity.campaignTitle}\nLocation: ${
      activity.campaignLocation
    }\nDate: ${activity.donationDate}`;

    if (activity.details) {
      if (activity.details.bloodType) {
        message += `\nBlood Type: ${activity.details.bloodType}`;
      }
      if (activity.details.volume) {
        message += `\nVolume Donated: ${activity.details.volume}ml`;
      }
      if (activity.details.hemoglobin) {
        message += `\nHemoglobin: ${activity.details.hemoglobin} g/dL`;
      }
      if (activity.details.bloodPressure) {
        message += `\nBlood Pressure: ${activity.details.bloodPressure} mmHg`;
      }
      if (activity.details.weight) {
        message += `\nWeight: ${activity.details.weight} kg`;
      }
      if (activity.details.notes) {
        message += `\nNotes: ${activity.details.notes}`;
      }
    }

    Alert.alert(t("activities.details_title"), message, [{ text: t("common.ok") }]);
  };

  const localActivityIcon = (type: LocalActivity['type']) => {
    switch (type) {
      case 'appointment_created':
        return CalendarPlus;
      case 'campaign_created':
        return PlusCircle;
      case 'campaign_joined':
        return Users;
      case 'donation_completed':
        return Heart;
      case 'profile_updated':
        return User;
      default:
        return Info;
    }
  };

  const recentEntries: TimelineEntry[] = filteredActivities.map((activity) => ({
    id: activity.id,
    title: activity.campaignTitle,
    tone: activity.type === "donation" ? "crimson" : "info",
    icon: activity.type === "donation" ? Heart : Stethoscope,
    date: activity.createdAt ? new Date(activity.createdAt) : new Date(activity.donationDate),
    meta: [
      activity.campaignLocation,
      activity.donationDate,
      ...(activity.details?.bloodType ? [`Blood type ${activity.details.bloodType}`] : []),
      ...(activity.details?.volume ? [`${activity.details.volume}ml donated`] : []),
    ],
    onPress: () => handleViewDetails(activity),
  }));

  const localEntries: TimelineEntry[] = localActivities.map((activity) => ({
    id: activity.id,
    title: activity.title || "Untitled Activity",
    icon: localActivityIcon(activity.type),
    tone: "ink",
    date: new Date(activity.timestamp),
    meta: [activity.description || "No description available"],
    onPress: () => handleLocalActivityPress(activity),
  }));

  return (
    <Screen scroll refreshing={refreshing} onRefresh={handleRefresh}>
      <AppBar title={t("activities.title")} />

      <View style={styles.tabRow}>
        <Segmented options={tabOptions} value={activeTab} onChange={(v) => handleTabChange(v as 'recent' | 'all')} />
      </View>

      <View style={[styles.filterWrap, { marginHorizontal: -theme.space.xl }]}>
        <ActivityFilterBar
          selectedFilter={selectedFilter}
          onFilterChange={handleFilterChange}
          filters={activeTab === 'recent' ? donationFilters : localFilters}
        />
      </View>

      {loading ? (
        <View style={{ gap: theme.space.lg }}>
          <Skeleton height={16} width="30%" />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
        </View>
      ) : activeTab === 'recent' ? (
        <>
          <ActivitiesTimeline
            entries={recentEntries}
            emptyTitle={t("activities.no_activities")}
            emptyBody={t("activities.no_activities_subtitle")}
            emptyActionLabel={t("activities.find_campaign")}
            onEmptyAction={handleFindCampaign}
          />
          {hasMore ? (
            <View style={styles.loadMoreWrap}>
              <Text
                variant="label"
                tone="crimson"
                onPress={handleLoadMore}
                style={styles.loadMoreText}
              >
                {loadingMore ? t("activities.loading_more") : t("activities.load_more")}
              </Text>
              <Text variant="caption" tone="inkMuted" align="center">
                {t("activities.showing_count", { shown: filteredActivities.length, total: totalItems })}
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        <ActivitiesTimeline
          entries={localEntries}
          emptyIcon={Info}
          emptyTitle={t("activities.no_local_activities")}
          emptyBody={t("activities.no_local_activities_subtitle")}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  tabRow: { marginBottom: 16 },
  filterWrap: { marginBottom: 8 },
  loadMoreWrap: { alignItems: "center", paddingVertical: 20, gap: 6 },
  loadMoreText: { paddingVertical: 8 },
});

export default ActivitiesScreen;
