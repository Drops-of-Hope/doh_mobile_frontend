// app/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Svg, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Signup: undefined;
};

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Loading dots animation references
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  // Blood drop with heartbeat and pulsing animation
  const AnimatedBloodDrop = () => (
    <Animated.View
      style={[{ transform: [{ scale: scaleAnim }] }, { opacity: fadeAnim }]}
      className="items-center mb-8"
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Svg width="140" height="180" viewBox="0 0 120 160">
          {/* Blood drop shape */}
          <Path
            d="M60 10 C60 10, 20 50, 20 90 C20 115, 37 135, 60 135 C83 135, 100 115, 100 90 C100 50, 60 10, 60 10 Z"
            fill="#DC2626"
          />
          {/* Heartbeat line */}
          <Path
            d="M15 90 L25 90 L35 70 L45 110 L55 50 L65 130 L75 90 L85 90 L95 90 L105 90"
            stroke="white"
            strokeWidth="3"
            fill="none"
          />
          {/* Highlight on drop */}
          <Path
            d="M45 45 C50 40, 55 45, 50 50 C45 55, 40 50, 45 45"
            fill="rgba(255,255,255,0.4)"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );

  useEffect(() => {
    // Start animations
    const startAnimations = () => {
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing animation for the blood drop
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Staggered loading dots animation
      const createDotAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0.3,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Start dot animations with delays
      createDotAnimation(dot1Anim, 0).start();
      createDotAnimation(dot2Anim, 200).start();
      createDotAnimation(dot3Anim, 400).start();
    };

    startAnimations();

    // Navigate to Home screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    navigation,
    fadeAnim,
    scaleAnim,
    pulseAnim,
    dot1Anim,
    dot2Anim,
    dot3Anim,
  ]);

  return (
    <View className="flex-1 bg-white">

      {/* Main content */}
      <View className="flex-1 justify-center items-center px-6 relative z-10">
        {/* Animated blood drop */}
        <AnimatedBloodDrop />

        {/* Animated title */}
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
          className="items-center"
        >
          <Text className="text-5xl font-bold text-gray-800 mb-4 text-center">
            Drops of Hope
          </Text>

          <Text className="text-xl text-gray-600 text-center px-4 mb-12">
            Connecting lifelines one drop at a time
          </Text>
        </Animated.View>

        {/* Loading indicator with proper React Native animations */}
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="absolute bottom-20"
        >
          <View className="flex-row space-x-2">
            <Animated.View
              style={{ opacity: dot1Anim }}
              className="w-2 h-2 bg-red-500 rounded-full"
            />
            <Animated.View
              style={{ opacity: dot2Anim }}
              className="w-2 h-2 bg-red-400 rounded-full"
            />
            <Animated.View
              style={{ opacity: dot3Anim }}
              className="w-2 h-2 bg-red-300 rounded-full"
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
