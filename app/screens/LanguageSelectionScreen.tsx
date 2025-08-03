import React from "react";
import LanguageSelectionScreenComponent from "./LanguageSelectionScreen/LanguageSelectionScreen";

interface LanguageSelectionScreenProps {
  navigation?: any;
  onClose?: () => void;
}

export default function LanguageSelectionScreen(
  props: LanguageSelectionScreenProps,
) {
  return <LanguageSelectionScreenComponent {...props} />;
}
