import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import QRSection from "../molecules/QRSection";
import AttendanceMarkedSection from "../molecules/AttendanceMarkedSection";
import InstructionList from "../atoms/InstructionList";
import { UserProfile } from "../types";

interface CampaignTabProps {
  userProfile: UserProfile | null;
  attendanceMarked: boolean;
  onShowQR: () => void;
  onFillForm: () => void;
}

export default function CampaignTab({
  userProfile,
  attendanceMarked,
  onShowQR,
  onFillForm,
}: CampaignTabProps) {
  const instructions = [
    "Show your QR code to the reception staff",
    "Wait for attendance confirmation",
    "Fill the health questionnaire",
    "Proceed with medical screening",
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!attendanceMarked ? (
        <View style={styles.section}>
          <QRSection 
            userProfile={userProfile}
            attendanceMarked={attendanceMarked}
            onShowQR={onShowQR}
            onShowForm={onFillForm}
          />
          <InstructionList title="Instructions:" instructions={instructions} />
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
    justifyContent: "center",
  },
});
