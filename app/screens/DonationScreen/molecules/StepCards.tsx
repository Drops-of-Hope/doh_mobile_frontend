import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DonationStatusResponse } from "../../../services/donationService";

interface StepCardsProps {
  donationStatus: DonationStatusResponse | null;
  isVisible: boolean;
}

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  icon?: string;
}

const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, description, status, icon }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getIconName = () => {
    if (icon) return icon as any;
    
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'time';
      case 'rejected': return 'close-circle';
      default: return 'ellipse-outline';
    }
  };

  return (
    <View style={[styles.stepCard, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepNumber, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.stepNumberText}>{stepNumber}</Text>
        </View>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>{title}</Text>
          <Text style={styles.stepDescription}>{description}</Text>
        </View>
        <Ionicons name={getIconName()} size={24} color={getStatusColor()} />
      </View>
    </View>
  );
};

export default function StepCards({ donationStatus, isVisible }: StepCardsProps) {
  if (!isVisible || !donationStatus) {
    return null;
  }

  const getFormStepStatus = () => {
    switch (donationStatus.formStatus) {
      case 'not_filled': return 'pending';
      case 'filled': return 'in_progress';
      case 'submitted': return 'completed';
      default: return 'pending';
    }
  };

  const getFormStepDescription = () => {
    switch (donationStatus.formStatus) {
      case 'not_filled': return 'Please fill out the donation form.';
      case 'filled': return 'You have filled the form. Please review and submit.';
      case 'submitted': return 'Form submitted successfully.';
      default: return 'Form status pending.';
    }
  };

  const getScreeningStepStatus = () => {
    if (donationStatus.formStatus !== 'submitted') return 'pending';
    
    switch (donationStatus.screeningStatus) {
      case 'pending': return 'pending';
      case 'in_progress': return 'in_progress';
      case 'approved': return 'completed';
      case 'rejected': return 'rejected';
      default: return 'pending';
    }
  };

  const getScreeningStepDescription = () => {
    if (donationStatus.formStatus !== 'submitted') {
      return 'Complete the donation form first.';
    }
    
    switch (donationStatus.screeningStatus) {
      case 'pending': return 'Please proceed to medical officer for screening. Checklist: weight/BP recorded?';
      case 'in_progress': return 'Medical screening in progress. Please wait.';
      case 'approved': return 'Congratulations, you are eligible! Please proceed to donation bed.';
      case 'rejected': return 'You are not fit to donate. Please leave the premises.';
      default: return 'Screening status pending.';
    }
  };

  const getFinalStepStatus = () => {
    if (donationStatus.screeningStatus === 'approved') return 'in_progress';
    if (donationStatus.screeningStatus === 'rejected') return 'rejected';
    return 'pending';
  };

  const getFinalStepDescription = () => {
    if (donationStatus.screeningStatus === 'approved') {
      return 'Do not move until process is complete. Consult officer if unwell.';
    }
    if (donationStatus.screeningStatus === 'rejected') {
      return 'Thank you for your time. Please visit us again when eligible.';
    }
    return 'Awaiting screening results.';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Donation Progress</Text>
      
      <StepCard
        stepNumber={1}
        title="Donation Form"
        description={getFormStepDescription()}
        status={getFormStepStatus()}
        icon="document-text"
      />

      <StepCard
        stepNumber={2}
        title="Medical Screening"
        description={getScreeningStepDescription()}
        status={getScreeningStepStatus()}
        icon="medical"
      />

      {(donationStatus.screeningStatus === 'approved' || donationStatus.screeningStatus === 'rejected') && (
        <StepCard
          stepNumber={3}
          title={donationStatus.screeningStatus === 'approved' ? "Donation Process" : "Process Complete"}
          description={getFinalStepDescription()}
          status={getFinalStepStatus()}
          icon={donationStatus.screeningStatus === 'approved' ? "time" : "checkmark-circle"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  stepCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepContent: {
    flex: 1,
    marginRight: 12,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});