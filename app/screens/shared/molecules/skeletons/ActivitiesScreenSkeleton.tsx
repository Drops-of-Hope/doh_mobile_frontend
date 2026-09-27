import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, StatusBar } from "react-native";
import Skeleton from "../../atoms/Skeleton";
import { COLORS, SPACING } from "../../../../../constants/theme";

export default function ActivitiesScreenSkeleton() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.BACKGROUND_SECONDARY} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <Skeleton height={32} width="60%" />
        <Skeleton height={16} width="40%" style={styles.marginTop} />
      </View>

      {/* Tab Skeleton */}
      <View style={styles.tabSkeleton}>
        <Skeleton height={40} width="48%" borderRadius={8} />
        <Skeleton height={40} width="48%" borderRadius={8} />
      </View>

      {/* Filter Bar Skeleton */}
      <View style={styles.filterSkeleton}>
        <Skeleton height={36} width={80} borderRadius={18} />
        <Skeleton height={36} width={100} borderRadius={18} />
        <Skeleton height={36} width={120} borderRadius={18} />
      </View>

      {/* Activity Item 1 */}
      <View style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.headerContent}>
            <Skeleton height={18} width="80%" />
            <Skeleton height={14} width="60%" style={styles.marginTop} />
          </View>
          <Skeleton width={60} height={20} borderRadius={10} />
        </View>
        <View style={styles.cardBody}>
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="70%" style={styles.marginTop} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Skeleton height={12} width="30%" />
            <Skeleton height={12} width="40%" />
          </View>
          <View style={[styles.detailRow, styles.marginTop]}>
            <Skeleton height={12} width="25%" />
            <Skeleton height={12} width="35%" />
          </View>
        </View>
      </View>

      {/* Activity Item 2 */}
      <View style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.headerContent}>
            <Skeleton height={18} width="85%" />
            <Skeleton height={14} width="55%" style={styles.marginTop} />
          </View>
          <Skeleton width={70} height={20} borderRadius={10} />
        </View>
        <View style={styles.cardBody}>
          <Skeleton height={14} width="95%" />
          <Skeleton height={14} width="65%" style={styles.marginTop} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Skeleton height={12} width="35%" />
            <Skeleton height={12} width="45%" />
          </View>
          <View style={[styles.detailRow, styles.marginTop]}>
            <Skeleton height={12} width="28%" />
            <Skeleton height={12} width="38%" />
          </View>
        </View>
      </View>

      {/* Activity Item 3 */}
      <View style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.headerContent}>
            <Skeleton height={18} width="75%" />
            <Skeleton height={14} width="65%" style={styles.marginTop} />
          </View>
          <Skeleton width={65} height={20} borderRadius={10} />
        </View>
        <View style={styles.cardBody}>
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="75%" style={styles.marginTop} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Skeleton height={12} width="32%" />
            <Skeleton height={12} width="42%" />
          </View>
          <View style={[styles.detailRow, styles.marginTop]}>
            <Skeleton height={12} width="26%" />
            <Skeleton height={12} width="36%" />
          </View>
        </View>
      </View>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    paddingTop: SPACING.MD,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  headerSkeleton: {
    marginBottom: SPACING.MD,
  },
  tabSkeleton: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.MD,
    paddingHorizontal: SPACING.XS,
  },
  filterSkeleton: {
    flexDirection: "row",
    gap: SPACING.SM,
    marginBottom: SPACING.MD,
    paddingHorizontal: SPACING.XS,
  },
  activityCard: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: 16,
    padding: SPACING.MD,
    marginBottom: SPACING.SM + SPACING.XS,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM + SPACING.XS,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.SM + SPACING.XS,
  },
  headerContent: {
    flex: 1,
  },
  cardBody: {
    marginBottom: SPACING.SM + SPACING.XS,
  },
  cardDetails: {
    paddingTop: SPACING.SM,
    borderTopWidth: 1,
    borderTopColor: COLORS.BACKGROUND_TERTIARY,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginTop: {
    marginTop: SPACING.XS + 2,
  },
  bottomPadding: {
    height: 100,
  },
});