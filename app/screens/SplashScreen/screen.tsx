import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme, Text } from "../../design";
import { DropMark } from "../../design/icons/brand";

type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
};

export default function SplashScreen() {
  const theme = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(16)).current;
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(titleFadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(titleSlideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    const createDotAnimation = (animValue: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(animValue, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        ])
      );

    const dotTimer = setTimeout(() => {
      createDotAnimation(dot1Anim, 0).start();
      createDotAnimation(dot2Anim, 250).start();
      createDotAnimation(dot3Anim, 500).start();
    }, 900);

    const navTimer = setTimeout(() => navigation.replace("Entry"), 2400);
    return () => {
      clearTimeout(dotTimer);
      clearTimeout(navTimer);
    };
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.color.paper }]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <View style={[styles.markWrap, { borderColor: theme.color.hairlineStrong, borderRadius: theme.radius.pill }]}>
          <DropMark size={44} color={theme.color.crimson} filled />
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: titleFadeAnim, transform: [{ translateY: titleSlideAnim }] }}>
        <Text variant="h1" align="center" style={styles.title}>
          Drops of Hope
        </Text>
        <Text variant="body" tone="inkMuted" align="center">
          Every donation, a lifeline
        </Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        <Dot anim={dot1Anim} color={theme.color.crimson} />
        <Dot anim={dot2Anim} color={theme.color.crimson} />
        <Dot anim={dot3Anim} color={theme.color.crimson} />
      </View>
    </View>
  );
}

function Dot({ anim, color }: { anim: Animated.Value; color: string }) {
  return <Animated.View style={[styles.dot, { opacity: anim, backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 24 },
  markWrap: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  title: { marginTop: 20, marginBottom: 4 },
  dotsRow: { flexDirection: "row", gap: 8, position: "absolute", bottom: 64 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
