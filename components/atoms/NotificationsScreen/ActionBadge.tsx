import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ActionBadgeProps {
  text?: string;
}

export default function ActionBadge({ text = "Action Required" }: ActionBadgeProps) {
  return (
    <View style={styles.actionBadge}>
      <Text style={styles.actionBadgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
});
