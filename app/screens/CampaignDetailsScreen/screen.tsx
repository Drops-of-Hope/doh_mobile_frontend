import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";
import CampaignDetailsSkeleton from "../shared/molecules/skeletons/CampaignDetailsSkeleton";
import { COLORS, SPACING } from "../../../constants/theme";
import { extractTimeFromISO } from "../../utils/userDataUtils";

interface CampaignDetailsScreenProps {
  navigation?: any;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

interface CampaignDetails {
  id: string;
  title: string;
  type: "MOBILE" | "FIXED";
  location: string;
  motivation: string;
  description: string;
  startTime: string;
  endTime: string;
  expectedDonors: number;
  actualDonors: number;
  contactPersonName: string;
  contactPersonPhone: string;
  isApproved: boolean;
  createdAt: string;
  status: string;
}

export default function CampaignDetailsScreen({
  navigation,
  route,
}: CampaignDetailsScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const campaignId = route?.params?.campaignId;

  useEffect(() => {
    if (campaignId) {
      loadCampaignDetails();
    }
  }, [campaignId]);

  // Refresh details whenever the screen gains focus (e.g., after marking attendance)
  useFocusEffect(
    React.useCallback(() => {
      if (campaignId) {
        loadCampaignDetails();
      }
    }, [campaignId])
  );

  const loadCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignDetails = await campaignService.getCampaignDetails(campaignId!);
      
      // Transform the campaign data to match our interface
      const transformedCampaign: CampaignDetails = {
        id: campaignDetails.id,
        title: campaignDetails.title,
        type: campaignDetails.type,
        location: campaignDetails.location,
        motivation: campaignDetails.motivation,
        description: campaignDetails.description,
        startTime: campaignDetails.startTime,
        endTime: campaignDetails.endTime,
        expectedDonors: campaignDetails.expectedDonors,
        actualDonors: campaignDetails.actualDonors,
        contactPersonName: campaignDetails.contactPersonName,
        contactPersonPhone: campaignDetails.contactPersonPhone,
        isApproved: campaignDetails.isApproved,
        createdAt: campaignDetails.createdAt,
        status: campaignDetails.status || "upcoming"
      };

      // Try to fetch live stats to ensure progress reflects latest counts
      try {
        const stats = await campaignService.getCampaignStats(campaignId!);
        console.log("📊 Campaign stats received:", stats);
        const merged: CampaignDetails = {
          ...transformedCampaign,
          // Prefer stats-provided numbers when available
          expectedDonors: stats.donationGoal || transformedCampaign.expectedDonors,
          actualDonors: stats.currentDonations ?? transformedCampaign.actualDonors,
        };
        console.log("✅ Merged campaign data:", {
          expectedDonors: merged.expectedDonors,
          actualDonors: merged.actualDonors,
        });
        setCampaign(merged);
      } catch (e) {
        console.log("⚠️ Stats fetch failed, using campaign data only:", e);
        // If stats endpoint not available, proceed with transformed data
        setCampaign(transformedCampaign);
      }
    } catch (error) {
      console.error("Failed to load campaign details:", error);
      Alert.alert("Error", "Failed to load campaign details. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  const handleEdit = () => {
    navigation?.navigate("EditCampaign", { campaignId });
  };

  const formatDate = (dateString: string) => {
    // Strip .000Z to prevent UTC conversion
    const cleanString = dateString.replace(/\.000Z$/, '');
    const date = new Date(cleanString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    // Extract time without timezone conversion
    return extractTimeFromISO(dateString);
  };

  const formatDateTime = (dateString: string) => {
    // Strip .000Z to prevent UTC conversion
    const cleanString = dateString.replace(/\.000Z$/, '');
    const date = new Date(cleanString);
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: extractTimeFromISO(dateString)
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <CampaignDetailsSkeleton />
      </SafeAreaView>
    );
  }

  if (!campaign) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Campaign not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.SM }]}>
          <TouchableOpacity onPress={handleBack} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color="#1A202C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Campaign Details</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
            <Ionicons name="create" size={24} color="#E53E3E" />
          </TouchableOpacity>
        </View>
        {/* Campaign Title */}
        <View style={styles.titleSection}>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          <View style={styles.typebadge}>
            <Text style={styles.typeText}>{campaign.type}</Text>
          </View>
        </View>

        {/* Campaign Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={COLORS.PRIMARY} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoText}>{campaign.location}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.PRIMARY} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoText}>{formatDate(campaign.startTime)}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color={COLORS.PRIMARY} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoText}>
                {formatTime(campaign.startTime)} - {formatTime(campaign.endTime)}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{Number(campaign.actualDonors) || 0}</Text>
                <Text style={styles.progressLabel}>Actual Donors</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{campaign.expectedDonors}</Text>
                <Text style={styles.progressLabel}>Expected Donors</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>
                  {(() => {
                    const expected = Number(campaign.expectedDonors) || 0;
                    const actual = Number(campaign.actualDonors) || 0;
                    const pct = expected > 0 ? Math.round((actual / expected) * 100) : 0;
                    const clamped = Math.max(0, Math.min(100, pct));
                    return `${clamped}%`;
                  })()}
                </Text>
                <Text style={styles.progressLabel}>Progress</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Motivation</Text>
          <Text style={styles.descriptionText}>{campaign.motivation}</Text>
          
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{campaign.description}</Text>
        </View>

        {/* Contact Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactCard}>
            <View style={styles.contactRow}>
              <Ionicons name="person" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.contactText}>{campaign.contactPersonName}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.contactText}>{campaign.contactPersonPhone}</Text>
            </View>
          </View>
        </View>

        {/* Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Approval Status:</Text>
              <Text style={[styles.statusValue, { color: campaign.isApproved ? COLORS.SUCCESS : COLORS.PRIMARY }]}>
                {campaign.isApproved ? "Approved" : "Pending"}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Campaign Status:</Text>
              <Text style={[styles.statusValue, { color: COLORS.INFO }]}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Created:</Text>
              <Text style={styles.statusValue}>{formatDate(campaign.createdAt)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    marginBottom: 8,
  },
  backIcon: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A202C",
    flex: 1,
    textAlign: "center",
  },
  editIcon: {
    width: 40,
    alignItems: "flex-end",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: "600",
  },
  titleSection: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  typebadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  typeText: {
    color: COLORS.BACKGROUND,
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "500",
  },
  progressSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressStat: {
    alignItems: "center",
    flex: 1,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.PRIMARY,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 16,
  },
  descriptionSection: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: 16,
  },
  contactSection: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  statusSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 12,
    padding: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});