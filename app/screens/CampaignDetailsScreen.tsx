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
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { campaignService } from "../services/campaignService";

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
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const campaignId = route?.params?.campaignId;

  useEffect(() => {
    if (campaignId) {
      loadCampaignDetails();
    }
  }, [campaignId]);

  const loadCampaignDetails = async () => {
    try {
      // For now, create mock data since we don't have a specific details endpoint
      // In a real app, you'd call: await campaignService.getCampaignDetails(campaignId)
      
      // Mock data - replace with actual API call
      const mockCampaign: CampaignDetails = {
        id: campaignId || "",
        title: "Blood Donation Campaign",
        type: "FIXED",
        location: "Central Hospital Colombo",
        motivation: "Save lives by donating blood",
        description: "Join us in our mission to save lives through blood donation.",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        expectedDonors: 100,
        actualDonors: 45,
        contactPersonName: "Dr. John Doe",
        contactPersonPhone: "0712345678",
        isApproved: true,
        createdAt: new Date().toISOString(),
        status: "active"
      };
      
      setCampaign(mockCampaign);
    } catch (error) {
      console.error("Failed to load campaign details:", error);
      Alert.alert("Error", "Failed to load campaign details");
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
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={styles.loadingText}>Loading campaign details...</Text>
        </View>
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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#1A202C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campaign Details</Text>
        <TouchableOpacity onPress={handleEdit} style={styles.editIcon}>
          <Ionicons name="create" size={24} color="#E53E3E" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <Ionicons name="location" size={20} color="#E53E3E" />
            <Text style={styles.infoText}>{campaign.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={20} color="#E53E3E" />
            <Text style={styles.infoText}>{formatDate(campaign.startTime)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#E53E3E" />
            <Text style={styles.infoText}>
              {formatTime(campaign.startTime)} - {formatTime(campaign.endTime)}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{campaign.actualDonors}</Text>
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
                  {Math.round((campaign.actualDonors / campaign.expectedDonors) * 100)}%
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
              <Ionicons name="person" size={20} color="#E53E3E" />
              <Text style={styles.contactText}>{campaign.contactPersonName}</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={20} color="#E53E3E" />
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
              <Text style={[styles.statusValue, { color: campaign.isApproved ? "#38A169" : "#E53E3E" }]}>
                {campaign.isApproved ? "Approved" : "Pending"}
              </Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Campaign Status:</Text>
              <Text style={[styles.statusValue, { color: "#3182CE" }]}>
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
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
    color: "#E53E3E",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  titleSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  campaignTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 8,
  },
  typebadge: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#4A5568",
  },
  progressSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A202C",
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#E53E3E",
  },
  progressLabel: {
    fontSize: 12,
    color: "#718096",
    marginTop: 4,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 16,
  },
  descriptionSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
    marginBottom: 16,
  },
  contactSection: {
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#4A5568",
  },
  statusSection: {
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
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
    color: "#718096",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
});