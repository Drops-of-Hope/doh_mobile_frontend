import React from "react";
import CreateCampaignScreenComponent from "./CreateCampaignScreen/screen";

interface CreateCampaignScreenProps {
  navigation?: any;
}

export default function CreateCampaignScreen({
  navigation,
}: CreateCampaignScreenProps) {
  return <CreateCampaignScreenComponent navigation={navigation} />;
}
