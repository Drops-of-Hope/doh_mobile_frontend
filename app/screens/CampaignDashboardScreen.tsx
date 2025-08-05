import React from "react";
import CampaignDashboardScreenComponent from "./CampaignDashboardScreen/screen";

interface CampaignDashboardScreenProps {
  navigation?: any;
}

export default function CampaignDashboardScreen({
  navigation,
}: CampaignDashboardScreenProps) {
  return <CampaignDashboardScreenComponent navigation={navigation} />;
}
