import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Appointment {
  id: string;
  hospital: string;
  date: string;
  time: string;
  location: string;
  confirmationId: string;
  status: 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
  type: 'blood_donation' | 'platelet_donation' | 'plasma_donation';
  notes?: string;
}

export default function UpcomingAppointmentScreen({ navigation }: { navigation?: any }) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      hospital: 'City General Hospital',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'Blood Bank Unit, 3rd Floor',
      confirmationId: 'APT-2024-001',
      status: 'confirmed',
      type: 'blood_donation',
      notes: 'Please arrive 15 minutes early. Bring a valid ID.'
    },
    {
      id: '2',
      hospital: 'University Medical Center',
      date: '2024-02-20',
      time: '2:00 PM',
      location: 'Donation Center, Building A',
      confirmationId: 'APT-2024-025',
      status: 'upcoming',
      type: 'platelet_donation',
      notes: 'Platelet donation session. Duration: 2-3 hours.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'upcoming': return '#3B82F6';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return 'checkmark-circle';
      case 'upcoming': return 'time';
      case 'completed': return 'checkmark';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getTypeDisplay = (type: string) => {
    switch (type) {
      case 'blood_donation': return 'Whole Blood Donation';
      case 'platelet_donation': return 'Platelet Donation';
      case 'plasma_donation': return 'Plasma Donation';
      default: return 'Blood Donation';
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setAppointments(prev =>
              prev.map(apt =>
                apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
              )
            );
          }
        }
      ]
    );
  };

  const handleReschedule = (appointmentId: string) => {
    Alert.alert(
      'Reschedule Appointment',
      'Contact the hospital to reschedule your appointment.',
      [{ text: 'OK' }]
    );
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'upcoming' || apt.status === 'confirmed'
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

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
        
        <Text style={styles.headerTitle}>My Appointments</Text>
        
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#5F27CD" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="calendar" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            </View>
            
            {upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.hospitalName}>{appointment.hospital}</Text>
                    <Text style={styles.appointmentType}>
                      {getTypeDisplay(appointment.type)}
                    </Text>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Ionicons 
                      name={getStatusIcon(appointment.status)} 
                      size={16} 
                      color="white" 
                    />
                    <Text style={styles.statusText}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#3B82F6" />
                    <Text style={styles.detailText}>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color="#F59E0B" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="location" size={16} color="#EF4444" />
                    <Text style={styles.detailText}>{appointment.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="document-text" size={16} color="#10B981" />
                    <Text style={styles.detailText}>ID: {appointment.confirmationId}</Text>
                  </View>
                </View>
                
                {appointment.notes && (
                  <View style={styles.notesContainer}>
                    <Ionicons name="information-circle" size={16} color="#6B7280" />
                    <Text style={styles.notesText}>{appointment.notes}</Text>
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.rescheduleButton}
                    onPress={() => handleReschedule(appointment.id)}
                  >
                    <Ionicons name="calendar" size={16} color="#3B82F6" />
                    <Text style={styles.rescheduleText}>Reschedule</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(appointment.id)}
                  >
                    <Ionicons name="close" size={16} color="#EF4444" />
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="clipboard" size={20} color="#10B981" />
              <Text style={styles.sectionTitle}>Past Appointments</Text>
            </View>
            
            {pastAppointments.map((appointment) => (
              <View key={appointment.id} style={[styles.appointmentCard, styles.pastCard]}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.hospitalName}>{appointment.hospital}</Text>
                    <Text style={styles.appointmentType}>
                      {getTypeDisplay(appointment.type)}
                    </Text>
                  </View>
                  
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                    <Ionicons 
                      name={getStatusIcon(appointment.status)} 
                      size={16} 
                      color="white" 
                    />
                    <Text style={styles.statusText}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color="#6B7280" />
                    <Text style={[styles.detailText, styles.pastText]}>
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Ionicons name="document-text" size={16} color="#6B7280" />
                    <Text style={[styles.detailText, styles.pastText]}>
                      ID: {appointment.confirmationId}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {upcomingAppointments.length === 0 && pastAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Appointments</Text>
            <Text style={styles.emptyMessage}>
              You don't have any appointments scheduled.{'\n'}
              Book your first appointment to get started!
            </Text>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
        
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
  addButton: {
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  appointmentCard: {
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
  pastCard: {
    opacity: 0.8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentType: {
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
  appointmentDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  pastText: {
    color: '#6B7280',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  rescheduleText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  cancelText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#5F27CD',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomPadding: {
    height: 24,
  },
});
