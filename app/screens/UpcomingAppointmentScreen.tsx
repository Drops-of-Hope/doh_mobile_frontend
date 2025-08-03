import React from "react";
import UpcomingAppointmentScreenComponent from "./UpcomingAppointmentScreen/screen";

interface UpcomingAppointmentScreenProps {
  navigation?: any;
}

export default function UpcomingAppointmentScreen({
  navigation,
}: UpcomingAppointmentScreenProps) {
  return <UpcomingAppointmentScreenComponent navigation={navigation} />;
}
