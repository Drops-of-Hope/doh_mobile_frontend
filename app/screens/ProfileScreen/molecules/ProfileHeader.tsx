import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfileAvatar from "../atoms/ProfileAvatar";
import BadgeDisplay from "../atoms/BadgeDisplay";
import { UserData } from "../types";

interface ProfileHeaderProps {
  userData: UserData;
  onEditProfile: () => void;
}

export default function ProfileHeader({
  userData,
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <View style={styles.profileHeader}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
          <Ionicons name="create-outline" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <ProfileAvatar imageUri={userData.imageUri} size={100} />

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Blood Type</Text>
            <Text style={styles.detailValue}>{userData.bloodType}</Text>
          </View>
          <View style={styles.detailSeparator} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Mobile</Text>
            <Text style={styles.detailValue}>{userData.mobileNumber}</Text>
          </View>
        </View>

        <BadgeDisplay
          badge={userData.donationBadge}
          membershipType={userData.membershipType}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTop: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEF2F2", // Light red background
    borderWidth: 1,
    borderColor: "#FECACA", // Light red border
  },
  userInfo: {
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FEF2F2", // Light red background for details
    borderRadius: 12,
    paddingVertical: 12,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailSeparator: {
    width: 1,
    height: 32,
    backgroundColor: "#FECACA", // Light red separator
    marginHorizontal: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: "#DC2626", // Red label color
    fontWeight: "500",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
});
