import React from 'react';
import { View } from 'react-native';
import MenuItem from '../../atoms/ProfileScreen/MenuItem';

interface MenuItemData {
  id: string;
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
}

interface MenuSectionProps {
  items: MenuItemData[];
  showSeparator?: boolean;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  items,
  showSeparator = true,
}) => {
  return (
    <View className={`bg-white ${showSeparator ? 'mb-4' : ''}`}>
      {items.map((item, index) => (
        <View key={item.id}>
          <MenuItem
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
          />
          {index < items.length - 1 && (
            <View className="h-px bg-gray-200 ml-16" />
          )}
        </View>
      ))}
    </View>
  );
};

export default MenuSection;