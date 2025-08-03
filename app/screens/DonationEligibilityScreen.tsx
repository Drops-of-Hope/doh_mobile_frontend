import React from "react";
import DonationEligibilityScreenComponent from "./DonationEligibilityScreen/screen";

interface DonationEligibilityScreenProps {
  navigation?: any;
}

export default function DonationEligibilityScreen(
  props: DonationEligibilityScreenProps,
) {
  return <DonationEligibilityScreenComponent {...props} />;
}
