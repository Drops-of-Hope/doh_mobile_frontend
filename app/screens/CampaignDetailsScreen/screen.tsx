import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { MapPin, Calendar, Clock, User, Phone, Pencil } from "lucide-react-native";
import { Screen, AppBar, Surface, Text, Icon, StatRow, StatTile, SectionHeader, Button, useTheme } from "../../design";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";
import CampaignDetailsSkeleton from "../shared/molecules/skeletons/CampaignDetailsSkeleton";
import { extractTimeFromISO } from "../../utils/userDataUtils";

import { logger } from "../../utils/logger";
import { useFocusRefresh } from "../../hooks/useFocusRefresh";

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

export default function CampaignDetailsScreen({ navigation, route }: CampaignDetailsScreenProps) {
  const theme = useTheme();
  useLanguage();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const campaignId = route?.params?.campaignId;

  const loadCampaignDetails = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!campaignId) return;
    try {
      if (!silent) setLoading(true);
      const campaignDetails = await campaignService.getCampaignDetails(campaignId);

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
        status: campaignDetails.status || "upcoming",
      };

      // Try to fetch live stats to ensure progress reflects latest counts
      try {
        const stats = await campaignService.getCampaignStats(campaignId);
        setCampaign({
          ...transformedCampaign,
          expectedDonors: stats.donationGoal || transformedCampaign.expectedDonors,
          actualDonors: stats.currentDonations ?? transformedCampaign.actualDonors,
        });
      } catch {
        setCampaign(transformedCampaign);
      }
    } catch (error) {
      logger.error("Failed to load campaign details:", error);
      if (!silent) {
        Alert.alert("Error", "Failed to load campaign details. Please check your connection and try again.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    loadCampaignDetails();
  }, [loadCampaignDetails]);

  // Refresh details whenever the screen gains focus (e.g., after marking
  // attendance via QR scan on another screen), without re-flashing the skeleton.
  useFocusRefresh(useCallback(() => loadCampaignDetails({ silent: true }), [loadCampaignDetails]));

  const handleBack = () => navigation?.goBack();
  const handleEdit = () => navigation?.navigate("EditCampaign", { campaignId });

  const formatDate = (dateString: string) => {
    const cleanString = dateString.replace(/\.000Z$/, "");
    return new Date(cleanString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatTime = (dateString: string) => extractTimeFromISO(dateString);

  if (loading) {
    return (
      <Screen>
        <CampaignDetailsSkeleton />
      </Screen>
    );
  }

  if (!campaign) {
    return (
      <Screen>
        <AppBar title="Campaign Details" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text variant="h3" tone="crimson" align="center" style={styles.errorText}>
            Campaign not found
          </Text>
          <Button title="Go Back" onPress={handleBack} fullWidth={false} />
        </View>
      </Screen>
    );
  }

  const expected = Number(campaign.expectedDonors) || 0;
  const actual = Number(campaign.actualDonors) || 0;
  const pct = expected > 0 ? Math.round((actual / expected) * 100) : 0;
  const clampedPct = Math.max(0, Math.min(100, pct));

  return (
    <Screen scroll>
      <AppBar
        title="Campaign Details"
        onBack={handleBack}
        right={
          <Pressable onPress={handleEdit} hitSlop={12}>
            <Icon icon={Pencil} size={22} color={theme.color.crimson} strokeWidth={1.75} />
          </Pressable>
        }
      />

      {/* Title */}
      <Surface style={styles.section}>
        <Text variant="h2" style={styles.campaignTitle}>
          {campaign.title}
        </Text>
        <View
          style={[styles.typeBadge, { backgroundColor: theme.color.crimsonSoft, borderRadius: theme.radius.pill }]}
        >
          <Text variant="caption" tone="crimson" style={styles.typeText}>
            {campaign.type}
          </Text>
        </View>
      </Surface>

      {/* Info */}
      <Surface style={styles.section}>
        <InfoRow icon={MapPin} label="Location" value={campaign.location} />
        <InfoRow icon={Calendar} label="Date" value={formatDate(campaign.startTime)} />
        <InfoRow icon={Clock} label="Time" value={`${formatTime(campaign.startTime)} - ${formatTime(campaign.endTime)}`} last />
      </Surface>

      {/* Progress */}
      <View style={styles.section}>
        <SectionHeader title="Progress" />
        <StatRow>
          <StatTile value={actual} label="Actual Donors" />
          <StatTile value={expected} label="Expected Donors" />
          <StatTile value={`${clampedPct}%`} label="Progress" />
        </StatRow>
      </View>

      {/* Description */}
      <Surface style={styles.section}>
        <Text variant="h3" style={styles.subheading}>
          Motivation
        </Text>
        <Text variant="body" tone="inkMuted" style={styles.descriptionText}>
          {campaign.motivation}
        </Text>

        <Text variant="h3" style={styles.subheading}>
          Description
        </Text>
        <Text variant="body" tone="inkMuted">
          {campaign.description}
        </Text>
      </Surface>

      {/* Contact */}
      <View style={styles.section}>
        <SectionHeader title="Contact Information" />
        <Surface>
          <View style={styles.contactRow}>
            <Icon icon={User} size={18} color={theme.color.crimson} />
            <Text variant="body" style={styles.contactText}>
              {campaign.contactPersonName}
            </Text>
          </View>
          <View style={styles.contactRow}>
            <Icon icon={Phone} size={18} color={theme.color.crimson} />
            <Text variant="body" style={styles.contactText}>
              {campaign.contactPersonPhone}
            </Text>
          </View>
        </Surface>
      </View>

      {/* Status */}
      <View style={styles.section}>
        <SectionHeader title="Status" />
        <Surface>
          <StatusRow label="Approval Status" value={campaign.isApproved ? "Approved" : "Pending"} tone={campaign.isApproved ? "success" : "crimson"} />
          <StatusRow
            label="Campaign Status"
            value={campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            tone="info"
          />
          <StatusRow label="Created" value={formatDate(campaign.createdAt)} tone="info" last />
        </Surface>
      </View>
    </Screen>
  );
}

function InfoRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.infoRow, !last && { marginBottom: 12 }]}>
      <Icon icon={icon} size={20} color={theme.color.crimson} />
      <View style={styles.infoTextContainer}>
        <Text variant="caption" tone="inkMuted">
          {label}
        </Text>
        <Text variant="bodyBold">{value}</Text>
      </View>
    </View>
  );
}

function StatusRow({
  label,
  value,
  tone,
  last,
}: {
  label: string;
  value: string;
  tone: "success" | "crimson" | "info";
  last?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.statusRow, !last && { marginBottom: 8 }]}>
      <Text variant="body" tone="inkMuted">
        {label}
      </Text>
      <Text variant="bodyBold" style={{ color: theme.color[tone] }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 20, paddingHorizontal: 20 },
  errorText: { marginBottom: 4 },
  section: { marginBottom: 16 },
  campaignTitle: { marginBottom: 10 },
  typeBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6 },
  typeText: { fontWeight: "700" },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoTextContainer: { marginLeft: 12, flex: 1, gap: 2 },
  subheading: { marginBottom: 8, marginTop: 4 },
  descriptionText: { marginBottom: 16, lineHeight: 20 },
  contactRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  contactText: { marginLeft: 12 },
  statusRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
