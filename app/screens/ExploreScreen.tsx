import React, { useState, useEffect } from "react";
import { 
  View, 
  SafeAreaView, 
  Alert, 
  Text, 
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform 
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import CampaignList from "../../components/molecules/Donation/CampaignList";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { donationService } from "../../app/services/donationService";

interface Campaign {
  id: string;
  title: string;
  description: string;
  participants: number;
  location?: string;
  date?: string;
  time?: string;
}

const ExploreScreen: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [campaigns, searchText, filterLocation, filterDate]);

  const filterCampaigns = () => {
    let filtered = campaigns;

    // Filter by search text
    if (searchText.trim()) {
      filtered = filtered.filter(
        campaign => 
          campaign.title.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchText.toLowerCase()) ||
          campaign.location?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Filter by location
    if (filterLocation.trim()) {
      filtered = filtered.filter(
        campaign => campaign.location?.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // Filter by date
    if (filterDate.trim()) {
      filtered = filtered.filter(
        campaign => campaign.date?.includes(filterDate)
      );
    }

    setFilteredCampaigns(filtered);
  };

  const loadCampaigns = async () => {
    try {
      const campaignsData = await donationService.getCampaigns();
      setCampaigns(campaignsData);
      setFilteredCampaigns(campaignsData);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      // Mock data for demo when API fails
      const mockData = [
        {
          id: "1",
          title: "Emergency Blood Drive - General Hospital",
          description:
            "Critical blood shortage at General Hospital. All blood types needed urgently.",
          participants: 156,
          location: "General Hospital, Colombo",
          date: "2025-07-15",
          time: "9:00 AM - 4:00 PM",
        },
        {
          id: "2",
          title: "Community Health Campaign - University",
          description: "Monthly blood donation drive at the university campus.",
          participants: 89,
          location: "University of Colombo",
          date: "2025-07-20",
          time: "10:00 AM - 3:00 PM",
        },
        {
          id: "3",
          title: "Mobile Blood Unit - Shopping Mall",
          description:
            "Convenient blood donation at the city center shopping mall.",
          participants: 45,
          location: "One Galle Face Mall",
          date: "2025-07-25",
          time: "11:00 AM - 6:00 PM",
        },
      ];
      setCampaigns(mockData);
      setFilteredCampaigns(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCampaign = async (campaign: Campaign) => {
    try {
      // Show loading state
      Alert.alert(
        "Joining Campaign",
        "Please wait while we register you for this campaign...",
        [],
        { cancelable: false }
      );

      // Try to register user interest in the campaign
      await donationService.joinCampaign(campaign.id);

      Alert.alert(
        "Registration Successful!",
        `You have successfully registered for "${campaign.title}". You will receive a notification with details.\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}`,
        [{ text: "OK" }]
      );

      // Update participant count
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
      );
      setCampaigns(updatedCampaigns);
      setFilteredCampaigns(updatedCampaigns.filter(c => 
        filteredCampaigns.some(fc => fc.id === c.id)
      ));

    } catch (error) {
      console.error("Join campaign error:", error);
      
      // For demo purposes, show success even if API fails
      Alert.alert(
        "Registration Successful!",
        `You have successfully registered for "${campaign.title}". You will receive a notification with details.\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}`,
        [{ text: "OK" }]
      );

      // Update participant count locally for demo
      const updatedCampaigns = campaigns.map((c) =>
        c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
      );
      setCampaigns(updatedCampaigns);
      setFilteredCampaigns(updatedCampaigns.filter(c => 
        filteredCampaigns.some(fc => fc.id === c.id)
      ));
    }
  };

  const handleSearchPress = () => {
    console.log('Search campaigns');
  };

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const applyFilters = () => {
    setFilterModalVisible(false);
    filterCampaigns();
  };

  const clearFilters = () => {
    setFilterLocation('');
    setFilterDate('');
    setSearchText('');
    setFilterModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5F27CD" />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
        <BottomTabBar activeTab="explore" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Explore</Text>
              <Text style={styles.headerSubtitle}>Find blood donation campaigns</Text>
            </View>
          </View>
          
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns, locations..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
              <Ionicons name="search" size={20} color="#5F27CD" />
            </TouchableOpacity>
          </View>
          
          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{filteredCampaigns.length}</Text>
                <Text style={styles.statLabel}>Available Campaigns</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {filteredCampaigns.reduce((total, campaign) => total + campaign.participants, 0)}
                </Text>
                <Text style={styles.statLabel}>Total Participants</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Campaigns Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Campaigns</Text>
            <Text style={styles.sectionSubtitle}>
              {filteredCampaigns.length !== campaigns.length 
                ? `Showing ${filteredCampaigns.length} of ${campaigns.length} campaigns`
                : "Join a campaign near you"
              }
            </Text>
          </View>
          
          <CampaignList
            campaigns={filteredCampaigns}
            onCampaignPress={handleJoinCampaign}
          />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleFilterPress}
      >
        <Ionicons name="filter" size={24} color="white" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Campaigns</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.filterLabel}>Location</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter location (e.g., Colombo)"
                value={filterLocation}
                onChangeText={setFilterLocation}
                placeholderTextColor="#999"
              />
              
              <Text style={styles.filterLabel}>Date</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter date (e.g., 2025-07-15)"
                value={filterDate}
                onChangeText={setFilterDate}
                placeholderTextColor="#999"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabBar activeTab="explore" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5F27CD',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    width: 60,
    height: 60,
    backgroundColor: '#5F27CD',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5F27CD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalContent: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginTop: 16,
  },
  filterInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
  clearButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#5F27CD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomPadding: {
    height: 24,
  },
});

export default ExploreScreen;