import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileAvatarProps {
  imageUri: string;
  onEditPress?: () => void;
  size?: number;
}

export default function ProfileAvatar({
  imageUri,
  onEditPress,
  size = 80,
}: ProfileAvatarProps) {
  return (
    <View style={[styles.avatarContainer, { width: size, height: size }]}>
      <Image
        source={{ uri: imageUri }}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
        defaultSource={require("../../../../assets/icon.png")}
      />
      {onEditPress && (
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    backgroundColor: "#F3F4F6",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
