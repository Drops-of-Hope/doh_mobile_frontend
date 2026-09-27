import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { Search, Users } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { donorSearchService, DonorSearchResult, DonorSearchFilters } from "../../services/donorSearchService";
import { campaignService } from "../../services/campaignService";

import {
  Screen,
  AppBar,
  Surface,
  Text,
  Field,
  Chip,
  Button,
  UserAvatar,
  SectionHeader,
  EmptyState,
  Icon,
  useTheme,
} from "../../design";

import { logger } from "../../utils/logger";
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
  const theme = useTheme();
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
      logger.error("Failed to load recent donors:", error);
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
      logger.error("Search failed:", error);
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

      await campaignService.markAttendance(attendanceData as any);

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
      logger.error("Failed to mark attendance:", error);
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
      logger.error("Failed to verify donor:", error);
      Alert.alert("Error", "Failed to verify donor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => navigation?.goBack();

  return (
    <Screen scroll>
      <AppBar title="Manual Search" onBack={handleBack} />

      <View style={{ marginTop: theme.space.lg }}>
        {/* Search Section */}
        <View style={{ marginBottom: theme.space.xxl }}>
          <SectionHeader title="Search Donors" />

          <Field
            placeholder="Enter NIC, name, email, or phone"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            leftIcon={<Icon icon={Search} size={18} color={theme.color.inkFaint} />}
          />

          <Text variant="label" tone="inkMuted" style={{ marginBottom: theme.space.sm }}>
            Filter by Blood Group
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm, marginBottom: theme.space.lg }}>
            <Chip label="All" selected={!selectedBloodGroup} onPress={() => setSelectedBloodGroup("")} />
            {bloodGroups.map((group) => (
              <Chip
                key={group}
                label={group}
                selected={selectedBloodGroup === group}
                onPress={() => setSelectedBloodGroup(group)}
              />
            ))}
          </View>

          <Button title="Search" onPress={handleSearch} loading={isLoading} />
        </View>

        {/* Recent Donors */}
        {recentDonors.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <SectionHeader title="Recent Donors" />
            {recentDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} onPress={() => handleSelectDonor(donor)} />
            ))}
          </View>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <SectionHeader title={`Search Results (${searchResults.length})`} />
            {searchResults.map((donor) => (
              <DonorCard key={donor.id} donor={donor} onPress={() => handleSelectDonor(donor)} />
            ))}
          </View>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <EmptyState icon={Users} title="No Donors Found" body="No donors found matching your search" />
        )}
      </View>
    </Screen>
  );
}

// Donor Card Component
interface DonorCardProps {
  donor: DonorSearchResult;
  onPress: () => void;
}

function DonorCard({ donor, onPress }: DonorCardProps) {
  const theme = useTheme();
  return (
    <Surface
      onTouchEnd={onPress}
      style={{ marginBottom: theme.space.md, flexDirection: "row", alignItems: "center" }}
    >
      <UserAvatar url={donor.profilePicture} name={donor.name} seed={donor.id} size={40} />
      <View style={{ flex: 1, marginLeft: theme.space.md }}>
        <Text variant="bodyBold">{donor.name}</Text>
        <Text variant="caption" tone="inkMuted">
          {donor.bloodGroup} • {donor.totalDonations} donations • {donor.donationBadge}
        </Text>
        <Text variant="caption" tone="inkFaint">
          {donor.email}
        </Text>
        {donor.phone ? (
          <Text variant="caption" tone="inkFaint">
            {donor.phone}
          </Text>
        ) : null}
      </View>

      <Surface
        tone={donor.eligibleToDonate ? "successSoft" : "dangerSoft"}
        bordered={false}
        padding={0}
        radius="pill"
        style={{ paddingHorizontal: 10, paddingVertical: 4 }}
      >
        <Text variant="overline" tone={donor.eligibleToDonate ? "success" : "danger"}>
          {donor.eligibleToDonate ? "ELIGIBLE" : "NOT ELIGIBLE"}
        </Text>
      </Surface>
    </Surface>
  );
}
