import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  RefreshControl,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import Button from "../../components/atoms/Button";
import { donationService } from "../../app/services/donationService";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);
const StyledText = styled(Text);

interface DonationActivity {
  id: string;
  campaignTitle: string;
  campaignLocation: string;
  donationDate: string;
  status: "pending" | "accepted" | "rejected";
  submissionDate: string;
  details?: {
    bloodType?: string;
    volume?: number;
    notes?: string;
  };
}

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
          status: "accepted",
          submissionDate: "2025-01-10T14:30:00Z",
          details: {
            bloodType: "O+",
            volume: 450,
            notes: "Successful donation, donor in good health",
          },
        },
        {
          id: "2",
          campaignTitle: "Community Health Campaign - University",
          campaignLocation: "University of Colombo",
          donationDate: "2025-01-05",
          status: "pending",
          submissionDate: "2025-01-05T10:15:00Z",
        },
        {
          id: "3",
          campaignTitle: "Mobile Blood Unit - Shopping Mall",
          campaignLocation: "One Galle Face Mall",
          donationDate: "2024-12-28",
          status: "rejected",
          submissionDate: "2024-12-28T16:45:00Z",
          details: {
            notes:
              "Donor health screening indicated temporary deferral due to low iron levels",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100";
      case "rejected":
        return "bg-red-100";
      case "pending":
        return "bg-yellow-100";
      default:
        return "bg-gray-100";
    }
  };

  const handleViewDetails = (activity: DonationActivity) => {
    const statusText =
      activity.status.charAt(0).toUpperCase() + activity.status.slice(1);
    let message = `Campaign: ${activity.campaignTitle}\nLocation: ${
      activity.campaignLocation
    }\nDate: ${
      activity.donationDate
    }\nStatus: ${statusText}\nSubmitted: ${new Date(
      activity.submissionDate
    ).toLocaleDateString()}`;

    if (activity.details) {
      if (activity.details.bloodType) {
        message += `\nBlood Type: ${activity.details.bloodType}`;
      }
      if (activity.details.volume) {
        message += `\nVolume: ${activity.details.volume}ml`;
      }
      if (activity.details.notes) {
        message += `\nNotes: ${activity.details.notes}`;
      }
    }

    Alert.alert("Donation Details", message, [{ text: "OK" }]);
  };

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 bg-white">
        <StyledView className="flex-1 justify-center items-center">
          <StyledText className="text-lg text-gray-600">
            Loading activities...
          </StyledText>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledView className="flex-1 pt-10 ">
        {/* Header */}
        <StyledView className="px-6 py-4 border-b border-gray-200">
          <StyledText className="text-2xl font-bold text-gray-800">
            My Donation Activities
          </StyledText>
          <StyledText className="text-sm text-gray-600 mt-1">
            Track your donation history and status
          </StyledText>
        </StyledView>

        {/* Activities List */}
        <StyledScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activities.length === 0 ? (
            <StyledView className="flex-1 justify-center items-center py-20">
              <StyledText className="text-lg text-gray-500 text-center">
                No donation activities yet
              </StyledText>
              <StyledText className="text-sm text-gray-400 text-center mt-2">
                Your donation history will appear here
              </StyledText>
            </StyledView>
          ) : (
            <StyledView className="py-4">
              {activities.map((activity) => (
                <StyledView
                  key={activity.id}
                  className="bg-white rounded-lg border border-gray-200 mb-4 p-4 shadow-sm"
                >
                  {/* Status Badge */}
                  <StyledView className="flex-row justify-between items-start mb-3">
                    <StyledView
                      className={`px-3 py-1 rounded-full ${getStatusBgColor(
                        activity.status
                      )}`}
                    >
                      <StyledText
                        className={`text-xs font-semibold capitalize ${getStatusColor(
                          activity.status
                        )}`}
                      >
                        {activity.status}
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-xs text-gray-500">
                      {new Date(activity.submissionDate).toLocaleDateString()}
                    </StyledText>
                  </StyledView>

                  {/* Campaign Info */}
                  <StyledText className="text-lg font-semibold text-gray-800 mb-1">
                    {activity.campaignTitle}
                  </StyledText>
                  <StyledText className="text-sm text-gray-600 mb-1">
                    📍 {activity.campaignLocation}
                  </StyledText>
                  <StyledText className="text-sm text-gray-600 mb-3">
                    📅 {activity.donationDate}
                  </StyledText>

                  {/* Quick Info */}
                  {activity.details?.bloodType && (
                    <StyledText className="text-sm text-gray-700 mb-2">
                      🩸 Blood Type: {activity.details.bloodType}
                    </StyledText>
                  )}

                  {/* Action Button */}
                  <Button
                    title="View Details"
                    onPress={() => handleViewDetails(activity)}
                    variant="outline"
                  />
                </StyledView>
              ))}
            </StyledView>
          )}
        </StyledScrollView>

        <BottomTabBar activeTab="activities" />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default ActivitiesScreen;
