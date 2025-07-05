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

interface EligibilityCheck {
  id: string;
  category: string;
  question: string;
  status: 'eligible' | 'ineligible' | 'review';
  description: string;
}

export default function DonationEligibilityScreen({ navigation }: { navigation?: any }) {
  const [eligibilityChecks] = useState<EligibilityCheck[]>([
    {
      id: '1',
      category: 'Age Requirement',
      question: 'Are you between 18-65 years old?',
      status: 'eligible',
      description: 'Donors must be between 18 and 65 years of age.'
    },
    {
      id: '2',
      category: 'Weight Requirement',
      question: 'Do you weigh at least 50kg (110 lbs)?',
      status: 'eligible',
      description: 'Minimum weight requirement ensures donor safety during donation.'
    },
    {
      id: '3',
      category: 'Health Status',
      question: 'Are you currently in good health?',
      status: 'eligible',
      description: 'Donors should be feeling well and healthy on donation day.'
    },
    {
      id: '4',
      category: 'Recent Donation',
      question: 'Has it been at least 56 days since your last donation?',
      status: 'eligible',
      description: 'Minimum 8-week interval between whole blood donations.'
    },
    {
      id: '5',
      category: 'Medications',
      question: 'Are you currently taking any medications?',
      status: 'review',
      description: 'Some medications may affect eligibility. Please consult with medical staff.'
    },
    {
      id: '6',
      category: 'Travel History',
      question: 'Have you traveled to malaria-endemic areas recently?',
      status: 'eligible',
      description: 'Recent travel to certain areas may require a deferral period.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return '#10B981';
      case 'ineligible': return '#EF4444';
      case 'review': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'eligible': return 'checkmark-circle';
      case 'ineligible': return 'close-circle';
      case 'review': return 'warning';
      default: return 'help-circle';
    }
  };

  const overallStatus = eligibilityChecks.some(check => check.status === 'ineligible') 
    ? 'ineligible' 
    : eligibilityChecks.some(check => check.status === 'review') 
    ? 'review' 
    : 'eligible';

  const getOverallMessage = () => {
    switch (overallStatus) {
      case 'eligible':
        return {
          title: 'You are eligible to donate!',
          message: 'All criteria are met. You can proceed with blood donation.',
          icon: 'checkmark-circle' as const,
          color: '#10B981'
        };
      case 'ineligible':
        return {
          title: 'Currently ineligible',
          message: 'Some criteria are not met. Please check the details below.',
          icon: 'close-circle' as const,
          color: '#EF4444'
        };
      case 'review':
        return {
          title: 'Medical review required',
          message: 'Some items need medical staff review before donation.',
          icon: 'warning' as const,
          color: '#F59E0B'
        };
      default:
        return {
          title: 'Unknown status',
          message: 'Please complete the eligibility check.',
          icon: 'help-circle' as const,
          color: '#6B7280'
        };
    }
  };

  const statusInfo = getOverallMessage();

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
        
        <Text style={styles.headerTitle}>Donation Eligibility</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Overall Status */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusCard, { borderColor: statusInfo.color }]}>
          <Ionicons name={statusInfo.icon} size={48} color={statusInfo.color} />
          <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
            {statusInfo.title}
          </Text>
          <Text style={styles.statusMessage}>
            {statusInfo.message}
          </Text>
          
          {overallStatus === 'eligible' && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: statusInfo.color }]}>
              <Text style={styles.actionButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Eligibility Checklist */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.checklistContainer}>
          <Text style={styles.sectionTitle}>Eligibility Criteria</Text>
          
          {eligibilityChecks.map((check) => (
            <View key={check.id} style={styles.checkItem}>
              <View style={styles.checkHeader}>
                <View style={styles.checkInfo}>
                  <Text style={styles.checkCategory}>{check.category}</Text>
                  <Text style={styles.checkQuestion}>{check.question}</Text>
                </View>
                
                <View style={[styles.checkStatus, { backgroundColor: getStatusColor(check.status) }]}>
                  <Ionicons 
                    name={getStatusIcon(check.status)} 
                    size={20} 
                    color="white" 
                  />
                </View>
              </View>
              
              <Text style={styles.checkDescription}>{check.description}</Text>
            </View>
          ))}
        </View>
        
        {/* Additional Information */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Notes</Text>
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={16} color="#3B82F6" />
            <Text style={styles.infoText}>
              Eligibility may change based on recent travel, medications, or health conditions.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color="#F59E0B" />
            <Text style={styles.infoText}>
              Final eligibility is determined by medical staff during pre-donation screening.
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="heart" size={16} color="#EF4444" />
            <Text style={styles.infoText}>
              Your safety and the safety of blood recipients is our top priority.
            </Text>
          </View>
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
  statusContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 8,
  },
  statusMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  checklistContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  checkItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  checkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkInfo: {
    flex: 1,
    marginRight: 12,
  },
  checkCategory: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  checkQuestion: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 20,
  },
  checkStatus: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    lineHeight: 16,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  bottomPadding: {
    height: 24,
  },
});
