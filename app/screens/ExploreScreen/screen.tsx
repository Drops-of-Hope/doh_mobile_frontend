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
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>("");

  // Filter state
  const [filters, setFilters] = useState<FilterCriteria>({
    location: "",
    date: "",
  });

  // Additional filter state for UI display
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("");

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
  }, []);

  useEffect(() => {
    applyFilters();
  }, [campaigns, searchText, filters]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      // Get upcoming campaigns (active and future)
      const campaignsData = await exploreService.getUpcomingCampaigns({
        sortBy: "date",
        sortOrder: "asc",
        limit: 50
      });
      
      // Map service Campaign type to screen Campaign type
      const mappedCampaigns = campaignsData.map(campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description,
        participants: campaign.actualDonors,
        location: campaign.location,
        date: new Date(campaign.startTime).toLocaleDateString(),
        time: new Date(campaign.startTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }));
      
      setCampaigns(mappedCampaigns);
      
      if (campaignsData.length === 0) {
        console.log("No upcoming campaigns found");
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

        // Update participant count locally
        const updatedCampaigns = campaigns.map((c) =>
          c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
        );
        setCampaigns(updatedCampaigns);
        setFilteredCampaigns(updatedCampaigns);
        
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
    // Parse the search text for prefixed searches
    const parsed = parseSearchText(searchText);
    
    // Apply parsed criteria to filters
    setFilters({
      location: parsed.location,
      date: parsed.startDate || parsed.endDate ? `${parsed.startDate}-${parsed.endDate}` : "",
    });

    // Update display filters
    setLocationFilter(parsed.location);
    setDateRangeFilter(formatDateRange(parsed.startDate, parsed.endDate));

    // Update search text to show only general search
    setSearchText(parsed.generalSearch);
  };

  const handleLocationPress = () => {
    // Add "Location: " prefix to search text
    if (!searchText.toLowerCase().includes('location:')) {
      setSearchText(searchText ? `${searchText} Location: ` : 'Location: ');
    }
  };

  const handleDateRangePress = () => {
    // Add date range prefix to search text
    if (!searchText.toLowerCase().includes('start:') && !searchText.toLowerCase().includes('end:')) {
      setSearchText(searchText ? `${searchText} Start: dd/mm/yyyy End: dd/mm/yyyy` : 'Start: dd/mm/yyyy End: dd/mm/yyyy');
    }
  };

  const handleClearFilters = () => {
    setFilters({ location: "", date: "" });
  };

  const hasActiveFilters =
    filters.location.trim() !== "" || filters.date.trim() !== "";

  if (loading && campaigns.length === 0) {
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
        onLocationPress={handleLocationPress}
        onDateRangePress={handleDateRangePress}
        hasActiveFilters={hasActiveFilters}
        locationFilter={locationFilter}
        dateRangeFilter={dateRangeFilter}
      />

      <CampaignList
        campaigns={filteredCampaigns}
        onCampaignPress={handleViewDetails}
        loading={loading}
      />

      {/* Show message when no campaigns are available */}
      {!loading && filteredCampaigns.length === 0 && (
        <View style={styles.noCampaignsContainer}>
          <Text style={styles.noCampaignsText}>
            {campaigns.length === 0 
              ? "No upcoming campaigns available at the moment."
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
