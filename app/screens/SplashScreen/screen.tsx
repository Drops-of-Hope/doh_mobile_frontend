import React, { useEffect, useRef, useState } from "react";
import { View, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SplashContent from "../shared/organisms/SplashContent";

type RootStackParamList = {
  Splash: undefined;
  Entry: undefined;
};

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [healthCheckComplete, setHealthCheckComplete] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const titleFadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(50)).current;
  const loadingFadeAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.timing(titleFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1500),
      Animated.timing(loadingFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
    };

    setTimeout(() => {
      createDotAnimation(dot1Anim, 0).start();
      createDotAnimation(dot2Anim, 300).start();
      createDotAnimation(dot3Anim, 600).start();
    }, 1000);

    // Only navigate after health check is complete
    const timer = setTimeout(() => {
      if (healthCheckComplete) {
        navigation.replace("Entry");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation, healthCheckComplete]);

  // Navigate when health check completes (if timer already passed)
  useEffect(() => {
    if (healthCheckComplete) {
      const delayTimer = setTimeout(() => {
        navigation.replace("Entry");
      }, 500);
      return () => clearTimeout(delayTimer);
    }
  }, [healthCheckComplete, navigation]);

  return (
    <View className="flex-1 bg-blue-200">
      <View className="absolute inset-0 bg-blue-200" />
      <SplashContent
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
        pulseAnim={pulseAnim}
        titleFadeAnim={titleFadeAnim}
        titleSlideAnim={titleSlideAnim}
        loadingFadeAnim={loadingFadeAnim}
        dot1Anim={dot1Anim}
        dot2Anim={dot2Anim}
        dot3Anim={dot3Anim}
      />
    </View>
  );
}
