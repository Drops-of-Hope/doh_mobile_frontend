import React from "react";
import FAQsScreenComponent from "./FAQsScreen/FAQsScreen";

interface FAQsScreenProps {
  onBack?: () => void;
}

export default function FAQsScreen(props: FAQsScreenProps) {
  return <FAQsScreenComponent {...props} />;
}
