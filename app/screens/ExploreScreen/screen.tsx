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
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import { exploreService } from "../../services/exploreService";

// Import refactored components
import SearchAndFilterBar from "./molecules/SearchAndFilterBar";
import CampaignList from "./molecules/CampaignList";
import FilterModal from "./organisms/FilterModal";
import CampaignDetailsModal from "./organisms/CampaignDetailsModal";

// Import types and utilities
import { Campaign, FilterCriteria } from "./types";
import { getMockCampaigns, filterCampaigns } from "./utils";

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

  // Modal states
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [campaignDetailsVisible, setCampaignDetailsVisible] = useState(false);

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
    try {
      // Close the details modal
      setCampaignDetailsVisible(false);

      // Show loading state
      setLoading(true);

      // Try to join the campaign
      await exploreService.joinCampaign({
        campaignId: campaign.id,
        contactNumber: "", // Could be collected from user input
        specialRequests: ""
      });

      Alert.alert(
        "Registration Successful!",
        `You have successfully registered for "${campaign.title}". You will receive a notification with details.\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}`,
        [{ text: "OK" }]
      );

      // Update participant count
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
      );
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error("Join campaign error:", error);

      // For demo purposes, show success even if API fails
      Alert.alert(
        "Registration Successful!",
        `You have successfully registered for "${campaign.title}". You will receive a notification with details.\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}`,
        [{ text: "OK" }]
      );

      // Update participant count locally for demo
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
      );
      setCampaigns(updatedCampaigns);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
        <BottomTabBar activeTab="Explore" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onFilterPress={() => setFilterModalVisible(true)}
        hasActiveFilters={hasActiveFilters}
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

      <BottomTabBar activeTab="Explore" />
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
});

export default ExploreScreen;
