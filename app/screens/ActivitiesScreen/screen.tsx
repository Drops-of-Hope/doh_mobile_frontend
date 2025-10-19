import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  StyleSheet,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BottomTabBar from "../shared/organisms/BottomTabBar";
import { activityService } from "../../services/activityService";
import { localActivityService, LocalActivity } from "../../services/localActivityService";
import ActivitiesHeader from "./organisms/ActivitiesHeader";
import ActivitiesList from "./organisms/ActivitiesList";
import ActivitiesScreenSkeleton from "../shared/molecules/skeletons/ActivitiesScreenSkeleton";
import ActivityFilterBar, { FilterOption } from "./molecules/ActivityFilterBar";
import LocalActivitiesList from "./molecules/LocalActivitiesList";
import { DonationActivity } from "./molecules/ActivityCard";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../constants/theme";

const ActivitiesScreen: React.FC = () => {
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

  const donationFilters: FilterOption[] = [
    { label: 'Recent', value: 'recent', icon: 'time' },
    { label: 'Donations', value: 'donation', icon: 'heart' },
    { label: 'Appointments', value: 'checkup', icon: 'medical' },
  ];

  const localFilters: FilterOption[] = [
    { label: 'All', value: 'all', icon: 'list' },
    { label: 'Today', value: 'today', icon: 'today' },
    { label: 'This Week', value: 'week', icon: 'calendar' },
    { label: 'Appointments', value: 'appointment_created', icon: 'calendar' },
    { label: 'Campaigns', value: 'campaign_created', icon: 'add-circle' },
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
    // Filter activities based on selected filter
    applyFilters();
  }, [activities, selectedFilter, activeTab]);

  const applyFilters = () => {
    // Only apply filters when on 'recent' tab, as 'all' tab uses localActivities
    if (activeTab !== 'recent') {
      setFilteredActivities([]);
      return;
    }

    let filtered = [...activities];

    if (selectedFilter === 'recent') {
      // Show only the 5 most recent activities
      filtered = filtered.slice(0, 5);
    } else if (selectedFilter === 'donation') {
      // Show only donations (limited to recent for performance)
      filtered = filtered.filter(a => a.type === 'donation').slice(0, 10);
    } else if (selectedFilter === 'checkup') {
      // Show only appointments/checkups (limited to recent for performance)
      filtered = filtered.filter(a => a.type === 'checkup').slice(0, 10);
    } else {
      // Default: show recent 5
      filtered = filtered.slice(0, 5);
    }

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
      console.error('Failed to load local activities:', error);
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
          console.warn('Error formatting date:', error);
        }
        
        return {
          id: activity.id || String(Math.random()),
          campaignTitle: String(activity.title || "Untitled Activity"),
          campaignLocation: String(activity.metadata?.location || activity.relatedData?.campaign?.location || "Unknown Location"),
          donationDate: formattedDate,
          type: activityType,
          status: "completed" as const,
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
      console.error("Failed to load activities:", error);
      
      // Fallback to mock data for demo when API fails (only for first page)
      if (page === 1) {
        const mockActivities = [
          {
            id: "1",
            campaignTitle: "Emergency Blood Drive - General Hospital",
            campaignLocation: "General Hospital, Colombo",
            donationDate: "2025-01-10",
            type: "donation" as const,
            status: "completed" as const,
            details: {
              bloodType: "O+",
              volume: 450,
              hemoglobin: 14.2,
              bloodPressure: "120/80",
              weight: 68,
              notes: "Successful donation, donor in excellent health",
            },
          },
          {
            id: "2",
            campaignTitle: "Health Checkup - University Medical Center",
            campaignLocation: "University of Colombo",
            donationDate: "2024-12-20",
            type: "checkup" as const,
            status: "completed" as const,
            details: {
              bloodType: "O+",
              hemoglobin: 13.8,
              bloodPressure: "118/78",
              weight: 67,
              notes: "Regular health screening completed, all vitals normal",
            },
          },
          {
            id: "3",
            campaignTitle: "Mobile Blood Unit - Community Drive",
            campaignLocation: "One Galle Face Mall",
            donationDate: "2024-11-15",
            type: "donation" as const,
            status: "completed" as const,
            details: {
              bloodType: "O+",
              volume: 450,
              hemoglobin: 14.5,
              bloodPressure: "122/82",
              weight: 69,
              notes: "Mobile unit donation, excellent facility and staff",
            },
          }
        ];
        setActivities(mockActivities);
        setTotalItems(mockActivities.length);
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
    setSelectedFilter(filter);
    if (activeTab === 'recent') {
      // Filter recent activities based on selection
      loadActivities(1, true);
    }
  };

  const handleTabChange = (tab: 'recent' | 'all') => {
    setActiveTab(tab);
    // Set appropriate default filter for each tab
    if (tab === 'recent') {
      setSelectedFilter('recent');
      // Apply filters immediately to show recent 5
      setCurrentPage(1);
    } else {
      setSelectedFilter('all');
      // Load local activities when switching to 'all' tab
      loadLocalActivities();
    }
  };

  const handleLocalActivityPress = (activity: LocalActivity) => {
    Alert.alert(
      activity.title,
      `${activity.description}\n\nTime: ${new Date(activity.timestamp).toLocaleString()}`,
      [{ text: 'OK' }]
    );
  };

  useEffect(() => {
    loadActivities();
  }, []);

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

    Alert.alert("Activity Details", message, [{ text: "OK" }]);
  };

  const renderLoadMoreButton = () => {
    if (!hasMore || selectedFilter === 'recent') return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={[styles.loadMoreButton, loadingMore && styles.loadMoreButtonDisabled]}
          onPress={handleLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.loadMoreText}>Load More Activities</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          Showing {filteredActivities.length} of {totalItems} activities
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <ActivitiesScreenSkeleton />
        <BottomTabBar activeTab="activities" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ActivitiesHeader />

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.activeTab]}
          onPress={() => handleTabChange('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.activeTabText]}>
            Recent Activities
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => handleTabChange('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Activities
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <ActivityFilterBar
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        filters={activeTab === 'recent' ? donationFilters : localFilters}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'recent' ? (
          <>
            <ActivitiesList
              activities={filteredActivities}
              onViewDetails={handleViewDetails}
            />
            {renderLoadMoreButton()}
          </>
        ) : (
          <LocalActivitiesList
            activities={localActivities}
            onActivityPress={handleLocalActivityPress}
            emptyMessage="No local activities recorded yet. Start by creating an appointment or joining a campaign!"
          />
        )}
      </ScrollView>

      <BottomTabBar activeTab="activities" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.XS,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    borderRadius: BORDER_RADIUS.SM,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
  },
  activeTabText: {
    color: COLORS.BACKGROUND,
  },
  loadMoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 100, // Space for bottom tab bar
  },
  loadMoreButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  loadMoreButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loadMoreText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paginationText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ActivitiesScreen;
