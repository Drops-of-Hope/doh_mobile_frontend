import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Droplets, Syringe, Heart, MapPin, Flag, LucideIcon } from "lucide-react-native";
import { Screen, AppBar, Surface, Text, Icon, StatRow, StatTile, SectionHeader, useTheme } from "../../design";

interface Donation {
  id: string;
  date: string;
  location: string;
  type: "blood" | "plasma" | "platelets";
  status: "completed" | "pending" | "cancelled";
  volume: string;
  campaign?: string;
}

interface MyDonationsScreenProps {
  navigation?: any;
}

const TYPE_ICON: Record<Donation["type"], LucideIcon> = {
  blood: Droplets,
  plasma: Syringe,
  platelets: Heart,
};

export default function MyDonationsScreen({ navigation }: MyDonationsScreenProps) {
  const theme = useTheme();
  const [donations] = useState<Donation[]>([
    {
      id: "1",
      date: "2024-01-15",
      location: "City General Hospital",
      type: "blood",
      status: "completed",
      volume: "450ml",
      campaign: "Emergency Blood Drive",
    },
    {
      id: "2",
      date: "2023-11-20",
      location: "Community Center",
      type: "plasma",
      status: "completed",
      volume: "600ml",
      campaign: "Community Health Initiative",
    },
    {
      id: "3",
      date: "2023-09-10",
      location: "University Medical Center",
      type: "platelets",
      status: "completed",
      volume: "300ml",
    },
    {
      id: "4",
      date: "2024-03-05",
      location: "City General Hospital",
      type: "blood",
      status: "pending",
      volume: "450ml",
      campaign: "Spring Blood Drive",
    },
  ]);

  const getStatusTone = (status: Donation["status"]): "success" | "warning" | "danger" => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "danger";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const completedDonations = donations.filter((d) => d.status === "completed");
  const totalVolume = completedDonations.reduce(
    (sum, donation) => sum + parseInt(donation.volume.replace("ml", ""), 10),
    0
  );

  return (
    <Screen scroll>
      <AppBar title="My Donations" onBack={() => navigation?.goBack()} />

      <View style={styles.statsWrap}>
        <StatRow>
          <StatTile value={completedDonations.length} label="Total Donations" />
          <StatTile value={`${totalVolume}ml`} label="Total Volume" />
          <StatTile value="Gold" label="Donor Level" />
        </StatRow>
      </View>

      <SectionHeader title="Donation History" />

      <View style={styles.list}>
        {donations.map((donation) => {
          const statusTone = getStatusTone(donation.status);
          return (
            <Surface key={donation.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.left}>
                  <View
                    style={[
                      styles.typeIcon,
                      { backgroundColor: theme.color.crimsonSoft, borderRadius: theme.radius.pill },
                    ]}
                  >
                    <Icon icon={TYPE_ICON[donation.type]} size={20} color={theme.color.crimson} />
                  </View>

                  <View style={styles.info}>
                    <Text variant="bodyBold">
                      {donation.type.charAt(0).toUpperCase() + donation.type.slice(1)} Donation
                    </Text>
                    <Text variant="caption" tone="inkMuted">
                      {formatDate(donation.date)}
                    </Text>
                    <View style={styles.metaRow}>
                      <Icon icon={MapPin} size={12} color={theme.color.inkFaint} />
                      <Text variant="caption" tone="inkMuted">
                        {donation.location}
                      </Text>
                    </View>
                    {donation.campaign && (
                      <View style={styles.metaRow}>
                        <Icon icon={Flag} size={12} color={theme.color.inkFaint} />
                        <Text variant="caption" tone="inkMuted">
                          {donation.campaign}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.right}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: theme.color[`${statusTone}Soft`], borderRadius: theme.radius.pill },
                    ]}
                  >
                    <Text variant="caption" tone={statusTone} style={styles.statusText}>
                      {donation.status.toUpperCase()}
                    </Text>
                  </View>
                  <Text variant="bodyBold">{donation.volume}</Text>
                </View>
              </View>
            </Surface>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsWrap: { marginBottom: 24 },
  list: { gap: 12 },
  card: {},
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  left: { flexDirection: "row", flex: 1 },
  typeIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 12 },
  info: { flex: 1, gap: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  right: { alignItems: "flex-end", gap: 6 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontWeight: "700" },
});
