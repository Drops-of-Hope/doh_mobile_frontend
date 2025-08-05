import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { qrService, CampaignStats, CampaignParticipant } from "../../app/services/qrService";
import { useLanguage } from "../../app/context/LanguageContext";

interface CampaignStatsComponentProps {
  campaignId: string;
  onScanQR?: () => void;
}

export default function CampaignStatsComponent({ 
  campaignId, 
  onScanQR 
}: CampaignStatsComponentProps) {
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [participants, setParticipants] = useState<CampaignParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "attended" | "completed">("all");

  const { t } = useLanguage();

  useEffect(() => {
    loadStats();
  }, [campaignId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsData, participantsData] = await Promise.all([
        qrService.getCampaignStats(campaignId),
        qrService.getCampaignParticipants(campaignId),
      ]);
      
      setStats(statsData);
      setParticipants(participantsData.participants);
    } catch (error) {
      console.error("Failed to load campaign stats:", error);
      Alert.alert(
        t("campaign_stats.error"),
        t("campaign_stats.load_error"),
        [{ text: t("common.ok") }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadStats();
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredParticipants = () => {
    switch (filter) {
      case "attended":
        return participants.filter(p => p.attendanceMarked);
      case "completed":
        return participants.filter(p => p.donationCompleted);
      default:
        return participants;
    }
  };

  const exportReport = async () => {
    try {
      Alert.alert(
        t("campaign_stats.export_report"),
        t("campaign_stats.select_format"),
        [
          {
            text: t("campaign_stats.export_csv"),
            onPress: () => handleExport("csv"),
          },
          {
            text: t("campaign_stats.export_excel"),
            onPress: () => handleExport("excel"),
          },
          {
            text: t("common.cancel"),
            style: "cancel",
          },
        ]
      );
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const handleExport = async (format: "csv" | "excel") => {
    try {
      const result = await qrService.exportCampaignReport(campaignId, format);
      Alert.alert(
        t("campaign_stats.export_success"),
        t("campaign_stats.export_success_message"),
        [{ text: t("common.ok") }]
      );
      // In a real app, you would open the download URL or share the file
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert(
        t("campaign_stats.error"),
        t("campaign_stats.export_error"),
        [{ text: t("common.ok") }]
      );
    }
  };

  const formatBloodGroup = (bloodGroup: string): string => {
    return bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-");
  };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "COMPLETED":
        return "#4CAF50";
      case "ATTENDED":
        return "#2196F3";
      case "CONFIRMED":
        return "#FF9800";
      case "REGISTERED":
        return "#9E9E9E";
      case "CANCELLED":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusIcon = (participant: CampaignParticipant): any => {
    if (participant.donationCompleted) return "checkmark-circle";
    if (participant.attendanceMarked) return "person-circle";
    return "time-outline";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>{t("campaign_stats.loading")}</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>{t("campaign_stats.no_data")}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
          <Text style={styles.retryButtonText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredParticipants = getFilteredParticipants();

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.scanButton} onPress={onScanQR}>
          <Ionicons name="qr-code-outline" size={24} color="#FFFFFF" />
          <Text style={styles.scanButtonText}>{t("campaign_stats.scan_qr")}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
          <Ionicons name="download-outline" size={20} color="#667eea" />
          <Text style={styles.exportButtonText}>{t("campaign_stats.export")}</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <LinearGradient
          colors={["#667eea", "#764ba2"]}
          style={styles.statCard}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalRegistered}</Text>
            <Text style={styles.statLabel}>{t("campaign_stats.registered")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalAttended}</Text>
            <Text style={styles.statLabel}>{t("campaign_stats.attended")}</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={["#11998e", "#38ef7d"]}
          style={styles.statCard}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalDonationsCompleted}</Text>
            <Text style={styles.statLabel}>{t("campaign_stats.completed")}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(stats.completionRate)}%</Text>
            <Text style={styles.statLabel}>{t("campaign_stats.completion_rate")}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Attendance Rate */}
      <View style={styles.rateContainer}>
        <Text style={styles.rateTitle}>{t("campaign_stats.attendance_rate")}</Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${stats.attendanceRate}%` }
            ]} 
          />
        </View>
        <Text style={styles.rateText}>{Math.round(stats.attendanceRate)}%</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterButtonText, filter === "all" && styles.filterButtonTextActive]}>
            {t("campaign_stats.all")} ({participants.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === "attended" && styles.filterButtonActive]}
          onPress={() => setFilter("attended")}
        >
          <Text style={[styles.filterButtonText, filter === "attended" && styles.filterButtonTextActive]}>
            {t("campaign_stats.attended")} ({participants.filter(p => p.attendanceMarked).length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === "completed" && styles.filterButtonActive]}
          onPress={() => setFilter("completed")}
        >
          <Text style={[styles.filterButtonText, filter === "completed" && styles.filterButtonTextActive]}>
            {t("campaign_stats.completed")} ({participants.filter(p => p.donationCompleted).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Participants List */}
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsTitle}>
          {t("campaign_stats.participants")} ({filteredParticipants.length})
        </Text>
        
        {filteredParticipants.map((participant) => (
          <View key={participant.id} style={styles.participantCard}>
            <View style={styles.participantHeader}>
              <View style={styles.participantInfo}>
                <Text style={styles.participantName}>{participant.user.name}</Text>
                <View style={styles.participantDetails}>
                  <Text style={styles.participantBloodGroup}>
                    {formatBloodGroup(participant.user.bloodGroup)}
                  </Text>
                  <Text style={styles.participantDonations}>
                    {t("campaign_stats.donations_count", { count: participant.user.totalDonations })}
                  </Text>
                </View>
              </View>
              
              <View style={styles.participantStatus}>
                <Ionicons 
                  name={getStatusIcon(participant)} 
                  size={24} 
                  color={getStatusColor(participant.status)}
                />
                <Text style={[styles.statusText, { color: getStatusColor(participant.status) }]}>
                  {participant.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.participantStats}>
              <View style={styles.participantStat}>
                <Text style={styles.participantStatLabel}>{t("campaign_stats.registered")}</Text>
                <Text style={styles.participantStatValue}>
                  {new Date(participant.registrationDate).toLocaleDateString()}
                </Text>
              </View>
              
              {participant.scannedAt && (
                <View style={styles.participantStat}>
                  <Text style={styles.participantStatLabel}>{t("campaign_stats.scanned")}</Text>
                  <Text style={styles.participantStatValue}>
                    {new Date(participant.scannedAt).toLocaleTimeString()}
                  </Text>
                </View>
              )}
              
              {participant.pointsEarned > 0 && (
                <View style={styles.participantStat}>
                  <Text style={styles.participantStatLabel}>{t("campaign_stats.points")}</Text>
                  <Text style={styles.participantStatValue}>{participant.pointsEarned}</Text>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {filteredParticipants.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#999" />
            <Text style={styles.emptyText}>{t("campaign_stats.no_participants")}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  scanButton: {
    flex: 1,
    backgroundColor: "#667eea",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  exportButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#667eea",
    gap: 8,
  },
  exportButtonText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 4,
  },
  rateContainer: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  rateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: 8,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  participantsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  participantsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  participantCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  participantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  participantDetails: {
    flexDirection: "row",
    gap: 12,
  },
  participantBloodGroup: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  participantDonations: {
    fontSize: 14,
    color: "#666",
  },
  participantStatus: {
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  participantStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
  },
  participantStat: {
    alignItems: "center",
  },
  participantStatLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  participantStatValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
  },
});
