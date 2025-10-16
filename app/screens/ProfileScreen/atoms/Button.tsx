import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
}) => {
  const baseClasses = "rounded-full items-center justify-center";

  const variantClasses = {
    primary: "bg-red-600",
    secondary: "bg-gray-600",
    outline: "border-2 border-gray-300 bg-white",
    danger: "bg-red-600",
  };

  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textVariantClasses = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-gray-700 font-medium",
    danger: "text-white font-semibold",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? "opacity-50" : ""}
      `}
      activeOpacity={0.8}
    >
      <StyledText
        className={`${textVariantClasses[variant]} ${textSizeClasses[size]}`}
      >
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );
};

export default Button;
