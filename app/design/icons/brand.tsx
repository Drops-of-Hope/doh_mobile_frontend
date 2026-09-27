import React from "react";
import Svg, { Path, Circle } from "react-native-svg";
import { useTheme } from "../ThemeProvider";

interface BrandIconProps {
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
}

// Blood drop — used as the brand mark and the center tab-bar action.
export const DropMark: React.FC<BrandIconProps> = ({ size = 22, color, filled = false, strokeWidth }) => {
  const theme = useTheme();
  const stroke = color ?? theme.color.ink;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2.5C12 2.5 5 11.2 5 15.5C5 19.6 8.13 22.5 12 22.5C15.87 22.5 19 19.6 19 15.5C19 11.2 12 2.5 12 2.5Z"
        stroke={stroke}
        strokeWidth={strokeWidth ?? theme.stroke}
        strokeLinejoin="round"
        fill={filled ? stroke : "none"}
      />
    </Svg>
  );
};

// Badge tier mark — a simple laurel-free medallion, tinted per tier.
export const TierMedal: React.FC<BrandIconProps> = ({ size = 22, color, strokeWidth }) => {
  const theme = useTheme();
  const stroke = color ?? theme.color.ink;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="10" r="6.5" stroke={stroke} strokeWidth={strokeWidth ?? theme.stroke} />
      <Path
        d="M9 15.5L7.5 21.5L12 19L16.5 21.5L15 15.5"
        stroke={stroke}
        strokeWidth={strokeWidth ?? theme.stroke}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default DropMark;
