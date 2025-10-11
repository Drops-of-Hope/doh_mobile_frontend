import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

const { width } = Dimensions.get("window");
const cardWidth = width - SPACING.MD * 3; // Account for margins

interface AdviceCard {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
}

const adviceData: AdviceCard[] = [
  {
    id: "1",
    title: "Hey Be Proud!",
    subtitle: "You are a Life Saver!",
    icon: "star",
    backgroundColor: "#FEF2F2", // Light red
  },
  {
    id: "2",
    title: "Stay Hydrated",
    subtitle: "Drink plenty of water before & after the donation",
    icon: "water",
    backgroundColor: "#EFF6FF", // Light blue
  },
  {
    id: "3",
    title: "Avoid Caffeine",
    subtitle: "Skip coffee and tea before donating",
    icon: "cafe-outline",
    backgroundColor: "#F0FDF4", // Light green
  },
  {
    id: "4",
    title: "Light Meal",
    subtitle: "Have a light meal before donation",
    icon: "restaurant",
    backgroundColor: "#FFFBEB", // Light yellow
  },
];

interface DonationAdviceCarouselProps {
  onAdvicePress?: (advice: AdviceCard) => void;
}

export default function DonationAdviceCarousel({
  onAdvicePress,
}: DonationAdviceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWidth);
    setCurrentIndex(index);
  };

  const scrollToCard = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * cardWidth,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const renderAdviceCard = (advice: AdviceCard, index: number) => (
    <TouchableOpacity
      key={advice.id}
      style={[styles.card, { backgroundColor: advice.backgroundColor }]}
      onPress={() => onAdvicePress?.(advice)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons name={advice.icon} size={24} color={COLORS.PRIMARY} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{advice.title}</Text>
          <Text style={styles.subtitle}>{advice.subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContainer}
        snapToInterval={cardWidth}
        decelerationRate="fast"
      >
        {adviceData.map((advice, index) => renderAdviceCard(advice, index))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {adviceData.map((advice, index) => (
          <TouchableOpacity
            key={`pagination-dot-${advice.id}`}
            style={[styles.dot, index === currentIndex && styles.activeDot]}
            onPress={() => scrollToCard(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.MD,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.MD,
  },
  card: {
    width: cardWidth,
    marginHorizontal: SPACING.XS,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.BACKGROUND,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
    fontWeight: "500",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.MD,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.BORDER,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: COLORS.PRIMARY,
    width: 24,
  },
});
