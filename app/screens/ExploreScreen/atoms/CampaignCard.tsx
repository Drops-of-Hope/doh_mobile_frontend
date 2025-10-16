import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Image } from "react-native";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

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
      <View style={styles.imageContainer}>
        <Image 
          source={require("../../../../assets/logo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {/* <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text> */}

        {location && <Text style={styles.detail}>{location}</Text>}

        {date && <Text style={styles.detail}>{date}</Text>}

        {time && <Text style={styles.detail}>{time}</Text>}

        <Text style={styles.participants}>{participants} participants</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    padding: SPACING.SM,
    margin: SPACING.XS,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    aspectRatio: 1, // Makes it square
    flex: 1,
    maxWidth: '48%', // For 2-column layout with some margin
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginBottom: SPACING.SM,
  },
  logo: {
    width: 50,
    height: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  description: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 16,
    marginBottom: SPACING.XS,
    textAlign: 'center',
  },
  detail: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
    textAlign: 'center',
  },
  participants: {
    fontSize: 10,
    color: COLORS.TEXT_MUTED,
    fontWeight: "500",
    textAlign: 'center',
    marginTop: SPACING.XS,
  },
});
