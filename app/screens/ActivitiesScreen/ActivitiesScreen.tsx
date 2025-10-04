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
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import { activityService } from "../../services/activityService";
import ActivitiesHeader from "../../../components/organisms/ActivitiesScreen/ActivitiesHeader";
import ActivitiesList from "../../../components/organisms/ActivitiesScreen/ActivitiesList";
import LoadingCard from "../../../components/molecules/ActivitiesScreen/LoadingCard";
import { DonationActivity } from "../../../components/molecules/ActivitiesScreen/ActivityCard";

const ActivitiesScreen: React.FC = () => {
  const [activities, setActivities] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadActivities();
  }, []);

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
        
        return {
          id: activity.id,
          campaignTitle: activity.title,
          campaignLocation: activity.metadata?.location || activity.relatedData?.campaign?.location || "Unknown Location",
          donationDate: activity.createdAt.split('T')[0], // Format date
          type: activityType,
          status: "completed" as const,
          details: {
            bloodType: activity.metadata?.bloodType || "Unknown",
            volume: activity.metadata?.volume || 450,
            hemoglobin: activity.metadata?.hemoglobin || 0,
            bloodPressure: activity.metadata?.bloodPressure || "Unknown",
            weight: activity.metadata?.weight || 0,
            notes: activity.description,
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
      await loadActivities(1, true);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!loadingMore && hasMore && !loading) {
      await loadActivities(currentPage + 1);
    }
  }, [loadingMore, hasMore, loading, currentPage]);

  useEffect(() => {
    loadActivities();
  }, []);

  const handleViewDetails = (activity: DonationActivity) => {
    const typeText =
      activity.type === "donation" ? "Blood Donation" : "Health Checkup";
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
    if (!hasMore) return null;
    
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
          Showing {activities.length} of {totalItems} activities
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <LoadingCard />
        <BottomTabBar activeTab="Activities" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ActivitiesHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <ActivitiesList
          activities={activities}
          onViewDetails={handleViewDetails}
        />
        {renderLoadMoreButton()}
      </ScrollView>

      <BottomTabBar activeTab="Activities" />
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
