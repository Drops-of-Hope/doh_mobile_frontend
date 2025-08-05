import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserQRModal from "../organisms/UserQRModal";

interface QRButtonProps {
  style?: any;
  title?: string;
  subtitle?: string;
}

export default function QRButton({ 
  style, 
  title = "My QR Code", 
  subtitle = "Show for attendance marking" 
}: QRButtonProps) {
  const [showQRModal, setShowQRModal] = useState(false);

  const handlePress = () => {
    setShowQRModal(true);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code-outline" size={24} color="#667eea" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </TouchableOpacity>
      
      <UserQRModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
