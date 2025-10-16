import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Skeleton from "../../atoms/Skeleton";

export default function HomeScreenSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stats Card Skeleton */}
      <View style={styles.statsCard}>
        <Skeleton height={24} width="60%" style={styles.marginBottom} />
        <Skeleton height={32} width="40%" />
      </View>

      {/* Component Row Skeleton */}
      <View style={styles.componentRow}>
        <View style={styles.componentCard}>
          <View style={styles.cardHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="50%" style={styles.marginTop} />
            </View>
          </View>
          <Skeleton height={20} width="30%" />
        </View>

        <View style={styles.componentCard}>
          <View style={styles.cardHeader}>
            <Skeleton width={40} height={40} borderRadius={20} />
            <View style={styles.cardContent}>
              <Skeleton height={16} width="70%" />
              <Skeleton height={12} width="50%" style={styles.marginTop} />
            </View>
          </View>
          <Skeleton height={20} width="30%" />
        </View>
      </View>

      {/* Appointment Section Skeleton */}
      <View style={styles.sectionCard}>
        <Skeleton height={20} width="50%" style={styles.marginBottom} />
        <View style={styles.appointmentDetails}>
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} width="60%" style={styles.marginTop} />
          <Skeleton height={16} width="80%" style={styles.marginTop} />
        </View>
      </View>

      {/* Emergencies Section Skeleton */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Skeleton height={20} width="40%" />
          <Skeleton height={16} width="20%" />
        </View>
        <View style={styles.emergencyItem}>
          <Skeleton height={18} width="70%" />
          <Skeleton height={14} width="50%" style={styles.marginTop} />
          <Skeleton height={14} width="30%" style={styles.marginTop} />
        </View>
        <View style={[styles.emergencyItem, styles.marginTop]}>
          <Skeleton height={18} width="60%" />
          <Skeleton height={14} width="40%" style={styles.marginTop} />
          <Skeleton height={14} width="35%" style={styles.marginTop} />
        </View>
      </View>

      {/* Campaigns Section Skeleton */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Skeleton height={20} width="40%" />
          <Skeleton height={16} width="20%" />
        </View>
        <View style={styles.campaignItem}>
          <Skeleton height={18} width="80%" />
          <Skeleton height={14} width="60%" style={styles.marginTop} />
          <Skeleton height={14} width="40%" style={styles.marginTop} />
        </View>
        <View style={[styles.campaignItem, styles.marginTop]}>
          <Skeleton height={18} width="75%" />
          <Skeleton height={14} width="55%" style={styles.marginTop} />
          <Skeleton height={14} width="45%" style={styles.marginTop} />
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
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#f5f5f5",
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  componentRow: {
    gap: 12,
    marginBottom: 20,
  },
  componentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardContent: {
    marginLeft: 12,
    flex: 1,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  appointmentDetails: {
    paddingVertical: 8,
  },
  emergencyItem: {
    paddingVertical: 8,
  },
  campaignItem: {
    paddingVertical: 8,
  },
  marginBottom: {
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 4,
  },
  bottomPadding: {
    height: 100,
  },
});