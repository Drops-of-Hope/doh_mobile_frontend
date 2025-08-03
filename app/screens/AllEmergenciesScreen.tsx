import React from "react";
import AllEmergenciesScreenComponent from "./AllEmergenciesScreen/screen";

interface AllEmergenciesScreenProps {
  navigation?: any;
}

export default function AllEmergenciesScreen(props: AllEmergenciesScreenProps) {
  return <AllEmergenciesScreenComponent {...props} />;
}
