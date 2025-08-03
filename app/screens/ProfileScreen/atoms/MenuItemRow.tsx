import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItem } from "../types";

interface MenuItemRowProps {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export default function MenuItemRow({ item, onPress }: MenuItemRowProps) {
  const isLogout = item.id === "logout";

  return (
    <TouchableOpacity
      style={[styles.menuItem, isLogout && styles.logoutItem]}
      onPress={() => onPress(item)}
    >
      <View style={styles.menuItemLeft}>
        <View
          style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}
        >
          <Ionicons
            name={item.icon as any}
            size={20}
            color={isLogout ? "#EF4444" : "#DC2626"}
          />
        </View>
        <Text style={[styles.menuItemText, isLogout && styles.logoutText]}>
          {item.title}
        </Text>
      </View>
      {item.showArrow !== false && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={isLogout ? "#EF4444" : "#9CA3AF"}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  logoutItem: {
    marginTop: 20,
    borderRadius: 12,
    marginHorizontal: 16,
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF2F2", // Light red background
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIconContainer: {
    backgroundColor: "#FEE2E2", // Slightly different red for logout
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  logoutText: {
    color: "#EF4444",
  },
});
