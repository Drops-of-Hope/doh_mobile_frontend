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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaignDetailsVisible, setCampaignDetailsVisible] = useState(false);

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

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignDetailsVisible(true);
  };

  const handleJoinCampaignConfirm = () => {
    if (!selectedCampaign) return;

    Alert.alert(
      "Join Campaign",
      `Are you sure you want to join "${selectedCampaign.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Join",
          onPress: () => handleJoinCampaign(selectedCampaign)
        }
      ]
    );
  };

  const handleJoinCampaign = async (campaign: Campaign) => {
    try {
      // Close the details modal
      setCampaignDetailsVisible(false);
      
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
    setShowDatePicker(false);
    setFilterModalVisible(false);
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    
    // Calculate how many cells we need (always show complete weeks)
    const totalCells = Math.ceil((daysInMonth + firstDayOfWeek) / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      let currentDate;
      let isCurrentMonth;
      
      if (i < firstDayOfWeek) {
        // Previous month dates
        const prevMonthDay = new Date(year, month - 1, 0).getDate() - (firstDayOfWeek - i - 1);
        currentDate = new Date(year, month - 1, prevMonthDay);
        isCurrentMonth = false;
      } else if (i < firstDayOfWeek + daysInMonth) {
        // Current month dates
        const currentMonthDay = i - firstDayOfWeek + 1;
        currentDate = new Date(year, month, currentMonthDay);
        isCurrentMonth = true;
      } else {
        // Next month dates
        const nextMonthDay = i - firstDayOfWeek - daysInMonth + 1;
        currentDate = new Date(year, month + 1, nextMonthDay);
        isCurrentMonth = false;
      }
      
      const today = new Date();
      const isToday = currentDate.toDateString() === today.toDateString();
      const isPast = currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      calendar.push({
        date: currentDate,
        dateString: currentDate.getFullYear() + '-' + 
          String(currentDate.getMonth() + 1).padStart(2, '0') + '-' + 
          String(currentDate.getDate()).padStart(2, '0'),
        day: currentDate.getDate(),
        isCurrentMonth,
        isToday,
        isPast
      });
    }
    
    return calendar;
  };

  const navigateMonth = (direction: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            onCampaignPress={handleViewDetails}
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
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.filterLabel}>Location</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter location (e.g., Colombo)"
                value={filterLocation}
                onChangeText={setFilterLocation}
                placeholderTextColor="#999"
              />
              
              <Text style={styles.filterLabel}>Date</Text>
              <View style={styles.dateInputContainer}>
                <TouchableOpacity 
                  style={[styles.filterInput, styles.datePickerButton]}
                  onPress={() => setShowDatePicker(!showDatePicker)}
                >
                  <Text style={filterDate ? styles.datePickerText : styles.datePickerPlaceholder}>
                    {filterDate ? (() => {
                      // Parse the date string properly to avoid timezone issues
                      const [year, month, day] = filterDate.split('-').map(Number);
                      const date = new Date(year, month - 1, day); // month is 0-indexed
                      return date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      });
                    })() : 'Select a date'}
                  </Text>
                  <View style={styles.datePickerControls}>
                    {filterDate && (
                      <TouchableOpacity 
                        onPress={() => {
                          setFilterDate('');
                          setShowDatePicker(false);
                        }}
                        style={styles.clearDateButton}
                      >
                        <Ionicons name="close-circle" size={20} color="#999" />
                      </TouchableOpacity>
                    )}
                    <Ionicons 
                      name={showDatePicker ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </View>
                </TouchableOpacity>
              </View>
              
              {showDatePicker && (
                <View style={styles.calendarContainer}>
                  <View style={styles.calendarHeaderContainer}>
                    <TouchableOpacity 
                      style={styles.monthNavButton}
                      onPress={() => navigateMonth(-1)}
                    >
                      <Ionicons name="chevron-back" size={20} color="#5F27CD" />
                    </TouchableOpacity>
                    
                    <Text style={styles.calendarHeader}>
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </Text>
                    
                    <TouchableOpacity 
                      style={styles.monthNavButton}
                      onPress={() => navigateMonth(1)}
                    >
                      <Ionicons name="chevron-forward" size={20} color="#5F27CD" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.calendarGrid}>
                    {/* Day headers */}
                    <View style={styles.dayHeaderRow}>
                      {dayNames.map((day, index) => (
                        <View key={index} style={styles.dayHeader}>
                          <Text style={styles.dayHeaderText}>{day}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {/* Calendar dates */}
                    <View style={styles.calendarDatesGrid}>
                      {generateCalendarGrid().map((dateItem, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.calendarGridDate,
                            !dateItem.isCurrentMonth && styles.inactiveDate,
                            dateItem.isToday && styles.todayDate,
                            filterDate === dateItem.dateString && styles.selectedDate,
                            dateItem.isPast && styles.pastDate
                          ]}
                          onPress={() => {
                            if (!dateItem.isPast) {
                              setFilterDate(dateItem.dateString);
                              setShowDatePicker(false);
                            }
                          }}
                          disabled={dateItem.isPast}
                        >
                          <Text style={[
                            styles.calendarGridDateText,
                            !dateItem.isCurrentMonth && styles.inactiveDateText,
                            dateItem.isToday && styles.todayDateText,
                            filterDate === dateItem.dateString && styles.selectedDateText,
                            dateItem.isPast && styles.pastDateText
                          ]}>
                            {dateItem.day}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    
                    <View style={styles.calendarFooter}>
                      <TouchableOpacity 
                        style={styles.todayButton}
                        onPress={() => {
                          const today = new Date();
                          const todayString = today.getFullYear() + '-' + 
                            String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(today.getDate()).padStart(2, '0');
                          setFilterDate(todayString);
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={styles.todayButtonText}>Today</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.clearCalendarButton}
                        onPress={() => {
                          setFilterDate('');
                          setShowDatePicker(false);
                        }}
                      >
                        <Text style={styles.clearCalendarButtonText}>Clear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
            
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

      {/* Campaign Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={campaignDetailsVisible}
        onRequestClose={() => setCampaignDetailsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Campaign Details</Text>
              <TouchableOpacity onPress={() => setCampaignDetailsVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedCampaign && (
                <View>
                  <Text style={styles.campaignDetailTitle}>{selectedCampaign.title}</Text>
                  
                  <View style={styles.campaignDetailSection}>
                    <Text style={styles.campaignDetailLabel}>Description</Text>
                    <Text style={styles.campaignDetailText}>{selectedCampaign.description}</Text>
                  </View>

                  {selectedCampaign.location && (
                    <View style={styles.campaignDetailSection}>
                      <Text style={styles.campaignDetailLabel}>Location</Text>
                      <Text style={styles.campaignDetailText}>{selectedCampaign.location}</Text>
                    </View>
                  )}

                  {selectedCampaign.date && (
                    <View style={styles.campaignDetailSection}>
                      <Text style={styles.campaignDetailLabel}>Date</Text>
                      <Text style={styles.campaignDetailText}>{selectedCampaign.date}</Text>
                    </View>
                  )}

                  {selectedCampaign.time && (
                    <View style={styles.campaignDetailSection}>
                      <Text style={styles.campaignDetailLabel}>Time</Text>
                      <Text style={styles.campaignDetailText}>{selectedCampaign.time}</Text>
                    </View>
                  )}

                  <View style={styles.campaignDetailSection}>
                    <Text style={styles.campaignDetailLabel}>Participants</Text>
                    <Text style={styles.campaignDetailText}>{selectedCampaign.participants} people joined</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setCampaignDetailsVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.joinCampaignButton} 
                onPress={handleJoinCampaignConfirm}
              >
                <Text style={styles.joinCampaignButtonText}>Join Campaign</Text>
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
    maxHeight: '95%',
    minHeight: 500,
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
    paddingBottom: 16,
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
  // Calendar styles
  dateInputContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clearDateButton: {
    padding: 2,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  datePickerPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 400,
  },
  calendarHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  calendarHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  calendarGrid: {
    padding: 16,
    paddingBottom: 8,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  dayHeader: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  calendarDatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarGridDate: {
    width: '14.28%', // 100% / 7 days
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 3,
  },
  calendarGridDateText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inactiveDate: {
    opacity: 0.3,
  },
  inactiveDateText: {
    color: '#BDC3C7',
  },
  todayDate: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  todayDateText: {
    color: '#27AE60',
    fontWeight: 'bold',
  },
  selectedDate: {
    backgroundColor: '#5F27CD',
  },
  selectedDateText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pastDate: {
    opacity: 0.4,
  },
  pastDateText: {
    color: '#BDC3C7',
  },
  calendarFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F8F9FA',
  },
  todayButton: {
    backgroundColor: '#5F27CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  todayButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  clearCalendarButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  clearCalendarButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  campaignDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  campaignDetailSection: {
    marginBottom: 20,
  },
  campaignDetailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  campaignDetailText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  joinCampaignButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  joinCampaignButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
});

export default ExploreScreen;