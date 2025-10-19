import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
import { userService } from "../../../services/userService";

interface BecomeCampaignOrganizerButtonProps {
  onSuccess: () => void; // Callback to trigger logout after success
}

const BecomeCampaignOrganizerButton: React.FC<
  BecomeCampaignOrganizerButtonProps
> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = () => {
    Alert.alert(
      "Become Campaign Organizer",
      "Would you like to apply to become a campaign organizer? This will allow you to create and manage blood donation campaigns.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Apply",
          onPress: handleRequestRole,
        },
      ]
    );
  };

  const handleRequestRole = async () => {
    try {
      setIsLoading(true);
      console.log("🚀 Requesting Campaign Organizer role...");

      // Call backend to assign Asgardeo role
      const result = await userService.requestCampaignOrganizerRole();

      console.log("✅ Role assignment result:", result);

      if (result.success) {
        // Show success message with logout instruction
        Alert.alert(
          "✅ Success!",
          "Campaign Organizer role has been assigned. Please re-login to see your new permissions.",
          [
            {
              text: "Logout Now",
              onPress: onSuccess,
            },
          ],
          { cancelable: false }
        );
      } else {
        // Show error if backend returned unsuccessful response
        Alert.alert(
          "❌ Request Failed",
          result.message ||
            "Unable to assign Campaign Organizer role. Please try again later."
        );
      }
    } catch (error: any) {
      console.error("❌ Error requesting role:", error);
      Alert.alert(
        "❌ Error",
        error.message ||
          "Failed to request Campaign Organizer role. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      disabled={isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={COLORS.PRIMARY} />
      ) : (
        <>
          <Ionicons name="megaphone" size={20} color={COLORS.PRIMARY} />
          <Text style={styles.buttonText}>Become Campaign Organizer</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    marginHorizontal: SPACING.MD,
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    gap: SPACING.SM,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
});

export default BecomeCampaignOrganizerButton;
