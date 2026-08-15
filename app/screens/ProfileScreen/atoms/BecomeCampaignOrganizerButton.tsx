import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Megaphone } from "lucide-react-native";
import { Button, Icon, useTheme } from "../../../design";
import { userService } from "../../../services/userService";

import { logger } from "../../../utils/logger";
interface BecomeCampaignOrganizerButtonProps {
  onSuccess: () => void; // Callback to trigger logout after success
}

const BecomeCampaignOrganizerButton: React.FC<BecomeCampaignOrganizerButtonProps> = ({ onSuccess }) => {
  const theme = useTheme();
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

      // Call backend to assign Asgardeo role
      const result = await userService.requestCampaignOrganizerRole();

      if (result.success) {
        // Show success message with logout instruction
        Alert.alert(
          "Success",
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
          "Request Failed",
          result.message || "Unable to assign Campaign Organizer role. Please try again later."
        );
      }
    } catch (error: any) {
      logger.error("Error requesting role:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to request Campaign Organizer role. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Button
        title="Become Campaign Organizer"
        variant="outline"
        loading={isLoading}
        onPress={handlePress}
        icon={<Icon icon={Megaphone} size={16} color={theme.color.crimson} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
});

export default BecomeCampaignOrganizerButton;
