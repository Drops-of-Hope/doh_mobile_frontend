import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  StyleSheet,
  StatusBar,
} from "react-native";
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import { donationService } from "../../services/donationService";
import ActivitiesHeader from "../../../components/organisms/ActivitiesScreen/ActivitiesHeader";
import ActivitiesList from "../../../components/organisms/ActivitiesScreen/ActivitiesList";
import LoadingCard from "../../../components/molecules/ActivitiesScreen/LoadingCard";
import { DonationActivity } from "../../../components/molecules/ActivitiesScreen/ActivityCard";

const ActivitiesScreen: React.FC = () => {
  const [activities, setActivities] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const activitiesData = await donationService.getDonationHistory();
      setActivities(activitiesData);
    } catch (error) {
      console.error("Failed to load activities:", error);
      // Mock data for demo
      setActivities([
        {
          id: "1",
          campaignTitle: "Emergency Blood Drive - General Hospital",
          campaignLocation: "General Hospital, Colombo",
          donationDate: "2025-01-10",
          type: "donation",
          status: "completed",
          details: {
            bloodType: "O+",
            volume: 450,
            hemoglobin: 14.2,
            bloodPressure: "120/80",
            weight: 68,
            notes: "Successful donation, donor in excellent health",
          },
        },
        {
          id: "2",
          campaignTitle: "Health Checkup - University Medical Center",
          campaignLocation: "University of Colombo",
          donationDate: "2024-12-20",
          type: "checkup",
          status: "completed",
          details: {
            bloodType: "O+",
            hemoglobin: 13.8,
            bloodPressure: "118/78",
            weight: 67,
            notes: "Regular health screening completed, all vitals normal",
          },
        },
        {
          id: "3",
          campaignTitle: "Mobile Blood Unit - Community Drive",
          campaignLocation: "One Galle Face Mall",
          donationDate: "2024-12-05",
          type: "donation",
          status: "completed",
          details: {
            bloodType: "O+",
            volume: 450,
            hemoglobin: 14.0,
            bloodPressure: "122/82",
            weight: 67,
            notes: "Successful donation for community blood bank",
          },
        },
        {
          id: "4",
          campaignTitle: "Children's Hospital Emergency Drive",
          campaignLocation: "Lady Ridgeway Hospital",
          donationDate: "2024-11-18",
          type: "donation",
          status: "completed",
          details: {
            bloodType: "O+",
            volume: 450,
            hemoglobin: 13.9,
            bloodPressure: "119/79",
            weight: 66,
            notes: "Emergency donation for pediatric patients",
          },
        },
        {
          id: "5",
          campaignTitle: "Pre-Donation Health Screening",
          campaignLocation: "Negombo General Hospital",
          donationDate: "2024-11-01",
          type: "checkup",
          status: "completed",
          details: {
            bloodType: "O+",
            hemoglobin: 13.7,
            bloodPressure: "116/76",
            weight: 66,
            notes: "Health screening before donation campaign",
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleViewDetails = (activity: DonationActivity) => {
    const typeText =
      activity.type === "donation" ? "Blood Donation" : "Health Checkup";
    let message = `${typeText}\n\nCampaign: ${activity.campaignTitle}\nLocation: ${
      activity.campaignLocation
    }\nDate: ${activity.donationDate}`;

    if (activity.details) {
      if (activity.details.bloodType) {
        message += `\nBlood Type: ${activity.details.bloodType}`;
      }
      if (activity.details.volume) {
        message += `\nVolume Donated: ${activity.details.volume}ml`;
      }
      if (activity.details.hemoglobin) {
        message += `\nHemoglobin: ${activity.details.hemoglobin} g/dL`;
      }
      if (activity.details.bloodPressure) {
        message += `\nBlood Pressure: ${activity.details.bloodPressure} mmHg`;
      }
      if (activity.details.weight) {
        message += `\nWeight: ${activity.details.weight} kg`;
      }
      if (activity.details.notes) {
        message += `\nNotes: ${activity.details.notes}`;
      }
    }

    Alert.alert("Activity Details", message, [{ text: "OK" }]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <LoadingCard />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ActivitiesHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ActivitiesList
          activities={activities}
          onViewDetails={handleViewDetails}
        />
      </ScrollView>

      <BottomTabBar activeTab="activities" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
});

export default ActivitiesScreen;
