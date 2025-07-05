import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import QRSection from '../../molecules/DonationScreen/QRSection';
import AttendanceMarkedSection from '../../molecules/DonationScreen/AttendanceMarkedSection';
import InstructionList from '../../atoms/DonationScreen/InstructionList';

interface CampaignTabProps {
  attendanceMarked: boolean;
  onShowQR: () => void;
  onFillForm: () => void;
}

export default function CampaignTab({ attendanceMarked, onShowQR, onFillForm }: CampaignTabProps) {
  const instructions = [
    "Show your QR code to the reception staff",
    "Wait for attendance confirmation",
    "Fill the health questionnaire",
    "Proceed with medical screening"
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!attendanceMarked ? (
        <View style={styles.section}>
          <QRSection onShowQR={onShowQR} />
          <InstructionList 
            title="Instructions:"
            instructions={instructions}
          />
        </View>
      ) : (
        <AttendanceMarkedSection onFillForm={onFillForm} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  section: {
    flex: 1,
    justifyContent: 'center',
  },
});
