import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ProfilePicture from "../../atoms/ProfileScreen/ProfilePicture";
import Button from "../../atoms/ProfileScreen/Button";

interface ProfileHeaderProps {
  name: string;
  email: string;
  bloodType?: string;
  mobileNumber?: string;
  donationBadge?: string;
  imageUri?: string;
  membershipType?: string;
  onEditProfile?: () => void;
  onProfilePicturePress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  bloodType,
  mobileNumber,
  donationBadge,
  imageUri,
  membershipType,
  onEditProfile,
  onProfilePicturePress,
}) => {
  const getBadgeColor = (badge: string): [string, string] => {
    switch (badge) {
      case "DIAMOND":
        return ["#B23CFD", "#9333EA"];
      case "PLATINUM":
        return ["#E5E7EB", "#9CA3AF"];
      case "GOLD":
        return ["#F59E0B", "#D97706"];
      case "SILVER":
        return ["#9CA3AF", "#6B7280"];
      case "BRONZE":
      default:
        return ["#92400E", "#78350F"];
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "DIAMOND":
        return "diamond";
      case "PLATINUM":
        return "trophy";
      case "GOLD":
        return "medal";
      case "SILVER":
        return "ribbon";
      case "BRONZE":
      default:
        return "star";
    }
  };

  const badgeColors: readonly [string, string] = donationBadge
    ? getBadgeColor(donationBadge)
    : ["#3B82F6", "#2563EB"];

  return (
    <View style={styles.container}>
      {/* Background Gradient Card */}
      <LinearGradient
        colors={["#FFFFFF", "#F8FAFC", "#F1F5F9"]}
        style={styles.cardBackground}
      >
        {/* Main Profile Info */}
        <View style={styles.profileSection}>
          {/* Profile Picture with Badge */}
          <View style={styles.profilePictureContainer}>
            <ProfilePicture
              imageUri={imageUri}
              size="lg"
              showCameraIcon={true}
              onPress={onProfilePicturePress}
            />
            {donationBadge && (
              <LinearGradient
                colors={badgeColors}
                style={styles.badgeContainer}
              >
                <Ionicons
                  name={
                    getBadgeIcon(
                      donationBadge,
                    ) as keyof typeof Ionicons.glyphMap
                  }
                  size={16}
                  color="white"
                  style={styles.badgeIcon}
                />
              </LinearGradient>
            )}
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text
              style={styles.userName}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            <Text
              style={styles.userEmail}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {email}
            </Text>

            {/* Membership Badge */}
            {membershipType && (
              <LinearGradient
                colors={["#EF4444", "#DC2626"]}
                style={styles.membershipBadge}
              >
                <Text style={styles.membershipText} numberOfLines={1}>
                  {membershipType}
                </Text>
              </LinearGradient>
            )}
          </View>
        </View>

        {/* Info Cards Row */}
        <View style={styles.infoCardsContainer}>
          {bloodType && (
            <LinearGradient
              colors={["#FFFFFF", "#FEF2F2"]}
              style={styles.infoCard}
            >
              <View style={styles.infoCardHeader}>
                <Ionicons
                  name="water"
                  size={20}
                  color="#EF4444"
                  style={styles.infoCardIcon}
                />
                <Text style={styles.infoCardLabel} numberOfLines={1}>
                  Blood Type
                </Text>
              </View>
              <Text style={styles.infoCardValue} numberOfLines={1}>
                {bloodType}
              </Text>
            </LinearGradient>
          )}

          {mobileNumber && (
            <LinearGradient
              colors={["#FFFFFF", "#F0F9FF"]}
              style={styles.infoCard}
            >
              <View style={styles.infoCardHeader}>
                <Ionicons
                  name="phone-portrait"
                  size={20}
                  color="#3B82F6"
                  style={styles.infoCardIcon}
                />
                <Text style={styles.infoCardLabel} numberOfLines={1}>
                  Mobile
                </Text>
              </View>
              <Text
                style={[
                  styles.infoCardValue,
                  {
                    fontSize:
                      mobileNumber && mobileNumber.length > 10 ? 14 : 16,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {mobileNumber}
              </Text>
            </LinearGradient>
          )}

          {/* Donation Count Card */}
          <LinearGradient
            colors={["#FFFFFF", "#F0FDF4"]}
            style={styles.infoCard}
          >
            <View style={styles.infoCardHeader}>
              <Ionicons
                name="heart"
                size={20}
                color="#10B981"
                style={styles.infoCardIcon}
              />
              <Text style={styles.infoCardLabel} numberOfLines={1}>
                Donations
              </Text>
            </View>
            <Text style={styles.infoCardValue}>12</Text>
          </LinearGradient>
        </View>

        {/* Donation Badge Display */}
        {donationBadge && donationBadge !== "MEMBER" && (
          <LinearGradient colors={badgeColors} style={styles.donationBadge}>
            <Text style={styles.donationBadgeText} numberOfLines={1}>
              {getBadgeIcon(donationBadge)} {donationBadge} DONOR
            </Text>
          </LinearGradient>
        )}

        {/* Edit Profile Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Edit Profile"
            variant="outline"
            size="sm"
            onPress={onEditProfile}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardBackground: {
    borderRadius: 28,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.5)",
  },
  profilePictureContainer: {
    position: "relative",
    marginRight: 16,
    flexShrink: 0,
  },
  badgeContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeIcon: {
    textAlign: "center",
  },
  userInfo: {
    flex: 1,
    minWidth: 0, // Important for text ellipsis
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 6,
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  userEmail: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 14,
    lineHeight: 20,
  },
  membershipBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: "100%",
  },
  membershipText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  infoCardsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    marginTop: 4,
  },
  infoCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    minHeight: 80,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardIcon: {
    marginRight: 6,
  },
  infoCardLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    flex: 1,
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  donationBadge: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  donationBadgeText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    alignItems: "center",
  },
});

export default ProfileHeader;
