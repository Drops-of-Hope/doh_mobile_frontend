import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Skeleton from "../../atoms/Skeleton";

export default function CampaignDetailsSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image Skeleton */}
      <View style={styles.headerImage}>
        <Skeleton height="100%" borderRadius={0} />
      </View>

      <View style={styles.content}>
        {/* Title and Date */}
        <View style={styles.titleSection}>
          <Skeleton height={28} width="90%" style={styles.marginBottom} />
          <Skeleton height={16} width="60%" />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Skeleton height={24} width="100%" />
            <Skeleton height={14} width="80%" style={styles.marginTop} />
          </View>
          <View style={styles.statItem}>
            <Skeleton height={24} width="100%" />
            <Skeleton height={14} width="70%" style={styles.marginTop} />
          </View>
          <View style={styles.statItem}>
            <Skeleton height={24} width="100%" />
            <Skeleton height={14} width="90%" style={styles.marginTop} />
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Skeleton height={20} width="40%" style={styles.sectionTitle} />
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="95%" style={styles.marginTop} />
          <Skeleton height={16} width="85%" style={styles.marginTop} />
          <Skeleton height={16} width="70%" style={styles.marginTop} />
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Skeleton height={20} width="30%" style={styles.sectionTitle} />
          <View style={styles.locationRow}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton height={16} width="80%" style={styles.locationText} />
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Skeleton height={20} width="35%" style={styles.sectionTitle} />
          <View style={styles.contactRow}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton height={16} width="60%" style={styles.contactText} />
          </View>
          <View style={[styles.contactRow, styles.marginTop]}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton height={16} width="70%" style={styles.contactText} />
          </View>
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Skeleton height={20} width="45%" style={styles.sectionTitle} />
          <View style={styles.requirementItem}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton height={16} width="85%" style={styles.requirementText} />
          </View>
          <View style={[styles.requirementItem, styles.marginTop]}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton height={16} width="75%" style={styles.requirementText} />
          </View>
          <View style={[styles.requirementItem, styles.marginTop]}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton height={16} width="80%" style={styles.requirementText} />
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Skeleton height={52} borderRadius={26} />
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerImage: {
    height: 240,
    backgroundColor: "#E5E7EB",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 12,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    marginLeft: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  requirementText: {
    marginLeft: 12,
  },
  buttonContainer: {
    marginVertical: 24,
  },
  marginBottom: {
    marginBottom: 8,
  },
  marginTop: {
    marginTop: 8,
  },
  bottomPadding: {
    height: 20,
  },
});