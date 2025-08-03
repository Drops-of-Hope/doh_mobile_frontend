import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";

interface Donation {
  id: string;
  date: string;
  location: string;
  type: "blood" | "plasma" | "platelets";
  status: "completed" | "pending" | "cancelled";
  volume: string;
  campaign?: string;
}

interface MyDonationsScreenProps {
  navigation?: any;
}

export default function MyDonationsScreen({
  navigation,
}: MyDonationsScreenProps) {
  const [donations] = useState<Donation[]>([
    {
      id: "1",
      date: "2024-01-15",
      location: "City General Hospital",
      type: "blood",
      status: "completed",
      volume: "450ml",
      campaign: "Emergency Blood Drive",
    },
    {
      id: "2",
      date: "2023-11-20",
      location: "Community Center",
      type: "plasma",
      status: "completed",
      volume: "600ml",
      campaign: "Community Health Initiative",
    },
    {
      id: "3",
      date: "2023-09-10",
      location: "University Medical Center",
      type: "platelets",
      status: "completed",
      volume: "300ml",
    },
    {
      id: "4",
      date: "2024-03-05",
      location: "City General Hospital",
      type: "blood",
      status: "pending",
      volume: "450ml",
      campaign: "Spring Blood Drive",
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blood":
        return "water";
      case "plasma":
        return "medical";
      case "platelets":
        return "heart";
      default:
        return "medical";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blood":
        return "#DC2626";
      case "plasma":
        return "#F59E0B";
      case "platelets":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => navigation?.goBack();

  const completedDonations = donations.filter((d) => d.status === "completed");
  const totalVolume = completedDonations.reduce((sum, donation) => {
    const volume = parseInt(donation.volume.replace("ml", ""));
    return sum + volume;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <DashboardHeader
        title="My Donations"
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <View style={styles.summaryCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedDonations.length}</Text>
            <Text style={styles.statLabel}>Total Donations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalVolume}ml</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>Gold</Text>
            <Text style={styles.statLabel}>Donor Level</Text>
          </View>
        </View>

        {/* Donations List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donation History</Text>

          {donations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.donationHeader}>
                <View style={styles.donationLeft}>
                  <View
                    style={[
                      styles.typeIcon,
                      { backgroundColor: getTypeColor(donation.type) },
                    ]}
                  >
                    <Ionicons
                      name={getTypeIcon(donation.type) as any}
                      size={20}
                      color="white"
                    />
                  </View>

                  <View style={styles.donationInfo}>
                    <Text style={styles.donationType}>
                      {donation.type.charAt(0).toUpperCase() +
                        donation.type.slice(1)}{" "}
                      Donation
                    </Text>
                    <Text style={styles.donationDate}>
                      {formatDate(donation.date)}
                    </Text>
                    <Text style={styles.donationLocation}>
                      <Ionicons
                        name="location-outline"
                        size={14}
                        color="#6B7280"
                      />{" "}
                      {donation.location}
                    </Text>
                    {donation.campaign && (
                      <Text style={styles.donationCampaign}>
                        <Ionicons
                          name="flag-outline"
                          size={14}
                          color="#6B7280"
                        />{" "}
                        {donation.campaign}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.donationRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(donation.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {donation.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.donationVolume}>{donation.volume}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  donationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  donationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  donationLeft: {
    flexDirection: "row",
    flex: 1,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  donationInfo: {
    flex: 1,
  },
  donationType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  donationLocation: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  donationCampaign: {
    fontSize: 12,
    color: "#6B7280",
  },
  donationRight: {
    alignItems: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  donationVolume: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  bottomPadding: {
    height: 24,
  },
});
