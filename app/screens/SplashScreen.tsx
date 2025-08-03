import React from "react";
import SplashScreenComponent from "./SplashScreen/SplashScreen";

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export default function SplashScreen(props: SplashScreenProps) {
  return <SplashScreenComponent />;
}
