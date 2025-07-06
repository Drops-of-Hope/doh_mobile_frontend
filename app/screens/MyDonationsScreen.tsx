import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Donation {
  id: string;
  date: string;
  location: string;
  bloodType: string;
  amount: string;
  status: 'completed' | 'verified' | 'pending';
  certificateId?: string;
}

export default function MyDonationsScreen({ navigation }: { navigation?: any }) {
  const [donations] = useState<Donation[]>([
    {
      id: '1',
      date: '2024-01-15',
      location: 'City General Hospital',
      bloodType: 'O+',
      amount: '450ml',
      status: 'verified',
      certificateId: 'CERT-2024-001'
    },
    {
      id: '2',
      date: '2023-12-10',
      location: 'University Medical Center',
      bloodType: 'O+',
      amount: '450ml',
      status: 'completed',
      certificateId: 'CERT-2023-089'
    },
    {
      id: '3',
      date: '2023-10-22',
      location: 'Community Blood Drive',
      bloodType: 'O+',
      amount: '450ml',
      status: 'verified',
      certificateId: 'CERT-2023-056'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#10B981';
      case 'completed': return '#3B82F6';
      case 'pending': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return 'checkmark-circle';
      case 'completed': return 'checkmark';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>My Donations</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{donations.length}</Text>
          <Text style={styles.statLabel}>Total Donations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {donations.reduce((total, donation) => total + parseInt(donation.amount), 0)}ml
          </Text>
          <Text style={styles.statLabel}>Blood Donated</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {donations.filter(d => d.status === 'verified').length}
          </Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
      </View>

      {/* Donations List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.donationsContainer}>
          <Text style={styles.sectionTitle}>Donation History</Text>
          
          {donations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.donationHeader}>
                <View style={styles.donationInfo}>
                  <Text style={styles.donationDate}>
                    {new Date(donation.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Text>
                  <Text style={styles.donationLocation}>{donation.location}</Text>
                </View>
                
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(donation.status) }]}>
                  <Ionicons 
                    name={getStatusIcon(donation.status)} 
                    size={16} 
                    color="white" 
                  />
                  <Text style={styles.statusText}>
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.donationDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="water" size={16} color="#EF4444" />
                  <Text style={styles.detailText}>Blood Type: {donation.bloodType}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="beaker" size={16} color="#3B82F6" />
                  <Text style={styles.detailText}>Amount: {donation.amount}</Text>
                </View>
                {donation.certificateId && (
                  <View style={styles.detailItem}>
                    <Ionicons name="document-text" size={16} color="#10B981" />
                    <Text style={styles.detailText}>Certificate: {donation.certificateId}</Text>
                  </View>
                )}
              </View>
              
              {donation.status === 'verified' && (
                <TouchableOpacity style={styles.downloadButton}>
                  <Ionicons name="download" size={16} color="#5F27CD" />
                  <Text style={styles.downloadText}>Download Certificate</Text>
                </TouchableOpacity>
              )}
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
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FAFBFC',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  scrollView: {
    flex: 1,
  },
  donationsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  donationCard: {
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
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  donationInfo: {
    flex: 1,
  },
  donationDate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  donationLocation: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  donationDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5F27CD',
    backgroundColor: '#F8F6FF',
  },
  downloadText: {
    color: '#5F27CD',
    fontSize: 14,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 24,
  },
});
