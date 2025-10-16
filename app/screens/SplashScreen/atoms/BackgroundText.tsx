import React from "react";
import { View, Text, Dimensions } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

export default function BackgroundText() {
  return (
    <View className="absolute top-[10%] left-0 right-0 items-center z-0">
      <Text
        className="font-semibold mb-[-40px] text-white/80 tracking-[3px] text-center"
        style={{ fontSize: screenWidth * 0.1 }}
      >
        DROPS OF
      </Text>
      <MaskedView
        maskElement={
          <Text
            className="font-extrabold text-white/80 tracking-[4px] text-center"
            style={{ fontSize: screenWidth * 0.35 }}
          >
            HOPE
          </Text>
        }
      >
        <LinearGradient
          colors={["#ffffff", "#B3D0E9"]}
          locations={[0.8, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ width: screenWidth, height: screenWidth * 0.35 }}
        />
      </MaskedView>
    </View>
  );
}
