// components/molecules/TitlePage.tsx
import React from "react";
import { View, Image, Text } from "react-native";

import DOHLogo from "../../../../assets/logo.png";
interface TitlePageProps {
  showWelcomeMessage?: boolean;
  titleSize?: "small" | "medium" | "large";
  alignment?: "left" | "center" | "right";
}

const TitlePage: React.FC<TitlePageProps> = ({
  showWelcomeMessage = false,
  titleSize = "large",
  alignment = "center",
}) => {
  // Blood drop with heartbeat component
  const BloodDropIcon = () => (
    <View className="items-center mb-4">
      <Image
        source={DOHLogo}
        style={{
          width: titleSize === "small" ? 60 : titleSize === "medium" ? 80 : 100,
          height:
            titleSize === "small" ? 60 : titleSize === "medium" ? 80 : 100,
          resizeMode: "contain",
        }}
      />
    </View>
  );

  const getTitleSizeClass = () => {
    switch (titleSize) {
      case "small":
        return "text-xl";
      case "medium":
        return "text-2xl";
      case "large":
        return "text-4xl";
      default:
        return "text-4xl";
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      case "center":
        return "text-center items-center";
      default:
        return "text-center items-center";
    }
  };

  return (
    <View className={`${getAlignmentClass()}`}>
      {/* Blood drop icon */}
      <BloodDropIcon />

      {/* Title */}
      <Text
        className={`${getTitleSizeClass()} font-bold text-gray-800 mb-4 ${
          alignment === "center"
            ? "text-center"
            : alignment === "left"
              ? "text-left"
              : "text-right"
        }`}
      >
        Drops of Hope
      </Text>

      {/* Subtitle */}
      <Text
        className={`${
          titleSize === "small" ? "text-sm" : "text-lg"
        } text-gray-600 ${titleSize === "small" ? "mb-4" : "mb-8"} px-4 ${
          alignment === "center"
            ? "text-center"
            : alignment === "left"
              ? "text-left"
              : "text-right"
        }`}
      >
        Connecting lifelines one drop at a time
      </Text>

      {/* Conditional Welcome message */}
      {showWelcomeMessage && (
        <View className="px-4">
          <Text
            className={`text-base text-gray-700 leading-6 ${
              alignment === "center"
                ? "text-center"
                : alignment === "left"
                  ? "text-left"
                  : "text-right"
            }`}
          >
            Your contribution makes a difference.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TitlePage;
