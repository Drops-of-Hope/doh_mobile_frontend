import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderSectionProps {
  firstName: string;
  donorLevel?: string;
  onLogout: () => void;
}

export default function HeaderSection({
  firstName,
  donorLevel = "Bronze Donor",
  onLogout,
}: HeaderSectionProps) {
  return (
    <View style={styles.headerContent}>
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>Hello, {firstName}</Text>
        <Text style={styles.subGreeting}>Your summary for the day</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.donorBadge}>
          <View style={styles.donorDot} />
          <Text style={styles.donorText}>{donorLevel}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={onLogout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  greetingHighlight: {
    color: "#dc2626", // Red highlight for name
  },
  subGreeting: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  donorBadge: {
    marginTop: 15,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#dc2626", // Red border for blood theme
  },
  donorDot: {
    width: 8,
    height: 8,
    backgroundColor: "#dc2626", // Red dot for blood theme
    borderRadius: 4,
    marginRight: 8,
  },
  donorText: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "700",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    marginTop: 15,
  },
});
