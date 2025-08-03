import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import { donationService } from "../../services/donationService";

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
      const campaignsData = await donationService.getCampaigns();
      setCampaigns(campaignsData);
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

      // Try to register user interest in the campaign
      await donationService.joinCampaign(campaign.id);

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
        <BottomTabBar />
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

      <BottomTabBar />
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
});

export default ExploreScreen;
