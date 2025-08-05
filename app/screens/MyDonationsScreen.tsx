import React from "react";
import MyDonationsScreenComponent from "./MyDonationsScreen/screen";

interface MyDonationsScreenProps {
  navigation?: any;
}

export default function MyDonationsScreen(props: MyDonationsScreenProps) {
  return <MyDonationsScreenComponent {...props} />;
}
