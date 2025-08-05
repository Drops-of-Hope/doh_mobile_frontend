import React from "react";
import { View, StyleSheet } from "react-native";
import MenuItemRow from "../atoms/MenuItemRow";
import { MenuItem } from "../types";

interface MenuSectionProps {
  menuItems: MenuItem[];
  onItemPress: (item: MenuItem) => void;
}

export default function MenuSection({
  menuItems,
  onItemPress,
}: MenuSectionProps) {
  // Separate logout from other items
  const regularItems = menuItems.filter((item) => item.id !== "logout");
  const logoutItem = menuItems.find((item) => item.id === "logout");

  return (
    <View style={styles.menuSection}>
      <View style={styles.menuContainer}>
        {regularItems.map((item, index) => (
          <MenuItemRow key={item.id} item={item} onPress={onItemPress} />
        ))}
      </View>

      {logoutItem && <MenuItemRow item={logoutItem} onPress={onItemPress} />}
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
});
