import React from 'react';
import { View, StyleSheet } from 'react-native';
import HeaderSection from '../../molecules/HomeScreen/HeaderSection';
import SearchBar from '../../atoms/HomeScreen/SearchBar';

interface HomeHeaderProps {
  firstName: string;
  donorLevel?: string;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onLogout: () => void;
}

export default function HomeHeader({ 
  firstName, 
  donorLevel, 
  searchText, 
  onSearchTextChange, 
  onLogout 
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <HeaderSection 
        firstName={firstName}
        donorLevel={donorLevel}
        onLogout={onLogout}
      />
      <SearchBar 
        value={searchText}
        onChangeText={onSearchTextChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    marginBottom: 32,
  },
});
