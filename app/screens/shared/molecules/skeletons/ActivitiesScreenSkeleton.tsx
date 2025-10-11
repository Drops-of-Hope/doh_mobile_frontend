import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Skeleton from "../../atoms/Skeleton";

export default function ActivitiesScreenSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      {/* Activity Item 4 */}
      <View style={styles.activityCard}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Skeleton width={24} height={24} borderRadius={12} />
          </View>
          <View style={styles.headerContent}>
            <Skeleton height={18} width="90%" />
            <Skeleton height={14} width="50%" style={styles.marginTop} />
          </View>
          <Skeleton width={55} height={20} borderRadius={10} />
        </View>
        <View style={styles.cardBody}>
          <Skeleton height={14} width="80%" />
          <Skeleton height={14} width="60%" style={styles.marginTop} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Skeleton height={12} width="33%" />
            <Skeleton height={12} width="43%" />
          </View>
          <View style={[styles.detailRow, styles.marginTop]}>
            <Skeleton height={12} width="27%" />
            <Skeleton height={12} width="37%" />
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
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: "#f5f5f5",
  },
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  cardBody: {
    marginBottom: 12,
  },
  cardDetails: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 6,
  },
  bottomPadding: {
    height: 100,
  },
});