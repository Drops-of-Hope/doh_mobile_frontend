import React from "react";
import ActivitiesScreenComponent from "./ActivitiesScreen/ActivitiesScreen";

interface ActivitiesScreenProps {
  // Add any props that ActivitiesScreen needs
}

export default function ActivitiesScreen(props: ActivitiesScreenProps) {
  return <ActivitiesScreenComponent {...props} />;
}
