import React from "react";
import { AppBar } from "../../../design";

interface ScreenHeaderProps {
  title: string;
  onBackPress: () => void;
}

export default function ScreenHeader({ title, onBackPress }: ScreenHeaderProps) {
  return <AppBar title={title} onBack={onBackPress} />;
}
