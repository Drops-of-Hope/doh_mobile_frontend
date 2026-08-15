import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { Plus, Settings2, BarChart3, Pencil, Trash2 } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService, Campaign } from "../../services/campaignService";
import { extractTimeFromISO } from "../../utils/userDataUtils";

import {
  Screen,
  AppBar,
  Surface,
  Text,
  Button,
  ProgressTrack,
  EmptyState,
  Icon,
  useTheme,
} from "../../design";
import { Calendar } from "lucide-react-native";

import { logger } from "../../utils/logger";
import { useFocusRefresh } from "../../hooks/useFocusRefresh";
interface CampaignManagementScreenProps {
  navigation?: any;
}

const STATUS_META: Record<string, { label: string; tone: "crimson" | "info" | "success" | "danger"; surfaceTone: "crimsonSoft" | "infoSoft" | "successSoft" | "dangerSoft" }> = {
  upcoming: { label: "Upcoming", tone: "info", surfaceTone: "infoSoft" },
  active: { label: "Active", tone: "crimson", surfaceTone: "crimsonSoft" },
  completed: { label: "Completed", tone: "success", surfaceTone: "successSoft" },
  cancelled: { label: "Cancelled", tone: "danger", surfaceTone: "dangerSoft" },
};

export default function CampaignManagementScreen({
  navigation,
}: CampaignManagementScreenProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();

  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!user?.sub) return;

    try {
      if (!silent) setIsLoading(true);
      const userCampaigns = await campaignService.getOrganizerCampaigns(
        user.sub
      );
      setCampaigns(userCampaigns);
    } catch (error) {
      logger.error("Failed to load campaigns:", error);
      if (!silent) {
        Alert.alert("Error", "Failed to load campaigns. Please try again.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [user?.sub]);

  // Previously loaded once on mount, so a newly-created or edited campaign
  // never appeared here without a logout/login. Refetch silently on focus.
  useFocusRefresh(useCallback(() => loadCampaigns({ silent: true }), [loadCampaigns]));

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
        Alert.alert("Cannot Edit Campaign", permissions.reasons.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }

      navigation?.navigate("EditCampaign", { campaignId: campaign.id });
    } catch (error) {
      logger.error("Failed to check permissions:", error);
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
        Alert.alert("Cannot Delete Campaign", permissions.reasons.join("\n"), [
          { text: "OK" },
        ]);
        return;
      }

      Alert.alert(
        "Delete Campaign",
        `Are you sure you want to delete "${campaign.title}"?\n\nThis will notify all registered donors and hospitals about the cancellation.`,
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
                  `${result.message}\n\nNotifications sent to:\n• ${result.notificationsSent.donors} donors\n• ${result.notificationsSent.hospitals} hospitals`,
                  [{ text: "OK", onPress: () => loadCampaigns() }]
                );
              } catch (error) {
                logger.error("Failed to delete campaign:", error);
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
      logger.error("Failed to check permissions:", error);
      Alert.alert("Error", "Failed to check campaign permissions.");
    }
  };

  const handleViewAnalytics = (campaign: Campaign) => {
    navigation?.navigate("CampaignAnalytics", { campaignId: campaign.id });
  };

  const handleManageCampaign = (campaign: Campaign) => {
    navigation?.navigate("CampaignDashboard", { campaignId: campaign.id });
  };

  const handleBack = () => navigation?.goBack();

  const rightAction = (
    <Button
      title="Create"
      size="sm"
      fullWidth={false}
      icon={<Icon icon={Plus} size={16} color={theme.color.inverse} />}
      onPress={handleCreateCampaign}
    />
  );

  if (isLoading) {
    return (
      <Screen>
        <AppBar title="Manage Campaigns" onBack={handleBack} right={rightAction} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
          <Text variant="body" tone="inkMuted">
            Loading campaigns...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll refreshing={isRefreshing} onRefresh={handleRefresh}>
      <AppBar title="Manage Campaigns" onBack={handleBack} right={rightAction} />

      <View style={{ marginTop: theme.space.lg }}>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No Campaigns Yet"
            body="Create your first blood donation campaign to get started"
            actionLabel="Create Campaign"
            onAction={handleCreateCampaign}
          />
        ) : (
          campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onEdit={() => handleEditCampaign(campaign)}
              onDelete={() => handleDeleteCampaign(campaign)}
              onViewAnalytics={() => handleViewAnalytics(campaign)}
              onManage={() => handleManageCampaign(campaign)}
            />
          ))
        )}
      </View>
    </Screen>
  );
}

// Campaign Card Component
interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onViewAnalytics: () => void;
  onManage: () => void;
}

function CampaignCard({
  campaign,
  onEdit,
  onDelete,
  onViewAnalytics,
  onManage,
}: CampaignCardProps) {
  const theme = useTheme();
  const meta = STATUS_META[campaign.status || "upcoming"] ?? STATUS_META.upcoming;
  const expected = campaign.expectedDonors || 0;
  const actual = campaign.actualDonors || 0;
  const progress = expected > 0 ? Math.min(actual / expected, 1) : 0;

  return (
    <Surface style={{ marginBottom: theme.space.lg }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: theme.space.sm,
        }}
      >
        <Text variant="h3" style={{ flex: 1, marginRight: theme.space.sm }}>
          {campaign.title}
        </Text>
        <Surface
          tone={meta.surfaceTone}
          bordered={false}
          padding={0}
          radius="pill"
          style={{ paddingHorizontal: 10, paddingVertical: 4 }}
        >
          <Text variant="overline" tone={meta.tone}>
            {meta.label.toUpperCase()}
          </Text>
        </Surface>
      </View>

      <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
        {campaign.location}
      </Text>
      <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
        {new Date(campaign.startTime.replace(/\.000Z$/, "")).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </Text>
      <Text variant="caption" tone="inkMuted" style={{ marginBottom: theme.space.lg }}>
        {extractTimeFromISO(campaign.startTime)} - {extractTimeFromISO(campaign.endTime)}
      </Text>

      <View style={{ marginBottom: theme.space.lg }}>
        <Text variant="label" tone="inkMuted" style={{ marginBottom: theme.space.sm }}>
          {actual} / {expected} donations
        </Text>
        <ProgressTrack progress={progress} />
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: theme.space.sm }}>
        <View style={{ flex: 1, minWidth: 110 }}>
          <Button
            title="Manage"
            size="sm"
            icon={<Icon icon={Settings2} size={16} color={theme.color.inverse} />}
            onPress={onManage}
          />
        </View>
        <View style={{ flex: 1, minWidth: 110 }}>
          <Button
            title="Analytics"
            size="sm"
            variant="outline"
            icon={<Icon icon={BarChart3} size={16} color={theme.color.crimson} />}
            onPress={onViewAnalytics}
          />
        </View>
        {campaign.canEdit && (
          <View style={{ flex: 1, minWidth: 110 }}>
            <Button
              title="Edit"
              size="sm"
              variant="outline"
              icon={<Icon icon={Pencil} size={16} color={theme.color.crimson} />}
              onPress={onEdit}
            />
          </View>
        )}
        {campaign.canDelete && (
          <View style={{ flex: 1, minWidth: 110 }}>
            <Button
              title="Delete"
              size="sm"
              variant="danger"
              icon={<Icon icon={Trash2} size={16} color={theme.color.danger} />}
              onPress={onDelete}
            />
          </View>
        )}
      </View>
    </Surface>
  );
}
