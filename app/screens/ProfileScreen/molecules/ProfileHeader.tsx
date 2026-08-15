import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Pencil, Droplet } from "lucide-react-native";
import { Surface, Text, Icon, UserAvatar, useTheme } from "../../../design";
import { UserData } from "../types";

// Utility to format blood type from A_POSITIVE to A+
const formatBloodType = (bloodType: string): string => {
  if (!bloodType) return "";

  return bloodType.replace("_POSITIVE", "+").replace("_NEGATIVE", "-").replace("_", " ");
};

interface ProfileHeaderProps {
  userData: UserData;
  avatarSeed?: string;
  onEditProfile?: () => void;
  onAvatarPress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData, avatarSeed, onEditProfile, onAvatarPress }) => {
  const theme = useTheme();
  const { name, email, bloodType } = userData;
  const formattedBloodType = formatBloodType(bloodType);

  return (
    <View style={styles.container}>
      <Surface style={styles.card}>
        <Pressable onPress={onAvatarPress} hitSlop={8} style={styles.avatarWrap}>
          <UserAvatar
            url={userData.profileImageUrl ?? userData.imageUri}
            name={name}
            seed={avatarSeed}
            size={64}
          />
        </Pressable>

        <View style={styles.userInfo}>
          <Text variant="h3" numberOfLines={1}>
            {name}
          </Text>
          <Text variant="caption" tone="inkMuted" numberOfLines={1} style={styles.email}>
            {email}
          </Text>
          {formattedBloodType ? (
            <View style={styles.bloodTypeRow}>
              <Icon icon={Droplet} size={13} color={theme.color.crimson} />
              <Text variant="label" tone="crimson" style={styles.bloodType}>
                {formattedBloodType}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={onEditProfile}
          hitSlop={8}
          style={[styles.editButton, { borderColor: theme.color.hairline, borderRadius: theme.radius.md }]}
        >
          <Icon icon={Pencil} size={16} />
        </Pressable>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  email: {
    marginTop: 2,
  },
  bloodTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  bloodType: {},
  editButton: {
    padding: 10,
    borderWidth: 1.5,
  },
});

export default ProfileHeader;
