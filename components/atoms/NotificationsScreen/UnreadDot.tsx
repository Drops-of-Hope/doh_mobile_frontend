import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function UnreadDot() {
  return <View style={styles.unreadDot} />;
}

const styles = StyleSheet.create({
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#FF4757',
    borderRadius: 5,
    marginLeft: 8,
  },
});
