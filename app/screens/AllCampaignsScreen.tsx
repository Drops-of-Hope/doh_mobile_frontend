import React from "react";
import AllCampaignsScreenComponent from "./AllCampaignsScreen/screen";

interface AllCampaignsScreenProps {
  navigation?: any;
}

export default function AllCampaignsScreen(props: AllCampaignsScreenProps) {
  return <AllCampaignsScreenComponent {...props} />;
}
