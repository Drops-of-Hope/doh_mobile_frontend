import React from "react";
import { View, StyleSheet } from "react-native";
import HeaderSection from "../molecules/HeaderSection";
import SearchBar from "../atoms/SearchBar";

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
  onLogout,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <HeaderSection
        firstName={firstName}
        donorLevel={donorLevel}
        onLogout={onLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    marginBottom: 32,
  },
});
