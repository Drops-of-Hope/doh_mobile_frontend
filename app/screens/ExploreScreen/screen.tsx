import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, ActivityIndicator } from "react-native";
import { exploreService } from "../../services/exploreService";
import { campaignService } from "../../services/campaignService";
import { useAuth } from "../../context/AuthContext";
import ExploreScreenSkeleton from "../shared/molecules/skeletons/ExploreScreenSkeleton";
import { extractTimeFromISO } from "../../utils/userDataUtils";
import { Screen, Text, useTheme } from "../../design";

// Import refactored components
import SearchAndFilterBar from "./molecules/SearchAndFilterBar";
import CampaignList from "./molecules/CampaignList";
import FilterModal from "./organisms/FilterModal";
import CampaignDetailsModal from "./organisms/CampaignDetailsModal";

// Import types and utilities
import { Campaign, FilterCriteria } from "./types";
import { filterCampaigns, parseSearchText, formatDateRange } from "./utils";

import { logger } from "../../utils/logger";
const ExploreScreen: React.FC = () => {
  const theme = useTheme();
  // State management
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>("");
  const [campaignStatus, setCampaignStatus] = useState<"live" | "upcoming">("live");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const ITEMS_PER_PAGE = 8;

  // Filter state
  const [filters, setFilters] = useState<FilterCriteria>({
    location: "",
    date: "",
  });

  // Modal states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [campaignDetailsVisible, setCampaignDetailsVisible] = useState(false);
  const [joiningCampaign, setJoiningCampaign] = useState(false);

  // Auth context
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadCampaigns();
  }, [campaignStatus]);

  useEffect(() => {
    applyFilters();
  }, [campaigns, searchText, filters]);

  useEffect(() => {
    // Update displayed campaigns with pagination
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setDisplayedCampaigns(filteredCampaigns.slice(0, endIndex));
    setHasMore(endIndex < filteredCampaigns.length);
  }, [filteredCampaigns, currentPage]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setCurrentPage(1); // Reset pagination
      // Don't clear campaigns immediately - let them stay visible while loading
      
      let campaignsData;
      
      if (campaignStatus === "live") {
        // Get live campaigns
        const result = await exploreService.getLiveCampaigns({
          sortBy: "date",
          sortOrder: "asc",
          limit: 50
        });
        campaignsData = result.campaigns;
      } else {
        // Get upcoming campaigns
        campaignsData = await exploreService.getUpcomingCampaigns({
          sortBy: "date",
          sortOrder: "asc",
          limit: 50
        });
      }
      
      // Client-side validation: filter campaigns by actual time to ensure correct categorization
      const now = new Date();
      const clientFilteredCampaigns = campaignsData.filter(campaign => {
        const startTimeStr = campaign.startTime.replace(/\.000Z$/, '');
        const endTimeStr = campaign.endTime.replace(/\.000Z$/, '');
        const startTime = new Date(startTimeStr);
        const endTime = new Date(endTimeStr);
        
        if (campaignStatus === "live") {
          // Live: started but not ended
          const isLive = now >= startTime && now <= endTime;
          return isLive;
        } else {
          // Upcoming: not started yet
          const isUpcoming = now < startTime;
          return isUpcoming;
        }
      });

      // Map service Campaign type to screen Campaign type and fetch participant count
      const mappedCampaigns = await Promise.all(
        clientFilteredCampaigns.map(async campaign => {
          // Fetch participant count using the new endpoint
          let participantCount = campaign.actualDonors || 0;
          try {
            const { count } = await campaignService.getCampaignParticipantCount(campaign.id);
            if (typeof count === "number" && count >= 0) {
              participantCount = count;
            }
          } catch (e) {
            // Ignore error, fallback to default participant count
          }
          
          return {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            participants: participantCount,
            expectedDonors: campaign.expectedDonors,
            location: campaign.location,
            date: new Date(campaign.startTime.replace(/\.000Z$/, '')).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            time: extractTimeFromISO(campaign.startTime),
            // Per-user registration status is not available from this endpoint; default to false
            isRegistered: false,
            participationId: undefined,
            participationStatus: undefined,
          };
        })
      );
      
      setCampaigns(mappedCampaigns);
      
    } catch (error) {
      logger.error("Failed to load campaigns:", error);
      // Set empty array on error - show "No campaigns" message
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = filterCampaigns(
      campaigns,
      searchText,
      filters.location,
      filters.date
    );
    setFilteredCampaigns(filtered);
    setCurrentPage(1); // Reset pagination when filters change
  };

  const handleViewMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailsVisible(true);
  };

  const handleJoinCampaign = async (campaign: Campaign) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      Alert.alert(
        "Authentication Required",
        "Please log in to join campaigns.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Login", 
            onPress: () => {
              // Navigation to login would go here
            }
          },
        ]
      );
      return;
    }

    // Check if user is already registered
    if (campaign.isRegistered) {
      // Show confirmation dialog for unregistering
      Alert.alert(
        "Unregister from Campaign",
        `Are you sure you want to unregister from "${campaign.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Unregister", 
            style: "destructive",
            onPress: async () => {
              try {
                setCampaignDetailsVisible(false);
                setJoiningCampaign(true);

                const result = await campaignService.leaveCampaign(campaign.id);

                if (result.success) {
                  Alert.alert(
                    "Unregistered Successfully",
                    result.message,
                    [{ text: "OK" }]
                  );

                  // Update campaign registration status locally
                  const updatedCampaigns = campaigns.map((c) =>
                    c.id === campaign.id ? { 
                      ...c, 
                      participants: c.participants - 1,
                      isRegistered: false,
                      participationId: undefined,
                      participationStatus: undefined,
                    } : c
                  );
                  setCampaigns(updatedCampaigns);
                }
              } catch (error) {
                logger.error("Unregister campaign error:", error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
                
                Alert.alert(
                  "Unregistration Failed",
                  errorMessage,
                  [{ text: "OK" }]
                );
              } finally {
                setJoiningCampaign(false);
              }
            }
          },
        ]
      );
      return;
    }

    // Handle new registration
    try {
      // Close the details modal for better UX
      setCampaignDetailsVisible(false);
      setJoiningCampaign(true);

      // Use the updated campaign service
      const result = await campaignService.joinCampaign(campaign.id, {
        contactNumber: user.phone_number || "",
        specialRequests: "",
        emergencyContact: "",
      });

      if (result.success) {
        Alert.alert(
          "🎉 Registration Successful!",
          `You have successfully registered for "${campaign.title}".\n\nParticipation ID: ${result.participationId}\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}\n\nYou will receive notifications with campaign updates and instructions.`,
          [{ text: "OK" }]
        );

        // Update participant count and registration status locally
        const updatedCampaigns = campaigns.map((c) =>
          c.id === campaign.id ? { 
            ...c, 
            participants: c.participants + 1,
            isRegistered: true,
            participationId: result.participationId,
            participationStatus: "REGISTERED" as const,
          } : c
        );
        setCampaigns(updatedCampaigns);
      } else {
        Alert.alert(
          "Registration Info",
          result.message,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      logger.error("Join campaign error:", error);

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      Alert.alert(
        "Registration Failed",
        `Failed to register for campaign: ${errorMessage}\n\nPlease try again later.`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Retry", 
            onPress: () => handleJoinCampaign(campaign)
          },
        ]
      );
    } finally {
      setJoiningCampaign(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
  };

  const handleSearchPress = () => {
    // Trigger filter application
    applyFilters();
  };

  const handleCampaignStatusChange = (status: "live" | "upcoming") => {
    setCampaignStatus(status);
  };

  const handleClearFilters = () => {
    setFilters({ location: "", date: "" });
  };

  const hasActiveFilters =
    filters.location.trim() !== "" || filters.date.trim() !== "";

  // Only show full skeleton on first load (when campaigns array is empty)
  const isFirstLoad = loading && campaigns.length === 0;

  if (isFirstLoad) {
    return (
      <Screen edges={["top", "bottom"]}>
        <ExploreScreenSkeleton />
      </Screen>
    );
  }

  const noCampaigns = !loading && displayedCampaigns.length === 0;

  return (
    <Screen edges={["top", "bottom"]}>
      <View style={styles.headerRow}>
        <Text variant="h1">Explore</Text>
      </View>

      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleSearchPress}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilters={hasActiveFilters}
        campaignStatus={campaignStatus}
        onCampaignStatusChange={handleCampaignStatusChange}
      />

      {noCampaigns ? (
        <View style={styles.emptyWrap}>
          <CampaignList
            campaigns={displayedCampaigns}
            onCampaignPress={handleViewDetails}
            loading={loading}
            hasMore={hasMore}
            onViewMore={handleViewMore}
          />
        </View>
      ) : (
        <CampaignList
          campaigns={displayedCampaigns}
          onCampaignPress={handleViewDetails}
          loading={loading}
          hasMore={hasMore}
          onViewMore={handleViewMore}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        initialFilters={filters}
      />

      <CampaignDetailsModal
        visible={campaignDetailsVisible}
        campaign={selectedCampaign}
        onClose={() => setCampaignDetailsVisible(false)}
        onJoin={handleJoinCampaign}
        isLiveCampaign={campaignStatus === "live"}
      />

      {/* Loading Overlay for Campaign Registration */}
      {joiningCampaign && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingCard, { backgroundColor: theme.color.surface, borderColor: theme.color.hairline }]}>
            <ActivityIndicator size="large" color={theme.color.crimson} />
            <Text variant="bodyBold" style={styles.loadingText}>
              Joining Campaign...
            </Text>
          </View>
        </View>
      )}

    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  emptyWrap: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(26, 25, 23, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
  },
});

export default ExploreScreen;
