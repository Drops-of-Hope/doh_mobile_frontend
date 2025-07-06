import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function ActionButton({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  style,
  disabled = false 
}: ActionButtonProps) {
  const getButtonStyle = () => {
    switch(variant) {
      case 'primary':
        return [styles.primaryButton, style];
      case 'secondary':
        return [styles.secondaryButton, style];
      case 'outline':
        return [styles.outlineButton, style];
      default:
        return [styles.primaryButton, style];
    }
  };

  const getTextStyle = () => {
    switch(variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  const getIconColor = () => {
    switch(variant) {
      case 'primary':
        return 'white';
      case 'secondary':
        return '#6B7280';
      case 'outline':
        return '#6B7280';
      default:
        return 'white';
    }
  };

  return (
    <TouchableOpacity 
      style={[...getButtonStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <Ionicons 
          name={icon} 
          size={16} 
          color={getIconColor()} 
          style={styles.icon} 
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  primaryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  outlineText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
  },
  icon: {
    marginRight: 8,
  },
});
