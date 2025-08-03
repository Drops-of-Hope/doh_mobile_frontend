import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CampaignCardProps {
  title: string;
  description: string;
  participants: number;
  location?: string;
  date?: string;
  time?: string;
  onPress: () => void;
}

export default function CampaignCard({
  title,
  description,
  participants,
  location,
  date,
  time,
  onPress,
}: CampaignCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      {location && <Text style={styles.detail}>📍 {location}</Text>}

      {date && <Text style={styles.detail}>📅 {date}</Text>}

      {time && <Text style={styles.detail}>⏰ {time}</Text>}

      <Text style={styles.participants}>{participants} participants</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  participants: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 8,
  },
});
