import React from "react";
import { Animated, View, Text } from "react-native";
import LoadingDot from "../atoms/LoadingDot";

type LoadingIndicatorProps = {
  dot1Anim: Animated.Value;
  dot2Anim: Animated.Value;
  dot3Anim: Animated.Value;
  loadingFadeAnim: Animated.Value;
};

export default function LoadingIndicator({
  dot1Anim,
  dot2Anim,
  dot3Anim,
  loadingFadeAnim,
}: LoadingIndicatorProps) {
  return (
    <Animated.View
      className="absolute bottom-12 items-center"
      style={{ opacity: loadingFadeAnim }}
    >
      <View className="flex-row justify-center items-center mb-1.5">
        <LoadingDot animValue={dot1Anim} color="#DC2626" />
        <LoadingDot animValue={dot2Anim} color="#EF4444" />
        <LoadingDot animValue={dot3Anim} color="#F87171" />
      </View>
      <Text className="text-xs font-semibold text-gray-500 tracking-widest">
        DROPS OF HOPE
      </Text>
    </Animated.View>
  );
}
