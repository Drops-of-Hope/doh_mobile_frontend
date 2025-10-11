import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MenuItem as MenuItemType } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface MenuSectionProps {
  menuItems: MenuItemType[];
  onItemPress: (item: MenuItemType) => void;
  title?: string;
  showSeparator?: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onItemPress,
  title,
  showSeparator = true,
}) => {
  return (
    <View style={[styles.container, showSeparator && styles.marginBottom]}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <View key={item.id}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => onItemPress(item)}
            >
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={item.icon as any} 
                  size={20} 
                  color={COLORS.SECONDARY} 
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons 
                name="chevron-forward" 
                size={16} 
                color={COLORS.TEXT_MUTED} 
              />
            </TouchableOpacity>
            {index < menuItems.length - 1 && (
              <View style={styles.separator} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
  },
  marginBottom: {
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
  },
  iconContainer: {
    width: 32,
    alignItems: "center",
    marginRight: SPACING.MD,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: "400",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
    marginLeft: 56, // Align with text content
  },
});

export default MenuSection;
