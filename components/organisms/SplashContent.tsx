//components/organisms/SplashContent.tsx
import React from "react";
import { Animated, View, Image } from "react-native";
import BackgroundText from "../atoms/SplashScreen/BackgroundText";
import BloodIcon from "../../assets/icon.png";
import LoadingIndicator from "../molecules/SplashScreen/LoadingIndicator";
import { LinearGradient } from "expo-linear-gradient";

type SplashContentProps = {
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
  titleFadeAnim: Animated.Value;
  titleSlideAnim: Animated.Value;
  loadingFadeAnim: Animated.Value;
  dot1Anim: Animated.Value;
  dot2Anim: Animated.Value;
  dot3Anim: Animated.Value;
};

export default function SplashContent({
  loadingFadeAnim,
  dot1Anim,
  dot2Anim,
  dot3Anim,
}: SplashContentProps) {
  return (
    <View className="flex-1 justify-center items-center px-20 relative">
      <BackgroundText />
      <View className="relative">
        <Image
          source={BloodIcon}
          style={{ width: 650, height: 650, top: 360 }}
        />

        {/* Gradient overlay to fade bottom of the image */}
        <LinearGradient
          colors={["transparent", "#B3D0E9"]} // Replace #000000 with your bg color
          start={{ x: 0, y: 0.4 }}
          end={{ x: 0, y: 1 }}
          className="abosulute bottom-0 left-0 right-0 h-[600px]"
        />
      </View>

      <LoadingIndicator
        dot1Anim={dot1Anim}
        dot2Anim={dot2Anim}
        dot3Anim={dot3Anim}
        loadingFadeAnim={loadingFadeAnim}
      />
    </View>
  );
}
