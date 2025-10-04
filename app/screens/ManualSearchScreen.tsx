import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardHeader from "./CampaignDashboardScreen/molecules/DashboardHeader";
import { donorSearchService, DonorSearchResult, DonorSearchFilters } from "../services/donorSearchService";
import { campaignService } from "../services/campaignService";

interface ManualSearchScreenProps {
  navigation?: any;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

export default function ManualSearchScreen({
  navigation,
  route,
}: ManualSearchScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { campaignId } = route?.params || {};

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DonorSearchResult[]>([]);
  const [recentDonors, setRecentDonors] = useState<DonorSearchResult[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<DonorSearchResult | null>(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  useEffect(() => {
    loadRecentDonors();
  }, []);

  const loadRecentDonors = async () => {
    try {
      const recent = await donorSearchService.getRecentDonors(campaignId, 5);
      setRecentDonors(recent);
    } catch (error) {
      console.error("Failed to load recent donors:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !selectedBloodGroup) {
      Alert.alert("Warning", "Please enter a search term or select a blood group");
      return;
    }

    setIsLoading(true);
    try {
      const filters: DonorSearchFilters = {
        query: searchQuery.trim(),
        bloodGroup: selectedBloodGroup || undefined,
        eligibleOnly: true,
        page: 1,
        limit: 20,
      };

      const result = await donorSearchService.searchDonors(filters);
      setSearchResults(result.donors);
    } catch (error) {
      console.error("Search failed:", error);
      Alert.alert("Error", "Failed to search donors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDonor = (donor: DonorSearchResult) => {
    setSelectedDonor(donor);
    Alert.alert(
      "Donor Selected",
      `${donor.name}\n` +
      `Blood Group: ${donor.bloodGroup}\n` +
      `Total Donations: ${donor.totalDonations}\n` +
      `Eligible: ${donor.eligibleToDonate ? 'Yes' : 'No'}\n` +
      `${donor.eligibilityReason ? `Reason: ${donor.eligibilityReason}` : ''}`,
      [
        {
          text: "Mark Attendance",
          onPress: () => handleMarkAttendance(donor),
          style: donor.eligibleToDonate ? "default" : "destructive",
        },
        {
          text: "Verify Identity",
          onPress: () => handleVerifyDonor(donor),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  const handleMarkAttendance = async (donor: DonorSearchResult) => {
    try {
      setIsLoading(true);

      const attendanceData = {
        campaignId: campaignId!,
        userId: donor.id,
        userName: donor.name,
        userEmail: donor.email,
        bloodType: donor.bloodGroup,
        isWalkIn: true, // Manual entry is considered walk-in
        screeningPassed: donor.eligibleToDonate,
        timestamp: new Date().toISOString(),
        markedBy: user?.sub || "",
      };

      await campaignService.markAttendance(attendanceData);

      Alert.alert(
        "Success",
        "Attendance marked successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setSelectedDonor(null);
              loadRecentDonors(); // Refresh recent donors
            },
          },
        ],
      );
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyDonor = async (donor: DonorSearchResult) => {
    try {
      setIsLoading(true);

      const verification = await donorSearchService.verifyDonor({
        donorId: donor.id,
        campaignId: campaignId!,
        verificationType: "BOTH",
        notes: "Manual verification via search",
      });

      if (verification.success) {
        Alert.alert(
          "Verification Complete",
          verification.message,
          [
            {
              text: "Mark Attendance",
              onPress: () => handleMarkAttendance(verification.donor),
            },
            {
              text: "OK",
              style: "cancel",
            },
          ],
        );
      } else {
        Alert.alert("Verification Failed", verification.message);
      }
    } catch (error) {
      console.error("Failed to verify donor:", error);
      Alert.alert("Error", "Failed to verify donor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigation?.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title="Manual Search"
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search Donors</Text>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Enter NIC, name, email, or phone"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />

          {/* Blood Group Filter */}
          <Text style={styles.filterLabel}>Filter by Blood Group:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bloodGroupContainer}>
            <TouchableOpacity
              style={[styles.bloodGroupChip, !selectedBloodGroup && styles.bloodGroupChipSelected]}
              onPress={() => setSelectedBloodGroup("")}
            >
              <Text style={[styles.bloodGroupText, !selectedBloodGroup && styles.bloodGroupTextSelected]}>
                All
              </Text>
            </TouchableOpacity>
            {bloodGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[styles.bloodGroupChip, selectedBloodGroup === group && styles.bloodGroupChipSelected]}
                onPress={() => setSelectedBloodGroup(group)}
              >
                <Text style={[styles.bloodGroupText, selectedBloodGroup === group && styles.bloodGroupTextSelected]}>
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.searchButtonText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Donors */}
        {recentDonors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Donors</Text>
            {recentDonors.map((donor) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                onPress={() => handleSelectDonor(donor)}
              />
            ))}
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results ({searchResults.length})</Text>
            {searchResults.map((donor) => (
              <DonorCard
                key={donor.id}
                donor={donor}
                onPress={() => handleSelectDonor(donor)}
              />
            ))}
          </View>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No donors found matching your search</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Donor Card Component
interface DonorCardProps {
  donor: DonorSearchResult;
  onPress: () => void;
}

function DonorCard({ donor, onPress }: DonorCardProps) {
  return (
    <TouchableOpacity style={styles.donorCard} onPress={onPress}>
      <View style={styles.donorInfo}>
        <Text style={styles.donorName}>{donor.name}</Text>
        <Text style={styles.donorDetails}>
          {donor.bloodGroup} • {donor.totalDonations} donations • {donor.donationBadge}
        </Text>
        <Text style={styles.donorContact}>{donor.email}</Text>
        {donor.phone && <Text style={styles.donorContact}>{donor.phone}</Text>}
      </View>
      
      <View style={styles.eligibilityContainer}>
        <View style={[styles.eligibilityBadge, { backgroundColor: donor.eligibleToDonate ? "#10B981" : "#EF4444" }]}>
          <Text style={styles.eligibilityText}>
            {donor.eligibleToDonate ? "Eligible" : "Not Eligible"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchSection: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 8,
  },
  bloodGroupContainer: {
    marginBottom: 16,
  },
  bloodGroupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  bloodGroupChipSelected: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  bloodGroupText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  bloodGroupTextSelected: {
    color: "#fff",
  },
  searchButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  donorCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  donorDetails: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  donorContact: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  eligibilityContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  eligibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eligibilityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
});