import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Text,
} from "react-native";
import BottomTabBar from "../shared/organisms/BottomTabBar";
import { exploreService } from "../../services/exploreService";
import { campaignService } from "../../services/campaignService";
import { useAuth } from "../../context/AuthContext";
import ExploreScreenSkeleton from "../shared/molecules/skeletons/ExploreScreenSkeleton";

// Import refactored components
import SearchAndFilterBar from "./molecules/SearchAndFilterBar";
import CampaignList from "./molecules/CampaignList";
import FilterModal from "./organisms/FilterModal";
import CampaignDetailsModal from "./organisms/CampaignDetailsModal";

// Import types and utilities
import { Campaign, FilterCriteria } from "./types";
import { getMockCampaigns, filterCampaigns, parseSearchText, formatDateRange } from "./utils";

const ExploreScreen: React.FC = () => {
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
      
      console.log(`${campaignStatus} campaigns loaded from API:`, campaignsData.length);
      
      // Map service Campaign type to screen Campaign type and fetch participant count
      const mappedCampaigns = await Promise.all(
        campaignsData.map(async campaign => {
          // Fetch participant count using the new endpoint
          let participantCount = campaign.actualDonors || 0;
          try {
            const { count } = await campaignService.getCampaignParticipantCount(campaign.id);
            if (typeof count === "number" && count >= 0) {
              participantCount = count;
              console.log(`✅ Campaign ${campaign.id}: ${count} participants`);
            }
          } catch (e) {
            console.log("Could not fetch participant count for campaign:", campaign.id);
          }
          
          return {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            participants: participantCount,
            location: campaign.location,
            date: new Date(campaign.startTime).toLocaleDateString(),
            time: new Date(campaign.startTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            // Per-user registration status is not available from this endpoint; default to false
            isRegistered: false,
            participationId: undefined,
            participationStatus: undefined,
          };
        })
      );
      
      setCampaigns(mappedCampaigns);
      
      if (campaignsData.length === 0) {
        console.log(`No ${campaignStatus} campaigns found`);
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      // Use mock data when API fails
      const mockData = getMockCampaigns();
      setCampaigns(mockData);
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
              console.log("Navigate to login");
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
                console.error("Unregister campaign error:", error);
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
        
        // Store registration details for future reference
        console.log("Campaign registration details:", result.registrationDetails);
      } else {
        Alert.alert(
          "Registration Info",
          result.message,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Join campaign error:", error);

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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <ExploreScreenSkeleton />
        <BottomTabBar activeTab="explore" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearchPress={handleSearchPress}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilters={hasActiveFilters}
        campaignStatus={campaignStatus}
        onCampaignStatusChange={handleCampaignStatusChange}
      />

      <CampaignList
        campaigns={displayedCampaigns}
        onCampaignPress={handleViewDetails}
        loading={loading}
        hasMore={hasMore}
        onViewMore={handleViewMore}
      />

      {/* Show message when no campaigns are available */}
      {!loading && displayedCampaigns.length === 0 && (
        <View style={styles.noCampaignsContainer}>
          <Text style={styles.noCampaignsText}>
            {campaigns.length === 0 
              ? `No ${campaignStatus} campaigns available at the moment.`
              : "No campaigns match your search criteria."}
          </Text>
        </View>
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
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Joining Campaign...</Text>
          </View>
        </View>
      )}

      <BottomTabBar activeTab="explore" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noCampaignsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 100,
  },
  noCampaignsText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
});

export default ExploreScreen;
