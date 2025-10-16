import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import { campaignService, Campaign } from "../../services/campaignService";

interface CampaignManagementScreenProps {
  navigation?: any;
}

export default function CampaignManagementScreen({
  navigation,
}: CampaignManagementScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    if (!user?.sub) return;

    try {
      setIsLoading(true);
      const userCampaigns = await campaignService.getOrganizerCampaigns(
        user.sub
      );
      setCampaigns(userCampaigns);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      Alert.alert("Error", "Failed to load campaigns. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCampaigns();
    setIsRefreshing(false);
  };

  const handleCreateCampaign = () => {
    navigation?.navigate("CreateCampaign");
  };

  const handleEditCampaign = async (campaign: Campaign) => {
    // Check permissions first
    try {
      const permissions = await campaignService.checkCampaignPermissions(
        campaign.id
      );

      if (!permissions.canEdit) {
        Alert.alert("Cannot Edit Campaign", permissions.reasons.join("\\n"), [
          { text: "OK" },
        ]);
        return;
      }

      navigation?.navigate("EditCampaign", { campaignId: campaign.id });
    } catch (error) {
      console.error("Failed to check permissions:", error);
      Alert.alert("Error", "Failed to check campaign permissions.");
    }
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    try {
      // Check permissions first
      const permissions = await campaignService.checkCampaignPermissions(
        campaign.id
      );

      if (!permissions.canDelete) {
        Alert.alert("Cannot Delete Campaign", permissions.reasons.join("\\n"), [
          { text: "OK" },
        ]);
        return;
      }

      Alert.alert(
        "Delete Campaign",
        `Are you sure you want to delete "${campaign.title}"?\\n\\nThis will notify all registered donors and hospitals about the cancellation.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                const result = await campaignService.deleteCampaign(
                  campaign.id
                );

                Alert.alert(
                  "Campaign Deleted",
                  `${result.message}\\n\\nNotifications sent to:\\n• ${result.notificationsSent.donors} donors\\n• ${result.notificationsSent.hospitals} hospitals`,
                  [{ text: "OK", onPress: () => loadCampaigns() }]
                );
              } catch (error) {
                console.error("Failed to delete campaign:", error);
                Alert.alert(
                  "Error",
                  error instanceof Error
                    ? error.message
                    : "Failed to delete campaign"
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Failed to check permissions:", error);
      Alert.alert("Error", "Failed to check campaign permissions.");
    }
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    navigation?.navigate("CampaignAnalytics", { campaignId: campaign.id });
  };

  const handleManageCampaign = (campaign: Campaign) => {
    navigation?.navigate("CampaignDashboard", { campaignId: campaign.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#3B82F6";
      case "active":
        return "#10B981";
      case "completed":
        return "#6B7280";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const handleBack = () => navigation?.goBack();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="Manage Campaigns"
          onBack={handleBack}
          onAdd={handleCreateCampaign}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title="Manage Campaigns"
        onBack={handleBack}
        onAdd={handleCreateCampaign}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#DC2626"]}
          />
        }
      >
        {campaigns.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Campaigns Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first blood donation campaign to get started
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateCampaign}
            >
              <Text style={styles.createButtonText}>Create Campaign</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.campaignsContainer}>
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onEdit={() => handleEditCampaign(campaign)}
                onDelete={() => handleDeleteCampaign(campaign)}
                onViewAnalytics={() => handleViewAnalytics(campaign)}
                onManage={() => handleManageCampaign(campaign)}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Campaign Card Component
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onViewAnalytics: () => void;
  onManage: () => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onViewAnalytics,
  onManage,
  getStatusColor,
  getStatusText,
}: CampaignCardProps) {
  return (
    <View style={styles.campaignCard}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.campaignTitle}>{campaign.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(campaign.status || 'upcoming') },
            ]}
          >
            <Text style={styles.statusText}>
              {getStatusText(campaign.status || 'upcoming')}
            </Text>
          </View>
        </View>
      </View>

      {/* Details */}
      <View style={styles.cardContent}>
        <Text style={styles.campaignLocation}>{campaign.location}</Text>
        <Text style={styles.campaignDate}>
          {new Date(campaign.startTime).toLocaleDateString()}
        </Text>
        <Text style={styles.campaignTime}>
          {new Date(campaign.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(campaign.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {campaign.actualDonors || 0} / {campaign.expectedDonors || 0} donations
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    ((campaign.actualDonors || 0) / (campaign.expectedDonors || 1)) * 100,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onManage}>
          <Text style={styles.actionButtonText}>Manage</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onViewAnalytics}>
          <Text style={styles.actionButtonText}>Analytics</Text>
        </TouchableOpacity>

        {campaign.canEdit && (
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={onEdit}
          >
            <Text style={[styles.actionButtonText, styles.editButtonText]}>
              Edit
            </Text>
          </TouchableOpacity>
        )}

        {campaign.canDelete && (
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  campaignsContainer: {
    paddingVertical: 16,
  },
  campaignCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  cardContent: {
    marginBottom: 16,
  },
  campaignLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  campaignDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  campaignTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#DC2626",
  },
  cardActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E53E3E",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  editButton: {
    backgroundColor: "#E53E3E",
    borderColor: "#E53E3E",
  },
  editButtonText: {
    color: "#FFFFFF",
  },
  deleteButton: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  deleteButtonText: {
    color: "#FFFFFF",
  },
});
