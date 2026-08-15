import React, { useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";
import { Star, Droplets, Coffee, UtensilsCrossed, LucideIcon } from "lucide-react-native";
import { Text, Icon, useTheme, Tokens } from "../../../design";

const { width } = Dimensions.get("window");
const cardWidth = width - 48; // Account for screen padding

interface AdviceCard {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: keyof Tokens["color"];
}

const adviceData: AdviceCard[] = [
  {
    id: "1",
    title: "Hey Be Proud!",
    subtitle: "You are a Life Saver!",
    icon: Star,
    tone: "crimsonSoft",
  },
  {
    id: "2",
    title: "Stay Hydrated",
    subtitle: "Drink plenty of water before & after the donation",
    icon: Droplets,
    tone: "infoSoft",
  },
  {
    id: "3",
    title: "Avoid Caffeine",
    subtitle: "Skip coffee and tea before donating",
    icon: Coffee,
    tone: "successSoft",
  },
  {
    id: "4",
    title: "Light Meal",
    subtitle: "Have a light meal before donation",
    icon: UtensilsCrossed,
    tone: "warningSoft",
  },
];

interface DonationAdviceCarouselProps {
  onAdvicePress?: (advice: AdviceCard) => void;
}

export default function DonationAdviceCarousel({ onAdvicePress }: DonationAdviceCarouselProps) {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / cardWidth);
    setCurrentIndex(index);
  };

  const scrollToCard = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * cardWidth, animated: true });
    setCurrentIndex(index);
  };

  const renderAdviceCard = (advice: AdviceCard) => (
    <Pressable
      key={advice.id}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.color[advice.tone] as string,
          borderColor: theme.color.hairline,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      onPress={() => onAdvicePress?.(advice)}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.color.surface, borderColor: theme.color.hairline, borderRadius: theme.radius.md },
          ]}
        >
          <Icon icon={advice.icon} size={22} color={theme.color.crimson} />
        </View>
        <View style={styles.textContainer}>
          <Text variant="bodyBold">{advice.title}</Text>
          <Text variant="caption" tone="inkMuted">
            {advice.subtitle}
          </Text>
        </View>
      </View>
    </Pressable>
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
        snapToInterval={cardWidth}
        decelerationRate="fast"
      >
        {adviceData.map(renderAdviceCard)}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {adviceData.map((advice, index) => (
          <Pressable
            key={`pagination-dot-${advice.id}`}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? theme.color.crimson : theme.color.hairline },
              index === currentIndex && styles.activeDot,
            ]}
            onPress={() => scrollToCard(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  card: {
    width: cardWidth,
    marginRight: 8,
    padding: 16,
    borderWidth: 1.5,
  },
  cardContent: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1.5,
  },
  textContainer: { flex: 1, gap: 2 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  activeDot: { width: 24 },
});
