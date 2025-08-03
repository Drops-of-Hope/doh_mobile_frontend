import React from "react";
import DonationScreenComponent from "./DonationScreen/screen";

interface DonationScreenProps {
  navigation?: any;
}

export default function DonationScreen(props: DonationScreenProps) {
  return <DonationScreenComponent {...props} />;
}
