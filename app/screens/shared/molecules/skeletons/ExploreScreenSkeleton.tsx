import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Skeleton from "../../atoms/Skeleton";

export default function ExploreScreenSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Search Bar Skeleton */}
      <View style={styles.searchContainer}>
        <Skeleton height={48} borderRadius={24} />
      </View>

      {/* Filter Tabs Skeleton */}
      <View style={styles.filterContainer}>
        <Skeleton height={36} width={80} borderRadius={18} />
        <Skeleton height={36} width={100} borderRadius={18} />
        <Skeleton height={36} width={90} borderRadius={18} />
        <Skeleton height={36} width={70} borderRadius={18} />
      </View>

      {/* Cards Grid Skeleton */}
      <View style={styles.cardsContainer}>
        {/* Row 1 */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="90%" />
              <Skeleton height={12} width="60%" style={styles.marginTop} />
              <Skeleton height={12} width="40%" style={styles.marginTop} />
            </View>
          </View>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="85%" />
              <Skeleton height={12} width="70%" style={styles.marginTop} />
              <Skeleton height={12} width="45%" style={styles.marginTop} />
            </View>
          </View>
        </View>

        {/* Row 2 */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="80%" />
              <Skeleton height={12} width="65%" style={styles.marginTop} />
              <Skeleton height={12} width="50%" style={styles.marginTop} />
            </View>
          </View>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="95%" />
              <Skeleton height={12} width="55%" style={styles.marginTop} />
              <Skeleton height={12} width="35%" style={styles.marginTop} />
            </View>
          </View>
        </View>

        {/* Row 3 */}
        <View style={styles.cardRow}>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="75%" />
              <Skeleton height={12} width="60%" style={styles.marginTop} />
              <Skeleton height={12} width="40%" style={styles.marginTop} />
            </View>
          </View>
          <View style={styles.card}>
            <Skeleton height={120} borderRadius={12} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="90%" />
              <Skeleton height={12} width="50%" style={styles.marginTop} />
              <Skeleton height={12} width="45%" style={styles.marginTop} />
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    marginBottom: 12,
  },
  cardContent: {
    paddingVertical: 4,
  },
  marginTop: {
    marginTop: 6,
  },
  bottomPadding: {
    height: 100,
  },
});