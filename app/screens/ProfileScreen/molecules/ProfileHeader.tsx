import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserData } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

// Utility to format blood type from A_POSITIVE to A+
const formatBloodType = (bloodType: string): string => {
  if (!bloodType) return "";
  
  return bloodType
    .replace("_POSITIVE", "+")
    .replace("_NEGATIVE", "-")
    .replace("_", " ");
};

interface ProfileHeaderProps {
  userData: UserData;
  onEditProfile?: () => void;
  onProfilePicturePress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  onEditProfile,
  onProfilePicturePress,
}) => {
  const {
    name,
    email,
    bloodType,
  } = userData;

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {/* Profile Picture */}
        <TouchableOpacity 
          style={styles.avatarContainer}
          onPress={onProfilePicturePress}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          {bloodType && (
            <View style={styles.bloodTypeContainer}>
              <Ionicons name="water" size={14} color={COLORS.PRIMARY} />
              <Text style={styles.bloodType}>{formatBloodType(bloodType)}</Text>
            </View>
          )}
        </View>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onEditProfile}
        >
          <Ionicons name="pencil" size={16} color={COLORS.SECONDARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingTop: SPACING.MD,
    paddingBottom: SPACING.SM,
  },
  profileCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    marginRight: SPACING.MD,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.BACKGROUND,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 6,
  },
  bloodTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodType: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: "500",
    marginLeft: 4,
  },
  editButton: {
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
});

export default ProfileHeader;