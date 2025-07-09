import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import LanguageSelectionScreen from "./LanguageSelectionScreen";
import FAQsScreen from "./FAQsScreen";
import EditProfileScreen from "./EditProfileScreen";
import { useAuth, USER_ROLES } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useMenuItemsConfig } from "../../components/molecules/ProfileScreen/MenuItemsConfig";

const ProfileScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { user, userRole, logout, hasRole, getFullName } = useAuth();
  const { t } = useLanguage();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    bloodType: "Loading...",
    mobileNumber: "Loading...",
    donationBadge: "SILVER", // SILVER, GOLD, HERO
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "DONOR",
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user) {
        setUserData({
          name: getFullName(),
          email: user.email || "user@example.com",
          bloodType: user.bloodType || "O+",
          mobileNumber: user.mobileNumber || "000-000-0000",
          donationBadge: getDonationBadge(),
          imageUri:
            user.picture ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(getFullName()) +
              "&background=FF4757&color=fff&size=160",
          membershipType: getRoleMembershipType(),
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const getRoleMembershipType = (): string => {
    if (hasRole(USER_ROLES.ADMIN)) return "ADMIN";
    if (hasRole(USER_ROLES.DONOR)) return "DONOR";
    if (hasRole(USER_ROLES.VOLUNTEER)) return "VOLUNTEER";
    if (hasRole(USER_ROLES.BENEFICIARY)) return "BENEFICIARY";
    if (hasRole(USER_ROLES.ORGANIZATION)) return "ORGANIZATION";
    return "MEMBER";
  };

  const getDonationBadge = (): string => {
    const donationCount = user?.donationCount || 0;
    if (donationCount >= 20) return "HERO";
    if (donationCount >= 10) return "GOLD";
    if (donationCount >= 5) return "SILVER";
    return "MEMBER";
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
    setShowEditProfileModal(true);
  };

  const handleProfilePicturePress = () => {
    console.log("Profile picture pressed");
  };

  const handleMyDonations = () => {
    console.log("My Donations pressed");
    navigation?.navigate("MyDonations");
  };

  const handleDonationEligibility = () => {
    console.log("Donation Eligibility pressed");
    navigation?.navigate("DonationEligibility");
  };

  const handleUpcomingAppointment = () => {
    console.log("Upcoming appointment pressed");
    navigation?.navigate("UpcomingAppointment");
  };

  const handleLanguage = () => {
    console.log("Language pressed");
    setShowLanguageModal(true);
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  const handleBecomeCampOrganizer = () => {
    console.log("Become Camp Organizer/Campaign Dashboard pressed");

    // Check if user is already a camp organizer
    if (hasRole(USER_ROLES.CAMP_ORGANIZER)) {
      // Navigate to Campaign Dashboard
      navigation?.navigate("CampaignDashboard");
    } else {
      // Show application dialog for becoming camp organizer
      Alert.alert(
        t("profile.camp_organizer_application"),
        t("profile.camp_organizer_message"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("profile.apply"),
            onPress: () => {
              console.log("User wants to become camp organizer");
              Alert.alert(
                t("profile.application_submitted"),
                t("profile.application_success_message"),
                [{ text: t("common.ok") }]
              );
            },
          },
        ]
      );
    }
  };

  const handleFAQs = () => {
    console.log("FAQs pressed");
    setShowFAQModal(true);
  };

  const handleLogOut = async () => {
    try {
      Alert.alert(
        t("profile.logout_confirm_title"),
        t("profile.logout_confirm_message"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("profile.log_out"),
            style: "destructive",
            onPress: async () => {
              await logout();
              console.log("Logged out successfully");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "HERO":
        return "#FF4757";
      case "GOLD":
        return "#FFD700";
      case "SILVER":
        return "#C0C0C0";
      default:
        return "#FF4757";
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "HERO":
        return "trophy";
      case "GOLD":
        return "medal";
      case "SILVER":
        return "ribbon";
      default:
        return "person";
    }
  };

  // Get dynamic menu items based on user role
  const { settingsMenuItems } = useMenuItemsConfig({
    onLanguage: handleLanguage,
    onNotifications: handleNotifications,
    onBecomeCampOrganizer: handleBecomeCampOrganizer,
    onMyDonations: handleMyDonations,
    onDonationEligibility: handleDonationEligibility,
    onUpcomingAppointment: handleUpcomingAppointment,
  });

  // Helper function to map item IDs to Ionicons names
  const getIconName = (itemId: string) => {
    switch (itemId) {
      case "language":
        return "language";
      case "notifications":
        return "notifications";
      case "become_organizer":
        return "business";
      case "campaign_dashboard":
        return "business";
      default:
        return "settings";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAFBFC"
        translucent={false}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account</Text>
            </View>
          </View>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <TouchableOpacity onPress={handleProfilePicturePress}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{ uri: userData.imageUri }}
                    style={styles.profileImage}
                  />
                  <View
                    style={[
                      styles.badgeContainer,
                      {
                        backgroundColor: getBadgeColor(userData.donationBadge),
                      },
                    ]}
                  >
                    <Ionicons
                      name={getBadgeIcon(userData.donationBadge)}
                      size={16}
                      color="white"
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{userData.name}</Text>
                <Text style={styles.profileEmail}>{userData.email}</Text>
                <View style={styles.profileDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="water" size={16} color="#FF4757" />
                    <Text style={styles.detailText}>{userData.bloodType}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="call" size={16} color="#FF4757" />
                    <Text style={styles.detailText}>
                      {userData.mobileNumber}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Edit Profile Button - Now at bottom */}
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="create" size={20} color="white" />
              <Text style={styles.editProfileText}>
                {t("profile.edit_profile")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Text style={styles.sectionSubtitle}>Manage your donations</Text>
          </View>

          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleMyDonations}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="heart" size={24} color="#FF4757" />
              </View>
              <Text style={styles.quickActionText}>
                {t("profile.my_donations")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleDonationEligibility}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#FF4757" />
              </View>
              <Text style={styles.quickActionText}>
                {t("profile.donation_eligibility")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={handleUpcomingAppointment}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar" size={24} color="#FF4757" />
              </View>
              <Text style={styles.quickActionText}>
                {t("profile.upcoming_appointment")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t("profile.settings")}</Text>
            <Text style={styles.sectionSubtitle}>
              {t("profile.app_preferences")}
            </Text>
          </View>

          <View style={styles.settingsCard}>
            {settingsMenuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={styles.settingLeft}>
                    <Ionicons
                      name={getIconName(item.id)}
                      size={20}
                      color="#FF4757"
                    />
                    <Text style={styles.settingText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
                </TouchableOpacity>
                {index < settingsMenuItems.length - 1 && (
                  <View style={styles.settingDivider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Support</Text>
            <Text style={styles.sectionSubtitle}>Help and information</Text>
          </View>

          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleFAQs}>
              <View style={styles.settingLeft}>
                <Ionicons name="help-circle" size={20} color="#FF4757" />
                <Text style={styles.settingText}>{t("profile.faqs")}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItem} onPress={handleLogOut}>
              <View style={styles.settingLeft}>
                <Ionicons name="log-out" size={20} color="#FF4757" />
                <Text style={[styles.settingText, { color: "#FF4757" }]}>
                  Log Out
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomTabBar activeTab="account" />

      {/* Modals */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LanguageSelectionScreen onClose={() => setShowLanguageModal(false)} />
      </Modal>

      <Modal
        visible={showFAQModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <FAQsScreen onBack={() => setShowFAQModal(false)} />
      </Modal>

      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EditProfileScreen onClose={() => setShowEditProfileModal(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8E8E8",
  },
  badgeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  profileDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: "#2C3E50",
  },
  editButton: {
    padding: 8,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF4757",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  editProfileText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#2C3E50",
    textAlign: "center",
    fontWeight: "500",
  },
  settingsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  settingDivider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginLeft: 52,
  },
  bottomPadding: {
    height: 24,
  },
});

export default ProfileScreen;
