import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  ScrollView,
  Text,
  RefreshControl,
  Alert,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { donationService } from "../../app/services/donationService";

interface DonationActivity {
  id: string;
  campaignTitle: string;
  campaignLocation: string;
  donationDate: string;
  type: "donation" | "checkup";
  status: "completed";
  details?: {
    bloodType?: string;
    volume?: number;
    notes?: string;
    hemoglobin?: number;
    bloodPressure?: string;
    weight?: number;
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

  const getStatusColors = (type: string) => {
    switch (type) {
      case "donation":
        return { text: '#FF4757', bg: '#FFF5F5' };
      case "checkup":
        return { text: '#00D2D3', bg: '#F0FDFA' };
      default:
        return { text: '#6B7280', bg: '#F8F9FA' };
    }
  };

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "donation":
        return "heart";
      case "checkup":
        return "medical";
      default:
        return "checkmark-circle";
    }
  };

  const handleViewDetails = (activity: DonationActivity) => {
    const typeText = activity.type === 'donation' ? 'Blood Donation' : 'Health Checkup';
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

  const ActivityCard = ({ activity }: { activity: DonationActivity }) => {
    const statusColors = getStatusColors(activity.type);
    const statusIcon = getStatusIcon(activity.type);

    return (
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
            <Ionicons name={statusIcon as any} size={14} color={statusColors.text} style={styles.statusIcon} />
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {activity.type === 'donation' ? 'Blood Donation' : 'Health Checkup'}
            </Text>
          </View>
          <Text style={styles.completedText}>Completed</Text>
        </View>

        <Text style={styles.campaignTitle}>{activity.campaignTitle}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>{activity.campaignLocation}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>{activity.donationDate}</Text>
        </View>

        {activity.details && (
          <View style={styles.detailsContainer}>
            {activity.details.bloodType && (
              <View style={styles.detailRow}>
                <Ionicons name="water" size={16} color="#FF4757" />
                <Text style={styles.detailText}>Blood Type: {activity.details.bloodType}</Text>
              </View>
            )}
            {activity.details.volume && (
              <View style={styles.detailRow}>
                <Ionicons name="beaker-outline" size={16} color="#3B82F6" />
                <Text style={styles.detailText}>Volume: {activity.details.volume}ml</Text>
              </View>
            )}
            {activity.details.hemoglobin && (
              <View style={styles.detailRow}>
                <Ionicons name="pulse" size={16} color="#00D2D3" />
                <Text style={styles.detailText}>Hemoglobin: {activity.details.hemoglobin} g/dL</Text>
              </View>
            )}
            {activity.details.bloodPressure && (
              <View style={styles.detailRow}>
                <Ionicons name="heart-outline" size={16} color="#5F27CD" />
                <Text style={styles.detailText}>BP: {activity.details.bloodPressure} mmHg</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => handleViewDetails(activity)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCard}>
            <Ionicons name="heart" size={48} color="#FF4757" />
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Donation Activities</Text>
        <Text style={styles.headerSubtitle}>Track your donation history and status</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Ionicons name="heart-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No donation activities yet</Text>
              <Text style={styles.emptySubtitle}>Your donation history will appear here</Text>
            </View>
          </View>
        ) : (
          <View style={styles.activitiesContainer}>
            <View style={styles.summaryCard}>
              <View style={styles.summaryContent}>
                <Text style={styles.summaryNumber}>{activities.length}</Text>
                <Text style={styles.summaryLabel}>Total Activities</Text>
              </View>
              <View style={styles.summaryStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {activities.filter(a => a.type === 'donation').length}
                  </Text>
                  <Text style={styles.statLabel}>Donations</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {activities.filter(a => a.type === 'checkup').length}
                  </Text>
                  <Text style={styles.statLabel}>Checkups</Text>
                </View>
              </View>
            </View>

            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomTabBar activeTab="activities" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FAFBFC',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  activitiesContainer: {
    paddingVertical: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#3B82F6',
    marginRight: 16,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginTop: 4,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  completedText: {
    fontSize: 12,
    color: '#00D2D3',
    fontWeight: '700',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  detailsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    fontWeight: '600',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  bottomPadding: {
    height: 100,
  },
});

export default ActivitiesScreen;